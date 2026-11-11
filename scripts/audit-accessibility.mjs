// Real Chromium + axe-core audit using the repository's existing CDP client.
// Requires: npm install -D axe-core
// Requires: node scripts/serve-audit.mjs dist 4175
// Requires: Chrome running with --remote-debugging-port=9222
import axe from 'axe-core';
import { writeFile } from 'node:fs/promises';
import { browserSession, pause } from './browser-session.mjs';
import { pagePath, pagePaths } from '../src/utils/routes.js';
import { reportDir, prepareReports, navigate, dismissPrivacy } from './qa-helpers.mjs';

const OUT = `${reportDir}/accessibility.json`;
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const views = [...Object.keys(pagePaths), 'not-found'];
const reports = [];
let errorCount = 0;

await prepareReports();
const browser = await browserSession();
try {
  await dismissPrivacy(browser);

  for (const language of ['tr', 'en', 'ar']) {
    for (const view of views) {
      const widths = ['home', 'contact', 'career'].includes(view) ? [390, 1440] : [1440];
      for (const width of widths) {
        const path = pagePath(view, language);
        await browser.send('Emulation.setDeviceMetricsOverride', {
          width, height: 900, deviceScaleFactor: 1, mobile: width < 768,
        });
        await navigate(browser, path);
        let ready = false;
        for (let attempt = 0; attempt < 80; attempt++) {
          ready = Boolean(await browser.evaluate("document.readyState === 'complete' && !!document.querySelector('h1')"));
          if (ready) break;
          await pause(100);
        }
        if (!ready) throw new Error(`Page did not finish loading: ${path}`);
        await pause(350);
        const injection = await browser.send('Runtime.evaluate', { expression: axe.source });
        if (injection.exceptionDetails) throw new Error(`axe injection failed on ${path}`);
        const result = await browser.evaluate(`
          window.axe.run(document, {
            runOnly: { type: 'tag', values: ${JSON.stringify(tags)} }
          }).then(result => ({
            incompleteCount: result.incomplete.length,
            incomplete: result.incomplete.map(item => ({ id:item.id, nodes:item.nodes.length })),
            passes: result.passes.length,
            violations: result.violations.map(v => ({
              id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
              nodes: v.nodes.slice(0, 6).map(n => ({
                target: n.target, summary: n.failureSummary
              })),
              affectedNodes: v.nodes.length
            }))
          }))
        `);
        errorCount += result.violations.length;
        reports.push({ path, language, view, width, ...result });
        await writeFile(`${reportDir}/accessibility-checkpoint.json`,JSON.stringify({reports,totalViolations:errorCount},null,2));
        console.log(`${result.violations.length ? 'FAIL' : 'PASS'} AXE ${path} ${width}px: ${result.violations.length} violations`);
      }
    }
  }
} finally {
  await browser.close();
  await writeFile(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(),
    methodology: 'Chrome CDP + axe-core; automated WCAG-tagged checks, NOT a full manual WCAG 2.2 AA certification.',
    scanned: reports.length,
    expectedScans: views.length * 3 + 9,
    complete: reports.length === views.length * 3 + 9,
    totalViolations: errorCount,
    reports,
  }, null, 2));
}
console.log(`Accessibility report: ${OUT}`);
if (errorCount) {
  console.error(`${errorCount} automated rule violations across tested pages. Review JSON and repair before release.`);
  process.exitCode = 1;
}
