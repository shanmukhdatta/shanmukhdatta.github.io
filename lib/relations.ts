import type { Project } from '../content/projects';
export function topicConnections(topics: { project: string }[], projects: Project[]) {
  const edges: { from: number; to: number }[] = [];
  for (let i = 0; i < topics.length; i++)
    for (let j = i + 1; j < topics.length; j++) {
      const a = projects.find((p) => p.slug === topics[i].project),
        b = projects.find((p) => p.slug === topics[j].project);
      if (
        a &&
        b &&
        (a.related?.includes(b.slug) ||
          b.related?.includes(a.slug) ||
          a.tags.some((tag) => b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())))
      )
        edges.push({ from: i, to: j });
    }
  return edges;
}
export function topicPoint(i: number) {
  return { x: 100 + (i % 3) * 200, y: 65 + Math.floor(i / 3) * 135 };
}

export function assertPublicRelations(data: {
  projects: Project[];
  research: { project: string }[];
  mindTopics: { project: string }[];
  skillLinks: { projects: string[] }[];
  knowledge: { projects: string[] }[];
}) {
  const slugs = new Set(data.projects.map((p) => p.slug));
  for (const record of [...data.research, ...data.mindTopics])
    if (!slugs.has(record.project))
      throw new Error('Referenced project is missing: ' + record.project);
  for (const record of [...data.skillLinks, ...data.knowledge])
    for (const slug of record.projects)
      if (!slugs.has(slug)) throw new Error('Referenced project is missing: ' + slug);
}
