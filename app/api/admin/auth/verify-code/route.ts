import type { NextRequest } from 'next/server';
import { installCookie, trustedOrigin, verifyCode } from '@/lib/cms-auth';
import { json } from '@/lib/cms-response';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!trustedOrigin(req))return json({error:'Untrusted request origin'},403);
 try{const raw=await req.text();if(raw.length>2000)return json({error:'Invalid request'},400);
 const data=JSON.parse(raw);const session=await verifyCode(req,data.email,data.code);
 if(!session)return json({error:'Code invalid, expired, or too many attempts'},401);
 await installCookie(session);return json({authenticated:true});
 }catch(error){console.error('OTP verification issue',error instanceof Error?error.message:'unknown');return json({error:'Authentication service unavailable'},503)}
}
