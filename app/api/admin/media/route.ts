import {randomUUID} from 'node:crypto';
import {config} from '../../../../lib/config';
import {authorized,rejectForeignOrigin} from '../../../../lib/security';
export const runtime='nodejs';
export async function POST(request:Request){
 try{
  await rejectForeignOrigin(request);
  if(!await authorized())return Response.json({error:'Sign in required'},{status:401});
  const form=await request.formData();const file=form.get('file');
  if(!(file instanceof File)||file.size===0||file.size>5_000_000)return Response.json({error:'Select an image or PDF smaller than 5 MB'},{status:400});
  const formats:{[type:string]:{ext:string;magic:number[]}}={'image/png':{ext:'png',magic:[137,80,78,71]},'image/jpeg':{ext:'jpg',magic:[255,216,255]},'image/webp':{ext:'webp',magic:[82,73,70,70]},'application/pdf':{ext:'pdf',magic:[37,80,68,70]}};
  const f=formats[file.type];if(!f)return Response.json({error:'PNG, JPG, WebP, or PDF only'},{status:400});
  const bytes=new Uint8Array(await file.arrayBuffer());
  if(!f.magic.every((v,i)=>bytes[i]===v)||(file.type==='image/webp'&&new TextDecoder().decode(bytes.subarray(8,12))!=='WEBP'))return Response.json({error:'File format mismatch'},{status:400});
  if(!config.supabaseUrl||!config.serviceRole)return Response.json({error:'Storage not configured'},{status:503});
  const path=randomUUID()+'.'+f.ext;
  const r=await fetch(`${config.supabaseUrl.replace(/\/$/,'')}/storage/v1/object/portfolio-media/${path}`,{method:'POST',headers:{Authorization:'Bearer '+config.serviceRole,apikey:config.serviceRole,'Content-Type':file.type,'x-upsert':'false'},body:bytes});
  if(!r.ok)return Response.json({error:'Upload failed. Ensure the portfolio-media bucket exists.'},{status:503});
  return Response.json({url:`${config.supabaseUrl.replace(/\/$/,'')}/storage/v1/object/public/portfolio-media/${path}`});
 }catch{return Response.json({error:'Upload unavailable'},{status:503});}
}

export async function GET(){
 if(!await authorized())return Response.json({error:'Sign in required'},{status:401});
 if(!config.supabaseUrl||!config.serviceRole)return Response.json({error:'Storage not configured'},{status:503});
 try{
  const base=config.supabaseUrl.replace(/\/$/,'');
  const r=await fetch(base+'/storage/v1/object/list/portfolio-media',{method:'POST',headers:{Authorization:'Bearer '+config.serviceRole,apikey:config.serviceRole,'Content-Type':'application/json'},body:JSON.stringify({prefix:'',limit:100,offset:0,sortBy:{column:'created_at',order:'desc'}}),cache:'no-store'});
  if(!r.ok)throw new Error('Storage listing failed');
  const files=await r.json() as Array<{name:string;created_at?:string}>;
  return Response.json({files:files.filter(x=>/^[a-f0-9-]+\.(png|jpg|webp|pdf)$/.test(x.name)).map(x=>({name:x.name,created_at:x.created_at,url:base+'/storage/v1/object/public/portfolio-media/'+x.name}))},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Media listing unavailable'},{status:503});}
}
