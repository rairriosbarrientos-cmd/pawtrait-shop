import Stripe from 'stripe';
import { store, env, json, idValido, origen } from '../lib/comun.mts';
import { productById, styleById } from '../../src/catalogo.js';

// POST { id, producto } -> { url } (Stripe Checkout). Without STRIPE_SECRET_KEY: demo thank-you page.
export default async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const { id, producto: productoId } = await req.json().catch(() => ({}));
  const producto = productById(productoId);
  if (!idValido(id) || !producto) return json({ error: 'Invalid order' }, 400);
  const trabajo: any = await store().get(`trabajos/${id}`, { type: 'json' });
  if (!trabajo || trabajo.estado !== 'listo') return json({ error: 'Your portrait is not ready yet' }, 409);

  const clave = env('STRIPE_SECRET_KEY');
  if (!clave) return json({ url: `/gracias?demo=1&id=${id}&producto=${producto.id}` });

  const base = origen(req);
  const estilo = styleById(trabajo.estilo);
  const imagen = trabajo.previewUrl.startsWith('http') ? trabajo.previewUrl : `${base}${trabajo.previewUrl}`;
  const stripe = new Stripe(clave);
  const sesion = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: producto.price,
        product_data: { name: `${producto.name} — ${estilo?.name}${trabajo.nombre ? ` of ${trabajo.nombre}` : ''}`, description: producto.detail, images: [imagen] },
      },
    }],
    ...(producto.physical ? {
      shipping_address_collection: { allowed_countries: ['US'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount', display_name: 'Free shipping', fixed_amount: { amount: 0, currency: 'usd' },
          delivery_estimate: { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 10 } },
        },
      }],
    } : {}),
    allow_promotion_codes: true,
    metadata: { id, producto: producto.id },
    success_url: `${base}/gracias?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/?retrato=${id}`,
  });
  return json({ url: sesion.url });
};

export const config = { path: '/api/checkout' };
