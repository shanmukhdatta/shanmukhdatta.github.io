import {db} from '../../../../lib/db';
import {authorized,jsonError} from '../../../../lib/security';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!await authorized())return Response.json({error:'Sign in required'},{status:401});
 try{const download=new URL(request.url).searchParams.get('download')==='1';
 const history=await db('portfolio_history',{query:'select=*&order=id.desc&limit=100'});
 const documents=download?await db('portfolio_documents',{query:'select=key,draft,published,revision,updated_at'}):undefined;
 return Response.json({history,...(download?{documents,exportedAt:new Date().toISOString()}: {})},{headers:{'Cache-Control':'no-store',...(download?{'Content-Disposition':'attachment; filename="shanxai-private-backup.json"'}:{})}});
 }catch(e){return jsonError(e);}
}
