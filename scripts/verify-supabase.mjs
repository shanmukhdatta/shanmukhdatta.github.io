import { Pool } from 'pg';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load local environment safely
const envFile = resolve(process.cwd(), '.env.local');
if (!existsSync(envFile)) {
  console.log('STATUS: .env.local file not found yet. Please create .env.local in the root directory.');
  process.exit(1);
}

// Read manually to avoid printing any values
const envLines = readFileSync(envFile, 'utf8').split(/\r?\n/);
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq > 0) {
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    env[key] = val;
  }
}

console.log('--- Supabase Integration Check ---');

// 1. Check PostgreSQL Database
if (!env.DATABASE_URL) {
  console.log('[-] DATABASE_URL: missing in .env.local');
} else {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 7000,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_name LIKE \'cms_%\'');
    const tableNames = res.rows.map(r => r.table_name).sort();
    console.log(`[+] Database connection: SUCCESS`);
    console.log(`[+] Verified CMS tables (${tableNames.length}/4):`, tableNames.join(', '));
    await pool.end();
  } catch (err) {
    console.log(`[-] Database connection failed:`, err.message);
    await pool.end().catch(() => {});
  }
}

// 2. Check Storage Configuration
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.SUPABASE_STORAGE_BUCKET) {
  console.log('[-] Storage configuration: incomplete in .env.local');
} else {
  try {
    const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/bucket/${encodeURIComponent(env.SUPABASE_STORAGE_BUCKET)}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: env.SUPABASE_SERVICE_ROLE_KEY
      }
    });

    if (resp.ok) {
      const bucket = await resp.json();
      console.log(`[+] Supabase Storage bucket "${env.SUPABASE_STORAGE_BUCKET}": FOUND`);
      console.log(`[+] Public bucket status:`, bucket.public ? 'PUBLIC (Correct)' : 'PRIVATE (Warning: Should be public for portfolio media)');
    } else {
      console.log(`[-] Supabase Storage check returned HTTP ${resp.status}`);
    }
  } catch (err) {
    console.log(`[-] Storage check failed:`, err.message);
  }
}
