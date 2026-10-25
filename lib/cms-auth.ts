import 'server-only';
import { createHash,createHmac,randomBytes,randomInt,timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { db, rateLimit } from './cms-db';

const COOKIE='sb_admin_session';
const sha=(s:string)=>createHash('sha256').update(s).digest('hex');
function secret(){const s=process.env.OTP_PEPPER;if(!s||s.length<32)throw new Error('OTP_PEPPER must contain at least 32 characters');return s}
const mac=(v:string)=>createHmac('sha256',secret()).update(v).digest('hex');
const configured=()=>Boolean(process.env.DATABASE_URL && process.env.OTP_PEPPER && process.env.ADMIN_EMAIL && process.env.APP_ORIGIN && process.env.RESEND_API_KEY && process.env.OTP_FROM_EMAIL);
export function authReady(){return configured()&&secret().length>=32}
export function trustedOrigin(req:NextRequest){
 const raw=req.headers.get('origin');if(!raw)return false;
 if(!process.env.APP_ORIGIN)return false;
 try{return new URL(raw).origin===new URL(process.env.APP_ORIGIN).origin}catch{return false}
}
function clientKey(req:NextRequest){
 // E-mail-scoped throttling remains authoritative; IP throttling is supplementary (proxy headers can vary).
 const ip=req.headers.get('x-real-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 return mac('ip:'+ip);
}
async function sendCode(to:string,code:string){
 const key=process.env.RESEND_API_KEY,from=process.env.OTP_FROM_EMAIL;
 if(!key||!from)throw new Error('Email provider is not configured');
 const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to,subject:'Your portfolio admin sign-in code',text:`Your portfolio admin code is ${code}. It expires in 10 minutes. If you did not request it, ignore this email.`}),cache:'no-store'});
 if(!response.ok)throw new Error('Email provider rejected request');
}
export async function requestCode(req:NextRequest,emailInput:unknown){
 if(!configured()||!process.env.RESEND_API_KEY||!process.env.OTP_FROM_EMAIL)throw new Error('Admin sign-in not configured');
 const email=typeof emailInput==='string'?emailInput.trim().toLowerCase():'';
 // Keep a generic response for non-admin addresses. Never send them email.
 if(email!==process.env.ADMIN_EMAIL!.trim().toLowerCase())return;
 const ipAllowed=await rateLimit('request-ip',clientKey(req),8,15);
 const emailAllowed=await rateLimit('request-email',mac('email:'+email),3,15);
 if(!ipAllowed||!emailAllowed)return;
 const code=String(randomInt(0,1000000)).padStart(6,'0');
 const hash=mac(`otp:${email}:${code}`);
 await db().query('UPDATE cms_login_codes SET consumed_at=now() WHERE email=$1 AND consumed_at IS NULL',[email]);
 await db().query("INSERT INTO cms_login_codes(email,code_hash,expires_at) VALUES($1,$2,now()+interval '10 minutes')",[email,hash]);
 await sendCode(email,code);
}
export async function verifyCode(req:NextRequest,emailInput:unknown,codeInput:unknown):Promise<string|null>{
 if(!configured())throw new Error('Admin sign-in not configured');
 const email=typeof emailInput==='string'?emailInput.trim().toLowerCase():'';
 const code=typeof codeInput==='string'?codeInput.trim():'';
 if(email!==process.env.ADMIN_EMAIL!.trim().toLowerCase()||!/^[0-9]{6}$/.test(code))return null;
 if(!await rateLimit('verify-ip',clientKey(req),12,15))return null;
 const client=await db().connect();
 try{
  await client.query('BEGIN');
  const result=await client.query('SELECT id,code_hash FROM cms_login_codes WHERE email=$1 AND consumed_at IS NULL AND expires_at>now() AND attempts<5 ORDER BY created_at DESC,id DESC LIMIT 1 FOR UPDATE',[email]);
  if(!result.rowCount){await client.query('COMMIT');return null}
  const row=result.rows[0];
  const candidate=Buffer.from(mac(`otp:${email}:${code}`),'hex');
  const expected=Buffer.from(row.code_hash,'hex');
  const match=candidate.length===expected.length&&timingSafeEqual(candidate,expected);
  await client.query('UPDATE cms_login_codes SET attempts=attempts+1,consumed_at=CASE WHEN $2 THEN now() ELSE consumed_at END WHERE id=$1',[row.id,match]);
  if(!match){await client.query('COMMIT');return null}
  const token=randomBytes(32).toString('base64url');
  await client.query("INSERT INTO cms_sessions(token_hash,email,expires_at) VALUES($1,$2,now()+interval '7 days')",[sha(token),email]);
  await client.query('COMMIT');return token;
 }catch(err){await client.query('ROLLBACK');throw err}finally{client.release()}
}
export async function installCookie(token:string){
 (await cookies()).set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:7*86400});
}
export async function adminEmail():Promise<string|null>{
 if(!configured())return null;
 const token=(await cookies()).get(COOKIE)?.value;
 if(!token||token.length>200)return null;
 const result=await db().query('SELECT email FROM cms_sessions WHERE token_hash=$1 AND expires_at>now() LIMIT 1',[sha(token)]);
 if(!result.rowCount)return null;
 return result.rows[0].email===process.env.ADMIN_EMAIL!.trim().toLowerCase()?result.rows[0].email:null;
}
export async function logOut(){
 const jar=await cookies();const token=jar.get(COOKIE)?.value;
 if(token)await db().query('DELETE FROM cms_sessions WHERE token_hash=$1',[sha(token)]);
 jar.delete(COOKIE);
}
