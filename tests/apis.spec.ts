// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ host: 'portfolio.test' }),
  cookies: async () => ({ get: () => undefined, set: vi.fn() }),
}));
const mocks = vi.hoisted(() => ({
  mail: vi.fn(),
  db: vi.fn(),
  limit: vi.fn(),
  authorized: vi.fn(),
}));
vi.mock('../lib/mail', () => ({ mail: mocks.mail }));
vi.mock('../lib/db', () => ({
  db: mocks.db,
  limit: mocks.limit,
  publishedDocuments: async () => ({}),
}));
vi.mock('../lib/config', () => ({
  config: {
    secret: 'test-only-secret',
    email: 'owner@example.test',
    contactTo: 'owner@example.test',
    groq: 'test-key',
    groqModel: 'test-model',
    resend: 'test-key',
    sender: 'test@example.test',
  },
  backendReady: () => true,
}));
vi.mock('../lib/security', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/security')>()),
  authorized: mocks.authorized,
}));
import { POST as contact } from '../app/api/contact/route';
import { POST as maya } from '../app/api/maya/route';
import { PUT as save, GET as readDocuments } from '../app/api/admin/documents/route';
import { GET as history } from '../app/api/admin/history/route';
import { site } from '../content/site';
const request = (path: string, body: unknown, origin = 'https://portfolio.test') =>
  new Request('https://portfolio.test' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.limit.mockResolvedValue(true);
  mocks.mail.mockResolvedValue('provider-confirmation');
  mocks.db.mockResolvedValue([]);
  mocks.authorized.mockResolvedValue(false);
});
describe('contact API with provider simulations', () => {
  const fields = {
    name: 'Demo Visitor',
    email: 'sample@example.com',
    message: 'A valid demo message for testing.',
  };
  it('rejects malformed input without mailing', async () => {
    expect((await contact(request('/api/contact', {}))).status).toBe(400);
    expect(mocks.mail).not.toHaveBeenCalled();
  });
  it('rejects foreign origin', async () => {
    expect((await contact(request('/api/contact', fields, 'https://foreign.test'))).status).toBe(
      503,
    );
    expect(mocks.mail).not.toHaveBeenCalled();
  });
  it('returns success only after provider acceptance and archives the message', async () => {
    expect((await contact(request('/api/contact', fields))).status).toBe(200);
    expect(mocks.mail).toHaveBeenCalledOnce();
    expect(mocks.db).toHaveBeenCalledWith(
      'portfolio_inbox',
      expect.objectContaining({ method: 'POST' }),
    );
  });
  it('reports provider failure without creating inbox success', async () => {
    mocks.mail.mockRejectedValue(new Error('provider failed'));
    expect((await contact(request('/api/contact', fields))).status).toBe(503);
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it('enforces the message rate limit', async () => {
    mocks.limit.mockResolvedValue(false);
    expect((await contact(request('/api/contact', fields))).status).toBe(429);
    expect(mocks.mail).not.toHaveBeenCalled();
  });
});
describe('Maya trust and provider boundaries', () => {
  it('returns provider SSE, builds facts on the server and ignores injected facts', async () => {
    const fetcher = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          'data: {"choices":[{"delta":{"content":"Public answer"}}]}\n\ndata: [DONE]\n\n',
        ),
    );
    vi.stubGlobal('fetch', fetcher);
    const r = await maya(
      request('/api/maya', { question: 'What is QTagger?', facts: 'INVENTED SECRET', history: [] }),
    );
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toContain('text/event-stream');
    expect(await r.text()).toContain('Public answer');
    const body = JSON.parse(fetcher.mock.calls[0]?.[1]?.body as string);
    expect(JSON.stringify(body)).toContain('QTagger+');
    expect(JSON.stringify(body)).not.toContain('INVENTED SECRET');
  });
  it('fails closed when rate limiting is unavailable', async () => {
    mocks.limit.mockRejectedValue(new Error('database unavailable'));
    expect((await maya(request('/api/maya', { question: 'Research?' }))).status).toBe(503);
  });
  it('returns an upstream failure without pretending to answer', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: 500 })),
    );
    expect((await maya(request('/api/maya', { question: 'Research?' }))).status).toBe(502);
  });
});
describe('CMS privacy, revision conflicts and validation', () => {
  it('denies documents and history to unauthenticated visitors', async () => {
    expect((await readDocuments()).status).toBe(401);
    expect((await history(new Request('https://portfolio.test/api/admin/history'))).status).toBe(
      401,
    );
  });
  it('rejects incomplete published content', async () => {
    mocks.authorized.mockResolvedValue(true);
    expect(
      (
        await save(
          request('/api/admin/documents', {
            key: 'site',
            action: 'publish',
            value: { name: 'broken' },
            revision: 0,
          }),
        )
      ).status,
    ).toBe(400);
    expect(mocks.db).not.toHaveBeenCalled();
  });
  it('reports an atomic conflict even if an earlier read matched', async () => {
    mocks.authorized.mockResolvedValue(true);
    mocks.db.mockResolvedValue([]);
    expect(
      (
        await save(
          request('/api/admin/documents', {
            key: 'site',
            action: 'save',
            value: site,
            revision: 0,
          }),
        )
      ).status,
    ).toBe(409);
    expect(mocks.db).toHaveBeenLastCalledWith('rpc/save_portfolio_document', expect.anything());
  });
  it('keeps a saved draft unpublished', async () => {
    mocks.authorized.mockResolvedValue(true);
    mocks.db.mockResolvedValueOnce([]).mockResolvedValueOnce([{ key: 'site', revision: 1 }]);
    expect(
      (
        await save(
          request('/api/admin/documents', {
            key: 'site',
            action: 'save',
            value: site,
            revision: 0,
          }),
        )
      ).status,
    ).toBe(200);
    expect(mocks.db.mock.calls[1][1].body.p_published).toBeNull();
  });
});
