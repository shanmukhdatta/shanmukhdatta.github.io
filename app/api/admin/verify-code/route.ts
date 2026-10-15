import {cookies} from 'next/headers';
import {config,backendReady} from '../../../../lib/config';
import {db,limit} from '../../../../lib/db';
import {clientIp,digest,same,sessionToken,COOKIE,rejectForeignOrigin} from '../../../../lib/security';
export const runtime='nodejs';
export async function POST(request:Request){
 try{
  await rejectForeignOrigin(request);
  if(!backendReady())return Response.json({error:'Admin login is not configured'},{status:503});
  const ip=clientIp(request);
  if(!await limit('verify:ip:'+ip,12,3600))return Response.json({error:'Too many attempts'},{status:429});
  const body=await request.json() as {code?:unknown};
  if(typeof body.code!=='string'||!/^\d{6}$/.test(body.code))return Response.json({error:'Enter the six-digit code'},{status:400});
  const rows=await db<Array<{code_hash:string;expires_at:string;attempts:number}>>('portfolio_otp',{query:'select=code_hash,expires_at,attempts&email=eq.'+encodeURIComponent(config.email)+'&limit=1'});
  if(!rows[0]||rows[0].attempts>=5||new Date(rows[0].expires_at).getTime()<Date.now())return Response.json({error:'Expired or invalid code'},{status:401});
  // Increment attempts before checking; a failed request cannot reset the counter.
  await db('portfolio_otp',{method:'PATCH',query:'email=eq.'+encodeURIComponent(config.email),body:{attempts:rows[0].attempts+1}});
  if(!same(rows[0].code_hash,digest('otp:'+body.code)))return Response.json({error:'Expired or invalid code'},{status:401});
  await db('portfolio_otp',{method:'DELETE',query:'email=eq.'+encodeURIComponent(config.email)});
  (await cookies()).set(COOKIE,sessionToken(config.email),{secure:process.env.NODE_ENV==='production',httpOnly:true,sameSite:'lax',path:'/',maxAge:21600});
  return Response.json({ok:true});
 }catch(e){console.error('OTP verification failure',e instanceof Error?e.message:'error');return Response.json({error:'Sign-in unavailable'},{status:503});}
}
