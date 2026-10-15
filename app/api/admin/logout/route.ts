import { cookies } from 'next/headers';
import { COOKIE, rejectForeignOrigin } from '../../../../lib/security';
export async function POST(req: Request) {
  try {
    await rejectForeignOrigin(req);
  } catch {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  (await cookies()).delete(COOKIE);
  return Response.json({ ok: true });
}
