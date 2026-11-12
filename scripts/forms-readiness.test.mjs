import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cvValidationError, isAllowedCvFile, MAX_CV_SIZE_BYTES,
  resolveFormFlags, isFormNameEnabled, CONTACT_FORM_NAME, CAREER_FORM_NAME,
} from '../src/utils/netlifyForms.js';

test('CV validation distinguishes missing, empty, disallowed and oversized uploads', () => {
  for (const file of [null, undefined, { name: '' }, { name: 'cv.pdf', size: 0 }, { name: 'cv.pdf', size: -1 }, { name: 'cv.pdf', size: NaN }]) {
    assert.equal(cvValidationError(file), 'required');
  }
  for (const name of ['cv.exe', 'cv.pdf.exe', 'cv.svg', 'cv.docx.html']) {
    assert.equal(cvValidationError({ name, size: 100 }), 'type');
  }
  assert.equal(cvValidationError({ name: 'cv.pdf', size: MAX_CV_SIZE_BYTES + 1 }), 'size');
  assert.equal(cvValidationError({ name: 'cv.pdf', size: MAX_CV_SIZE_BYTES }), null);
});

test('CV picker accepts supported documents while rejecting a conflicting browser MIME type', () => {
  for (const [name, type] of [
    ['CV.PDF', 'application/pdf'],
    ['cv.doc', 'application/msword'],
    ['cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ['cv.pdf', ''],
    ['cv.doc', 'application/octet-stream'],
  ]) assert.equal(cvValidationError({ name, type, size: 100 }), null);
  for (const [name, type] of [['cv.pdf', 'image/svg+xml'], ['cv.docx', 'text/html'], ['cv.doc', 'application/pdf']]) {
    assert.equal(cvValidationError({ name, type, size: 100 }), 'type');
  }
  assert.equal(isAllowedCvFile({ name: {} }), false);
  assert.equal(isAllowedCvFile({}), false);
});

test('forms stay closed unless global and per-form switches are explicitly true', () => {
  const off = resolveFormFlags({});
  assert.deepEqual(off, { contact: false, career: false });
  assert.deepEqual(resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
  }), off);
  const contactOnly = resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
    VITE_CONTACT_FORMS_ENABLED: 'true',
    VITE_CAREER_FORMS_ENABLED: 'false',
  });
  assert.deepEqual(contactOnly, { contact: true, career: false });
  assert.equal(isFormNameEnabled(CONTACT_FORM_NAME, contactOnly), true);
  assert.equal(isFormNameEnabled(CAREER_FORM_NAME, contactOnly), false);
  assert.equal(isFormNameEnabled('unexpected-form', contactOnly), false);
  const careerOnly = resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'true',
    VITE_CONTACT_FORMS_ENABLED: 'false',
    VITE_CAREER_FORMS_ENABLED: 'true',
  });
  assert.deepEqual(careerOnly, { contact: false, career: true });
  assert.deepEqual(resolveFormFlags({
    VITE_NETLIFY_FORMS_ENABLED: 'false',
    VITE_CONTACT_FORMS_ENABLED: 'true',
    VITE_CAREER_FORMS_ENABLED: 'true',
  }), off);
});
