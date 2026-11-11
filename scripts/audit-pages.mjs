import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { pagePath, pagePaths } from '../src/utils/routes.js';
import { browserSession, pause } from './browser-session.mjs';
import { prepareReports, navigate } from './qa-helpers.mjs';

const base = 'http://127.0.0.1:4175';
const browser = await browserSession();
const results = [];
const widths = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440, 1920];
await prepareReports();
await browser.send('Page.addScriptToEvaluateOnNewDocument', { source: "localStorage.setItem('karaoglu-privacy-consent','{\"choice\":\"necessary\"}')" });
try {
  for (const language of ['tr', 'en', 'ar']) {
    for (const view of [...Object.keys(pagePaths), 'not-found']) {
      const path = pagePath(view, language);
      const response = await fetch(base + path);
      const html = await response.text();
      assert.equal(response.status, 200, path);
      assert.match(html, /data-ssr="true"/);
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + ' static H1');
      assert.ok(!html.includes('/src/') && !html.includes('$RC='), path + ' no dev assets or inline patches');
      await navigate(browser, path);
      for (let attempt = 0; attempt < 40; attempt++) {
        await pause(75);
        if (await browser.evaluate(`document.readyState === 'complete' && !!document.querySelector('h1')`)) break;
      }
      await pause(650);
      const page = { path, view, language, sizes: [] };
      for (const width of widths) {
        await browser.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
        await pause(35);
        const state = await browser.evaluate(`({ lang:document.documentElement.lang, h1:document.querySelectorAll('h1').length, overflow:document.documentElement.scrollWidth > innerWidth + 1, title:document.title, canonical:document.querySelector('link[rel="canonical"]').href, alternates:document.querySelectorAll('link[hreflang]').length, brokenVisible:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight && i.getBoundingClientRect().bottom>0 && i.complete && !i.naturalWidth).map(i=>i.currentSrc || i.src) })`);
        assert.equal(state.lang, language, path);
        assert.equal(state.h1, 1, path);
        assert.equal(state.overflow, false, path + ' overflow at ' + width);
        assert.equal(state.alternates, 4, path);
        assert.equal(state.brokenVisible.length, 0, path + ' broken visible media');
        page.sizes.push({ width, ...state });
      }
      results.push(page);
      await writeFile(`${process.env.RELEASE_REPORT_DIR || 'reports'}/page-audit-checkpoint.json`, JSON.stringify({ pages: results, completedChecks: results.length * widths.length }, null, 2));
      console.log('PASS', path, widths.length, 'widths');
    }
  }
  // Every static internal URL must resolve, including image/source and share assets.
  const references = new Set();
  for (const page of results) {
    const html = await readFile(`dist${page.path}index.html`, 'utf8');
    for (const [, url] of html.matchAll(/(?:href|src|poster)="(\/[^"]*)"/g)) references.add(url.split('#')[0]);
    for (const [, srcset] of html.matchAll(/\b(?:imagesrcset|srcset)="([^"]*)"/gi)) for (const part of srcset.split(',')) references.add(part.trim().split(' ')[0]);
  }
  for (const path of references) if (path) assert.equal((await fetch(base + path)).status, 200, path);
  assert.equal((await fetch(base + '/missing-page-qa/')).status, 404);
  const errors = browser.events.filter(event => event.method === 'Runtime.exceptionThrown' || (event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error'));
  assert.equal(errors.length, 0, JSON.stringify(errors));
  await writeFile(`${process.env.RELEASE_REPORT_DIR || 'reports'}/page-audit.json`, JSON.stringify({ pages: results, internalReferences: references.size, consoleErrors: errors, checks: results.length * widths.length }, null, 2));
  console.log('PASS', results.length, 'pages;', results.length * widths.length, 'responsive checks;', references.size, 'internal resources');
} finally { await browser.close(); }
