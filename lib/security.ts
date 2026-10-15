import 'server-only';
import { createHash, createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { config } from './config';

export const COOKIE = 'shanxai_admin';
export function digest(data: string) {
  return createHmac('sha256', config.secret).update(data).digest('hex');
}
export function same(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function newCode() {
  return randomInt(100000, 1000000).toString();
}
export function clientIp(request: Request) {
  // On Vercel x-forwarded-for is platform-set. Never authorize based on an IP alone.
  const raw = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  return createHash('sha256').update(raw).digest('hex').slice(0, 24);
}
export function sessionToken(email: string) {
  const expiry = Date.now() + 6 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ email, expiry })).toString('base64url');
  return body + '.' + digest('session:' + body);
}
export function validSession(token?: string) {
  if (!token || !config.secret || !config.email) return false;
  const p = token.split('.');
  if (p.length !== 2 || !same(digest('session:' + p[0]), p[1])) return false;
  try {
    const value = JSON.parse(Buffer.from(p[0], 'base64url').toString());
    return (
      value.email === config.email &&
      Number.isSafeInteger(value.expiry) &&
      value.expiry > Date.now()
    );
  } catch {
    return false;
  }
}
export async function authorized() {
  return validSession((await cookies()).get(COOKIE)?.value);
}
export async function requireAdmin() {
  if (!(await authorized())) throw new Error('unauthorized');
}
export async function rejectForeignOrigin(req: Request) {
  const origin = req.headers.get('origin');
  const host = (await headers()).get('host');
  if (origin && host && new URL(origin).host !== host) throw new Error('forbidden origin');
}
export function jsonError(error: unknown) {
  if (error instanceof Error && error.message === 'unauthorized')
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  if (error instanceof Error && error.message === 'forbidden origin')
    return Response.json({ error: 'Origin rejected' }, { status: 403 });
  return Response.json(
    { error: 'Request unavailable. Check configuration or retry later.' },
    { status: 503 },
  );
}
