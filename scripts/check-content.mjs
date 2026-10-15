import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'content/projects.ts'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'content/catalog.ts'), 'utf8');
const site = fs.readFileSync(path.join(root, 'content/site.ts'), 'utf8');
const files = [];
const scan = (folder) => {
  for (const dirent of fs.readdirSync(folder, { withFileTypes: true })) {
    if (['node_modules', '.next', 'out', '.git'].includes(dirent.name)) continue;
    const loc = path.join(folder, dirent.name);
    if (dirent.isDirectory()) scan(loc);
    else if (/\.(?:tsx?|mjs|json|md|html|css)$/.test(dirent.name)) files.push(loc);
  }
};
scan(root);
const projectSlugs = [...source.matchAll(/\bslug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]);
assert.ok(projectSlugs.length >= 28, 'Expected a comprehensive set of curated project records');
assert.equal(new Set(projectSlugs).size, projectSlugs.length, 'Duplicate project slug');
const categoryNames = [
  'Research',
  'AI Products',
  'Agents & Infrastructure',
  'Cybersecurity',
  'Healthcare',
  'Applied Engineering',
  'Explorations',
];
for (const item of projectSlugs) assert.match(item, /^[a-z0-9-]+$/);
for (const name of [
  'Soochana AI',
  'RiskPulse AI',
  'ChronoMind AI',
  'Voice Doctor AI',
  'Facial Skin Disease Research',
  'DermaLens AI',
  'CLARION',
  'No Hack',
  'GURU',
  'BUJJI',
  'QTagger+',
  'Kaggle GPU MCP',
])
  assert.ok(source.includes(name), `Missing key work: ${name}`);
const referenceNames = [...catalog.matchAll(/'([A-Za-z0-9-]+)'/g)].map((m) => m[1]);
const countGroups = [...catalog.matchAll(/repos:\s*\[([\s\S]*?)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]),
);
assert.equal(
  countGroups.length,
  71,
  'Repository directory count differs from audited public snapshot',
);
assert.equal(new Set(countGroups).size, countGroups.length, 'Duplicate repo directory item');
// Disallow academic score fields in any shipped source/content/build, without embedding them in site copy.
const forbidden = [
  String.fromCharCode(99, 103, 112, 97),
  String.fromCharCode(103, 112, 97),
  'grade' + ' point average',
  'academic' + ' percentage',
];
for (const f of files) {
  // Reviewed allowlist: npm lockfile integrity hashes are dependency metadata, not public editorial content.
  if (path.basename(f) === 'package-lock.json') continue;
  // Reviewed technical allowlist: the DOM SVG path type is not an academic statistic.
  const body = fs.readFileSync(f, 'utf8').toLowerCase().replaceAll('svgpathelement', '');
  for (const word of forbidden)
    assert.ok(!body.includes(word), `Academic score field detected in ${path.relative(root, f)}`);
}
for (const value of ['[ADD EMAIL]', '[ADD PHOTO]', '[ADD DESCRIPTION]'])
  assert.ok(
    !site.includes(value) && !source.includes(value),
    `Unresolved content placeholder: ${value}`,
  );
const privateNames = [
  'nextjs-commerce',
  'TPO-NITJ',
  'dravidian-alignment-private',
  'facial-skin-disease-synthetic-generation',
  'Scalp-Disease-Detection-System-data',
];
for (const name of privateNames) {
  assert.ok(!catalog.includes(`'${name}'`), `Private repository in public directory: ${name}`);
}
for (const slug of projectSlugs) assert.ok(!slug.includes(' '));
console.log(
  `Content checks passed: ${projectSlugs.length} case-study records, ${countGroups.length} public repository links, ${files.length} source files, no private repository entries or academic scores.`,
);
