'use strict';
/**
 * CI-only Resend interception for a disposable local integration test.
 * Never enabled unless both GitHub CI and an explicit capture path are set.
 * No real network email is sent; no real credentials are stored.
 */
if (process.env.CI === 'true' && process.env.CI_MOCK_RESEND_CAPTURE) {
  const fs = require('node:fs');
  const capture = process.env.CI_MOCK_RESEND_CAPTURE;
  const originalFetch = globalThis.fetch;
  if (typeof originalFetch !== 'function') throw new Error('Node fetch missing');
  globalThis.fetch = async function ciFetch(input, init) {
    const url = typeof input === 'string' ? input : input?.url;
    if (url === 'https://api.resend.com/emails') {
      const body = JSON.parse(String(init?.body ?? '{}'));
      const match = String(body.text ?? '').match(/code is ([0-9]{6})/);
      if (!match || typeof body.to !== 'string') {
        return new Response('Malformed email', { status: 400 });
      }
      fs.writeFileSync(capture, JSON.stringify({ to: body.to, code: match[1] }), { mode: 0o600 });
      return new Response(JSON.stringify({ id: 'ci-email-mock' }), {
        status: 200, headers: { 'content-type': 'application/json' }
      });
    }
    return originalFetch.call(this, input, init);
  };
}
