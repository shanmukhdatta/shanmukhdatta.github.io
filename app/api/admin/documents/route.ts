import {db} from '../../../../lib/db';
import {authorized,rejectForeignOrigin,jsonError} from '../../../../lib/security';
import {isDocumentKey,validateDocument} from '../../../../lib/validate';
import {baseline} from '../../../../lib/portfolio-store';
export const dynamic='force-dynamic';
type Row={key:string;draft:unknown;published:unknown;revision:number;updated_at:string};
export async function GET(){if(!await authorized())return Response.json({error:'Sign in required'},{status:401});try{const rows=await db<Row[]>('portfolio_documents',{query:'select=key,draft,published,revision,updated_at'});return Response.json({documents:rows,baseline},{headers:{'Cache-Control':'no-store'}});}catch(e){return jsonError(e);}}
export async function PUT(request:Request){
 try{
  await rejectForeignOrigin(request);if(!await authorized())return Response.json({error:'Sign in required'},{status:401});
  const body=await request.json() as {key?:unknown;value?:unknown;action?:unknown;revision?:unknown};
  if(typeof body.key!=='string'||!isDocumentKey(body.key)||!['save','publish','restore'].includes(String(body.action)))return Response.json({error:'Invalid document request'},{status:400});
  const key=body.key, action=String(body.action);
  if(action!=='restore')try{validateDocument(key,body.value);}catch(e){return Response.json({error:e instanceof Error?e.message:'Invalid content'},{status:400});}
  const rows=await db<Row[]>('portfolio_documents',{query:'select=key,draft,published,revision&key=eq.'+key});
  const prev=rows[0], expected=Number(body.revision??0);
  if(expected!==(prev?.revision??0))return Response.json({error:'Another session edited this document. Refresh before saving.'},{status:409});
  const draft=action==='restore'?(prev?.published??baseline[key]):body.value;
  if(action==='restore')validateDocument(key,draft);
  const published=action==='publish'?body.value:prev?.published??null;
  const next={key,draft,published,revision:expected+1,updated_at:new Date().toISOString()};
  await db('portfolio_documents',{method:'POST',query:'on_conflict=key',prefer:'resolution=merge-duplicates,return=representation',body:next});
  return Response.json({ok:true,document:next});
 }catch(e){return jsonError(e);}
}
