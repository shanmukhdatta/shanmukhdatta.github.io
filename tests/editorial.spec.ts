// @vitest-environment node
import { it, expect, vi, beforeEach } from 'vitest';
vi.mock('server-only', () => ({}));
const state = vi.hoisted(() => ({ docs: {} as Record<string, unknown> }));
vi.mock('../lib/db', () => ({ publishedDocuments: async () => state.docs }));
import { liveData } from '../lib/portfolio-store';
import { validateDocument } from '../lib/validate';
import { editorial } from '../content/editorial';
import { projects } from '../content/projects';
import { topicConnections, assertPublicRelations } from '../lib/relations';
import { privateRegister } from '../lib/editorial-register';
beforeEach(() => {
  state.docs = {};
});
it('validates all new editable document families', () => {
  for (const [key, value] of Object.entries(editorial))
    expect(() => validateDocument(key, value)).not.toThrow();
  expect(() => validateDocument('register', privateRegister)).not.toThrow();
  expect(privateRegister).toHaveLength(76);
});
it('never projects drafts or the private editorial register into public content', async () => {
  state.docs = {
    articles: [
      { ...editorial.articles[0], slug: 'private-draft', status: 'draft', body: 'DRAFT_SENTINEL' },
      { ...editorial.articles[0], slug: 'public-note' },
    ],
    knowledge: [
      {
        id: 'private-fact',
        question: 'private',
        answer: 'PRIVATE_KNOWLEDGE_SENTINEL',
        projects: [],
        status: 'draft',
      },
    ],
    register: [{ secret: 'REGISTER_SENTINEL' }],
  };
  const data = await liveData(),
    json = JSON.stringify(data);
  expect(data.articles.map((a) => a.slug)).toEqual(['public-note']);
  expect(json).not.toMatch(/DRAFT_SENTINEL|PRIVATE_KNOWLEDGE_SENTINEL|REGISTER_SENTINEL/);
});
it('rejects redirect cycles, off-site destinations and duplicate paths', () => {
  for (const redirects of [
    [
      { from: '/a', to: '/b', permanent: true },
      { from: '/b', to: '/a', permanent: true },
    ],
    [{ from: '/a', to: 'https://evil.test', permanent: false }],
    [
      { from: '/a', to: '/b', permanent: true },
      { from: '/a', to: '/c', permanent: true },
    ],
  ])
    expect(() => validateDocument('seo', { ...editorial.seo, redirects })).toThrow();
});
it('rejects malformed articles, study figures, skill states and long intro barriers', () => {
  expect(() => validateDocument('articles', [{ title: 'missing' }])).toThrow();
  expect(() => validateDocument('intro', { ...editorial.intro, durationMs: 8000 })).toThrow();
  expect(() =>
    validateDocument('skillLinks', [{ skill: 'Python', state: '100%', projects: [] }]),
  ).toThrow();
  expect(() =>
    validateDocument('research', [
      {
        ...editorial.research[0],
        figures: [{ src: 'javascript:alert(1)', caption: 'fake', source: 'fake' }],
      },
    ]),
  ).toThrow();
});
it('derives semantic board edges from real project relations and shared technologies', () => {
  const topics = [{ project: 'qtagger-plus' }, { project: 'no-hack' }];
  expect(topicConnections(topics, projects)).toContainEqual({ from: 0, to: 1 });
});
it('rejects orphan project links on publication', async () => {
  const data = await liveData();
  expect(() =>
    assertPublicRelations({
      ...data,
      research: [{ ...editorial.research[0], project: 'missing' }],
    }),
  ).toThrow(/missing/);
});

it('rejects slash-normalized redirect loops', () => {
  expect(() =>
    validateDocument('seo', {
      ...editorial.seo,
      redirects: [
        { from: '/a/', to: '/b', permanent: true },
        { from: '/b/', to: '/a', permanent: true },
      ],
    }),
  ).toThrow();
});
