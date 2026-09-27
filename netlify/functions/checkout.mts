import Stripe from 'stripe';
import { store, env, json, idValido, origen, nuevoId } from '../lib/comun.mts';
import { productById, styleById, validLine, lineLabel } from '../../src/catalogo.js';

// POST { id, items: [{ producto, opciones, qty }] } -> { url } (Stripe Checkout).
// The cart is stored server-side (prices come from the catalog, never from the browser).
export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const { id, items } = await req.json().catch(() => ({}));
  if (!idValido(id) || !Array.isArray(items) || items.length === 0 || items.length > 10) return json({ error: 'Invalid order' }, 400);
  const lineas = items.map(validLine);
  if (lineas.some((l) => !l)) return json({ error: 'One of the items is not available. Please review your order.' }, 400);

  const s = store();
  const trabajo: any = await s.get(`trabajos/${id}`, { type: 'json' });
  if (!trabajo || trabajo.estado !== 'listo') return json({ error: 'Your portrait is not ready yet' }, 409);

  const carrito = nuevoId();
  await s.setJSON(`carritos/${carrito}`, { id, lineas, creado: Date.now() });
  const fisico = lineas.some((l) => productById(l.producto)?.physical);

  const clave = env('STRIPE_SECRET_KEY');
  if (!clave) return json({ url: `/gracias?demo=1&carrito=${carrito}` });

  const base = origen(req);
  const estilo = styleById(trabajo.estilo);
  const imagen = trabajo.previewUrl.startsWith('http') ? trabajo.previewUrl : `${base}${trabajo.previewUrl}`;
  const sesion = await new Stripe(clave).checkout.sessions.create({
    mode: 'payment',
    line_items: lineas.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency: 'usd',
        unit_amount: l.price,
        product_data: { name: `${lineLabel(l)} — ${estilo?.name}${trabajo.nombre ? ` of ${trabajo.nombre}` : ''}`, description: productById(l.producto)?.detail, images: [imagen] },
      },
    })),
    ...(fisico ? {
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount', display_name: 'Free shipping', fixed_amount: { amount: 0, currency: 'usd' },
          delivery_estimate: { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 10 } },
        },
      }],
    } : {}),
    allow_promotion_codes: true,
    metadata: { id, carrito },
    success_url: `${base}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?retrato=${id}`,
  });
  return json({ url: sesion.url });
};

export const config = { path: '/api/checkout' };
