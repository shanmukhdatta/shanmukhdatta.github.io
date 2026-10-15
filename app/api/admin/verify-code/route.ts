import { cookies } from 'next/headers';
import { config, backendReady } from '../../../../lib/config';
import { db, limit } from '../../../../lib/db';
import {
  clientIp,
  digest,
  sessionToken,
  COOKIE,
  rejectForeignOrigin,
} from '../../../../lib/security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    await rejectForeignOrigin(request);
    if (!backendReady())
      return Response.json({ error: 'Admin login is not configured' }, { status: 503 });
    const ip = clientIp(request);
    if (!(await limit('verify:ip:' + ip, 12, 3600)))
      return Response.json({ error: 'Too many attempts' }, { status: 429 });
    const body = (await request.json()) as { code?: unknown };
    if (typeof body.code !== 'string' || !/^\d{6}$/.test(body.code))
      return Response.json({ error: 'Enter the six-digit code' }, { status: 400 });
    // Lock, compare, increment attempts and consume in one database transaction.
    const accepted = await db<boolean>('rpc/consume_portfolio_otp', {
      method: 'POST',
      body: { p_email: config.email, p_hash: digest('otp:' + body.code) },
    });
    if (!accepted) return Response.json({ error: 'Expired or invalid code' }, { status: 401 });
    (await cookies()).set(COOKIE, sessionToken(config.email), {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 21600,
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error('OTP verification failure', e instanceof Error ? e.message : 'error');
    return Response.json({ error: 'Sign-in unavailable' }, { status: 503 });
  }
}
