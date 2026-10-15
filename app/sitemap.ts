export const dynamic = 'force-dynamic';
import type { MetadataRoute } from 'next';
import { liveData } from '../lib/portfolio-store';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://shanmukhdatta.github.io').replace(
    /\/$/,
    '',
  );
  const { projects, research, articles } = await liveData();
  return [
    { url: base + '/', changeFrequency: 'monthly', priority: 1 },
    { url: base + '/projects/', changeFrequency: 'weekly', priority: 0.9 },
    { url: base + '/research/', changeFrequency: 'monthly', priority: 0.8 },
    { url: base + '/writing/', priority: 0.6 },
    ...research
      .filter((r) => !r.demo)
      .map((r) => ({ url: base + '/research/' + r.slug + '/', priority: 0.7 })),
    ...articles
      .filter((a) => !a.demo)
      .map((a) => ({ url: base + '/writing/' + a.slug + '/', priority: 0.5 })),
    ...projects.map((p) => ({
      url: base + '/projects/' + p.slug + '/',
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
