/** CMS content is plain text and URLs, never executable HTML. All data here is public. */
import { profile, experiences, achievements, skills, credentials, roadmap } from '../content/site';
import { workItems, type WorkItem } from '../content/work';
import { blogPosts } from '../content/blogs';

export type ContentKind = 'profile' | 'work' | 'blog' | 'experience' | 'achievement' | 'skill' | 'credential' | 'gallery' | 'roadmap';
export type ContentStatus = 'draft' | 'published' | 'hidden';
export type PortfolioData = {
 profile: { name:string;shortName:string;role:string;hello:string;introduction:string;email:string;location:string;school:string;degree:string;minor:string;years:string;portrait:string;resume:string;github:string;linkedin:string;tagline:string;gallery:{src:string;alt:string;caption:string}[] };
 experiences: {role:string;organization:string;period:string;description:string;kind:'Internship'|'Campus experience'}[];
 achievements: {year:string;title:string;description:string}[];
 skills: {group:string;items:string[]}[];
 credentials: {title:string;issuer:string;date?:string;verifyUrl?:string}[];
 roadmap: {phase:string;title:string;description:string}[];
 workItems: WorkItem[];
 blogPosts: {slug:string;title:string;description:string;date:string;category:string;body:string}[];
};
export type ContentRecord = {id:string;kind:ContentKind;status:ContentStatus;payload:Record<string,unknown>;version:number;origin?:'built-in'|'database';updatedAt?:string};

export const kinds:ContentKind[] = ['work','blog','experience','achievement','skill','credential','gallery','roadmap','profile'];
export function defaultPortfolio(): PortfolioData {
 return {
  profile: {...profile, gallery: profile.gallery.map(x=>({...x}))},
  experiences:experiences.map(x=>({...x})), achievements:achievements.map(x=>({...x})),
  skills:skills.map(x=>({...x,items:[...x.items]})), credentials:credentials.map(x=>({...x})),
  roadmap:roadmap.map(x=>({...x})), workItems:workItems.map(x=>({...x,stack:[...x.stack]})),
  blogPosts:blogPosts.map(x=>({...x})),
 };
}
function slugify(v:string){return v.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)||'entry'}
/** Built-in records are replaceable/hidden from the admin UI without changing source files. */
export function defaultRecords():ContentRecord[]{
 const data=defaultPortfolio();
 const asRecord=(kind:ContentKind,id:string,payload:object):ContentRecord=>({kind,id,status:'published',payload:{...payload},version:0,origin:'built-in'});
 return [
  asRecord('profile','main',data.profile),
  ...data.workItems.map(x=>asRecord('work',x.id,x)),
  ...data.blogPosts.map(x=>asRecord('blog',x.slug,x)),
  ...data.experiences.map(x=>asRecord('experience',slugify(`${x.role}-${x.organization}`),x)),
  ...data.achievements.map(x=>asRecord('achievement',slugify(`${x.year}-${x.title}`),x)),
  ...data.skills.map(x=>asRecord('skill',slugify(x.group),x)),
  ...data.credentials.map(x=>asRecord('credential',slugify(`${x.title}-${x.issuer}`),x)),
  ...data.profile.gallery.map((x,i)=>asRecord('gallery',slugify(`photo-${i+1}-${x.caption}`),x)),
  ...data.roadmap.map(x=>asRecord('roadmap',slugify(x.phase),x))
 ];
}
const simpleText = (v:unknown,max=3000)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
const optionalText=(v:unknown,max=3000)=>v===undefined||v===''||simpleText(v,max);
const url=(v:unknown,local=false)=>{
 if(v===undefined||v==='')return true;
 if(typeof v!=='string'||v.length>2048)return false;
 if(local && /^\/(?:images|resume)\/[a-zA-Z0-9/_\-.]+$/.test(v)&&!v.includes('..'))return true;
 try{const u=new URL(v);return u.protocol==='https:'}catch{return false}
};
const list=(v:unknown)=>Array.isArray(v)&&v.length<=35&&v.every(x=>simpleText(x,90));
const attrs=(payload:Record<string,unknown>,required:string[])=>required.every(k=>simpleText(payload[k],k==='body'?24000:6000));
const allowedKinds=new Set(kinds);
export function validateRecord(kind:unknown,id:unknown,payload:unknown,status:unknown):{ok:true;value:ContentRecord}|{ok:false;error:string}{
 if(typeof kind!=='string'||!allowedKinds.has(kind as ContentKind))return {ok:false,error:'Unknown content type'};
 if(typeof id!=='string'||!/^[a-z0-9][a-z0-9-]{0,89}$/.test(id))return {ok:false,error:'ID must be 1–90 lowercase letters, digits or hyphens'};
 if(status!=='draft'&&status!=='published'&&status!=='hidden')return {ok:false,error:'Invalid status'};
 if(!payload||typeof payload!=='object'||Array.isArray(payload))return {ok:false,error:'Content must be an object'};
 const p=payload as Record<string,unknown>;
 let valid=false;
 switch(kind as ContentKind){
  case 'profile':valid=id==='main'&&attrs(p,['name','shortName','role','hello','introduction','email','location','school','degree','minor','years','portrait','resume','github','linkedin','tagline'])&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(p.email))&&url(p.portrait,true)&&url(p.resume,true)&&url(p.github)&&url(p.linkedin)&&Array.isArray(p.gallery);break;
  case 'work':valid=attrs(p,['name','category','status','summary','detail'])&&list(p.stack)&&['projects','research','hackathons','open-source'].includes(String(p.category))&&optionalText(p.venue,250)&&optionalText(p.doi,200)&&optionalText(p.publicationDate,100)&&url(p.github)&&url(p.live)&&url(p.paper)&&(!p.publicationStatus||['ongoing','published'].includes(String(p.publicationStatus)))&&(!p.featured||typeof p.featured==='boolean')&&(p.publicationStatus!=='published'||(p.category==='research'&&simpleText(p.venue,250)&&typeof p.paper==='string'&&p.paper.length>0&&url(p.paper)))&&p.id===id;break;
  case 'blog':valid=attrs(p,['title','description','date','category','body'])&&p.slug===id;break;
  case 'experience':valid=attrs(p,['role','organization','period','description','kind'])&&['Internship','Campus experience'].includes(String(p.kind));break;
  case 'achievement':valid=attrs(p,['year','title','description']);break;
  case 'skill':valid=attrs(p,['group'])&&list(p.items);break;
  case 'credential':valid=attrs(p,['title','issuer'])&&optionalText(p.date,100)&&url(p.verifyUrl);break;
  case 'gallery':valid=attrs(p,['src','alt','caption'])&&url(p.src,true);break;
  case 'roadmap':valid=attrs(p,['phase','title','description']);break;
 }
 if(!valid)return {ok:false,error:'Missing or invalid fields for '+kind};
 // Keep only the known JSON shape; reject oversized/non-serializable payloads.
 const serialized=JSON.stringify(payload);
 if(!serialized||serialized.length>40000)return {ok:false,error:'Content is too large'};
 return {ok:true,value:{id,kind:kind as ContentKind,status,payload:p,version:0}};
}
/** Published DB rows replace matching built-in entries. Hidden entries act as tombstones. */
export function resolveRecords(changes:ContentRecord[]):ContentRecord[]{
 const result=new Map(defaultRecords().map(x=>[`${x.kind}:${x.id}`,x]));
 for(const x of changes){const key=`${x.kind}:${x.id}`;if(x.status==='hidden'){result.delete(key)}else if(x.status==='published'){result.set(key,x)}}
 return [...result.values()];
}
export function publicPortfolio(changes:ContentRecord[]):PortfolioData{
 const data=defaultPortfolio();const records=resolveRecords(changes);
 const by=(kind:ContentKind)=>records.filter(x=>x.kind===kind).map(x=>x.payload);
 const single=by('profile')[0];if(single)data.profile={...data.profile,...single, gallery:data.profile.gallery} as PortfolioData['profile'];
 data.profile.gallery=by('gallery') as PortfolioData['profile']['gallery'];
 data.workItems=by('work') as PortfolioData['workItems'];data.blogPosts=by('blog') as PortfolioData['blogPosts'];
 data.experiences=by('experience') as PortfolioData['experiences'];data.achievements=by('achievement') as PortfolioData['achievements'];
 data.skills=by('skill') as PortfolioData['skills'];data.credentials=by('credential') as PortfolioData['credentials'];
 data.roadmap=by('roadmap') as PortfolioData['roadmap'];return data;
}
