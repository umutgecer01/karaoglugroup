import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import {
  REPOSITORY, validateDispatch, validateCommitTrees, validateEnvironment,
  validateChecks, validateCodeQLAnalysis, validatePreviewStatus, validateAlerts,
} from './production-policy.mjs';

export async function readJson(url, token, fetchImpl = fetch) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetchImpl(url, { redirect: 'error', signal: AbortSignal.timeout(20000), headers: {
        Authorization: `Bearer ${token}`, Accept: 'application/json', 'User-Agent': 'Karaoglu-controlled-production',
      } });
    } catch { if (attempt === 2) throw new Error('Read-only API request failed; publication is blocked.'); continue; }
    if ([502, 503, 504].includes(response.status) && attempt < 2) { await response.body?.cancel(); continue; }
    if (!response.ok) throw new Error(`Read-only API returned HTTP ${response.status}; publication is blocked.`);
    return response.json();
  }
  throw new Error('API read did not complete.');
}

export async function productionPreflight(env = process.env, read = readJson) {
  const checkedOut = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  validateDispatch(env, checkedOut);
  const gh = path => read(`https://api.github.com/repos/${REPOSITORY}${path}`, env.GITHUB_TOKEN);
  const [mainRef, main, preview, environment, checkResponse, status, analyses] = await Promise.all([
    gh('/git/ref/heads/main'), gh(`/commits/${env.EXPECTED_SHA}`), gh(`/commits/${env.REVIEWED_PREVIEW_SHA}`),
    gh('/environments/production'), gh(`/commits/${env.EXPECTED_SHA}/check-runs?per_page=100`),
    gh(`/commits/${env.REVIEWED_PREVIEW_SHA}/status`),
    gh('/code-scanning/analyses?ref=refs%2Fheads%2Fmain&tool_name=CodeQL&per_page=100'),
  ]);
  if (mainRef.object?.sha !== env.EXPECTED_SHA) throw new Error('Remote main changed; obtain approval for the new exact SHA.');
  validateCommitTrees(main, preview, env.EXPECTED_SHA, env.REVIEWED_PREVIEW_SHA);
  validateEnvironment(environment);
  validateChecks(checkResponse.check_runs || []);
  validateCodeQLAnalysis(analyses, env.EXPECTED_SHA);
  validatePreviewStatus(status.statuses || []);
  const alerts = [];
  for (let page = 1; page <= 20; page++) {
    const batch = await gh(`/code-scanning/alerts?ref=refs%2Fheads%2Fmain&state=open&per_page=100&page=${page}`);
    if (!Array.isArray(batch)) throw new Error('Unexpected Code Scanning response.');
    alerts.push(...batch);
    if (batch.length < 100) break;
    if (page === 20) throw new Error('Code Scanning pagination limit reached; review manually.');
  }
  validateAlerts(alerts);
  return { expectedSha: env.EXPECTED_SHA, reviewedPreviewSha: env.REVIEWED_PREVIEW_SHA, environmentReviewRequired: true, exactMainChecksPassed: true, highCriticalAlerts: 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  productionPreflight().then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
