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
    sample: null,
    prompt: `Turn this pet into a 19th-century military officer oil portrait. ${KEEP} Wearing a navy blue military jacket with gold epaulettes, medals and a sash, standing proudly, painted landscape background, classical oil painting, museum quality.`,
  },
  {
    id: 'pop',
    name: 'Pop Art',
    tagline: 'Bold colors, gallery-wall energy',
    sample: null,
    prompt: `Turn this pet into a bold pop art portrait. ${KEEP} Vibrant flat colors, halftone dots, thick black outlines, bright solid background, 1960s pop art style, poster print.`,
  },
  {
    id: 'minimal',
    name: 'Line Art',
    tagline: 'Clean single-line illustration',
    sample: null,
    prompt: `Turn this pet into an elegant minimalist line art illustration. ${KEEP} Clean continuous black ink lines, a few soft beige accent shapes, lots of white space, modern Scandinavian art print.`,
  },
];

// Prices in US cents. Printful variant IDs come from env vars (see README) so they can be verified per account.
export const PRODUCTS = [
  { id: 'digital', name: 'Digital Download', detail: 'High-resolution file, instant delivery', price: 2900, physical: false },
  { id: 'framed-12x16', name: 'Framed Print 12×16″', detail: 'Museum-quality matte paper, black wood frame, ready to hang', price: 8900, physical: true, variantEnv: 'PRINTFUL_VARIANT_12X16' },
  { id: 'framed-18x24', name: 'Framed Print 18×24″', detail: 'Large statement piece, black wood frame, ready to hang', price: 12900, physical: true, variantEnv: 'PRINTFUL_VARIANT_18X24' },
];

export const MAX_GENERATIONS_PER_DAY = 8;

export function styleById(id) { return STYLES.find((s) => s.id === id) || null; }
export function productById(id) { return PRODUCTS.find((p) => p.id === id) || null; }
export function usd(cents) { return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`; }
