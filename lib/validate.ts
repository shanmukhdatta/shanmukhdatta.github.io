// Public data validation. No HTML interpolation or JavaScript URLs are permitted.
export const documentKeys=['site','milestones','mindTopics','skills','projects'] as const;
export type DocumentKey=typeof documentKeys[number];
export function isDocumentKey(k:string):k is DocumentKey{return documentKeys.includes(k as DocumentKey);}
export function validateDocument(key:string,value:unknown){
 if(!isDocumentKey(key))throw new Error('Unknown document');
 const raw=JSON.stringify(value);if(!raw||raw.length>320_000)throw new Error('Document too large');
 if(new RegExp([['c','g','p','a'].join(''), '\\b'+['g','p','a'].join('')+'\\b', 'grade.point','grade-point','academic.score'].join('|'),'i').test(raw))throw new Error('Academic scores are excluded from this portfolio');
 if(/javascript:|data:text\/html|<script|onerror\s*=|onload\s*=/i.test(raw))throw new Error('Unsafe markup or URL');
 if(key==='projects'){
  if(!Array.isArray(value)||value.length>180)throw new Error('Projects must be an array of at most 180 records');
  const slugs=new Set<string>();for(const item of value){
   if(!item||typeof item!=='object')throw new Error('Project record missing');
   const p=item as Record<string,unknown>;
   if(typeof p.slug!=='string'||! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||slugs.has(p.slug))throw new Error('Invalid or duplicate project slug');
   slugs.add(p.slug);for(const field of ['name','summary','problem','approach','evidence','next','category','stage'])if(typeof p[field]!=='string'||!(p[field] as string).trim())throw new Error('Missing '+field);
   if(!Array.isArray(p.tags)||p.tags.some(t=>typeof t!=='string'))throw new Error('Invalid tags');
   for(const field of ['repo','demo'])if(p[field]!=null &&(typeof p[field]!=='string'|| !/^https:\/\//.test(p[field] as string)))throw new Error('Links must use HTTPS');
  }
 }
 if(key==='site'&&(!value||typeof value!=='object'||typeof (value as {name?:unknown}).name!=='string'))throw new Error('Invalid site profile');
 if(key==='milestones'&&(!Array.isArray(value)||value.length>100))throw new Error('Invalid journey');
 if(key==='mindTopics'&&(!Array.isArray(value)||value.length>80))throw new Error('Invalid mind topics');
 if(key==='skills'&&(!value||typeof value!=='object'||Array.isArray(value)))throw new Error('Invalid toolkit');
 return value;
}
