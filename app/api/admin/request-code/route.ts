import { config, backendReady } from '../../../../lib/config';
import { db, limit } from '../../../../lib/db';
import { clientIp, digest, newCode, rejectForeignOrigin } from '../../../../lib/security';
import { mail } from '../../../../lib/mail';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    await rejectForeignOrigin(request);
    if (!backendReady() || !config.resend || !config.sender)
      return Response.json({ error: 'Admin login is not configured' }, { status: 503 });
    const ip = clientIp(request);
    if (!(await limit('otp:ip:' + ip, 5, 3600)) || !(await limit('otp:account', 8, 3600)))
      return Response.json({ error: 'Too many attempts. Try later.' }, { status: 429 });
    const code = newCode();
    await db('portfolio_otp', {
      method: 'POST',
      query: 'on_conflict=email',
      prefer: 'resolution=merge-duplicates',
      body: {
        email: config.email,
        code_hash: digest('otp:' + code),
        expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
        attempts: 0,
      },
    });
    await mail(
      config.email,
      'shanXAI secure sign-in code',
      `Your one-time sign-in code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`,
    );
    return Response.json({
      ok: true,
      message: 'If the owner email is configured, a sign-in code has been sent.',
    });
  } catch (e) {
    console.error('OTP request failure', e instanceof Error ? e.message : 'error');
    return Response.json({ error: 'Could not request a code. Try later.' }, { status: 503 });
  }
}
