import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRODUCTION_SITE_ID, PRODUCTION_URL, REPOSITORY, CONFIRMATION,
  validateDispatch, validateCommitTrees, validateEnvironment, validateChecks,
  validatePreviewStatus, validateAlerts, validateSite, validateCandidate, validateCodeQLAnalysis,
  validateProductionHtml, normalizeNetlifyForms,
} from './production-policy.mjs';
import { readJson } from './production-preflight.mjs';

const sha = 'a'.repeat(40), previewSha = 'b'.repeat(40);
const approved = () => ({ GITHUB_EVENT_NAME: 'workflow_dispatch', GITHUB_REPOSITORY: REPOSITORY, GITHUB_REF: 'refs/heads/main', PUBLISH_CONFIRMATION: CONFIRMATION, EXPECTED_SHA: sha, REVIEWED_PREVIEW_SHA: previewSha, GITHUB_SHA: sha, NETLIFY_SITE_ID: PRODUCTION_SITE_ID, VITE_NETLIFY_FORMS_ENABLED: 'false', VITE_CONTACT_FORMS_ENABLED: 'false', VITE_CAREER_FORMS_ENABLED: 'false', VITE_SITE_URL: `${PRODUCTION_URL}/`, CONTEXT: 'production', GITHUB_TOKEN: 'test-placeholder' });
const site = () => ({ id: PRODUCTION_SITE_ID, name: 'karaoglugroupnet', ssl_url: PRODUCTION_URL, build_settings: { repo_path: REPOSITORY, repo_branch: 'main', stop_builds: false }, published_deploy: { id: 'c'.repeat(24), state: 'ready', locked: true } });
const html = `<html><head><meta name="robots" content="index, follow"><link rel="canonical" href="${PRODUCTION_URL}/tr/"></head><form name="corporate-contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" noValidate=""><input name="form-name" value="corporate-contact"><button type="submit" disabled="">Send</button></form></html>`;

test('production dispatch rejects wrong branch, repository, commit, project, confirmation and enabled forms', () => {
  assert.doesNotThrow(() => validateDispatch(approved(), sha));
  for (const [key, value] of Object.entries({ GITHUB_EVENT_NAME: 'push', GITHUB_REPOSITORY: 'attacker/repo', GITHUB_REF: 'refs/heads/release/test', PUBLISH_CONFIRMATION: '', EXPECTED_SHA: sha.slice(0, 7), REVIEWED_PREVIEW_SHA: '../main', GITHUB_SHA: previewSha, NETLIFY_SITE_ID: '80b58d06-0cbb-432c-8193-17d34ba776df', VITE_NETLIFY_FORMS_ENABLED: 'true', CONTEXT: 'deploy-preview', VITE_SITE_URL: 'https://example.invalid/', GITHUB_TOKEN: '' })) {
    assert.throws(() => validateDispatch({ ...approved(), [key]: value }, sha), key);
  }
  assert.throws(() => validateDispatch(approved(), previewSha));
  for (const key of ['VITE_NETLIFY_FORMS_ENABLED', 'VITE_CONTACT_FORMS_ENABLED', 'VITE_CAREER_FORMS_ENABLED']) {
    for (const value of ['true', '', undefined]) assert.throws(() => validateDispatch({ ...approved(), [key]: value }, sha), `${key}=${value}`);
  }
});

test('main must be the exact tested preview tree even when merge commit SHA differs', () => {
  const main = { sha, commit: { tree: { sha: 'c'.repeat(40) } } }, preview = { sha: previewSha, commit: { tree: { sha: 'c'.repeat(40) } } };
  assert.doesNotThrow(() => validateCommitTrees(main, preview, sha, previewSha));
  assert.throws(() => validateCommitTrees(main, { ...preview, commit: { tree: { sha: 'd'.repeat(40) } } }, sha, previewSha));
  assert.throws(() => validateCommitTrees(main, preview, previewSha, previewSha));
});

test('environment review protection is checked rather than assumed from environment name', () => {
  const environment = { name: 'production', protection_rules: [{ type: 'required_reviewers', prevent_self_review: true, reviewers: [{ type: 'User' }] }] };
  assert.doesNotThrow(() => validateEnvironment(environment));
  assert.throws(() => validateEnvironment({ name: 'production' }));
  assert.throws(() => validateEnvironment({ ...environment, protection_rules: [{ ...environment.protection_rules[0], prevent_self_review: false }] }));
});

test('latest exact-main checks must all pass and high or critical open alerts block publication', () => {
  const checks = ['Build site', 'Security checks', 'Analyze JavaScript', 'CodeQL', 'browser-qa'].map((name, id) => ({ id, name, status: 'completed', conclusion: 'success' }));
  assert.doesNotThrow(() => validateChecks(checks));
  assert.throws(() => validateChecks(checks.slice(0, 2)));
  assert.throws(() => validateChecks(checks.filter(check => check.name !== 'browser-qa')));
  assert.throws(() => validateChecks([...checks, { id: 101, name: 'browser-qa', status: 'completed', conclusion: 'failure' }]));
  assert.throws(() => validateChecks([...checks, { id: 100, name: 'CodeQL', status: 'completed', conclusion: 'failure' }]));
  assert.throws(() => validateChecks(checks.map(check => check.name === 'CodeQL' ? { ...check, status: 'in_progress' } : check)));
  assert.doesNotThrow(() => validateAlerts([]));
  for (const severity of ['high', 'critical']) assert.throws(() => validateAlerts([{ state: 'open', rule: { security_severity_level: severity } }]));
  const analysis = { commit_sha: sha, tool: { name: 'CodeQL' }, rules_count: 89, error: '' };
  assert.doesNotThrow(() => validateCodeQLAnalysis([analysis], sha));
  assert.throws(() => validateCodeQLAnalysis([analysis], previewSha));
  assert.throws(() => validateCodeQLAnalysis([{ ...analysis, error: 'Analysis failed' }], sha));
  assert.throws(() => validateCodeQLAnalysis([{ ...analysis, rules_count: 0 }], sha));
});

test('only successful same-project preview status is accepted', () => {
  const status = { context: 'netlify/karaoglugroupnet/deploy-preview', state: 'success', target_url: 'https://deploy-preview-1--karaoglugroupnet.netlify.app/' };
  assert.doesNotThrow(() => validatePreviewStatus([status]));
  for (const target_url of ['https://deploy-preview-1--karaoglugroup.netlify.app/', 'https://deploy-preview-1--karaoglugroupnet.netlify.app.attacker.invalid/', 'http://deploy-preview-1--karaoglugroupnet.netlify.app/']) assert.throws(() => validatePreviewStatus([{ ...status, target_url }]));
  assert.throws(() => validatePreviewStatus([{ ...status, state: 'pending' }]));
});

test('site and candidate identity require the locked live project without disabling previews', () => {
  assert.doesNotThrow(() => validateSite(site()));
  for (const changed of [{ id: '80b58d06-0cbb-432c-8193-17d34ba776df' }, { ssl_url: 'https://karaoglugroup.netlify.app' }, { build_settings: { ...site().build_settings, stop_builds: true } }, { published_deploy: { ...site().published_deploy, locked: false } }]) assert.throws(() => validateSite({ ...site(), ...changed }));
  const candidate = { id: 'd'.repeat(24), site_id: PRODUCTION_SITE_ID, state: 'ready', published_at: null };
  assert.doesNotThrow(() => validateCandidate(candidate));
  assert.throws(() => validateCandidate({ ...candidate, site_id: 'other' }));
  assert.throws(() => validateCandidate({ ...candidate, id: '../../unlock' }));
  assert.throws(() => validateCandidate({ ...candidate, published_at: '2026-11-09' }));
});

test('production HTML keeps forms closed and only expected Netlify opening-form normalization is tolerated', () => {
  assert.doesNotThrow(() => validateProductionHtml(html));
  assert.throws(() => validateProductionHtml(html.replace('index, follow', 'noindex, nofollow')));
  assert.throws(() => validateProductionHtml(html.replace(' disabled=""', '')));
  assert.throws(() => validateProductionHtml(html.replace(' disabled=""', ' aria-disabled=""')));
  assert.throws(() => validateProductionHtml(html.replace(' disabled=""', ' data-disabled=""')));
  const processed = html.replace('<form name="corporate-contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" noValidate="">', "<form method='POST' name='corporate-contact' noValidate>");
  assert.equal(normalizeNetlifyForms(html), normalizeNetlifyForms(processed));
  assert.notEqual(normalizeNetlifyForms(html), normalizeNetlifyForms(processed.replace(' disabled=""', '')));
  assert.notEqual(normalizeNetlifyForms(html), normalizeNetlifyForms(processed.replace('</head>', '<script src="/other.js"></script></head>')));
});

test('read-only API helper fails closed on denial and retries only transient read failures', async () => {
  let attempts = 0;
  await assert.rejects(readJson('https://api.netlify.com/api/v1/sites/test', 'test-placeholder', async () => { attempts++; return new Response('', { status: 403 }); }));
  assert.equal(attempts, 1);
  attempts = 0;
  const result = await readJson('https://api.netlify.com/api/v1/sites/test', 'test-placeholder', async (url, options) => { attempts++; assert.equal(options.redirect, 'error'); return attempts < 3 ? new Response('', { status: 503 }) : Response.json({ ok: true }); });
  assert.equal(attempts, 3); assert.equal(result.ok, true);
});

test('workflow remains manual, serial and pinned; credentials are passed only to publication', async () => {
  const workflow = await readFile(new URL('../.github/workflows/netlify-deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /workflow_dispatch:/); assert.doesNotMatch(workflow, /^\s+(?:push|pull_request):/m);
  assert.match(workflow, /cancel-in-progress: false/); assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /netlify-cli@27\.16\.2/); assert.doesNotMatch(workflow, /--prod\b|--auth[=\s]/);
  assert.match(workflow, /REVIEWED_PREVIEW_SHA:/); assert.match(workflow, /environment:\s+name: production/);
  assert.equal((workflow.match(/NETLIFY_AUTH_TOKEN:/g) || []).length, 1);
  for (const key of ['VITE_NETLIFY_FORMS_ENABLED', 'VITE_CONTACT_FORMS_ENABLED', 'VITE_CAREER_FORMS_ENABLED']) assert.ok(workflow.includes(`${key}: 'false'`));
  const browserWorkflow = await readFile(new URL('../.github/workflows/browser-qa.yml', import.meta.url), 'utf8');
  assert.match(browserWorkflow, /push:\s+branches: \[main,/);
  for (const name of ['ci', 'security', 'codeql']) {
    const verificationWorkflow = await readFile(new URL(`../.github/workflows/${name}.yml`, import.meta.url), 'utf8');
    assert.match(verificationWorkflow, /uses: actions\/checkout@v4\s+with:\s+persist-credentials: false/, `${name} must not leave the Git token available to application/dependency commands`);
  }
});
