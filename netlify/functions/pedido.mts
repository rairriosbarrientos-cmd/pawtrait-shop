import Stripe from 'stripe';
import { store, env, json, urlCompleta, idValido } from '../lib/comun.mts';
import { productById, styleById, lineLabel } from '../../src/catalogo.js';

// GET ?session_id=  -> order summary for the thank-you page (+ download link if it includes the digital file).
// GET ?carrito=     -> demo mode only (no Stripe key): shows what would have been ordered.
export default async (req: Request) => {
  const q = new URL(req.url).searchParams;
  const s = store();
  let carritoId: string | null = null;
  let email: string | null = null;
  let demo = false;

  if (!env('STRIPE_SECRET_KEY')) {
    carritoId = q.get('carrito');
    demo = true;
    if (!idValido(carritoId)) return json({ error: 'Not found' }, 404);
  } else {
    const sesionId = q.get('session_id') || '';
    if (!/^cs_[A-Za-z0-9_]+$/.test(sesionId)) return json({ error: 'Not found' }, 404);
    const sesion = await new Stripe(env('STRIPE_SECRET_KEY')).checkout.sessions.retrieve(sesionId).catch(() => null);
    if (!sesion || sesion.payment_status !== 'paid') return json({ error: 'Payment not completed' }, 402);
    carritoId = sesion.metadata?.carrito || null;
    email = sesion.customer_details?.email || null;
  }

  const carrito: any = carritoId ? await s.get(`carritos/${carritoId}`, { type: 'json' }) : null;
  if (!carrito) return json({ error: 'Not found' }, 404);
  const trabajo: any = await s.get(`trabajos/${carrito.id}`, { type: 'json' });
  const digital = carrito.lineas.some((l: any) => !productById(l.producto)?.physical);
  return json({
    demo,
    items: carrito.lineas.map((l: any) => ({ label: lineLabel(l), qty: l.qty })),
    fisico: carrito.lineas.some((l: any) => productById(l.producto)?.physical),
    estilo: styleById(trabajo?.estilo)?.name,
    nombre: trabajo?.nombre,
    email,
    preview: trabajo?.previewUrl,
    descarga: digital && !demo && !trabajo?.demo ? `${urlCompleta(req, carrito.id)}&descargar=1` : null,
  });
};

export const config = { path: '/api/pedido' };
