import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
async function load(path){const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {validateDocument}=await load('lib/validate.ts');
const {projects}=await load('content/projects.ts');
const {site,milestones,mindTopics,skills}=await load('content/site.ts');
test('all shipped public data satisfies the CMS schema',()=>{for(const [key,value] of Object.entries({site,milestones,mindTopics,skills,projects}))assert.equal(validateDocument(key,value),value);});
test('incomplete and empty public records cannot break scenes',()=>{for(const [key,value] of [['site',{name:'Only a name'}],['projects',[]],['mindTopics',[]],['milestones',[{}]],['skills',{Tools:5}]])assert.throws(()=>validateDocument(key,value));});
test('paper and image URLs reject active or non-HTTPS content',()=>{for(const field of ['paper','demo','repo'])assert.throws(()=>validateDocument('projects',[{...projects[0],[field]:'javascript:alert(1)',related:[]}])) ;assert.throws(()=>validateDocument('projects',[{...projects[0],related:[],screenshots:['data:image/svg+xml,<svg/>']}])) ;});
test('duplicates, dangling relations and invalid statuses fail publication',()=>{assert.throws(()=>validateDocument('projects',[projects[0],projects[0]]));assert.throws(()=>validateDocument('projects',[{...projects[0],stage:'Guaranteed production'}]));assert.throws(()=>validateDocument('projects',[{...projects[0],related:['missing']}])) ;});
test('unsafe profile links and malformed gallery records are rejected',()=>{assert.throws(()=>validateDocument('site',{...site,links:{...site.links,resume:'http://unsafe.test/resume.pdf'}}));assert.throws(()=>validateDocument('site',{...site,gallery:[{src:'https://example.com/a.jpg'}]}));});
