import Link from 'next/link';
import { notFound } from 'next/navigation';
import { liveData } from '../../../lib/portfolio-store';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = (await liveData()).research.find((x) => x.slug === slug);
  return r
    ? {
        title: r.title + ' — Study',
        description: r.abstract,
        alternates: { canonical: '/research/' + r.slug + '/' },
        robots: { index: !r.demo },
      }
    : {};
}
export default async function Study({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await liveData(),
    r = data.research.find((x) => x.slug === slug);
  if (!r) notFound();
  const project = data.projects.find((p) => p.slug === r.project);
  return (
    <main id="content" className="case-shell research-study">
      <nav className="case-top">
        <Link href="/research/">← Research Lab</Link>
        <Link href="/">Portfolio</Link>
      </nav>
      <p className="eyebrow">
        {r.demo ? 'DEMO STUDY' : 'RESEARCH RECORD'} / {r.publication}
      </p>
      <h1>{r.title}</h1>
      <p className="case-lead">{r.abstract}</p>
      <div className="case-grid">
        <article className="case-main">
          {[
            ['Method', r.method],
            ['Datasets', r.datasets.join('\n')],
            ['Evidence & limitations', r.limitations],
            ['Reproducibility', r.reproducibility],
            [
              'Collaborators',
              r.collaborators.join(', ') ||
                'Attribution is documented in the linked source. No additional collaborator claims are made here.',
            ],
          ].map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
          {r.figures.map((f, i) => (
            <figure key={f.src}>
              <img src={f.src} alt={f.caption} loading="lazy" />
              <figcaption>
                Fig. {i + 1} · {f.caption} · Source: {f.source}
              </figcaption>
            </figure>
          ))}
        </article>
        <aside className="case-aside">
          <h2>Evidence</h2>
          {r.sources.map((s) => (
            <p key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label} ↗
              </a>
            </p>
          ))}
          {project && (
            <Link className="btn" href={`/projects/${project.slug}/`}>
              Engineering case study ↗
            </Link>
          )}
        </aside>
      </div>
    </main>
  );
}
