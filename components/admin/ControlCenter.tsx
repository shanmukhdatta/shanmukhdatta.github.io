'use client';
import {useCallback,useEffect,useState} from 'react';
import {defaultRecords,kinds,type ContentKind,type ContentRecord,type ContentStatus} from '@/lib/cms-schema';

type Field={key:string;label:string;type?:'text'|'textarea'|'url'|'email'|'select'|'checkbox'|'list';options?:string[];help?:string};
const fieldMap:Record<ContentKind,Field[]>={
 profile:[
  {key:'name',label:'Full name'},{key:'shortName',label:'Display name'},{key:'role',label:'Headline'},
  {key:'hello',label:'Opening sentence'},{key:'introduction',label:'Introduction',type:'textarea'},
  {key:'email',label:'Public contact email',type:'email'},{key:'location',label:'Location'},
  {key:'school',label:'Institution'},{key:'degree',label:'Degree'},{key:'minor',label:'Minor'},{key:'years',label:'Study years'},
  {key:'portrait',label:'Hero photo URL',type:'url',help:'Photo remains to the right of the intro, even on mobile.'},
  {key:'resume',label:'Résumé PDF URL',type:'url'},{key:'github',label:'GitHub URL',type:'url'},
  {key:'linkedin',label:'LinkedIn URL',type:'url'},{key:'tagline',label:'Footer slogan'}
 ],
 work:[
  {key:'name',label:'Project or paper title'},
  {key:'category',label:'Category',type:'select',options:['projects','research','hackathons','open-source']},
  {key:'status',label:'Real status',type:'select',options:['Built / explored','In development','Research in progress','Contribution','Architecture / planned','Hackathon project']},
  {key:'summary',label:'Short summary',type:'textarea'},{key:'detail',label:'Detailed description',type:'textarea'},
  {key:'stack',label:'Technologies (comma-separated)',type:'list'},
  {key:'github',label:'GitHub URL',type:'url'},{key:'live',label:'Live demo URL',type:'url'},
  {key:'publicationStatus',label:'Research status',type:'select',options:['','ongoing','published']},
  {key:'venue',label:'Publication venue (if verified)'},{key:'publicationDate',label:'Publication date'},
  {key:'doi',label:'DOI (optional)'},{key:'paper',label:'Paper URL',type:'url'},
  {key:'featured',label:'Featured work',type:'checkbox'}
 ],
 blog:[{key:'title',label:'Blog title'},{key:'description',label:'Summary',type:'textarea'},
  {key:'date',label:'Date (YYYY-MM-DD)'},{key:'category',label:'Category'},
  {key:'body',label:'Blog content (plain text)',type:'textarea',help:'Plain text only. No HTML is rendered.'}],
 experience:[{key:'role',label:'Position'},{key:'organization',label:'Organization'},{key:'period',label:'Dates'},
  {key:'kind',label:'Experience type',type:'select',options:['Internship','Campus experience']},{key:'description',label:'Description',type:'textarea'}],
 achievement:[{key:'year',label:'Year'},{key:'title',label:'Achievement'},{key:'description',label:'Description',type:'textarea'}],
 skill:[{key:'group',label:'Skill group'},{key:'items',label:'Skills (comma-separated)',type:'list'}],
 credential:[{key:'title',label:'Certificate title'},{key:'issuer',label:'Issuer'},
  {key:'date',label:'Issue date'},{key:'verifyUrl',label:'Verification link',type:'url'}],
 gallery:[{key:'src',label:'Photo URL',type:'url'},{key:'alt',label:'Photo alternative text'},
  {key:'caption',label:'Caption'}],
 roadmap:[{key:'phase',label:'Phase'},{key:'title',label:'Milestone'},{key:'description',label:'Description',type:'textarea'}]
};
const blankPayload:Record<ContentKind,Record<string,unknown>>={
 profile:{},work:{name:'',category:'projects',status:'In development',summary:'',detail:'',stack:[],publicationStatus:'ongoing',featured:false},
 blog:{title:'',description:'',date:new Date().toISOString().slice(0,10),category:'Notes',body:''},
 experience:{role:'',organization:'',period:'',kind:'Internship',description:''},
 achievement:{year:'',title:'',description:''},skill:{group:'',items:[]},credential:{title:'',issuer:''},
 gallery:{src:'',alt:'',caption:''},roadmap:{phase:'',title:'',description:''}
};
const titles:Record<ContentKind,string>={profile:'Profile & résumé',work:'Projects & research',blog:'Blogs',experience:'Internships & work',achievement:'Achievements',skill:'Skill groups',credential:'Certificates',gallery:'Photo gallery',roadmap:'Roadmap'};
function idFrom(v:string){return v.trim().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'untitled'}
function labelFor(record:ContentRecord){const p=record.payload;return String(p.name||p.title||p.role||p.group||p.caption||p.phase||record.id)}
async function requestJson<T>(url:string,init:RequestInit={}):Promise<T>{
 const r=await fetch(url,{...init,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...init.headers}});
 const body=await r.json().catch(()=>({error:'Invalid server response'}));
 if(!r.ok)throw new Error(body.error||`Request failed (${r.status})`);
 return body as T;
}
export default function ControlCenter(){
 const [session,setSession]=useState<'checking'|'login'|'authenticated'|'unconfigured'>('checking');
 const [email,setEmail]=useState('');const [code,setCode]=useState('');
 const [notice,setNotice]=useState('');const [busy,setBusy]=useState(false);
 const [kind,setKind]=useState<ContentKind>('work');const [records,setRecords]=useState<ContentRecord[]>([]);
 const [editing,setEditing]=useState<ContentRecord|null>(null);const [draft,setDraft]=useState<Record<string,unknown>>({});
 const [editId,setEditId]=useState('');const [publishStatus,setPublishStatus]=useState<ContentStatus>('draft');
 const [mediaBusy,setMediaBusy]=useState(false);
 const load=useCallback(async()=>{
  const data=await requestJson<{records:ContentRecord[]}>('/api/admin/records');setRecords(data.records);
 },[]);
 useEffect(()=>{let cancelled=false;
  requestJson<{configured:boolean;authenticated:boolean}>('/api/admin/auth/session').then(async result=>{
   if(cancelled)return;if(!result.configured){setSession('unconfigured');return}
   if(result.authenticated){setSession('authenticated');await load()}else setSession('login');
  }).catch(()=>{if(!cancelled){setSession('login');setNotice('Session service is unavailable or not configured.')}});
  return ()=>{cancelled=true};
 },[load]);
 async function execute(action:()=>Promise<void>){setBusy(true);setNotice('');try{await action()}catch(e){setNotice(e instanceof Error?e.message:'Request failed')}finally{setBusy(false)}}
 async function requestOtp(){await execute(async()=>{const data=await requestJson<{message:string}>('/api/admin/auth/request-code',{method:'POST',body:JSON.stringify({email})});setNotice(data.message)})}
 async function verifyOtp(){await execute(async()=>{await requestJson('/api/admin/auth/verify-code',{method:'POST',body:JSON.stringify({email,code})});setCode('');setSession('authenticated');await load();setNotice('Signed in.')})}
 async function logout(){await execute(async()=>{await requestJson('/api/admin/auth/logout',{method:'POST',body:'{}'});setSession('login');setEditing(null);setRecords([]);setNotice('Signed out.')})}
 function edit(row:ContentRecord){setEditing(row);setDraft({...row.payload});setEditId(row.id);setPublishStatus(row.status);setNotice('')}
 function create(){
  const payload={...blankPayload[kind]};
  const row:ContentRecord={kind,id:kind==='profile'?'main':'',status:'draft',payload,version:0};
  edit(row);
 }
 function updateField(key:string,v:unknown){setDraft(d=>({...d,[key]:v}))}
 function makeRecord():ContentRecord{
  if(!editing)throw Error('No selected record');
  const identity=editing.version>0||editing.origin==='built-in'?editing.id:editId||idFrom(String(draft.name||draft.title||draft.role||draft.group||draft.caption||draft.phase||''));
  const id=identity.toLowerCase().trim();
  const payload: Record<string,unknown> = {...draft,...(kind==='work'?{id}:{}),...(kind==='blog'?{slug:id}:{})};
  if(kind==='profile'&&editing){payload.gallery=editing.payload.gallery||[]}
  return {...editing,kind,id,payload,status:publishStatus};
 }
 async function save(){if(!editing)return;
  await execute(async()=>{
   const entry=makeRecord();const res=await requestJson<{record:ContentRecord}>('/api/admin/records',{method:'PUT',body:JSON.stringify(entry)});
   await load();edit(res.record);setNotice(res.record.status==='published'?'Published. Reload the public portfolio to see changes.':'Saved as '+res.record.status+'.');
  });
 }
 async function hide(){if(!editing||editing.kind==='profile')return;
  if(!window.confirm('Hide this entry from the public portfolio? You can restore it later.'))return;
  await execute(async()=>{
   await requestJson('/api/admin/records',{method:'DELETE',body:JSON.stringify({kind:editing.kind,id:editing.id,version:editing.version})});
   await load();setEditing(null);setNotice('Entry hidden. Select it again to restore it.');
  });
 }
 async function upload(file:File,key:string){
  setMediaBusy(true);setNotice('');
  try{
   const form=new FormData();form.append('file',file);
   const response=await fetch('/api/admin/media',{method:'POST',body:form,credentials:'same-origin'});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Upload failed');
   updateField(key,data.url);setNotice('Upload complete. Save and publish this entry to make the change public.');
  }catch(e){setNotice(e instanceof Error?e.message:'Upload failed')}finally{setMediaBusy(false)}
 }
 const sorted=records.filter(x=>x.kind===kind);
 return <div className="cc-outer"><div className="cc-panel">
  <header className="cc-head"><div><span className="eyebrow">✳ STUDENT'S BLACKBOARD</span><h1>Control center.</h1><p>Private notebook / content management</p></div><a href="/" className="outline-action">← PUBLIC PORTFOLIO</a></header>
  {notice&&<div className="cc-notice" role="status">{notice}</div>}
  {session==='checking'&&<div className="cc-section"><p>Checking admin session…</p></div>}
  {session==='unconfigured'&&<div className="cc-section"><h2>Admin system needs setup</h2><p>Configure your database, admin email, OTP secret, email sender, and public application origin. Refer to <code>docs/PHASE3_SETUP.md</code>. No insecure demo login is available.</p></div>}
  {session==='login'&&<div className="cc-section cc-login"><h2>Sign in with an email code</h2><p>Only the designated portfolio administrator can sign in. Verification codes expire after ten minutes.</p>
   <form onSubmit={e=>{e.preventDefault();void requestOtp()}}><label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your admin email"/></label><button className="outline-action primary" type="submit" disabled={busy}>SEND CODE ↗</button></form>
   <form onSubmit={e=>{e.preventDefault();void verifyOtp()}}><label>Six-digit email code<input autoComplete="one-time-code" inputMode="numeric" minLength={6} maxLength={6} pattern="[0-9]{6}" value={code} onChange={e=>setCode(e.target.value)} required placeholder="000000"/></label><button className="outline-action" type="submit" disabled={busy}>VERIFY & SIGN IN ↗</button></form>
  </div>}
  {session==='authenticated'&&<>
   <div className="cc-toolbar"><span className="eyebrow">ADMIN / PUBLISHING DESK</span><button className="outline-action" onClick={()=>void logout()} disabled={busy}>LOG OUT</button></div>
   <nav className="cc-tabs" aria-label="Content types">{kinds.map(k=><button type="button" key={k} aria-pressed={kind===k} onClick={()=>{setKind(k);setEditing(null);setNotice('')}}>{titles[k]} <span>({records.filter(r=>r.kind===k).length})</span></button>)}</nav>
   <div className="cc-workspace"><section className="cc-records" aria-label="Content entries"><div className="cc-listhead"><h2>{titles[kind]}</h2><button type="button" className="outline-action primary" onClick={()=>kind==='profile'?edit(sorted[0]||defaultRecords().find(x=>x.kind==='profile')!):create()}>{kind==='profile'?'EDIT PROFILE':'+ NEW ENTRY'}</button></div>
    {sorted.length===0&&<p className="cc-help">No items in this section yet. Create your first entry.</p>}
    <div className="cc-list">{sorted.map(row=><button key={`${row.kind}:${row.id}`} className="cc-listitem" aria-pressed={editing?.id===row.id} onClick={()=>edit(row)}><strong>{labelFor(row)}</strong><span>{row.status.toUpperCase()} · {row.origin==='built-in'?'STARTER':'CMS'}</span></button>)}</div>
   </section>
   <section className="cc-editor" aria-label="Entry editor">
    {!editing?<div className="cc-empty"><span className="hand">✎</span><h2>Choose a notebook page.</h2><p>Pick an entry on the left to edit, or create a new one. Nothing changes publicly until you publish.</p></div>:<>
     <h2>{editing.id?'Edit entry':'New entry'}</h2>
     <p className="cc-help">Drafts stay private. Published items appear publicly; hidden items remain recoverable. Only mark research as published once publication details are verified.</p>
     <form onSubmit={e=>{e.preventDefault();void save()}}>
      {kind!=='profile'&&<label className="cc-field">Stable entry ID <small>(lowercase letters, digits, hyphens; cannot change after first save)</small><input value={editId} disabled={editing.version>0||editing.origin==='built-in'} onChange={e=>setEditId(idFrom(e.target.value))} placeholder="e.g. my-project-name" pattern="[a-z0-9][a-z0-9-]*"/></label>}
      {fieldMap[kind].map(field=><label className="cc-field" key={field.key}>{field.label}{field.help&&<small>{field.help}</small>}
       {field.type==='textarea'?<textarea rows={field.key==='body'||field.key==='detail'?8:4} value={String(draft[field.key]??'')} onChange={e=>updateField(field.key,e.target.value)}/>
       :field.type==='select'?<select value={String(draft[field.key]??'')} onChange={e=>updateField(field.key,e.target.value)}>{field.options?.map(option=><option value={option} key={option}>{option||'Not applicable'}</option>)}</select>
       :field.type==='checkbox'?<input type="checkbox" checked={Boolean(draft[field.key])} onChange={e=>updateField(field.key,e.target.checked)}/>
       :<input type={field.type==='email'?'email':'text'} value={field.type==='list'?(Array.isArray(draft[field.key])?(draft[field.key] as string[]).join(', '):''):String(draft[field.key]??'')} onChange={e=>updateField(field.key,field.type==='list'?e.target.value.split(',').map(x=>x.trim()).filter(Boolean):e.target.value)}/>
       }
       {(field.key==='src'||field.key==='portrait'||field.key==='resume')&&<span className="cc-upload"><input type="file" accept={field.key==='resume'?'application/pdf':'image/jpeg,image/png,image/webp'} disabled={mediaBusy} onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file,field.key)}}/><span className="cc-help">{mediaBusy?'Uploading…':'Or upload a file to your configured media bucket'}</span></span>}
      </label>)}
      <label className="cc-field">Publication state<select value={publishStatus} onChange={e=>setPublishStatus(e.target.value as ContentStatus)}><option value="draft">Draft — private</option><option value="published">Published — visible</option>{kind!=='profile'&&<option value="hidden">Hidden — archived</option>}</select></label>
      {kind==='work'&&draft.publicationStatus==='published'&&<p className="cc-warning">Published papers require a verified publication venue and HTTPS paper link. Unpublished research belongs in Ongoing.</p>}
      <div className="cc-actions"><button className="outline-action primary" type="submit" disabled={busy||mediaBusy}>{busy?'SAVING…':'SAVE ENTRY ↗'}</button><button className="outline-action" type="button" onClick={()=>setEditing(null)}>CANCEL</button>{editing.id&&editing.kind!=='profile'&&<button type="button" className="outline-action" onClick={()=>void hide()} disabled={busy}>HIDE</button>}</div>
     </form>
    </>}
   </section></div>
   <div className="cc-bottom">Your public notebook uses your real résumé and source-backed project details. A public database connection is required before changes persist. Keep research statuses and credentials accurate.</div>
  </>}
 </div></div>
}
