import { store, idValido, firmaValida } from '../lib/comun.mts';

// GET ?id=&tipo=preview           -> watermarked preview (public)
// GET ?id=&tipo=full&token=...    -> full resolution (signed link: Printful + paying customers)
export default async (req: Request) => {
  const q = new URL(req.url).searchParams;
  const id = q.get('id');
  if (!idValido(id)) return new Response('Not found', { status: 404 });
  const s = store();
  if (q.get('tipo') === 'full') {
    if (!firmaValida(id, q.get('token'))) return new Response('Forbidden', { status: 403 });
    const png = await s.get(`full/${id}`, { type: 'arrayBuffer' });
    if (!png) return new Response('Not found', { status: 404 });
    const headers: Record<string, string> = { 'Content-Type': 'image/png', 'Cache-Control': 'private, max-age=86400' };
    if (q.get('descargar')) headers['Content-Disposition'] = `attachment; filename="pawtrait-${id}.png"`;
    return new Response(png, { headers });
  }
  const jpg = await s.get(`preview/${id}`, { type: 'arrayBuffer' });
  if (!jpg) return new Response('Not found', { status: 404 });
  return new Response(jpg, { headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};

export const config = { path: '/api/imagen' };
