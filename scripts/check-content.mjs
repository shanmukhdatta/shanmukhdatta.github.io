import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const files = ['content/site.ts','content/work.ts','content/blogs.ts','docs/DESIGN_SPEC.md','public/images/shanmukh-hero.webp','public/images/shanmukh-gallery.webp','public/resume/Shanmukh_Datta_Resume.pdf'];
for (const file of files) {const p=path.join(root,file);if(!fs.existsSync(p)||fs.statSync(p).size===0)throw new Error(`Missing or empty: ${file}`);}
const text=fs.readFileSync(path.join(root,'content/work.ts'),'utf8');
if(/publicationStatus:\s*'published'/.test(text.replace(/\/\*[\s\S]*?\*\//g,'')))throw new Error('Published entries require review');
console.log('Content and asset presence checks passed. These checks do not validate runtime rendering.');
