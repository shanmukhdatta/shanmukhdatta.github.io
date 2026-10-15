// Validate every browser-visible field before drafts can become public content.
export const documentKeys=['site','milestones','mindTopics','skills','projects'] as const;
export type DocumentKey=typeof documentKeys[number];
export function isDocumentKey(k:string):k is DocumentKey{return documentKeys.includes(k as DocumentKey);}
function record(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Expected an object');return value as Record<string,unknown>;}
function text(value:unknown,label:string){if(typeof value!=='string'||!value.trim()||value.length>16000)throw new Error('Invalid '+label);}
function list(value:unknown,label:string,max=180):unknown[]{if(!Array.isArray(value)||value.length>max)throw new Error('Invalid '+label);return value;}
function strings(value:unknown,label:string){for(const x of list(value,label))text(x,label);}
function url(value:unknown,label:string,local=false){if(local&&typeof value==='string'&&/^\/(?!\/)[a-zA-Z0-9/_-]+\.(?:pdf|png|jpg|jpeg|webp)$/.test(value))return;if(typeof value!=='string')throw new Error('Invalid '+label);try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)throw new Error();}catch{throw new Error(label+' must be an absolute HTTPS URL');}}
const stages=['Research','Prototype','In development','Architecture','Open source','Demo','Experiment'];
const tracks=['Research','AI Products','Agents & Infrastructure','Cybersecurity','Healthcare','Applied Engineering','Explorations'];
export function validateDocument(key:string,value:unknown){
 if(!isDocumentKey(key))throw new Error('Unknown document');
 const raw=JSON.stringify(value);if(!raw||raw.length>320_000)throw new Error('Document too large');
 if(new RegExp([['c','g','p','a'].join(''), '\\b'+['g','p','a'].join('')+'\\b', 'grade.point','grade-point','academic.score'].join('|'),'i').test(raw))throw new Error('Academic scores are excluded from this portfolio');
 if(/javascript:|data:text\/html|<script|onerror\s*=|onload\s*=/i.test(raw))throw new Error('Unsafe markup or URL');
 if(key==='projects'){
  const projects=list(value,'projects');if(!projects.length)throw new Error('Keep at least one public project');
  const slugs=new Set<string>();for(const item of projects){
   const p=record(item);
   if(typeof p.slug!=='string'||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||slugs.has(p.slug))throw new Error('Invalid or duplicate project slug');
   slugs.add(p.slug);for(const field of ['name','eyebrow','summary','problem','approach','evidence','next'])text(p[field],field);
   if(!stages.includes(String(p.stage))||!tracks.includes(String(p.category)))throw new Error('Invalid project stage or track');
   strings(p.tags,'tags');for(const field of ['features','related'])if(p[field]!==undefined)strings(p[field],field);
   for(const field of ['repo','demo','paper'])if(p[field]!=null&&p[field]!=='')url(p[field],field);
   if(p.screenshots!==undefined)for(const src of list(p.screenshots,'screenshots',30))url(src,'Screenshot',true);
   for(const field of ['featured','research'])if(p[field]!==undefined&&typeof p[field]!=='boolean')throw new Error('Invalid '+field);
   if(p.metrics!==undefined)for(const m of list(p.metrics,'metrics',20)){const metric=record(m);text(metric.label,'metric label');text(metric.value,'metric value');if(metric.source!==undefined)text(metric.source,'metric source');}
  }
  for(const item of projects){const p=record(item);for(const slug of (p.related||[]) as string[])if(!slugs.has(slug))throw new Error('Related project does not exist: '+slug);}
 }
 if(key==='site'){
  const profile=record(value);
  for(const field of ['name','shortName','brand','headline','tagline','description','institute','program','location','email','availability','quote','aboutTitle','aboutIntro','aboutDetail','currentlyExploring'])text(profile[field],field);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(profile.email)))throw new Error('Invalid email');
  const links=record(profile.links);for(const field of ['github','linkedin'])url(links[field],field);for(const field of ['scholar','resume'])if(links[field]!=null)url(links[field],field,field==='resume');
  if(typeof profile.signalAccent!=='boolean')throw new Error('Invalid signal setting');
  for(const item of list(profile.gallery,'gallery',50)){const photo=record(item);url(photo.src,'Gallery image',true);text(photo.title,'Photo title');text(photo.place,'Photo place');}
 }
 if(key==='milestones')for(const item of list(value,'journey',100)){const m=record(item);for(const field of ['date','label','type','note'])text(m[field],field);if(m.proof)url(m.proof,'Milestone proof');}
 if(key==='mindTopics'){const topics=list(value,'mind topics',80);if(!topics.length)throw new Error('Keep at least one mind topic');for(const item of topics){const t=record(item);for(const field of ['title','chain','project','detail'])text(t[field],field);}}
 if(key==='skills')for(const [group,items] of Object.entries(record(value))){text(group,'skill group');strings(items,'skills');}
 return value;
}
