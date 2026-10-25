import type {NextRequest} from 'next/server';
import {randomUUID} from 'node:crypto';
import {guard,json} from '@/lib/cms-response';
export const runtime='nodejs';
const accepted:{[key:string]:{ext:string;max:number}}={
 'image/jpeg':{ext:'jpg',max:5*1024*1024},'image/png':{ext:'png',max:5*1024*1024},'image/webp':{ext:'webp',max:5*1024*1024},'application/pdf':{ext:'pdf',max:8*1024*1024},
};
export async function POST(req:NextRequest){
 const denied=await guard(req,true);if(denied)return denied;
 const base=process.env.SUPABASE_URL,serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY,bucket=process.env.SUPABASE_STORAGE_BUCKET;
 if(!base||!serviceKey||!bucket)return json({error:'Media storage not configured; you may use an existing public HTTPS URL'},503);
 if(!/^https:\/\//.test(base)||!/^[a-z0-9_-]{2,65}$/i.test(bucket))return json({error:'Invalid storage configuration'},503);
 const length=Number(req.headers.get('content-length')||0);if(length>9*1024*1024)return json({error:'Upload too large'},413);
 try{
  const form=await req.formData();const file=form.get('file');
  if(!(file instanceof File))return json({error:'Choose a file'},400);
  const spec=accepted[file.type];if(!spec||file.size<1||file.size>spec.max)return json({error:'Only JPG, PNG, WebP (up to 5MB), or PDF (up to 8MB) are accepted'},400);
  const bytes=new Uint8Array(await file.arrayBuffer());
  const jpg=bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff;
  const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
  const webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
  const pdf=String.fromCharCode(...bytes.slice(0,5))==='%PDF-';
  if(!({ 'image/jpeg':jpg,'image/png':png,'image/webp':webp,'application/pdf':pdf }[file.type]))return json({error:'File bytes do not match the declared type'},400);
  const path=`portfolio/${randomUUID()}.${spec.ext}`;
  const api=`${base.replace(/\/$/,'')}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`;
  const response=await fetch(api,{method:'POST',headers:{Authorization:`Bearer ${serviceKey}`,apikey:serviceKey,'Content-Type':file.type,'x-upsert':'false'},body:bytes,cache:'no-store'});
  if(!response.ok){console.error('Media storage rejected upload',response.status);return json({error:'Storage upload failed'},502)}
  return json({url:`${base.replace(/\/$/,'')}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path}`});
 }catch{return json({error:'Media upload failed'},503)}
}
