import { projects } from './projects';
import { skills } from './site';
export type Article = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  date: string;
  status: 'draft' | 'published';
  demo: boolean;
  tags: string[];
};
export type Study = {
  slug: string;
  project: string;
  title: string;
  abstract: string;
  method: string;
  datasets: string[];
  collaborators: string[];
  publication: string;
  reproducibility: string;
  limitations: string;
  figures: { src: string; caption: string; source: string }[];
  sources: { label: string; url: string }[];
  status: 'draft' | 'published';
  demo: boolean;
};
export type SkillLink = {
  skill: string;
  state: 'Used in project' | 'Learning' | 'Exploring';
  projects: string[];
};
export type Knowledge = {
  id: string;
  question: string;
  answer: string;
  projects: string[];
  status: 'draft' | 'published';
};
export const articles: Article[] = [
  {
    slug: 'demo-evaluation-notebook',
    title: 'Demo note: from a question to an experiment',
    summary: 'A sample research notebook layout. Fictional example for interface testing.',
    body: 'Start with a testable question\n\nThis is demonstration writing, not a report of completed research. Define the behavior you want to measure before choosing a model.\n\nRecord the setup\n\nFor this fictional example, describe the data source, split policy, baseline and random seeds. Keep assumptions visible.\n\nInspect the limitations\n\nA result only applies to the conditions tested. A reproducible notebook should explain both what it supports and what it leaves unknown.',
    date: '2026-10-15',
    status: 'published',
    demo: true,
    tags: ['Demo', 'Evaluation', 'Reproducibility'],
  },
];
export const research: Study[] = projects
  .filter((p) => p.research)
  .map((p) => ({
    slug: p.slug,
    project: p.slug,
    title: p.name,
    abstract: p.summary,
    method: p.approach,
    datasets: [
      'See the linked source for dataset versions and access terms; not independently verified here.',
    ],
    collaborators: [],
    publication: 'Research/prototype record; no publication acceptance asserted.',
    reproducibility: p.next,
    limitations: p.evidence,
    figures: [],
    sources: p.repo ? [{ label: 'Project source and methodology', url: p.repo }] : [],
    status: 'published',
    demo: false,
  }));
export const seo = {
  title: 'Shanmukh Datta — AI Research & Engineering',
  description: 'Research that can be examined. Systems that can be used. Ideas that keep moving.',
  image: '/opengraph-image',
  redirects: [] as { from: string; to: string; permanent: boolean }[],
};
export const intro = {
  enabled: true,
  durationMs: 2150,
  greetings: ['Namaste', 'Hello', 'Hola', 'నమస్తే', 'வணக்கம்', 'ನಮಸ್ಕಾರ'],
  firstLine: 'Stop Thinking.',
  secondLine: 'Start Doing.',
};
export const knowledge: Knowledge[] = [
  {
    id: 'evidence-policy',
    question: 'How are project stages verified?',
    answer:
      'Every project record distinguishes research, prototypes, architecture and implementation. A repository description is not independent proof of deployment.',
    projects: [],
    status: 'published',
  },
];
export const skillLinks: SkillLink[] = Object.values(skills)
  .flat()
  .map((skill) => {
    const matches = projects
      .filter((p) => p.tags.some((t) => t.toLowerCase() === skill.toLowerCase()))
      .map((p) => p.slug);
    return { skill, state: matches.length ? 'Used in project' : 'Exploring', projects: matches };
  });
export const editorial = { articles, research, seo, intro, knowledge, skillLinks };
