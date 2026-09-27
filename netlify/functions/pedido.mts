import Stripe from 'stripe';
import { store, env, json, urlCompleta } from '../lib/comun.mts';
import { productById, styleById } from '../../src/catalogo.js';

// GET ?session_id= -> order summary for the thank-you page (+ download link for digital orders).
export default async (req: Request) => {
  const sesionId = new URL(req.url).searchParams.get('session_id') || '';
  if (!/^cs_[A-Za-z0-9_]+$/.test(sesionId) || !env('STRIPE_SECRET_KEY')) return json({ error: 'Not found' }, 404);
  const sesion = await new Stripe(env('STRIPE_SECRET_KEY')).checkout.sessions.retrieve(sesionId).catch(() => null);
  if (!sesion || sesion.payment_status !== 'paid') return json({ error: 'Payment not completed' }, 402);
  const id = sesion.metadata?.id || '';
  const producto = productById(sesion.metadata?.producto);
  const s = store();
  const trabajo: any = await s.get(`trabajos/${id}`, { type: 'json' });
  const pedido: any = await s.get(`pedidos/${sesionId}`, { type: 'json' });
  return json({
    producto: producto?.name,
    fisico: !!producto?.physical,
    estilo: styleById(trabajo?.estilo)?.name,
    nombre: trabajo?.nombre,
    email: sesion.customer_details?.email,
    preview: trabajo?.previewUrl,
    estado: pedido?.estado || 'pagado',
    descarga: producto && !producto.physical && !trabajo?.demo ? `${urlCompleta(req, id)}&descargar=1` : null,
  });
};

export const config = { path: '/api/pedido' };
