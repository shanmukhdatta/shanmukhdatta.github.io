import 'server-only';
import { Pool, type PoolClient } from 'pg';
import type { ContentRecord } from './cms-schema';
let pool:Pool|undefined;
export function dbReady(){return Boolean(process.env.DATABASE_URL)}
export function db():Pool{
 if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is not configured');
 if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:4000,idleTimeoutMillis:30000});
 return pool;
}
export async function loadChanges():Promise<ContentRecord[]>{
 if(!dbReady())return [];
 const result=await db().query('SELECT kind,id,status,payload,version,updated_at FROM cms_records ORDER BY created_at ASC');
 return result.rows.map(row=>({kind:row.kind,id:row.id,status:row.status,payload:row.payload,version:row.version,origin:'database',updatedAt:row.updated_at.toISOString()}));
}
/** Atomic per-key rate limit using an UPSERT. All calls are server-side. */
export async function rateLimit(action:string,keyHash:string,max:number,minutes:number,client:PoolClient|Pool=db()):Promise<boolean>{
 const result=await client.query(`INSERT INTO cms_rate_limits(action,key_hash,window_start,attempts) VALUES($1,$2,now(),1)
 ON CONFLICT(action,key_hash) DO UPDATE SET
  attempts = CASE WHEN cms_rate_limits.window_start < now()-($3::int * interval '1 minute') THEN 1 ELSE cms_rate_limits.attempts+1 END,
  window_start = CASE WHEN cms_rate_limits.window_start < now()-($3::int * interval '1 minute') THEN now() ELSE cms_rate_limits.window_start END
 RETURNING attempts`,[action,keyHash,minutes]);
 return Number(result.rows[0].attempts)<=max;
}
