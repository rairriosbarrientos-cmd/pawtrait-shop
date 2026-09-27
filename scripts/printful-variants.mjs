// Checks that every Printful product ID in the catalog is right for your account
// and that each size/color the shop sells exists. Usage: PRINTFUL_API_KEY=... npm run printful:variants
import { PRODUCTS, defaultOptions } from '../src/catalogo.js';
const key = process.env.PRINTFUL_API_KEY;
if (!key) { console.error('Set PRINTFUL_API_KEY first.'); process.exit(1); }
const headers = { Authorization: `Bearer ${key}` };
const norm = (t) => (/\d/.test(String(t)) ? (String(t).match(/\d+/g) || []).join('x') : String(t || '').trim().toLowerCase());
let problemas = 0;
for (const p of PRODUCTS.filter((x) => x.physical)) {
  const id = Number(process.env[`PRINTFUL_PRODUCT_${p.id.toUpperCase()}`]) || p.printful.productId;
  const r = await fetch(`https://api.printful.com/products/${id}`, { headers }).then((x) => x.json());
  const variantes = r.result?.variants || [];
  console.log(`\n${p.name} → Printful product ${id}: ${r.result?.product?.title || 'NOT FOUND'}`);
  const tallas = p.options?.size || [undefined];
  const colores = p.options?.color || [p.fixed?.color];
  for (const size of tallas) for (const color of colores) {
    const v = variantes.find((x) => (!size || norm(x.size) === norm(size)) && (!color || String(x.color).toLowerCase() === color.toLowerCase()));
    if (!v) { problemas++; console.log(`  ✗ missing ${size || ''} ${color || ''}`); } else console.log(`  ✓ ${size || ''} ${color || ''} → variant ${v.id} ($${v.price} cost)`);
  }
}
console.log(problemas ? `\n${problemas} option(s) not found: fix the product ID with PRINTFUL_PRODUCT_<ID> env vars or adjust options in src/catalogo.js.` : '\nAll good ✓');
