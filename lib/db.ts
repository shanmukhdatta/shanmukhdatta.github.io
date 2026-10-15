import 'server-only';
import { config, backendReady } from './config';
export class DatabaseUnavailable extends Error {}
export async function db<T = unknown>(
  table: string,
  options: {
    method?: string;
    query?: string;
    body?: unknown;
    headers?: Record<string, string>;
    prefer?: string;
  } = {},
): Promise<T> {
  if (!backendReady()) throw new DatabaseUnavailable('Persistent backend not configured');
  if (!/^(?:[a-z_]+|rpc\/[a-z_]+)$/.test(table)) throw new Error('Invalid table name');
  const url =
    config.supabaseUrl.replace(/\/$/, '') +
    '/rest/v1/' +
    table +
    (options.query ? '?' + options.query : '');
  const result = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      apikey: config.serviceRole,
      Authorization: 'Bearer ' + config.serviceRole,
      'Content-Type': 'application/json',
      ...(options.prefer ? { Prefer: options.prefer } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });
  if (!result.ok) {
    console.error('Database operation failed', table, result.status);
    throw new Error('Database operation failed');
  }
  const value = await result.text();
  return (value ? JSON.parse(value) : null) as T;
}
export async function limit(key: string, max: number, windowSeconds: number) {
  // Atomic database RPC: all serverless instances enforce one shared quota.
  const result = await db<boolean>('rpc/consume_rate_limit', {
    method: 'POST',
    body: { p_key: key, p_limit: max, p_window_seconds: windowSeconds },
  });
  // RPC returns a boolean scalar, not an array, in current SQL definition.
  return result === true;
}
export async function publishedDocuments() {
  const rows = await db<Array<{ key: string; published: unknown }>>('portfolio_documents', {
    query: 'select=key,published&published=not.is.null',
  });
  return Object.fromEntries(rows.map((x) => [x.key, x.published]));
}
