import { getStore } from '@netlify/blobs';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const store = () => getStore({ name: 'pawtrait', consistency: 'strong' });

export const env = (k: string) => (globalThis as any).Netlify?.env?.get(k) ?? process.env[k] ?? '';

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

export function nuevoId() {
  return randomBytes(12).toString('base64url');
}

export function idValido(id: string | null): id is string {
  return !!id && /^[A-Za-z0-9_-]{16}$/.test(id);
}

// Signed links for the full-resolution file: only Printful and paying customers receive them.
function secreto() {
  const s = env('IMAGE_SIGNING_SECRET');
  if (!s) throw new Error('IMAGE_SIGNING_SECRET is not set');
  return s;
}
export function firmar(id: string) {
  return createHmac('sha256', secreto()).update(`full:${id}`).digest('base64url');
}
export function firmaValida(id: string, token: string | null) {
  if (!token) return false;
  const a = Buffer.from(firmar(id));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function origen(req: Request) {
  return env('URL') || new URL(req.url).origin;
}

export function urlCompleta(req: Request, id: string) {
  return `${origen(req)}/api/imagen?id=${id}&tipo=full&token=${firmar(id)}`;
}

// Low-res, watermarked preview so nobody can take the art without paying.
export async function crearPreview(png: Buffer) {
  const sharp = (await import('sharp')).default;
  const { data, info } = await sharp(png).resize({ width: 720, withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const marca = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs><pattern id="p" width="440" height="150" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
        <text x="20" y="80" font-family="Georgia, serif" font-size="30" font-weight="700" fill="white" fill-opacity="0.34" letter-spacing="3">PAWTRAIT PREVIEW</text>
      </pattern></defs>
      <rect width="100%" height="100%" fill="url(#p)"/>
    </svg>`);
  return sharp(data).composite([{ input: marca, top: 0, left: 0 }]).jpeg({ quality: 72 }).toBuffer();
}

// Simple per-IP daily cap so a single visitor can't burn through AI credits.
export async function consumirCupo(ip: string, maximo: number) {
  const dia = new Date().toISOString().slice(0, 10);
  const clave = `cupo/${dia}/${ip || 'desconocido'}`;
  const s = store();
  const usado = Number((await s.get(clave)) || 0);
  if (usado >= maximo) return false;
  await s.set(clave, String(usado + 1));
  return true;
}
