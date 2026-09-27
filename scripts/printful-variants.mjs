// Lists Printful framed-poster variants so you can copy the right IDs into Netlify env vars.
// Usage: PRINTFUL_API_KEY=... npm run printful:variants
const key = process.env.PRINTFUL_API_KEY;
if (!key) { console.error('Set PRINTFUL_API_KEY first.'); process.exit(1); }
const headers = { Authorization: `Bearer ${key}` };
const productos = await fetch('https://api.printful.com/products?category_id=', { headers }).then((r) => r.json());
const enmarcados = (productos.result || []).filter((p) => /framed poster/i.test(p.title));
for (const p of enmarcados) {
  const detalle = await fetch(`https://api.printful.com/products/${p.id}`, { headers }).then((r) => r.json());
  console.log(`\n${p.title} (product ${p.id})`);
  for (const v of detalle.result?.variants || []) {
    if (/12″?×16|18″?×24|12x16|18x24/i.test(v.name)) console.log(`  variant ${v.id}  ${v.name}  $${v.price}`);
  }
}
