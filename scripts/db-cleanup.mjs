import { Pool } from 'pg';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && existsSync(envFile)) {
  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);
  const l = lines.find(line => line.startsWith('DATABASE_URL='));
  if (l) dbUrl = l.slice('DATABASE_URL='.length).trim().replace(/\\/g, '');
}

if (!dbUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 5000,
  ssl: /localhost|127\.0\.0\.1/.test(dbUrl) ? false : { rejectUnauthorized: false }
});

try {
  const r1 = await pool.query("DELETE FROM cms_login_codes WHERE expires_at < now() OR (consumed_at IS NOT NULL AND created_at < now() - interval '1 day')");
  const r2 = await pool.query("DELETE FROM cms_sessions WHERE expires_at < now()");
  const r3 = await pool.query("DELETE FROM cms_rate_limits WHERE window_start < now() - interval '1 hour'");
  console.log(`Pruned ${r1.rowCount} old login codes, ${r2.rowCount} expired sessions, ${r3.rowCount} rate limit records.`);
} catch (err) {
  console.error('Cleanup failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
