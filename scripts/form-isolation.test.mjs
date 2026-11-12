import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveFormFlags } from '../src/utils/netlifyForms.js';

test('all switch combinations fail closed unless explicitly approved', () => {
  for (const master of [undefined, false, true, 'false', 'true', 'TRUE']) {
    for (const contact of [undefined, 'false', 'true']) for (const career of [undefined, 'false', 'true']) {
      assert.deepEqual(resolveFormFlags({
        VITE_NETLIFY_FORMS_ENABLED: master,
        VITE_CONTACT_FORMS_ENABLED: contact,
        VITE_CAREER_FORMS_ENABLED: career,
      }), { contact: master === 'true' && contact === 'true', career: master === 'true' && career === 'true' });
    }
  }
});

test('transport blocks disabled and unknown form names before fetch', async () => {
  const source = await readFile(new URL('../src/utils/netlifyForms.js', import.meta.url), 'utf8');
  const originalFormData = globalThis.FormData;
  const originalFetch = globalThis.fetch;
  const requests = [];
  try {
    // A synthetic form adapter: no DOM, remote endpoint or personal data.
    globalThis.FormData = class { constructor(form) { return form; } };
    globalThis.fetch = async (url, options) => { requests.push({ url, ...options }); return { ok: true }; };
    for (const [contact, career] of [[false, false], [true, false], [false, true], [true, true]]) {
      const env = { VITE_NETLIFY_FORMS_ENABLED: 'true', VITE_CONTACT_FORMS_ENABLED: String(contact), VITE_CAREER_FORMS_ENABLED: String(career) };
      const module = await import(`data:text/javascript;base64,${Buffer.from(source.replaceAll('import.meta.env', JSON.stringify(env))).toString('base64')}`);
      for (const [name, allowed] of [['corporate-contact', contact], ['career-application', career], ['unknown', false]]) {
        const form = new originalFormData();
        form.set('form-name', name);
        const before = requests.length;
        if (allowed) {
          await module.submitNetlifyForm(form, { multipart: name === 'career-application' });
          assert.equal(requests.length, before + 1);
          const request = requests.at(-1);
          assert.equal(request.url, '/');
          assert.equal(request.method, 'POST');
          if (name === 'career-application') assert.equal(request.body, form);
          else assert.equal(new URLSearchParams(request.body).get('form-name'), name);
        } else {
          await assert.rejects(module.submitNetlifyForm(form));
          assert.equal(requests.length, before);
        }
      }
      const spam = new originalFormData();
      spam.set('form-name', contact ? 'corporate-contact' : 'career-application');
      spam.set('bot-field', 'synthetic');
      const before = requests.length;
      await assert.rejects(module.submitNetlifyForm(spam));
      assert.equal(requests.length, before);
    }
  } finally {
    globalThis.FormData = originalFormData;
    globalThis.fetch = originalFetch;
  }
});
