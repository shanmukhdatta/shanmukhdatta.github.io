import type { NextRequest } from 'next/server';
import { requestCode,trustedOrigin } from '@/lib/cms-auth';
import { json } from '@/lib/cms-response';
export const runtime='nodejs';
export async function POST(req:NextRequest){
 if(!trustedOrigin(req))return json({error:'Untrusted request origin'},403);
 try{const body=await req.text();if(body.length>2000)return json({error:'Invalid request'},400);const data=JSON.parse(body);
 await requestCode(req,data.email);
 return json({message:'If this is the authorized admin address, an email code was sent.'},202);
 }catch(error){console.error('OTP request issue',error instanceof Error?error.message:'unknown');return json({error:'Admin email service unavailable'},503)}
}
