// Shared catalog: used by the storefront and by the Netlify functions.
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3CkFWXycqPoKkwm4fwcfCrhWKBI';

export const SAMPLE_PHOTO = `${CDN}/hf_20260927_112511_d9cc9e8d-c792-4ec7-bc7a-09872dd3827d.png`;

const KEEP = 'Keep this exact pet recognizable: same face, eye color, fur color, markings and ear shape.';

export const STYLES = [
  {
    id: 'royal',
    name: 'The Royal',
    tagline: 'Renaissance oil portrait fit for a king',
    sample: `${CDN}/hf_20260927_112546_0cf17407-f2b6-4a6a-9fd2-032a6e3dbca7.png`,
    prompt: `Turn this pet into a classical Renaissance royal oil portrait. ${KEEP} Wearing an ornate red velvet royal cape with ermine trim, a gold medallion chain and a small jeweled crown, seated on a tufted velvet cushion, dark moody museum background, Rembrandt lighting, visible oil brushstrokes, fine art masterpiece.`,
  },
  {
    id: 'astronaut',
    name: 'The Astronaut',
    tagline: 'One small step for dogkind',
    sample: `${CDN}/hf_20260927_112546_2b272efa-609f-4b69-915f-63de53bcbdaa.png`,
    prompt: `Turn this pet into a heroic astronaut portrait. ${KEEP} Wearing a detailed white space suit with mission patches, helmet visor open, Earth and stars glowing behind, cinematic rim lighting, highly detailed digital painting, poster quality.`,
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    tagline: 'Soft, timeless, gallery-ready',
    sample: `${CDN}/hf_20260927_112546_3c97077d-e2b7-481e-998e-e1d2e445549e.png`,
    prompt: `Turn this pet into a soft watercolor portrait. ${KEEP} Loose expressive watercolor washes, delicate ink outlines, warm pastel palette, white paper background with gentle paint splashes, elegant minimalist art print.`,
  },
  {
    id: 'general',
    name: 'The General',
    tagline: 'Decorated officer, 19th-century style',
    sample: `${CDN}/hf_20260927_174514_0438c047-d0ec-434a-92c0-670af4a4dec3.png`,
    prompt: `Turn this pet into a 19th-century military officer oil portrait. ${KEEP} Wearing a navy blue military jacket with gold epaulettes, medals and a sash, standing proudly, painted landscape background, classical oil painting, museum quality.`,
  },
  {
    id: 'pop',
    name: 'Pop Art',
    tagline: 'Bold colors, gallery-wall energy',
    sample: `${CDN}/hf_20260927_174514_5013cfd4-4e45-4698-beef-1a076f1e6c00.png`,
    prompt: `Turn this pet into a bold pop art portrait. ${KEEP} Vibrant flat colors, halftone dots, thick black outlines, bright solid background, 1960s pop art style, poster print.`,
  },
  {
    id: 'minimal',
    name: 'Line Art',
    tagline: 'Clean single-line illustration',
    sample: `${CDN}/hf_20260927_174513_3f60d661-6b49-4006-995c-c4381eaa428f.png`,
    prompt: `Turn this pet into an elegant minimalist line art illustration. ${KEEP} Clean continuous black ink lines, a few soft beige accent shapes, lots of white space, modern Scandinavian art print.`,
  },
];

// Prices in US cents, free US shipping included. Printful catalog product IDs can be overridden
// per product with env PRINTFUL_PRODUCT_<ID> (run `npm run printful:variants` to verify them).
// Variants are matched by size/color when the order is sent to Printful.
export const CATEGORIES = [
  { id: 'wall', name: 'Wall art' },
  { id: 'apparel', name: 'Apparel' },
  { id: 'home', name: 'Home & gifts' },
];

export const PRODUCTS = [
  { id: 'digital', category: 'wall', name: 'Digital Download', detail: 'High-resolution file, instant delivery', price: 2900, physical: false, mockup: 'frame' },
  { id: 'framed', category: 'wall', name: 'Framed Print', detail: 'Museum-quality matte paper, black wood frame, ready to hang', physical: true, mockup: 'frame',
    options: { size: ['12×16″', '18×24″'] }, prices: { '12×16″': 8900, '18×24″': 12900 }, fixed: { color: 'Black' },
    printful: { productId: 2, placement: 'default' } },
  { id: 'canvas', category: 'wall', name: 'Canvas', detail: 'Gallery-wrapped canvas on a wood frame', physical: true, mockup: 'canvas',
    options: { size: ['12×16″', '16×20″', '18×24″'] }, prices: { '12×16″': 6900, '16×20″': 8900, '18×24″': 10900 },
    printful: { productId: 3, placement: 'default' } },
  { id: 'tee', category: 'apparel', name: 'T-Shirt', detail: 'Soft unisex Bella+Canvas tee', price: 3400, physical: true, mockup: 'tee',
    options: { size: ['S', 'M', 'L', 'XL', '2XL'], color: ['White', 'Black', 'Natural'] },
    printful: { productId: 71, placement: 'front' } },
  { id: 'hoodie', category: 'apparel', name: 'Hoodie', detail: 'Cozy unisex Gildan heavy blend hoodie', price: 5900, physical: true, mockup: 'hoodie',
    options: { size: ['S', 'M', 'L', 'XL', '2XL'], color: ['White', 'Black', 'Sport Grey'] },
    printful: { productId: 146, placement: 'front' } },
  { id: 'mug', category: 'home', name: 'Mug', detail: 'Glossy ceramic, dishwasher & microwave safe', physical: true, mockup: 'mug',
    options: { size: ['11 oz', '15 oz'] }, prices: { '11 oz': 2400, '15 oz': 2700 },
    printful: { productId: 19, placement: 'default' } },
  { id: 'tote', category: 'home', name: 'Tote Bag', detail: 'Sturdy everyday cotton tote', price: 2900, physical: true, mockup: 'tote',
    printful: { productId: 84, placement: 'front' } },
  { id: 'blanket', category: 'home', name: 'Throw Blanket', detail: 'Ultra-soft fleece, 50×60″', price: 7900, physical: true, mockup: 'blanket',
    printful: { productId: 423, placement: 'default' } },
];

export const MAX_ITEMS = 10;
export const COLOR_SWATCH = { White: '#FFFFFF', Black: '#1E1B16', Natural: '#EFE6D2', 'Sport Grey': '#A9A9A7' };

// First value of each option, so a product can be added in one tap.
export function defaultOptions(product) {
  return Object.fromEntries(Object.entries(product.options || {}).map(([k, v]) => [k, v[0]]));
}
export function priceFor(product, options = {}) {
  return product.prices ? product.prices[options.size] ?? null : product.price;
}
export function fromPrice(product) {
  return product.prices ? Math.min(...Object.values(product.prices)) : product.price;
}
// Validates a cart line coming from the browser; returns a clean line or null.
export function validLine(line) {
  const product = productById(line?.producto);
  if (!product) return null;
  const opciones = {};
  for (const [k, valores] of Object.entries(product.options || {})) {
    if (!valores.includes(line.opciones?.[k])) return null;
    opciones[k] = line.opciones[k];
  }
  const qty = Number(line.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_ITEMS) return null;
  const price = priceFor(product, opciones);
  if (!price) return null;
  return { producto: product.id, opciones, qty: product.physical ? qty : 1, price };
}
export function lineLabel(line) {
  const product = productById(line.producto);
  const extra = Object.values(line.opciones || {}).join(' · ');
  return `${product?.name}${extra ? ` (${extra})` : ''}`;
}

export const MAX_GENERATIONS_PER_DAY = 8;

export function styleById(id) { return STYLES.find((s) => s.id === id) || null; }
export function productById(id) { return PRODUCTS.find((p) => p.id === id) || null; }
export function usd(cents) { return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`; }
