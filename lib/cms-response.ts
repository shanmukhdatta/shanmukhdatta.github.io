import { NextResponse, type NextRequest } from 'next/server';
import { adminEmail,authReady,trustedOrigin } from './cms-auth';
export function json(data:unknown,status=200){return NextResponse.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export async function guard(req:NextRequest,mutation=false){
 try{
  if(!authReady())return json({error:'Admin integration has not been configured'},503);
  if(mutation&&!trustedOrigin(req))return json({error:'Untrusted request origin'},403);
  if(!await adminEmail())return json({error:'Sign in required'},401);
  return null;
 }catch{return json({error:'Authentication storage is unavailable'},503)}
}
