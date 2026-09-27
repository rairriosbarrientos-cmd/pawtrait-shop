import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLES, PRODUCTS, styleById, productById, usd } from '../src/catalogo.js';

test('styles have unique ids and prompts that keep the pet recognizable', () => {
  assert.equal(new Set(STYLES.map((s) => s.id)).size, STYLES.length);
  for (const s of STYLES) assert.match(s.prompt, /same face/);
});

test('every physical product maps to a Printful variant env var', () => {
  for (const p of PRODUCTS) {
    assert.ok(Number.isInteger(p.price) && p.price > 0);
    if (p.physical) assert.match(p.variantEnv, /^PRINTFUL_VARIANT_/);
  }
});

test('lookups and price formatting', () => {
  assert.equal(styleById('royal').name, 'The Royal');
  assert.equal(styleById('nope'), null);
  assert.equal(productById('digital').physical, false);
  assert.equal(usd(8900), '$89');
  assert.equal(usd(2950), '$29.50');
});
