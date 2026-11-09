import test from 'node:test';
import assert from 'node:assert/strict';
import { createMotionPreference, MOTION_STORAGE_KEY } from '../src/utils/motionPreference.js';

function fixture({ saved = null, system = false, blocked = false } = {}) {
  const attributes = new Map(), values = new Map([[MOTION_STORAGE_KEY, saved]]), callbacks = new Set();
  const media = { matches: system, addEventListener: (_, callback) => callbacks.add(callback), removeEventListener: (_, callback) => callbacks.delete(callback) };
  const preference = createMotionPreference({ root: { setAttribute: (name, value) => attributes.set(name, value) }, media, storage: { getItem: key => { if (blocked) throw Error('blocked'); return values.get(key); }, setItem: (key, value) => { if (blocked) throw Error('blocked'); values.set(key, value); } } });
  return { preference, attributes, values, changeSystem: value => { media.matches = value; for (const callback of callbacks) callback(); }, callbacks };
}

test('a persistent user choice stops motion across reloads without retaining focus', () => {
  const first = fixture();
  assert.equal(first.attributes.get('data-reduced-motion'), 'false');
  first.preference.setUserReduced(true);
  assert.equal(first.attributes.get('data-reduced-motion'), 'true');
  const reloaded = fixture({ saved: first.values.get(MOTION_STORAGE_KEY) });
  assert.equal(reloaded.preference.snapshot().reduced, true);
  reloaded.preference.setUserReduced(false);
  assert.equal(reloaded.attributes.get('data-reduced-motion'), 'false');
});

test('a user cannot re-enable animation over OS reduced motion, including dynamic changes', () => {
  const f = fixture({ system: true });
  f.preference.setUserReduced(false);
  assert.equal(f.preference.snapshot().reduced, true);
  f.changeSystem(false);
  assert.equal(f.preference.snapshot().reduced, false);
  f.preference.setUserReduced(true);
  f.changeSystem(true); f.changeSystem(false);
  assert.equal(f.preference.snapshot().reduced, true);
});

test('blocked storage keeps the current-visit preference effective', () => {
  const f = fixture({ blocked: true });
  assert.doesNotThrow(() => f.preference.setUserReduced(true));
  assert.equal(f.attributes.get('data-reduced-motion'), 'true');
  assert.equal(f.preference.snapshot().userReduced, true);
});

test('untrusted stored strings do not become arbitrary CSS or a false boolean preference', () => {
  const f = fixture({ saved: 'false' });
  assert.equal(f.preference.snapshot().reduced, false);
  const invalid = fixture({ saved: '<script>' });
  assert.equal(invalid.attributes.get('data-reduced-motion'), 'false');
});

test('subscriptions can be released and media listeners are removed on disposal', () => {
  const f = fixture(); let count = 0;
  const unsubscribe = f.preference.subscribe(() => count++);
  f.preference.setUserReduced(true); assert.equal(count, 1);
  unsubscribe(); f.preference.setUserReduced(false); assert.equal(count, 1);
  f.preference.dispose(); assert.equal(f.callbacks.size, 0);
});
