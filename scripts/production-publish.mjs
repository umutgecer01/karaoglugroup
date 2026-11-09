import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { productionPreflight, readJson } from './production-preflight.mjs';
import {
  CLI_VERSION, PRODUCTION_SITE_ID, PRODUCTION_URL, normalizeNetlifyForms,
  validateSite, validateCandidate, validateProductionHtml,
} from './production-policy.mjs';

const env = process.env;
const root = process.cwd();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const record = { startedAt: new Date().toISOString(), siteId: PRODUCTION_SITE_ID, formsEnabled: false, publicationLockRemoved: false, phase: 'preflight' };
let recordPath;
const save = async () => { if (recordPath) await writeFile(recordPath, JSON.stringify(record, null, 2)); };

async function main() {
  if (!env.NETLIFY_AUTH_TOKEN) throw new Error('NETLIFY_AUTH_TOKEN is missing; no upload or publication attempted.');
  const preflight = await productionPreflight();
  const cli = resolve(env.NETLIFY_CLI_PATH || 'missing-netlify-cli');
  const cliPackage = JSON.parse(await readFile(join(dirname(cli), '..', 'package.json'), 'utf8'));
  if (cliPackage.name !== 'netlify-cli' || cliPackage.version !== CLI_VERSION) throw new Error('The pinned official Netlify CLI is required.');
  const netlify = path => readJson(`https://api.netlify.com/api/v1${path}`, env.NETLIFY_AUTH_TOKEN);
  const before = await netlify(`/sites/${PRODUCTION_SITE_ID}`);
  validateSite(before);
  const baseline = before.published_deploy.id;
  const siteInvariant = site => JSON.stringify({ id: site.id, url: site.ssl_url, repo: site.build_settings?.repo_path, branch: site.build_settings?.repo_branch, stopBuilds: site.build_settings?.stop_builds, command: site.build_settings?.cmd, publish: site.build_settings?.dir, customDomain: site.custom_domain, aliases: site.domain_aliases });
  const previews = await netlify(`/sites/${PRODUCTION_SITE_ID}/deploys?per_page=100`);
  const reviewedDeploy = previews.find(deploy => deploy.commit_ref === env.REVIEWED_PREVIEW_SHA && deploy.state === 'ready' && deploy.context === 'deploy-preview' && deploy.review_id > 0 && !deploy.published_at);
  if (!reviewedDeploy) throw new Error('No ready PR preview for the approved tree exists on the production project.');

  const stage = join(root, '.audit', 'production-publish', preflight.expectedSha);
  await mkdir(dirname(stage), { recursive: true });
  await mkdir(stage, { recursive: false });
  recordPath = join(stage, 'publication.json');
  Object.assign(record, preflight, { baseline, reviewedDeploy: reviewedDeploy.id, phase: 'preparing-artifact' });
  await save();
  if (execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim()) throw new Error('Tracked source changed during build.');
  try { await stat('dist/_headers'); throw new Error('Preview headers cannot be published.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const lang of ['tr', 'en', 'ar']) validateProductionHtml(await readFile(`dist/${lang}/index.html`, 'utf8'));
  await cp('dist', join(stage, 'dist'), { recursive: true });
  await cp('netlify.toml', join(stage, 'netlify.toml'));
  const files = {};
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error('Artifact symlinks are not allowed.');
      if (entry.isDirectory()) await walk(path);
      else files[relative(stage, path).replaceAll('\\', '/')] = hash(await readFile(path));
    }
  }
  await walk(join(stage, 'dist'));
  files['netlify.toml'] = hash(await readFile(join(stage, 'netlify.toml')));
  const manifest = { sourceCommit: preflight.expectedSha, reviewedPreviewSha: preflight.reviewedPreviewSha, siteId: PRODUCTION_SITE_ID, formsEnabled: false, context: 'production', files };
  await writeFile(join(stage, 'manifest.json'), JSON.stringify(manifest, null, 2));
  for (const [path, expected] of Object.entries(files)) if (hash(await readFile(join(stage, path))) !== expected) throw new Error('Artifact changed before upload.');
  record.phase = 'uploading-draft'; await save();
  const cliEnv = { ...env, NETLIFY_SITE_ID: PRODUCTION_SITE_ID, NETLIFY_CLI_TELEMETRY_DISABLED: '1' };
  delete cliEnv.NETLIFY_API_URL;
  const child = spawn(process.execPath, [cli, 'deploy', '--draft', '--site', PRODUCTION_SITE_ID, '--dir', join(stage, 'dist'), '--cwd', stage, '--no-build', '--json', '--message', `Approved main ${preflight.expectedSha}; forms disabled`], {
    cwd: stage, env: cliEnv,
    stdio: ['ignore', 'pipe', 'pipe'], signal: AbortSignal.timeout(600000),
  });
  // CLI output is held in memory, never printed or persisted; it can include account configuration.
  let stdout = '';
  child.stdout.on('data', data => { stdout += data.toString(); });
  child.stderr.on('data', () => {});
  const code = await new Promise((resolveCode, reject) => { child.on('error', () => reject(new Error('Netlify upload process failed; inspect the project before retry.'))); child.on('close', resolveCode); });
  if (code !== 0) throw new Error('Netlify CLI upload failed; inspect the project before retry.');
  let cliResult;
  try { cliResult = JSON.parse(stdout); } catch { throw new Error('CLI result could not be read; inspect the project before retry.'); }
  if (!/^[0-9a-f]{24}$/.test(cliResult.deploy_id || '')) throw new Error('CLI did not return a valid deployment ID.');
  record.candidate = cliResult.deploy_id; record.phase = 'candidate-uploaded'; await save();
  const candidate = await netlify(`/deploys/${record.candidate}`);
  validateCandidate(candidate);
  const unchanged = await netlify(`/sites/${PRODUCTION_SITE_ID}`);
  validateSite(unchanged);
  if (unchanged.published_deploy.id !== baseline || siteInvariant(unchanged) !== siteInvariant(before)) throw new Error('Current publication or settings changed during upload.');

  const candidateUrl = `https://${record.candidate}--karaoglugroupnet.netlify.app`;
  async function verifyRemote(base, isLive) {
    let verified = 0;
    for (const path of Object.keys(files).filter(path => path.startsWith('dist/') && (/\.(?:js|css)$/.test(path) || /^dist\/(?:tr|en|ar)\/index\.html$/.test(path)))) {
      const response = await fetch(`${base}/${path.slice(5)}`, { redirect: 'error', signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error('Remote artifact verification failed.');
      const body = Buffer.from(await response.arrayBuffer());
      if (path.endsWith('.html')) {
        const html = body.toString('utf8');
        validateProductionHtml(html);
        if (normalizeNetlifyForms(html) !== normalizeNetlifyForms(await readFile(join(stage, path), 'utf8'))) throw new Error('Remote HTML differs beyond Netlify Forms attribute processing.');
        if (isLive && /noindex/i.test(response.headers.get('x-robots-tag') || '')) throw new Error('Published content has a noindex HTTP header.');
      } else if (hash(body) !== files[path]) throw new Error('Remote asset hash mismatch.');
      verified++;
    }
    return verified;
  }
  record.candidateVerifiedFiles = await verifyRemote(candidateUrl, false);
  // Recheck exact main, environment, security gates and baseline immediately before publication.
  await productionPreflight();
  const stillLocked = await netlify(`/sites/${PRODUCTION_SITE_ID}`);
  validateSite(stillLocked);
  if (stillLocked.published_deploy.id !== baseline || siteInvariant(stillLocked) !== siteInvariant(before)) throw new Error('Baseline changed; obtain approval for the current publication.');
  record.phase = 'publish-request-started'; await save();
  // The lock endpoint publishes this exact ready deploy and locks it. Never unlock auto-publishing.
  // Writes are deliberately not retried; a timeout requires reading project state before any next action.
  const publication = await fetch(`https://api.netlify.com/api/v1/deploys/${record.candidate}/lock`, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(20000), headers: { Authorization: `Bearer ${env.NETLIFY_AUTH_TOKEN}`, Accept: 'application/json' },
  });
  if (!publication.ok) throw new Error(`Publication API returned HTTP ${publication.status}; inspect state before retry.`);
  await publication.body?.cancel();
  let after;
  for (let attempt = 0; attempt < 30; attempt++) {
    after = await netlify(`/sites/${PRODUCTION_SITE_ID}`);
    if (after.published_deploy?.id === record.candidate && after.published_deploy.locked) break;
    await new Promise(resolveWait => setTimeout(resolveWait, 1000));
  }
  if (after?.published_deploy?.id !== record.candidate || !after.published_deploy.locked) throw new Error('Publication result is pending or unexpected; inspect without repeating the write.');
  if (siteInvariant(after) !== siteInvariant(before)) throw new Error('Netlify site settings changed unexpectedly.');
  record.phase = 'published-verifying'; record.publishedDeploy = after.published_deploy.id; record.locked = true; await save();
  record.liveVerifiedFiles = await verifyRemote(PRODUCTION_URL, true);
  const published = await netlify(`/deploys/${record.candidate}`);
  Object.assign(record, { phase: 'complete', publishedAt: published.published_at, actualApiContext: published.context, completedAt: new Date().toISOString() });
  await save();
  console.log(JSON.stringify({ published: PRODUCTION_URL, deployId: record.candidate, sourceCommit: preflight.expectedSha, locked: true, formsEnabled: false }));
}

main().catch(async error => {
  record.outcome = 'needs-inspection';
  await save();
  console.error(error instanceof Error ? error.message.replaceAll(env.NETLIFY_AUTH_TOKEN || '\0', '[REDACTED]') : 'Production operation failed; inspect state.');
  process.exitCode = 1;
});
