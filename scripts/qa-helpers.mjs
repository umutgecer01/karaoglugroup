import { mkdir } from 'node:fs/promises';
import { pause } from './browser-session.mjs';

export const reportDir = process.env.RELEASE_REPORT_DIR || 'reports/final-release';
export const base = 'http://127.0.0.1:4175';
export async function prepareReports() { await mkdir(reportDir, { recursive: true }); }
export async function navigate(browser, path) {
  await browser.send('Page.navigate', { url: base + path });
  for (let n = 0; n < 150; n++) {
    try { if (await browser.call(path => location.pathname === path && document.readyState === 'complete' && !!document.querySelector('h1'), path)) { await pause(180); return; } } catch { /* The previous execution context can disappear during navigation. */ }
    await pause(100);
  }
  throw new Error('Page readiness timeout: ' + path);
}
export async function dismissPrivacy(browser) {
  await browser.send('Page.addScriptToEvaluateOnNewDocument', { source: 'localStorage.setItem("karaoglu-privacy-consent",JSON.stringify({choice:"necessary"}))' });
}
