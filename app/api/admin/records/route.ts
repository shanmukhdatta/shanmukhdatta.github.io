import type { NextRequest } from 'next/server';
import { db, loadChanges } from '@/lib/cms-db';
import { guard,json } from '@/lib/cms-response';
import { defaultRecords, kinds,validateRecord,type ContentKind,type ContentRecord } from '@/lib/cms-schema';
export const runtime='nodejs';
const merge=(saved:ContentRecord[])=>{
 const map=new Map(defaultRecords().map(x=>[`${x.kind}:${x.id}`,x]));
 saved.forEach(x=>map.set(`${x.kind}:${x.id}`,x));
 return [...map.values()];
};
export async function GET(req:NextRequest){const denied=await guard(req);if(denied)return denied;
 try{return json({records:merge(await loadChanges())})}catch{return json({error:'Database unavailable; apply db/schema.sql'},503)}
}
export async function PUT(req:NextRequest){
 const denied=await guard(req,true);if(denied)return denied;
 try{
  const raw=await req.text();if(raw.length>46000)return json({error:'Record too large'},413);
  const body=JSON.parse(raw),candidate=validateRecord(body.kind,body.id,body.payload,body.status);
  if(!candidate.ok)return json({error:candidate.error},400);
  const version=body.version;
  if(!Number.isSafeInteger(version)||version<0)return json({error:'Invalid version'},400);
  const {kind,id,status,payload}=candidate.value;
  let result;
  if(version===0){
   result=await db().query(`INSERT INTO cms_records(kind,id,status,payload) VALUES($1,$2,$3,$4::jsonb) ON CONFLICT DO NOTHING
    RETURNING kind,id,status,payload,version,updated_at`,[kind,id,status,JSON.stringify(payload)]);
  }else{
   result=await db().query(`UPDATE cms_records SET status=$3,payload=$4::jsonb,version=version+1,updated_at=now()
     WHERE kind=$1 AND id=$2 AND version=$5 RETURNING kind,id,status,payload,version,updated_at`,[kind,id,status,JSON.stringify(payload),version]);
  }
  if(!result.rowCount)return json({error:'Another edit changed this record. Reload before editing.'},409);
  const row=result.rows[0];return json({record:{kind:row.kind,id:row.id,status:row.status,payload:row.payload,version:row.version,origin:'database',updatedAt:row.updated_at.toISOString()}});
 }catch(error){console.error('CMS save failed',error instanceof Error?error.message:'unknown');return json({error:'Unable to save record'},503)}
}
/** Hiding is reversible and leaves an audit trail, including for built-in entries. */
export async function DELETE(req:NextRequest){
 const denied=await guard(req,true);if(denied)return denied;
 try{const raw=await req.text();if(raw.length>2000)return json({error:'Invalid request'},400);
 const {kind,id,version}=JSON.parse(raw);
 if(!kinds.includes(kind as ContentKind)||typeof id!=='string'||!/^[a-z0-9][a-z0-9-]{0,89}$/.test(id)||!Number.isSafeInteger(version)||version<0)return json({error:'Invalid record'},400);
 if(kind==='profile')return json({error:'Profile cannot be hidden'},400);
 const original=version===0?defaultRecords().find(x=>x.kind===kind&&x.id===id):null;
 let result;
 if(version===0&&original){result=await db().query(`INSERT INTO cms_records(kind,id,status,payload) VALUES($1,$2,'hidden',$3::jsonb) ON CONFLICT DO NOTHING RETURNING version`,[kind,id,JSON.stringify(original.payload)])}
 else{result=await db().query(`UPDATE cms_records SET status='hidden',version=version+1,updated_at=now() WHERE kind=$1 AND id=$2 AND version=$3 RETURNING version`,[kind,id,version])}
 if(!result.rowCount)return json({error:'Record changed; reload before hiding'},409);
 return json({hidden:true});
 }catch{return json({error:'Unable to hide entry'},503)}
}
