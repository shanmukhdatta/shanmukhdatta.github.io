import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { Pool } from 'pg';

/**
 * Run against a disposable PostgreSQL service and locally mocked Resend.
 * No external credentials, no live inbox and no deployment are involved.
 */
if (process.env.CI !== 'true') throw new Error('This integration suite is CI-only');
const connectionString = process.env.CI_DATABASE_URL;
if (!connectionString || !/localhost|127\.0\.0\.1/.test(connectionString)) {
  throw new Error('CI_DATABASE_URL must point at local disposable PostgreSQL');
}

const root = process.cwd();
const folder = await mkdtemp(join(tmpdir(), 'blackboard-ci-'));
const captureFile = join(folder, 'resend.json');
const host = '127.0.0.1';
const port = 3171;
const origin = `http://${host}:${port}`;
const email = 'portfolio-ci-admin@example.test';
const sessionSecret = randomBytes(48).toString('hex');
const pool = new Pool({ connectionString, connectionTimeoutMillis: 4000 });
let server;
let output = '';

const assertStatus = async (path, expected, options={}) => {
  const response = await fetch(origin + path, {
    ...options,
    redirect: 'manual',
    signal: AbortSignal.timeout(12000),
  });
  assert.equal(response.status, expected, `${path}: expected HTTP ${expected}, got ${response.status}: ${(await response.clone().text()).slice(0,500)}`);
  return response;
};
const post = (path, payload, cookie='', withOrigin=true, method='POST') =>
  assertStatus;
const send = async (path, method, payload, cookie, withOrigin=true) =>
  fetch(origin + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(withOrigin ? { origin } : {}),
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(payload),
    redirect: 'manual',
    signal: AbortSignal.timeout(12000),
  });
const check = async (name, fn) => {
  await fn();
  console.log('PASS ' + name);
};

try {
  const schema = await readFile('db/schema.sql', 'utf8');
  await pool.query(schema);
  console.log('PASS PostgreSQL schema applied');

  const env = {
    ...process.env,
    CI: 'true',
    CI_MOCK_RESEND_CAPTURE: captureFile,
    NODE_OPTIONS: `--require=${resolve(root, 'scripts/ci-resend-mock.cjs')}`,
    DATABASE_URL: connectionString,
    ADMIN_EMAIL: email,
    OTP_PEPPER: sessionSecret,
    APP_ORIGIN: origin,
    RESEND_API_KEY: 'ci-mock-key-not-real',
    OTP_FROM_EMAIL: 'CI Test <ci@example.test>',
    SUPABASE_URL: '',
    SUPABASE_SERVICE_ROLE_KEY: '',
    SUPABASE_STORAGE_BUCKET: '',
  };
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname',host,'--port',String(port)],{
    cwd: root, env, stdio: ['ignore','pipe','pipe']
  });
  for (const s of [server.stdout,server.stderr]) s.on('data', chunk => {
    output = (output + chunk.toString()).slice(-12000);
  });
  let ready = false;
  for (let n=0;n<50;n++) {
    if (server.exitCode !== null) throw new Error('Next.js exited early: ' + output);
    try { if ((await fetch(origin + '/', { signal: AbortSignal.timeout(1000) })).ok) { ready=true;break; }} catch {}
    await sleep(1000);
  }
  assert.ok(ready,'Next.js never became ready: '+output);
  console.log('PASS Next.js production server started against PostgreSQL');

  await check('configured session is unauthenticated', async () => {
    const resp = await assertStatus('/api/admin/auth/session',200);
    const data = await resp.json();
    assert.equal(data.configured, true);
    assert.equal(data.authenticated, false);
  });
  await check('unauthed API cannot read or edit CMS records', async () => {
    await assertStatus('/api/admin/records',401);
    assert.equal((await send('/api/admin/records','PUT',{kind:'blog'},'',true)).status,401);
  });
  await check('originless OTP request rejected', async () => {
    assert.equal((await send('/api/admin/auth/request-code','POST',{email},'',false)).status,403);
  });
  await check('non-admin email gets generic response without an OTP', async () => {
    const r=await send('/api/admin/auth/request-code','POST',{email:'not-admin@example.test'},'');
    assert.equal(r.status,202);
    assert.equal(existsSync(captureFile),false);
  });
  await check('admin OTP request goes to a mocked sender', async () => {
    const r=await send('/api/admin/auth/request-code','POST',{email},'');
    assert.equal(r.status,202);
    assert.ok(existsSync(captureFile),'expected mock email capture file');
  });

  const delivered=JSON.parse(await readFile(captureFile,'utf8'));
  assert.equal(delivered.to,email);
  assert.match(delivered.code,/^[0-9]{6}$/);
  await check('invalid OTP rejected', async () => {
    const bad=delivered.code==='000000'?'999999':'000000';
    const r=await send('/api/admin/auth/verify-code','POST',{email,code:bad},'');
    assert.equal(r.status,401);
  });
  let cookie;
  await check('correct OTP creates a secure administrator session', async () => {
    const r=await send('/api/admin/auth/verify-code','POST',{email,code:delivered.code},'');
    assert.equal(r.status,200);
    const setCookie=r.headers.get('set-cookie')??'';
    assert.match(setCookie,/sb_admin_session=/);
    assert.match(setCookie,/httponly/i);
    assert.match(setCookie,/samesite=strict/i);
    assert.match(setCookie,/secure/i);
    cookie=setCookie.split(';')[0];
    assert.equal((await assertStatus('/api/admin/auth/session',200,{headers:{cookie}})).status,200);
    assert.equal((await (await assertStatus('/api/admin/auth/session',200,{headers:{cookie}})).json()).authenticated,true);
  });
  await check('OTP cannot be reused', async () => {
    assert.equal((await send('/api/admin/auth/verify-code','POST',{email,code:delivered.code},'')).status,401);
  });

  let version=0;
  const slug='ci-test-notebook-entry';
  const blog={slug,title:'Integration test blog',description:'Disposable CMS test entry',date:'2026-10-26',category:'Engineering',body:'Generated solely to verify CMS workflow.'};
  await check('authenticated CMS records listing works', async () => {
    const r=await assertStatus('/api/admin/records',200,{headers:{cookie}});
    const j=await r.json();
    assert.ok(Array.isArray(j.records));
    assert.ok(j.records.some(x=>x.kind==='profile'));
  });
  await check('cross-origin state changes forbidden even with cookie', async () => {
    const r=await send('/api/admin/records','PUT',{kind:'blog',id:slug,payload:blog,status:'draft',version},cookie,false);
    assert.equal(r.status,403);
  });
  await check('create draft without making it public', async () => {
    const r=await send('/api/admin/records','PUT',{kind:'blog',id:slug,payload:blog,status:'draft',version},cookie);
    assert.equal(r.status,200);
    const j=await r.json();
    version=j.record.version;
    assert.equal(version,1);
    const publicData=await (await assertStatus('/api/public/content',200)).json();
    assert.ok(!publicData.blogPosts.some(x=>x.slug===slug));
  });
  await check('publish draft and see it on public API and homepage', async () => {
    const r=await send('/api/admin/records','PUT',{kind:'blog',id:slug,payload:blog,status:'published',version},cookie);
    assert.equal(r.status,200);
    version=(await r.json()).record.version;
    assert.equal(version,2);
    const publicData=await (await assertStatus('/api/public/content',200)).json();
    assert.ok(publicData.blogPosts.some(x=>x.slug===slug));
    const homepage=await (await assertStatus('/',200)).text();
    assert.match(homepage,/Integration test blog/);
  });
  await check('stale versions cannot overwrite the published record',async()=>{
    const r=await send('/api/admin/records','PUT',{kind:'blog',id:slug,payload:blog,status:'draft',version:1},cookie);
    assert.equal(r.status,409);
  });
  await check('hide published content and remove it from public API',async()=>{
    const r=await send('/api/admin/records','DELETE',{kind:'blog',id:slug,version},cookie);
    assert.equal(r.status,200);
    const publicData=await (await assertStatus('/api/public/content',200)).json();
    assert.ok(!publicData.blogPosts.some(x=>x.slug===slug));
  });
  await check('invalid research publication rejected',async()=>{
    const work={id:'ci-fake-paper',name:'Unpublished study',category:'research',status:'Research in progress',summary:'Test summary',detail:'Test details',stack:['Python'],publicationStatus:'published'};
    const r=await send('/api/admin/records','PUT',{kind:'work',id:work.id,payload:work,status:'published',version:0},cookie);
    assert.equal(r.status,400);
  });
  await check('media upload disabled without storage configuration',async()=>{
    const r=await fetch(origin+'/api/admin/media',{method:'POST',headers:{cookie,origin},signal:AbortSignal.timeout(12000)});
    assert.equal(r.status,503);
  });
  await check('logout invalidates administrator session',async()=>{
    const logout=await send('/api/admin/auth/logout','POST',{},cookie);
    assert.equal(logout.status,200);
    await assertStatus('/api/admin/records',401,{headers:{cookie}});
  });
  console.log('All isolated PostgreSQL + mock OTP integration checks passed.');
} catch (err) {
  console.error('FAIL Phase 4 CMS integration:',err);
  console.error('Next.js server output:',output.slice(-3500));
  process.exitCode=1;
} finally {
  if (server) {server.kill('SIGTERM');await sleep(250);}
  await pool.end();
  await rm(folder,{recursive:true,force:true});
}
