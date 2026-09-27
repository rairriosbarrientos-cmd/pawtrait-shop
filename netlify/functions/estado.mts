import { store, env, json, idValido, crearPreview } from '../lib/comun.mts';
import { styleById, SAMPLE_PHOTO } from '../../src/catalogo.js';

// GET ?id= -> { estado: 'procesando' | 'listo' | 'error', preview? }
export default async (req: Request) => {
  const id = new URL(req.url).searchParams.get('id');
  if (!idValido(id)) return json({ error: 'Invalid id' }, 400);
  const s = store();
  const trabajo: any = await s.get(`trabajos/${id}`, { type: 'json' });
  if (!trabajo) return json({ error: 'Not found' }, 404);
  if (trabajo.estado !== 'procesando') return json(respuesta(trabajo));

  if (trabajo.demo) {
    if (Date.now() - trabajo.creado < 3500) return json({ estado: 'procesando' });
    trabajo.estado = 'listo';
    trabajo.previewUrl = styleById(trabajo.estilo)?.sample || SAMPLE_PHOTO;
    await s.setJSON(`trabajos/${id}`, trabajo);
    return json(respuesta(trabajo));
  }

  const headers = { Authorization: `Key ${env('FAL_KEY')}` };
  const st = await fetch(trabajo.statusUrl, { headers }).then((r) => r.json()).catch(() => null);
  if (!st || st.status === 'IN_QUEUE' || st.status === 'IN_PROGRESS') return json({ estado: 'procesando' });
  if (st.status !== 'COMPLETED') return fallar(s, trabajo, `status ${st.status}`);

  const resultado = await fetch(trabajo.responseUrl, { headers }).then((r) => r.json()).catch(() => null);
  const url = resultado?.images?.[0]?.url;
  if (!url) return fallar(s, trabajo, 'no image in result');
  const png = Buffer.from(await (await fetch(url)).arrayBuffer());
  await s.set(`full/${id}`, png);
  await s.set(`preview/${id}`, await crearPreview(png));
  trabajo.estado = 'listo';
  trabajo.previewUrl = `/api/imagen?id=${id}&tipo=preview`;
  await s.setJSON(`trabajos/${id}`, trabajo);
  return json(respuesta(trabajo));
};

function respuesta(t: any) {
  return t.estado === 'listo' ? { estado: 'listo', preview: t.previewUrl, demo: !!t.demo } : { estado: t.estado };
}

async function fallar(s: any, trabajo: any, motivo: string) {
  console.error('generation failed', trabajo.id, motivo);
  trabajo.estado = 'error';
  await s.setJSON(`trabajos/${trabajo.id}`, trabajo);
  return json({ estado: 'error' });
}

export const config = { path: '/api/estado' };
