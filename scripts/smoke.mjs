// Production HTTP checks; no provider credentials are needed or printed.
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const port=4387,base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{stdio:['ignore','pipe','pipe'],env:{...process.env,SUPABASE_URL:'',SUPABASE_SERVICE_ROLE_KEY:'',ADMIN_EMAIL:'',SESSION_SECRET:'',GROQ_API_KEY:'',RESEND_API_KEY:''}});
let logs='';child.stdout.on('data',v=>logs+=v);child.stderr.on('data',v=>logs+=v);
try{
 let ready=false;for(let i=0;i<80;i++){try{const r=await fetch(base+'/api/content');if(r.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
 assert.ok(ready,'Production server did not start: '+logs);
 const content=await (await fetch(base+'/api/content')).json();assert.equal(content.projects.length,29);
 for(const path of ['/','/projects/','/research/','/control-center/','/demo/','/sitemap.xml','/robots.txt',...content.projects.map(p=>`/projects/${p.slug}/`)]){const r=await fetch(base+path);assert.equal(r.status,200,path);assert.match(r.headers.get('x-content-type-options')||'',/nosniff/);const body=await r.text();if(path==='/')assert.ok(body.includes(content.site.shortName),'Public profile must render on the server');}
 for(const asset of [...content.site.gallery.map(p=>p.src),content.site.links.resume]){const r=await fetch(base+asset);assert.equal(r.status,200,asset);assert.ok((await r.arrayBuffer()).byteLength>1000,asset);}
 assert.equal((await fetch(base+'/projects/does-not-exist/')).status,404);
 for(const path of ['/api/admin/documents','/api/admin/inbox','/api/admin/media','/api/admin/history'])assert.equal((await fetch(base+path)).status,401,path);
 assert.equal((await fetch(base+'/api/admin/session').then(r=>r.json())).authorized,false);
 assert.equal((await fetch(base+'/api/maya',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'Research?'})})).status,503);
 assert.equal((await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'})).status,400);
 console.log('Production smoke checks passed: all 29 case studies, core routes, server-rendered content, headers, 404 and unauthenticated API boundaries.');
}finally{child.kill('SIGTERM');await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once('exit',resolve);setTimeout(()=>{child.kill('SIGKILL');resolve();},3000).unref();});}
