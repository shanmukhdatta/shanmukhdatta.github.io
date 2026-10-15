import { privateRegister } from '../../../../lib/editorial-register';
import { db } from '../../../../lib/db';
import { authorized, rejectForeignOrigin, jsonError } from '../../../../lib/security';
import { isDocumentKey, validateDocument } from '../../../../lib/validate';
import { assertPublicRelations } from '../../../../lib/relations';
import { baseline, liveData } from '../../../../lib/portfolio-store';
export const dynamic = 'force-dynamic';
type Row = {
  key: string;
  draft: unknown;
  published: unknown;
  revision: number;
  updated_at: string;
};
export async function GET() {
  if (!(await authorized())) return Response.json({ error: 'Sign in required' }, { status: 401 });
  try {
    const rows = await db<Row[]>('portfolio_documents', {
      query: 'select=key,draft,published,revision,updated_at',
    });
    return Response.json(
      { documents: rows, baseline: { ...baseline, register: privateRegister } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return jsonError(e);
  }
}
export async function PUT(request: Request) {
  try {
    await rejectForeignOrigin(request);
    if (!(await authorized())) return Response.json({ error: 'Sign in required' }, { status: 401 });
    const body = (await request.json()) as {
      key?: unknown;
      value?: unknown;
      action?: unknown;
      revision?: unknown;
      reviewed?: unknown;
    };
    if (
      typeof body.key !== 'string' ||
      !isDocumentKey(body.key) ||
      !['save', 'publish', 'restore'].includes(String(body.action))
    )
      return Response.json({ error: 'Invalid document request' }, { status: 400 });
    const key = body.key,
      action = String(body.action);
    if (action === 'publish' && body.reviewed !== true)
      return Response.json(
        { error: 'Preview and evidence review is required before publishing' },
        { status: 400 },
      );
    if (key === 'register' && action === 'publish')
      return Response.json(
        { error: 'Editorial register is private and cannot be published' },
        { status: 400 },
      );
    if (action !== 'restore')
      try {
        validateDocument(key, body.value);
      } catch (e) {
        return Response.json(
          { error: e instanceof Error ? e.message : 'Invalid content' },
          { status: 400 },
        );
      }
    if (action === 'publish' && key !== 'register') {
      try {
        const candidate = { ...(await liveData()), [key]: body.value };
        assertPublicRelations(candidate);
      } catch (e) {
        return Response.json(
          { error: e instanceof Error ? e.message : 'Invalid project references' },
          { status: 400 },
        );
      }
    }
    const rows = await db<Row[]>('portfolio_documents', {
      query: 'select=key,draft,published,revision&key=eq.' + key,
    });
    const prev = rows[0],
      expected = Number(body.revision ?? 0);
    if (expected !== (prev?.revision ?? 0))
      return Response.json(
        { error: 'Another session edited this document. Refresh before saving.' },
        { status: 409 },
      );
    const draft =
      action === 'restore'
        ? (prev?.published ?? (key === 'register' ? privateRegister : baseline[key]))
        : body.value;
    if (action === 'restore') validateDocument(key, draft);
    const published = action === 'publish' ? body.value : (prev?.published ?? null);
    // Compare-and-swap in PostgreSQL, not a read followed by an unconditional upsert.
    const saved = await db<Row[]>('rpc/save_portfolio_document', {
      method: 'POST',
      body: { p_key: key, p_draft: draft, p_published: published, p_revision: expected },
    });
    if (!saved.length)
      return Response.json(
        { error: 'Another session edited this document. Refresh before saving.' },
        { status: 409 },
      );
    return Response.json({ ok: true, document: saved[0] });
  } catch (e) {
    return jsonError(e);
  }
}
