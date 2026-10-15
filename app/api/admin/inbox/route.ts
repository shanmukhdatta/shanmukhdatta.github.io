import { authorized } from '../../../../lib/security';
import { db } from '../../../../lib/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  if (!(await authorized())) return Response.json({ error: 'Sign in required' }, { status: 401 });
  try {
    const messages = await db('portfolio_inbox', {
      query: 'select=id,name,email,message,created_at,provider_id&order=created_at.desc&limit=100',
    });
    return Response.json({ messages }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Inbox unavailable' }, { status: 503 });
  }
}
