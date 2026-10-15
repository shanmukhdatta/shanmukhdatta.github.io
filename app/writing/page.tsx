import Link from 'next/link';
import { liveData } from '../../lib/portfolio-store';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Writing & Notes' };
export default async function Writing() {
  const { articles } = await liveData();
  return (
    <main id="content" className="archive-page">
      <nav className="case-top">
        <Link href="/">← Portfolio</Link>
      </nav>
      <header className="archive-header">
        <p className="eyebrow">WRITING & FIELD NOTES</p>
        <h1>Thinking in public.</h1>
        <p>Methods, decisions and lessons from building. Sample notes are explicitly labeled.</p>
      </header>
      {articles.length ? (
        articles.map((a) => (
          <Link className="archive-item" key={a.slug} href={`/writing/${a.slug}/`}>
            <span>{a.demo ? 'DEMO' : 'NOTE'}</span>
            <div>
              <h2>{a.title}</h2>
              <p>{a.summary}</p>
              <small>
                {a.date} · {a.tags.join(' · ')}
              </small>
            </div>
            <span>↗</span>
          </Link>
        ))
      ) : (
        <p>No public articles yet.</p>
      )}
    </main>
  );
}
