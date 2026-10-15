import {randomUUID} from 'node:crypto';
import {config} from '../../../../lib/config';
import {authorized,rejectForeignOrigin} from '../../../../lib/security';
export const runtime='nodejs';
export async function POST(request:Request){
 try{
  await rejectForeignOrigin(request);
  if(!await authorized())return Response.json({error:'Sign in required'},{status:401});
  const form=await request.formData();const file=form.get('file');
  if(!(file instanceof File)||file.size===0||file.size>4_000_000)return Response.json({error:'Select an image smaller than 4 MB'},{status:400});
  const formats:{[type:string]:{ext:string;magic:number[]}}={'image/png':{ext:'png',magic:[137,80,78,71]},'image/jpeg':{ext:'jpg',magic:[255,216,255]},'image/webp':{ext:'webp',magic:[82,73,70,70]}};
  const f=formats[file.type];if(!f)return Response.json({error:'PNG, JPG, or WebP only'},{status:400});
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!f.magic.every((v,i)=>bytes[i]===v)||(file.type==='image/webp'&&new TextDecoder().decode(bytes.subarray(8,12))!=='WEBP'))return Response.json({error:'File format mismatch'},{status:400});
  if(!config.supabaseUrl||!config.serviceRole)return Response.json({error:'Storage not configured'},{status:503});
  const path=randomUUID()+'.'+f.ext;
  const r=await fetch(`${config.supabaseUrl.replace(/\/$/,'')}/storage/v1/object/portfolio-media/${path}`,{method:'POST',headers:{Authorization:'Bearer '+config.serviceRole,apikey:config.serviceRole,'Content-Type':file.type,'x-upsert':'false'},body:bytes});
  if(!r.ok)return Response.json({error:'Upload failed. Ensure the portfolio-media bucket exists.'},{status:503});
  return Response.json({url:`${config.supabaseUrl.replace(/\/$/,'')}/storage/v1/object/public/portfolio-media/${path}`});
 }catch{return Response.json({error:'Upload unavailable'},{status:503});}
}
