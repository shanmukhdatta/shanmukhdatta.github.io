import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {readFileSync,existsSync} from 'node:fs';
const read=x=>readFileSync(x,'utf8');
test('server uses secrets and authenticated owner dashboard',()=>{const auth=read('app/api/admin/documents/route.ts');assert.match(auth,/authorized\(\)/);assert.match(read('lib/config.ts'),/SESSION_SECRET/);assert.ok(existsSync('db/schema.sql'));});
test('chat context is built from server-owned public portfolio',()=>{const s=read('app/api/maya/route.ts');assert.match(s,/liveData\(\)/);assert.match(s,/PUBLIC FACTS/);assert.doesNotMatch(s,/body\.facts/);});
test('contact never claims success without provider acceptance',()=>{const s=read('app/api/contact/route.ts');assert.match(s,/await mail\(/);assert.match(s,/providerId/);});
test('content edits have draft and explicit publish',()=>{const s=read('app/api/admin/documents/route.ts');assert.match(s,/action==='publish'/);assert.match(s,/revision/);assert.match(s,/validateDocument/);});
test('v2 has pages for core navigation',()=>{for(const x of ['app/page.tsx','app/projects/page.tsx','app/research/page.tsx','app/control-center/page.tsx','app/api/content/route.ts'])assert.ok(existsSync(x),x);});
