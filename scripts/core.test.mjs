import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { pagePath, pagePaths, resolveRoute } from '../src/utils/routes.js';
import { pageMetadata } from '../src/utils/metadata.js';
import { tr } from '../src/data/translations/tr.js';
import { en } from '../src/data/translations/en.js';
import { ar } from '../src/data/translations/ar.js';
import { getServiceGallery } from '../src/data/serviceGallery.js';
import { formsEnabled, submitNetlifyForm, isValidEmail, isValidPhone, isAllowedCvFile, MAX_CV_SIZE_BYTES } from '../src/utils/netlifyForms.js';
import { normalizeLanguage } from '../src/utils/i18n.js';
import { decodeHtmlEntities } from './html-entities.mjs';
import { callBrowserFunction } from './browser-call.mjs';

test('HTML entities decode a single layer, preserving nested and unknown references', () => {
  assert.equal(decodeHtmlEntities('&amp;&quot;&#x27;&lt;&gt;'), '&"\'<>');
  assert.equal(decodeHtmlEntities('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
  assert.equal(decodeHtmlEntities('&amp;quot;&amp;#x27;&amp;amp;'), '&quot;&#x27;&amp;');
  assert.equal(decodeHtmlEntities('&unknown; plain العربية Türkçe'), '&unknown; plain العربية Türkçe');
});

test('URL and storage language text selects only trusted localized routes', () => {
  const origin = 'https://example.invalid';
  for (const input of ['//evil.invalid', 'https://evil.invalid', '\\\\evil.invalid', 'javascript:alert(1)', '%2f%2fevil.invalid', 'en/../../evil', 'constructor', '__proto__', '', null, {}, 'EN', ' ar ']) {
    assert.ok(['tr', 'en', 'ar'].includes(normalizeLanguage(input)));
    for (const view of [...Object.keys(pagePaths), '__proto__', 'constructor', '//evil.invalid']) {
      const path = pagePath(view, input);
      const url = new URL(path, origin);
      assert.equal(url.origin, origin);
      assert.match(path, /^\/(tr|en|ar)\/[a-z0-9-]*\/?$/);
    }
  }
  assert.equal(normalizeLanguage(' EN '), 'en');
  assert.equal(normalizeLanguage('AR'), 'ar');
  assert.equal(pagePath('__proto__', 'en'), '/en/404/');
  assert.deepEqual(resolveRoute('/', '', '#constructor'), {view:'not-found', language:'tr'});
});

test('CDP function arguments cannot become executable function source', async () => {
  const payload = '\");globalThis.compromised=true;//\\`\nالعربية';
  const calls = [];
  const send = async (method, params) => {
    calls.push({method, params});
    return method === 'Runtime.evaluate' ? {result:{objectId:'context'}} : {result:{value:payload}};
  };
  assert.equal(await callBrowserFunction(send, value => value, [payload]), payload);
  assert.equal(calls[0].params.expression, 'globalThis');
  assert.equal(calls[1].method, 'Runtime.callFunctionOn');
  assert.deepEqual(calls[1].params.arguments, [{value:payload}]);
  assert.ok(!calls[1].params.functionDeclaration.includes(payload));
  await assert.rejects(callBrowserFunction(async () => ({exceptionDetails:{text:'blocked'}}), () => true), /context unavailable/);
});

test('production-disabled form transport rejects without making a network request', async () => {
  assert.equal(formsEnabled, false);
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = () => { requests++; throw new Error('Unexpected network call'); };
  try { await assert.rejects(submitNetlifyForm({}), /must be verified/); assert.equal(requests, 0); }
  finally { globalThis.fetch = originalFetch; }
});
test('contact validators reject malformed values and keep the CV limit below the platform request cap', () => {
  assert.ok(isValidEmail('qa@example.invalid'));
  for (const value of ['invalid', 'a@@example.com', 'a@', '']) assert.equal(isValidEmail(value), false);
  assert.ok(isValidPhone('+90 (544) 443 80 00'));
  for (const value of ['letters05444438000', '123', '1234567890123456']) assert.equal(isValidPhone(value), false);
  assert.ok(isAllowedCvFile({ name: 'resume.PDF' }));
  assert.equal(isAllowedCvFile({ name: 'resume.pdf.exe' }), false);
  assert.equal(MAX_CV_SIZE_BYTES, 7 * 1024 * 1024);
  assert.ok(MAX_CV_SIZE_BYTES < 8_000_000);
});

test('all localized paths round trip without ambiguity', () => {
  for (const language of ['tr', 'en', 'ar']) for (const view of Object.keys(pagePaths)) assert.deepEqual(resolveRoute(pagePath(view, language)), { view, language });
  assert.equal(resolveRoute('/missing').view, 'not-found');
  assert.deepEqual(resolveRoute('/', '?lang=en', '#faaliyetler'), { view: 'services', language: 'en' });
  assert.deepEqual(resolveRoute('/en/contact/', '', '#main-content'), { view: 'contact', language: 'en' });
});
test('metadata has unique titles, correct canonical and three language alternates', () => {
  for (const [language, content] of Object.entries({ tr, en, ar })) {
    const titles = new Set();
    for (const view of Object.keys(pagePaths)) {
      const meta = pageMetadata(view, language, content);
      assert.ok(meta.title && meta.description && meta.description !== 'undefined');
      assert.equal(new URL(meta.canonical).pathname, pagePath(view, language));
      assert.equal(meta.alternates.length, 3);
      assert.ok(!titles.has(meta.title), `${language}: duplicate title ${meta.title}`);
      titles.add(meta.title);
    }
    assert.equal(pageMetadata('not-found', language, content).robots, 'noindex, follow');
  }
});

test('preview metadata forbids indexing while preserving production canonical URLs', () => {
  const production = pageMetadata('contact','en',en);
  const preview = pageMetadata('contact','en',en,undefined,true);
  assert.equal(preview.robots,'noindex, nofollow');
  assert.equal(preview.canonical,production.canonical);
  assert.deepEqual(preview.alternates,production.alternates);
});
const strings = (object, path = '') => Object.entries(object).flatMap(([key, value]) => value && typeof value === 'object' ? strings(value, `${path}${key}.`) : typeof value === 'string' ? [[path + key, value]] : []);
test('English and Arabic have every Turkish text key and no broken character replacements', () => {
  const keys = strings(tr).filter(([key]) => !key.endsWith('.fit'));
  for (const locale of [en, ar]) {
    const translated = new Map(strings(locale));
    for (const [key] of keys) assert.ok(translated.get(key), `Missing ${key}`);
    for (const [key, value] of strings(locale.ui)) assert.ok(!value.includes('?') && !value.includes('\ufffd'), key);
  }
  assert.equal(tr.ui.skip, '\u0130\u00e7eri\u011fe ge\u00e7');
});
test('responsive variants exist and gallery structure survives translations', async () => {
  const media = JSON.parse(await readFile('src/data/generatedMedia.json', 'utf8'));
  for (const [source, entry] of Object.entries(media)) {
    await access('public' + source);
    assert.ok(entry.width > 0 && entry.height > 0);
    for (const variant of entry.variants) { await access('public' + variant.src); assert.ok(variant.width <= entry.width && variant.bytes > 0); }
  }
  for (const t of [tr, en, ar]) for (const id of ['automotive', 'construction', 'petroleum', 'agriculture', 'rental']) {
    for (const image of getServiceGallery(id, t.services.items[id])) { assert.ok(image.alt && image.width && image.height); await access('public' + image.src); }
  }
});
