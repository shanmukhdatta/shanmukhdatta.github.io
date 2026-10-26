import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {createRequire} from 'node:module';
const root=resolve(import.meta.dirname,'..');
const temp=mkdtempSync(join(tmpdir(),'cms-test-'));
// The schema is deliberately self-contained and can be tested even without npm access.
const localTsc=join(root,'node_modules/typescript/bin/tsc');
const [tscBin,prefixArgs]=existsSync(localTsc)?[process.execPath,[localTsc]]:['tsc',[]];
execFileSync(tscBin,[...prefixArgs,'--pretty','false','--target','es2022','--module','commonjs','--moduleResolution','node','--esModuleInterop','--skipLibCheck','--strict','--outDir',temp,'lib/cms-schema.ts','content/site.ts','content/work.ts','content/blogs.ts'],{cwd:root,stdio:'pipe'});
const req=createRequire(import.meta.url);
const cms=req(join(temp,'lib/cms-schema.js'));
test.after(()=>rmSync(temp,{recursive:true,force:true}));
const record=(kind,id,payload,status='published')=>({kind,id,payload,status,version:1});
const initial=cms.defaultPortfolio();
test('actual résumé-backed starter content is preserved',()=>{
 assert.ok(initial.workItems.length>=10);
 assert.equal(initial.experiences.length,3);
 assert.match(initial.profile.shortName,/Shanmukh/);
 assert.equal(initial.blogPosts.length,0);
 assert.equal(initial.credentials.length,0);
});
test('publishing updates existing work without making duplicates',()=>{
 const old=initial.workItems[0];const replacement={...old,summary:'CMS-published change'};
 const snapshot=cms.publicPortfolio([record('work',old.id,replacement)]);
 assert.equal(snapshot.workItems.filter(x=>x.id===old.id).length,1);
 assert.equal(snapshot.workItems.find(x=>x.id===old.id).summary,'CMS-published change');
});
test('drafts do not overwrite published starter content',()=>{
 const old=initial.workItems[0];const snapshot=cms.publicPortfolio([record('work',old.id,{...old,summary:'UNPUBLISHED'},'draft')]);
 assert.equal(snapshot.workItems[0].summary,old.summary);
});
test('hidden tombstones remove both built-in and newly published entries',()=>{
 const existing=initial.workItems[0];const newRow={...existing,id:'new-entry',name:'New Entry'};
 const snapshot=cms.publicPortfolio([record('work',existing.id,existing,'hidden'),record('work','new-entry',newRow,'published'),record('work','new-entry',newRow,'hidden')]);
 assert.ok(!snapshot.workItems.some(x=>x.id===existing.id));assert.ok(!snapshot.workItems.some(x=>x.id==='new-entry'));
});
test('draft blogs are never public',()=>{
 const blog={slug:'a-real-post',title:'My note',description:'A description',date:'2026-10-26',category:'Engineering',body:'A real blog draft'};
 assert.equal(cms.publicPortfolio([record('blog',blog.slug,blog,'draft')]).blogPosts.length,0);
 assert.equal(cms.publicPortfolio([record('blog',blog.slug,blog)]).blogPosts.length,1);
});
test('Published research must have verifiable venue and paper URL',()=>{
 const old=initial.workItems.find(x=>x.id==='aura');
 const bad={...old,publicationStatus:'published'};
 assert.equal(cms.validateRecord('work',bad.id,bad,'published').ok,false);
 const good={...bad,venue:'Example Research Venue',paper:'https://example.org/paper'};
 assert.equal(cms.validateRecord('work',good.id,good,'published').ok,true);
});
test('malicious URL schemes and invalid states are rejected',()=>{
 const old=initial.workItems[0];
 assert.equal(cms.validateRecord('work',old.id,{...old,github:'javascript:alert(1)'},'published').ok,false);
 assert.equal(cms.validateRecord('work',old.id,{...old,live:'data:text/html,<script>alert(1)</script>'},'published').ok,false);
 assert.equal(cms.validateRecord('work',old.id,old,'exposed').ok,false);
 assert.equal(cms.validateRecord('profile','other',initial.profile,'published').ok,false);
});
test('published gallery image appears only when approved, with original photo preserved',()=>{
 const item={src:'https://images.example.org/photo.jpg',alt:'Research lab',caption:'A research photo'};
 const data=cms.publicPortfolio([record('gallery','lab-photo',item)]);
 assert.equal(data.profile.gallery.length,initial.profile.gallery.length+1);
 assert.ok(data.profile.gallery.some(x=>x.caption==='A research photo'));
 assert.ok(data.profile.gallery.some(x=>x.src.includes('shanmukh-gallery.webp')));
});
test('new credential requires issuer; skills require string lists',()=>{
 assert.equal(cms.validateRecord('credential','certificate',{title:'Course'},'published').ok,false);
 assert.equal(cms.validateRecord('credential','certificate',{title:'Course',issuer:'Publisher'},'published').ok,true);
 assert.equal(cms.validateRecord('skill','machine-learning',{group:'Machine Learning',items:['Python','PyTorch']},'published').ok,true);
 assert.equal(cms.validateRecord('skill','machine-learning',{group:'Machine Learning',items:['Python',99]},'published').ok,false);
});
