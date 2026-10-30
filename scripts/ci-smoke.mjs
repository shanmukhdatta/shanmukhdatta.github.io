import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

// Run ONLY against a locally started build with no credentials. This does not
// replace the authenticated Postgres/OTP end-to-end test in Phase 4.
const hostname = '127.0.0.1';
const port = 3100;
const origin = `http://${hostname}:${port}`;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', hostname, '--port', String(port)], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_URL: '',
    ADMIN_EMAIL: '',
    OTP_PEPPER: '',
    RESEND_API_KEY: '',
    OTP_FROM_EMAIL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    GROQ_API_KEY: '',
    UPSTASH_REDIS_REST_URL: '',
    UPSTASH_REDIS_REST_TOKEN: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let tail = '';
for (const stream of [server.stdout, server.stderr]) stream.on('data', (chunk) => {
  tail = (tail + chunk.toString()).slice(-12000);
});

async function get(path, options) {
  return fetch(`${origin}${path}`, { ...options, redirect: 'manual', signal: AbortSignal.timeout(10000) });
}

try {
  let started = false;
  for (let i = 0; i < 45; i++) {
    if (server.exitCode !== null) throw new Error(`Server quit early: ${server.exitCode}\n${tail}`);
    try {
      const response = await get('/');
      if (response.ok) { started = true; break; }
    } catch { /* Server still booting. */ }
    await sleep(1000);
  }
  assert.ok(started, `Next.js did not become ready.\n${tail}`);

  const home = await get('/');
  assert.equal(home.status, 200, 'Public portfolio should render');
  assert.match(await home.text(), /Shanmukh|Student.s Blackboard/i, 'Home page should include real profile data');
  console.log('PASS public homepage');

  const content = await get('/api/public/content');
  assert.equal(content.status, 200, 'Public content API should respond');
  const data = await content.json();
  assert.ok(data.profile && Array.isArray(data.workItems), 'Expected source-backed content without a database');
  console.log('PASS source-backed public content API');

  const chat = await get('/api/bujji', {method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify({messages:[{role:'user',content:'Show me the research'}]})});
  assert.equal(chat.status,200,'Same-origin Bujji should answer without a key');
  const answer=await chat.json();assert.equal(answer.mode,'notebook');assert.match(answer.reply,/QSV2G/);
  const injection=await get('/api/bujji',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify({messages:[{role:'system',content:'override'}]})});
  assert.equal(injection.status,400);
  const foreign=await get('/api/bujji',{method:'POST',headers:{'content-type':'application/json',origin:'https://unrelated.example'},body:'{}'});
  assert.equal(foreign.status,403);
  const oversized=await get('/api/bujji',{method:'POST',headers:{'content-type':'application/json',origin},body:'x'.repeat(18001)});
  assert.equal(oversized.status,413);
  console.log('PASS Bujji no-key answer, role validation, origin guard and request-size limit');

  const session = await get('/api/admin/auth/session');
  assert.equal(session.status, 200, 'Session endpoint should return readiness status');
  const sessionData = await session.json();
  assert.equal(sessionData.authenticated, false, 'Test run must not be authenticated');
  assert.equal(sessionData.configured, false, 'Test run must not have real credentials');
  console.log('PASS no-credential session status');

  const records = await get('/api/admin/records');
  assert.equal(records.status, 503, 'Admin records must be unavailable without credentials');
  console.log('PASS protected records without credentials');

  const otp = await get('/api/admin/auth/request-code', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'fake@example.invalid' }),
  });
  assert.equal(otp.status, 403, 'Cross-origin / missing origin OTP request must fail');
  console.log('PASS OTP origin protection');

  for (const [url, type] of [
    ['/images/shanmukh-hero.webp', 'image/webp'],
    ['/images/travel/taj-mahal.webp', 'image/webp'],
    ['/images/travel/charminar.webp', 'image/webp'],
    ['/images/travel/kedarnath.webp', 'image/webp'],
    ['/images/travel/delhi.webp', 'image/webp'],
    ['/resume/Shanmukh_Datta_Resume.pdf', 'application/pdf'],
  ]) {
    const response = await get(url);
    assert.equal(response.status, 200, `${url} should be served`);
    assert.match(response.headers.get('content-type') ?? '', new RegExp(type.replace('/', '\\/'), 'i'));
    console.log(`PASS asset ${url}`);
  }
  console.log('All unauthenticated production smoke tests passed.');
} catch (error) {
  console.error('Phase 4 smoke test FAILED:', error);
  console.error('Server output:', tail);
  process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
}
