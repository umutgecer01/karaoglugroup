export const PRODUCTION_SITE_ID = 'b4753086-eb94-4a7e-b5f5-7270835fab3a';
export const PRODUCTION_URL = 'https://karaoglugroupnet.netlify.app';
export const REPOSITORY = 'umutgecer01/karaoglugroup';
export const CONFIRMATION = 'PUBLISH_KARAOGLUGROUPNET';
export const CLI_VERSION = '27.16.2';

function requireValue(condition, message) { if (!condition) throw new Error(message); }
export function validateDispatch(env, checkedOutSha) {
  requireValue(env.GITHUB_EVENT_NAME === 'workflow_dispatch', 'Only a manual workflow dispatch can publish.');
  requireValue(env.GITHUB_REPOSITORY === REPOSITORY, 'Unexpected GitHub repository.');
  requireValue(env.GITHUB_REF === 'refs/heads/main', 'Only main can publish.');
  requireValue(env.PUBLISH_CONFIRMATION === CONFIRMATION, 'Explicit publication confirmation is required.');
  for (const key of ['EXPECTED_SHA', 'REVIEWED_PREVIEW_SHA']) requireValue(/^[0-9a-f]{40}$/.test(env[key] || ''), `${key} must be a full lowercase commit SHA.`);
  requireValue(env.EXPECTED_SHA === checkedOutSha && env.EXPECTED_SHA === env.GITHUB_SHA, 'Selected, expected and checked-out SHAs must match.');
  requireValue(env.NETLIFY_SITE_ID === PRODUCTION_SITE_ID, 'Wrong production Project ID.');
  requireValue(env.VITE_NETLIFY_FORMS_ENABLED === 'false', 'Forms must remain disabled.');
  requireValue(env.CONTEXT === 'production' && env.VITE_SITE_URL === `${PRODUCTION_URL}/`, 'Production build context and URL are required.');
  requireValue(Boolean(env.GITHUB_TOKEN), 'GitHub read token is missing.');
}

export function validateCommitTrees(main, preview, expectedSha, previewSha) {
  requireValue(main.sha === expectedSha && preview.sha === previewSha, 'GitHub returned an unexpected commit.');
  requireValue(Boolean(main.commit?.tree?.sha) && main.commit.tree.sha === preview.commit?.tree?.sha, 'Main must contain exactly the reviewed preview tree.');
}

export function validateEnvironment(environment) {
  requireValue(environment.name === 'production', 'The production environment is missing.');
  const reviewers = environment.protection_rules?.find(rule => rule.type === 'required_reviewers');
  requireValue(reviewers?.reviewers?.length > 0 && reviewers.prevent_self_review === true, 'Production requires a reviewer and Prevent self-review. Configure GitHub before publishing.');
}

export function validateChecks(checks) {
  const latest = new Map();
  for (const check of checks) if (!latest.has(check.name) || latest.get(check.name).id < check.id) latest.set(check.name, check);
  for (const name of ['Build site', 'Security checks', 'Analyze JavaScript']) {
    const check = latest.get(name);
    requireValue(check?.status === 'completed' && check.conclusion === 'success', `Exact main commit needs a successful ${name} check.`);
  }
  const findings = latest.get('CodeQL');
  if (findings) requireValue(findings.status === 'completed' && findings.conclusion === 'success', 'The CodeQL findings check has not passed.');
}

export function validateCodeQLAnalysis(analyses, sha) {
  const exact = analyses.filter(analysis => analysis.commit_sha === sha && analysis.tool?.name === 'CodeQL');
  requireValue(exact.length > 0 && exact.every(analysis => !analysis.error && analysis.rules_count > 0), 'A successful CodeQL analysis for the exact main SHA is required.');
}

export function validatePreviewStatus(statuses) {
  const status = statuses.find(item => item.context === 'netlify/karaoglugroupnet/deploy-preview');
  requireValue(status?.state === 'success', 'Reviewed source needs a successful same-project Netlify preview.');
  const url = new URL(status.target_url);
  requireValue(url.protocol === 'https:' && (url.hostname === 'deploy-preview-1--karaoglugroupnet.netlify.app' || /^deploy-preview-[1-9][0-9]*--karaoglugroupnet\.netlify\.app$/.test(url.hostname)), 'Unexpected preview status URL.');
}

export function validateAlerts(alerts) {
  requireValue(!alerts.some(alert => alert.state === 'open' && ['critical', 'high'].includes(alert.rule?.security_severity_level)), 'Open high or critical Code Scanning alerts block publication.');
}

export function validateSite(site) {
  requireValue(site.id === PRODUCTION_SITE_ID && site.name === 'karaoglugroupnet' && site.ssl_url?.replace(/\/$/, '') === PRODUCTION_URL, 'Netlify production identity does not match.');
  requireValue(site.build_settings?.repo_path === REPOSITORY && site.build_settings.repo_branch === 'main', 'Unexpected Netlify repository or production branch.');
  requireValue(site.build_settings?.stop_builds === false, 'Preserve the enabled Git preview pipeline.');
  requireValue(site.published_deploy?.state === 'ready' && site.published_deploy.locked === true, 'An existing ready, locked publication is required.');
}

export function validateCandidate(deploy) {
  requireValue(deploy.site_id === PRODUCTION_SITE_ID && /^[0-9a-f]{24}$/.test(deploy.id || ''), 'Candidate belongs to another project.');
  requireValue(deploy.state === 'ready' && !deploy.published_at, 'Candidate must be ready and unpublished.');
}

export function validateProductionHtml(html) {
  requireValue(/<meta\s+name="robots"\s+content="index, follow"/.test(html), 'Production content must be indexable.');
  requireValue(html.includes(`rel="canonical" href="${PRODUCTION_URL}/`), 'Production canonical is missing.');
  for (const form of html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)) {
    for (const button of form[1].matchAll(/<button\b[^>]*type="submit"[^>]*>/g)) requireValue(/\bdisabled(?:="")?(?:\s|>)/.test(button[0]), 'Production forms must remain disabled.');
  }
}

// Netlify Forms removes detection attributes and normalizes form attribute order.
// Every other HTML byte, including form fields and disabled buttons, must match.
export function normalizeNetlifyForms(html) {
  return html.replace(/<form\b[^>]*>/gi, tag => JSON.stringify([...tag.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
    .slice(1).map(match => [match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? ''])
    .filter(([name]) => !['data-netlify', 'netlify-honeypot'].includes(name))
    .sort(([a], [b]) => a.localeCompare(b))));
}
