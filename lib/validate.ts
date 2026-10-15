// Validate every browser-visible field before drafts can become public content.
export const documentKeys = [
  'site',
  'milestones',
  'mindTopics',
  'skills',
  'projects',
  'articles',
  'research',
  'seo',
  'knowledge',
  'intro',
  'skillLinks',
  'register',
] as const;
export type DocumentKey = (typeof documentKeys)[number];
export function isDocumentKey(k: string): k is DocumentKey {
  return documentKeys.includes(k as DocumentKey);
}
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected an object');
  return value as Record<string, unknown>;
}
function slug(value: unknown) {
  if (typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value))
    throw new Error('Invalid slug');
}
function text(value: unknown, label: string) {
  if (typeof value !== 'string' || !value.trim() || value.length > 16000)
    throw new Error('Invalid ' + label);
}
function list(value: unknown, label: string, max = 180): unknown[] {
  if (!Array.isArray(value) || value.length > max) throw new Error('Invalid ' + label);
  return value;
}
function strings(value: unknown, label: string) {
  for (const x of list(value, label)) text(x, label);
}
function url(value: unknown, label: string, local = false) {
  if (
    local &&
    typeof value === 'string' &&
    /^\/(?!\/)[a-zA-Z0-9/_-]+\.(?:pdf|png|jpg|jpeg|webp)$/.test(value)
  )
    return;
  if (typeof value !== 'string') throw new Error('Invalid ' + label);
  try {
    const u = new URL(value);
    if (u.protocol !== 'https:' || u.username || u.password) throw new Error();
  } catch {
    throw new Error(label + ' must be an absolute HTTPS URL');
  }
}
const stages = [
  'Research',
  'Prototype',
  'In development',
  'Architecture',
  'Open source',
  'Demo',
  'Experiment',
];
const tracks = [
  'Research',
  'AI Products',
  'Agents & Infrastructure',
  'Cybersecurity',
  'Healthcare',
  'Applied Engineering',
  'Explorations',
];
export function validateDocument(key: string, value: unknown) {
  if (!isDocumentKey(key)) throw new Error('Unknown document');
  const raw = JSON.stringify(value);
  if (!raw || raw.length > 320_000) throw new Error('Document too large');
  if (
    new RegExp(
      [
        ['c', 'g', 'p', 'a'].join(''),
        '\\b' + ['g', 'p', 'a'].join('') + '\\b',
        'grade.point',
        'grade-point',
        'academic.score',
      ].join('|'),
      'i',
    ).test(raw)
  )
    throw new Error('Academic scores are excluded from this portfolio');
  if (/javascript:|data:text\/html|<script|onerror\s*=|onload\s*=/i.test(raw))
    throw new Error('Unsafe markup or URL');
  if (key === 'projects') {
    const projects = list(value, 'projects');
    if (!projects.length) throw new Error('Keep at least one public project');
    const slugs = new Set<string>();
    for (const item of projects) {
      const p = record(item);
      if (
        typeof p.slug !== 'string' ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) ||
        slugs.has(p.slug)
      )
        throw new Error('Invalid or duplicate project slug');
      slugs.add(p.slug);
      for (const field of ['name', 'eyebrow', 'summary', 'problem', 'approach', 'evidence', 'next'])
        text(p[field], field);
      if (!stages.includes(String(p.stage)) || !tracks.includes(String(p.category)))
        throw new Error('Invalid project stage or track');
      strings(p.tags, 'tags');
      for (const field of ['features', 'related'])
        if (p[field] !== undefined) strings(p[field], field);
      for (const field of ['repo', 'demo', 'paper'])
        if (p[field] != null && p[field] !== '') url(p[field], field);
      if (p.screenshots !== undefined)
        for (const src of list(p.screenshots, 'screenshots', 30)) url(src, 'Screenshot', true);
      for (const field of ['featured', 'research'])
        if (p[field] !== undefined && typeof p[field] !== 'boolean')
          throw new Error('Invalid ' + field);
      if (p.metrics !== undefined)
        for (const m of list(p.metrics, 'metrics', 20)) {
          const metric = record(m);
          text(metric.label, 'metric label');
          text(metric.value, 'metric value');
          for (const field of ['source', 'dataset', 'version', 'setup'])
            text(metric[field], 'metric ' + field);
        }
    }
    for (const item of projects) {
      const p = record(item);
      for (const slug of (p.related || []) as string[])
        if (!slugs.has(slug)) throw new Error('Related project does not exist: ' + slug);
    }
  }
  if (key === 'site') {
    const profile = record(value);
    for (const field of [
      'name',
      'shortName',
      'brand',
      'headline',
      'tagline',
      'description',
      'institute',
      'program',
      'location',
      'email',
      'availability',
      'quote',
      'aboutTitle',
      'aboutIntro',
      'aboutDetail',
      'currentlyExploring',
    ])
      text(profile[field], field);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(profile.email))) throw new Error('Invalid email');
    const links = record(profile.links);
    for (const field of ['github', 'linkedin']) url(links[field], field);
    for (const field of ['scholar', 'resume'])
      if (links[field] != null) url(links[field], field, field === 'resume');
    if (typeof profile.signalAccent !== 'boolean') throw new Error('Invalid signal setting');
    for (const item of list(profile.gallery, 'gallery', 50)) {
      const photo = record(item);
      url(photo.src, 'Gallery image', true);
      text(photo.title, 'Photo title');
      text(photo.place, 'Photo place');
    }
  }
  if (key === 'milestones')
    for (const item of list(value, 'journey', 100)) {
      const m = record(item);
      for (const field of ['date', 'label', 'type', 'note']) text(m[field], field);
      if (m.proof) url(m.proof, 'Milestone proof');
      if (m.evidence) {
        const e = record(m.evidence);
        url(e.url, 'Milestone source');
        text(e.label, 'Source label');
        text(e.verification, 'Verification status');
      }
    }
  if (key === 'mindTopics') {
    const topics = list(value, 'mind topics', 80);
    if (!topics.length) throw new Error('Keep at least one mind topic');
    for (const item of topics) {
      const t = record(item);
      for (const field of ['title', 'chain', 'project', 'detail']) text(t[field], field);
    }
  }
  if (key === 'skills')
    for (const [group, items] of Object.entries(record(value))) {
      text(group, 'skill group');
      strings(items, 'skills');
    }
  if (key === 'articles') {
    const slugs = new Set<string>();
    for (const x of list(value, 'articles')) {
      const a = record(x);
      slug(a.slug);
      if (slugs.has(String(a.slug))) throw new Error('Duplicate article');
      slugs.add(String(a.slug));
      for (const f of ['title', 'summary', 'body', 'date']) text(a[f], f);
      strings(a.tags, 'tags');
      if (!['draft', 'published'].includes(String(a.status)) || typeof a.demo !== 'boolean')
        throw new Error('Invalid article status');
    }
  }
  if (key === 'research')
    for (const x of list(value, 'studies')) {
      const r = record(x);
      slug(r.slug);
      slug(r.project);
      for (const f of [
        'title',
        'abstract',
        'method',
        'publication',
        'reproducibility',
        'limitations',
      ])
        text(r[f], f);
      strings(r.datasets, 'datasets');
      strings(r.collaborators, 'collaborators');
      if (!['draft', 'published'].includes(String(r.status)) || typeof r.demo !== 'boolean')
        throw new Error('Invalid study status');
      for (const f of list(r.figures, 'figures', 30)) {
        const fig = record(f);
        url(fig.src, 'figure', true);
        text(fig.caption, 'caption');
        text(fig.source, 'source');
      }
      for (const x of list(r.sources, 'sources', 30)) {
        const source = record(x);
        text(source.label, 'source label');
        url(source.url, 'Source');
      }
    }
  if (key === 'seo') {
    const x = record(value);
    text(x.title, 'SEO title');
    text(x.description, 'SEO description');
    if (x.image !== '/opengraph-image') url(x.image, 'OpenGraph image', true);
    const seen = new Set();
    for (const r of list(x.redirects, 'redirects', 50)) {
      const rule = record(r);
      for (const k of ['from', 'to'])
        if (typeof rule[k] !== 'string' || !/^\/(?!\/)[a-z0-9/_-]*$/.test(rule[k] as string))
          throw new Error('Redirects must be local paths');
      if (rule.from === rule.to || seen.has(rule.from))
        throw new Error('Duplicate or self redirect');
      seen.add(rule.from);
      if (typeof rule.permanent !== 'boolean') throw new Error('Invalid redirect');
    }
    const rules = x.redirects as { from: string; to: string }[];
    for (const r of rules) {
      const seenPath = new Set([r.from]);
      let to = r.to;
      while (rules.some((t) => t.from === to)) {
        if (seenPath.has(to)) throw new Error('Redirect cycle');
        seenPath.add(to);
        to = rules.find((t) => t.from === to)!.to;
      }
    }
  }
  if (key === 'intro') {
    const x = record(value);
    if (
      typeof x.enabled !== 'boolean' ||
      typeof x.durationMs !== 'number' ||
      x.durationMs < 1000 ||
      x.durationMs > 3000
    )
      throw new Error('Intro duration must be 1–3 seconds');
    strings(x.greetings, 'greetings');
    if (!(x.greetings as unknown[]).length) throw new Error('Greetings required');
    text(x.firstLine, 'intro text');
    text(x.secondLine, 'intro text');
  }
  if (key === 'knowledge')
    for (const k of list(value, 'knowledge')) {
      const x = record(k);
      slug(x.id);
      text(x.question, 'question');
      text(x.answer, 'answer');
      strings(x.projects, 'projects');
      if (!['draft', 'published'].includes(String(x.status)))
        throw new Error('Invalid knowledge state');
    }
  if (key === 'skillLinks')
    for (const k of list(value, 'skill links')) {
      const x = record(k);
      text(x.skill, 'skill');
      strings(x.projects, 'proof projects');
      if (!['Used in project', 'Learning', 'Exploring'].includes(String(x.state)))
        throw new Error('Invalid skill state');
    }
  if (key === 'register')
    for (const k of list(value, 'editorial register', 200)) {
      const x = record(k);
      text(x.id, 'id');
      for (const f of [
        'visibility',
        'sourceProvenance',
        'ownershipRole',
        'projectFamily',
        'stage',
        'evidence',
        'publicationPermission',
        'lastVerifiedAt',
        'publicPlacement',
      ])
        text(x[f], f);
    }
  return value;
}
