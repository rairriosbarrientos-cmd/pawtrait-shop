import Stripe from 'stripe';
import { store, env, json, urlCompleta } from '../lib/comun.mts';
import { printfulBase, printfulHeaders, resolverVariante } from '../lib/printful.mts';
import { productById, lineLabel } from '../../src/catalogo.js';

// Stripe -> paid order -> one Printful order with every physical item (print, make, ship). No manual work.
export default async (req: Request) => {
  if (!env('STRIPE_SECRET_KEY') || !env('STRIPE_WEBHOOK_SECRET')) return json({ error: 'Stripe is not configured' }, 503);
  const stripe = new Stripe(env('STRIPE_SECRET_KEY'));
  let evento: Stripe.Event;
  try {
    evento = await stripe.webhooks.constructEventAsync(await req.text(), req.headers.get('stripe-signature') || '', env('STRIPE_WEBHOOK_SECRET'));
  } catch {
    return json({ error: 'Invalid signature' }, 400);
  }
  if (evento.type !== 'checkout.session.completed' && evento.type !== 'checkout.session.async_payment_succeeded') return json({ ok: true });

  const sesion = evento.data.object as Stripe.Checkout.Session;
  if (sesion.payment_status !== 'paid') return json({ ok: true });
  const s = store();
  const carritoId = sesion.metadata?.carrito || '';
  const carrito: any = carritoId ? await s.get(`carritos/${carritoId}`, { type: 'json' }) : null;
  if (!carrito) { console.error('cart not found', sesion.id); return json({ ok: true }); }

  const clave = `pedidos/${sesion.id}`;
  const pedido: any = (await s.get(clave, { type: 'json' })) || {
    sesion: sesion.id, carrito: carritoId, id: carrito.id, lineas: carrito.lineas, email: sesion.customer_details?.email, total: sesion.amount_total, creado: Date.now(), estado: 'pagado',
  };
  const fisicas = carrito.lineas.filter((l: any) => productById(l.producto)?.physical);
  if (fisicas.length === 0 || pedido.estado === 'en_produccion') {
    if (fisicas.length === 0) pedido.estado = 'entregado';
    await s.setJSON(clave, pedido);
    return json({ ok: true });
  }

  // On failure answer 500 so Stripe retries; Printful rejects a duplicate external_id, so no double orders.
  const envio: any = (sesion as any).collected_information?.shipping_details || (sesion as any).shipping_details;
  const dir = envio?.address || {};
  try {
    const archivo = urlCompleta(req, carrito.id);
    const items = [];
    for (const l of fisicas) {
      const product = productById(l.producto)!;
      items.push({ variant_id: await resolverVariante(product, l.opciones), quantity: l.qty, name: lineLabel(l), files: [{ type: product.printful.placement, url: archivo }] });
    }
    const res = await fetch(`${printfulBase()}/orders?confirm=${env('PRINTFUL_AUTO_CONFIRM') === 'false' ? 'false' : 'true'}`, {
      method: 'POST',
      headers: printfulHeaders(),
      body: JSON.stringify({
        external_id: carritoId,
        shipping: 'STANDARD',
        recipient: {
          name: envio?.name || sesion.customer_details?.name, email: sesion.customer_details?.email,
          address1: dir.line1, address2: dir.line2 || '', city: dir.city, state_code: dir.state, country_code: dir.country, zip: dir.postal_code,
        },
        items,
      }),
    });
    const r = await res.json();
    if (!res.ok && !/external_id/i.test(JSON.stringify(r))) throw new Error(`Printful ${res.status}: ${JSON.stringify(r).slice(0, 300)}`);
    pedido.estado = 'en_produccion';
    pedido.printful = r?.result?.id ?? pedido.printful ?? null;
    delete pedido.error;
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
