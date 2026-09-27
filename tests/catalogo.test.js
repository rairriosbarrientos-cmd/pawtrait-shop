import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLES, PRODUCTS, styleById, productById, usd, validLine, priceFor, defaultOptions, fromPrice } from '../src/catalogo.js';

test('styles have unique ids and prompts that keep the pet recognizable', () => {
  assert.equal(new Set(STYLES.map((s) => s.id)).size, STYLES.length);
  for (const s of STYLES) assert.match(s.prompt, /same face/);
});

test('every physical product can be fulfilled by Printful and every option has a price', () => {
  assert.equal(new Set(PRODUCTS.map((p) => p.id)).size, PRODUCTS.length);
  for (const p of PRODUCTS) {
    if (p.physical) {
      assert.ok(Number.isInteger(p.printful?.productId), p.id);
      assert.ok(['front', 'default'].includes(p.printful.placement), p.id);
    }
    const tallas = p.options?.size || [undefined];
    for (const size of tallas) assert.ok(priceFor(p, { size }) > 0, `${p.id} ${size}`);
    assert.ok(fromPrice(p) > 0);
  }
});

test('cart lines are validated against the catalog (prices never come from the browser)', () => {
  const tee = validLine({ producto: 'tee', opciones: { size: 'L', color: 'Black' }, qty: 2, price: 1 });
  assert.deepEqual(tee, { producto: 'tee', opciones: { size: 'L', color: 'Black' }, qty: 2, price: 3400 });
  assert.equal(validLine({ producto: 'tee', opciones: { size: 'XXXL', color: 'Black' }, qty: 1 }), null);
  assert.equal(validLine({ producto: 'tee', opciones: { size: 'L' }, qty: 1 }), null);
  assert.equal(validLine({ producto: 'mug', opciones: { size: '11 oz' }, qty: 0 }), null);
  assert.equal(validLine({ producto: 'mug', opciones: { size: '11 oz' }, qty: 11 }), null);
  assert.equal(validLine({ producto: 'nope', qty: 1 }), null);
  assert.equal(validLine({ producto: 'digital', qty: 5 }).qty, 1);
  assert.equal(validLine({ producto: 'canvas', opciones: { size: '16×20″' }, qty: 1 }).price, 8900);
  assert.deepEqual(defaultOptions(productById('hoodie')), { size: 'S', color: 'White' });
});

test('lookups and price formatting', () => {
  assert.equal(styleById('royal').name, 'The Royal');
  assert.equal(styleById('nope'), null);
  assert.equal(usd(8900), '$89');
  assert.equal(usd(2950), '$29.50');
});
