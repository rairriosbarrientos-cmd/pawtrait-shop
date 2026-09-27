import type { Context } from '@netlify/functions';
import { store, env, json, nuevoId, consumirCupo } from '../lib/comun.mts';
import { styleById, MAX_GENERATIONS_PER_DAY } from '../../src/catalogo.js';

// POST { foto: dataURL (jpeg, <=1600px), estilo, nombre? } -> { id }
// Starts an AI job. Without FAL_KEY the shop runs in demo mode and returns sample art.
export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const estilo = styleById(body?.estilo);
  const foto = String(body?.foto || '');
  const nombre = String(body?.nombre || '').trim().slice(0, 40);
  if (!estilo) return json({ error: 'Unknown style' }, 400);
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(foto) || foto.length > 4_500_000) return json({ error: 'Please upload a JPG or PNG photo under 3 MB.' }, 400);

  if (!(await consumirCupo(context.ip, MAX_GENERATIONS_PER_DAY))) {
    return json({ error: `You've reached today's limit of ${MAX_GENERATIONS_PER_DAY} previews. Come back tomorrow!` }, 429);
  }

  const id = nuevoId();
  const s = store();
  const trabajo: Record<string, unknown> = { id, estilo: estilo.id, nombre, creado: Date.now(), estado: 'procesando' };
  const falKey = env('FAL_KEY');

  if (!falKey) {
    trabajo.demo = true;
  } else {
    const modelo = env('FAL_MODEL') || 'fal-ai/flux-pro/kontext';
    const res = await fetch(`${env('FAL_QUEUE_URL') || 'https://queue.fal.run'}/${modelo}`, {
      method: 'POST',
      headers: { Authorization: `Key ${falKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: estilo.prompt, image_url: foto, output_format: 'png', aspect_ratio: '4:5' }),
    });
    if (!res.ok) {
      console.error('fal error', res.status, await res.text());
      return json({ error: 'Our artists are busy. Please try again in a minute.' }, 502);
    }
    const cola = await res.json();
    trabajo.statusUrl = cola.status_url;
    trabajo.responseUrl = cola.response_url;
  }
  await s.setJSON(`trabajos/${id}`, trabajo);
  return json({ id });
};

export const config = { path: '/api/generar' };
