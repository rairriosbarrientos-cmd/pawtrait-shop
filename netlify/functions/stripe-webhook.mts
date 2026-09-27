import Stripe from 'stripe';
import { store, env, json, urlCompleta } from '../lib/comun.mts';
import { productById } from '../../src/catalogo.js';

// Stripe -> paid order -> automatic Printful order (print, frame, ship). No manual work.
export default async (req: Request) => {
  if (!env('STRIPE_SECRET_KEY') || !env('STRIPE_WEBHOOK_SECRET')) return json({ error: 'Stripe is not configured' }, 503);
  const stripe = new Stripe(env('STRIPE_SECRET_KEY'));
  let evento: Stripe.Event;
  try {
    evento = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get('stripe-signature') || '', env('STRIPE_WEBHOOK_SECRET'));
  } catch (e) {
    return json({ error: 'Invalid signature' }, 400);
  }
  if (evento.type !== 'checkout.session.completed' && evento.type !== 'checkout.session.async_payment_succeeded') return json({ ok: true });

  const sesion = evento.data.object as Stripe.Checkout.Session;
  if (sesion.payment_status !== 'paid') return json({ ok: true });
  const id = sesion.metadata?.id || '';
  const producto = productById(sesion.metadata?.producto);
  if (!id || !producto) return json({ ok: true });

  const s = store();
  const clave = `pedidos/${sesion.id}`;
  const pedido: any = (await s.get(clave, { type: 'json' })) || {
    sesion: sesion.id, id, producto: producto.id, email: sesion.customer_details?.email, total: sesion.amount_total, creado: Date.now(), estado: 'pagado',
  };
  if (!producto.physical || pedido.estado === 'en_produccion') {
    pedido.estado = producto.physical ? pedido.estado : 'entregado';
    await s.setJSON(clave, pedido);
    return json({ ok: true });
  }

  // Physical: send to Printful. On failure answer 500 so Stripe retries; Printful rejects duplicate external_id.
  const envio: any = (sesion as any).collected_information?.shipping_details || (sesion as any).shipping_details;
  const dir = envio?.address || {};
  const variante = Number(env(producto.variantEnv || ''));
  try {
    if (!variante) throw new Error(`${producto.variantEnv} is not set`);
    const res = await fetch(`${env('PRINTFUL_API_URL') || 'https://api.printful.com'}/orders?confirm=${env('PRINTFUL_AUTO_CONFIRM') === 'false' ? 'false' : 'true'}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env('PRINTFUL_API_KEY')}`,
        'Content-Type': 'application/json',
        ...(env('PRINTFUL_STORE_ID') ? { 'X-PF-Store-Id': env('PRINTFUL_STORE_ID') } : {}),
      },
      body: JSON.stringify({
        external_id: id,
        shipping: 'STANDARD',
        recipient: {
          name: envio?.name || sesion.customer_details?.name, email: sesion.customer_details?.email,
          address1: dir.line1, address2: dir.line2 || '', city: dir.city, state_code: dir.state, country_code: dir.country, zip: dir.postal_code,
        },
        items: [{ variant_id: variante, quantity: 1, name: producto.name, files: [{ url: urlCompleta(req, id) }] }],
      }),
    });
    const r = await res.json();
    if (!res.ok && !/external_id/i.test(JSON.stringify(r))) throw new Error(`Printful ${res.status}: ${JSON.stringify(r).slice(0, 300)}`);
    pedido.estado = 'en_produccion';
    pedido.printful = r?.result?.id ?? pedido.printful ?? null;
    await s.setJSON(clave, pedido);
    return json({ ok: true });
  } catch (e: any) {
    console.error('printful order failed', sesion.id, e?.message);
    pedido.estado = 'error_printful';
    pedido.error = String(e?.message || e).slice(0, 300);
    await s.setJSON(clave, pedido);
    return json({ error: 'fulfillment failed, will retry' }, 500);
  }
};

export const config = { path: '/api/stripe-webhook' };
