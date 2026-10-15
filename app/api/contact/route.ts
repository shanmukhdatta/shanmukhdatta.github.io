import {config} from '../../../lib/config';
import {limit,db} from '../../../lib/db';
import {mail} from '../../../lib/mail';
import {clientIp,rejectForeignOrigin} from '../../../lib/security';
export const runtime='nodejs';
export async function POST(request:Request){
 try{
  await rejectForeignOrigin(request);
  const data=await request.json() as Record<string,unknown>;
  if(data.website)return Response.json({ok:true}); // honeypot: deliberately no delivery
  const name=typeof data.name==='string'?data.name.trim():'';
  const email=typeof data.email==='string'?data.email.trim():'';
  const message=typeof data.message==='string'?data.message.trim():'';
  if(name.length<2||name.length>100||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>180||message.length<10||message.length>4000)return Response.json({error:'Check your name, email and message lengths'},{status:400});
  if(!config.contactTo)return Response.json({error:'Contact form has not been configured'},{status:503});
  if(!await limit('contact:'+clientIp(request),4,3600))return Response.json({error:'Too many messages. Try again later.'},{status:429});
  const safeName=name.replace(/[\r\n]/g,' ').slice(0,100);
  const providerId=await mail(config.contactTo,'shanXAI portfolio enquiry from '+safeName,`Name: ${safeName}\nEmail: ${email}\n\n${message}`,email);
  try{await db('portfolio_inbox',{method:'POST',body:{name:safeName,email,message,provider_id:providerId}});}catch(e){console.error('Inbox archival failed after provider acceptance',e instanceof Error?e.message:'error');}
  return Response.json({ok:true,message:'Email accepted by the delivery provider.'});
 }catch(e){console.error('Contact endpoint error',e instanceof Error?e.message:'error');return Response.json({error:'Delivery could not be confirmed. Please use the email link.'},{status:503});}
}
