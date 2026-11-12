import test from 'node:test';
import assert from 'node:assert/strict';
import { approvedReferences, publishableReferences } from '../src/data/approvedReferences.js';

test('no unapproved real-world references are presented by default', () => {
  assert.deepEqual(approvedReferences, []);
  assert.deepEqual(publishableReferences(), []);
  assert.deepEqual(publishableReferences([
    { id: 'a', name: 'Fictional', verified: false, publicationApproved: true },
    { id: 'b', name: 'Fictional', verified: true, publicationApproved: false },
  ]), []);
});
test('references require approval, identity and safe local image paths', () => {
  const verified = {id:'approved-test', name:'TEST ONLY', verified:true, publicationApproved:true};
  assert.equal(publishableReferences([verified]).length, 1);
  assert.deepEqual(publishableReferences([{...verified, logoSrc:'https://example.test/remote.svg'}]), []);
  assert.deepEqual(publishableReferences([{...verified, logoSrc:'/images/example.webp'}]).length, 1);
  for (const logoSrc of ['/images/../private.webp', '/images//example.webp', '/images/example.svg', '/images/example.webp?x=1', ['images/example.webp'], 'javascript:alert(1)']) {
    assert.deepEqual(publishableReferences([{ ...verified, logoSrc }]), []);
  }
  for (const record of [null, undefined, {}, { ...verified, id: ' ' }, { ...verified, name: '' }]) {
    assert.deepEqual(publishableReferences([record]), []);
  }
});
