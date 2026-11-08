import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { pagePath, pagePaths } from '../src/utils/routes.js';
import { pageMetadata } from '../src/utils/metadata.js';
import { tr } from '../src/data/translations/tr.js';
import { en } from '../src/data/translations/en.js';
import { ar } from '../src/data/translations/ar.js';
import { decodeHtmlEntities as unescape } from './html-entities.mjs';

const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1].toLowerCase(), match[2]]));
test('preview headers retain security/cache rules and production has no preview header file', async () => {
  if (['deploy-preview','branch-deploy'].includes(process.env.CONTEXT)) {
    const headers = await readFile('dist/_headers','utf8');
    for (const value of ['X-Robots-Tag: noindex, nofollow, nosnippet','Content-Security-Policy:', 'Strict-Transport-Security:', 'X-Content-Type-Options: nosniff','/assets/*','immutable','/images/*','/videos/*']) assert.ok(headers.includes(value), value);
  } else await assert.rejects(access('dist/_headers'));
});
test('all 54 generated pages expose matching metadata and remain form-disabled', async () => {
  let count = 0;
  for (const [language, content] of Object.entries({ tr, en, ar })) for (const view of [...Object.keys(pagePaths), 'not-found']) {
    const html = await readFile(`dist${pagePath(view, language)}index.html`, 'utf8');
    const expected = pageMetadata(view, language, content, undefined, ['deploy-preview','branch-deploy'].includes(process.env.CONTEXT));
    assert.equal(unescape(html.match(/<title>(.*?)<\/title>/)[1]), expected.title);
    assert.match(html, new RegExp(`<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">`));
    const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(match => attrs(match[0]));
    for (const [key, value] of [['description', expected.description], ['og:title', expected.title], ['og:description', expected.description], ['og:url', expected.canonical], ['og:locale', expected.locale], ['twitter:title', expected.title], ['robots', expected.robots]]) {
      const meta = metas.find(item => item.name === key || item.property === key);
      assert.equal(unescape(meta?.content || ''), value, `${language}/${view} ${key}`);
    }
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(match => attrs(match[0]));
    assert.equal(links.find(item => item.rel === 'canonical').href, expected.canonical);
    for (const alternate of expected.alternates) assert.equal(links.find(item => item.hreflang === alternate.lang).href, alternate.href);
    assert.ok(!html.includes('Bot alanı'), 'hidden field must not introduce Turkish into other locales');
    for (const [, attributes, body] of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)) {
      const form = attrs(attributes);
      assert.equal(form.method, 'POST');
      assert.equal(form['data-netlify'], 'true');
      assert.equal(form['netlify-honeypot'], 'bot-field');
      const fields = [...body.matchAll(/<(?:input|textarea|select)\b[^>]*>/g)].map(match => attrs(match[0]));
      assert.equal(fields.find(item => item.name === 'form-name')?.value, form.name);
      for (const field of ['bot-field', 'name', 'phone', 'email', 'consent']) assert.ok(fields.some(item => item.name === field));
      if (form.name === 'career-application') {
        assert.equal(form.enctype, 'multipart/form-data');
        for (const field of ['position', 'experience', 'cv']) assert.ok(fields.some(item => item.name === field));
        assert.equal(fields.find(item => item.name === 'cv').type, 'file');
      }
      const submit = body.match(/<button[^>]*type="submit"[^>]*>/)?.[0];
      if (submit) assert.match(submit, /\bdisabled(?:="")?/);
    }
    const preloads = links.filter(item => item.rel === 'preload' && item.as === 'image');
    assert.equal(preloads.length, view === 'home' ? 1 : 0, 'only home hero needs a preload');
    if (view === 'home') {
      assert.equal(preloads[0].type, 'image/webp');
      assert.ok(preloads[0].imagesrcset && preloads[0].imagesizes);
    }
    count++;
  }
  assert.equal(count, 54);
});
test('static detection stubs contain the complete form field union', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const stubs = [...html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)].filter(match => /\bhidden(?:="")?(?:\s|$)/.test(match[1]));
  assert.equal(stubs.length, 2);
  const contact = stubs.find(match => attrs(match[1]).name === 'corporate-contact');
  for (const field of ['form-name','source','bot-field','name','phone','email','company','service','message','consent']) assert.match(contact[2], new RegExp(`name="${field}"`));
  const career = stubs.find(match => attrs(match[1]).name === 'career-application');
  for (const field of ['form-name','bot-field','name','phone','email','position','experience','message','cv','consent']) assert.match(career[2], new RegExp(`name="${field}"`));
});
test('sitemap and robots match all 51 canonical content pages, excluding 404', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 51);
  for (const language of ['tr','en','ar']) for (const view of Object.keys(pagePaths)) assert.ok(sitemap.includes(`<loc>https://karaoglugroupnet.netlify.app${pagePath(view, language)}</loc>`));
  assert.ok(!sitemap.includes('/404/'));
  assert.match(await readFile('dist/robots.txt', 'utf8'), /Sitemap: https:\/\/karaoglugroupnet.netlify.app\/sitemap.xml/);
  assert.match(await readFile('netlify.toml', 'utf8'), /VITE_NETLIFY_FORMS_ENABLED = "false"/);
});
