import { env } from './comun.mts';

const catalogo = new Map<number, any[]>();

export const printfulBase = () => env('PRINTFUL_API_URL') || 'https://api.printful.com';

export function printfulHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env('PRINTFUL_API_KEY')}`,
    'Content-Type': 'application/json',
    ...(env('PRINTFUL_STORE_ID') ? { 'X-PF-Store-Id': env('PRINTFUL_STORE_ID') } : {}),
  };
}

export function productoPrintful(product: any) {
  return Number(env(`PRINTFUL_PRODUCT_${product.id.toUpperCase()}`)) || product.printful.productId;
}

// "12×16″" and "12″×16″" both become "12x16"; "11 oz" becomes "11"; "XL" stays "xl".
function normalizarTalla(t: string) {
  const s = String(t || '');
  return /\d/.test(s) ? (s.match(/\d+/g) || []).join('x') : s.trim().toLowerCase();
}

// Finds the Printful variant for a product + chosen options (size/color).
export async function resolverVariante(product: any, opciones: Record<string, string>) {
  const id = productoPrintful(product);
  if (!catalogo.has(id)) {
    const r = await fetch(`${printfulBase()}/products/${id}`, { headers: printfulHeaders() });
    if (!r.ok) throw new Error(`Printful product ${id}: HTTP ${r.status}`);
    catalogo.set(id, (await r.json())?.result?.variants || []);
  }
  const variantes = catalogo.get(id)!;
  const quiero = { ...(product.fixed || {}), ...opciones };
  const v = variantes.find((x) =>
    (!quiero.size || normalizarTalla(x.size) === normalizarTalla(quiero.size))
    && (!quiero.color || String(x.color || '').toLowerCase() === quiero.color.toLowerCase()));
  if (!v) throw new Error(`No Printful variant for ${product.id} ${JSON.stringify(quiero)} in product ${id}`);
  return v.id as number;
}
