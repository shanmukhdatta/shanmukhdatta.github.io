import type { Metadata } from 'next';
import Link from 'next/link';
import { liveData } from '../../lib/portfolio-store';
export const metadata: Metadata = {
  title: 'Research Lab',
  description: 'Research questions, methods, evidence, and limitations.',
};
export const dynamic = 'force-dynamic';
export default async function ResearchIndex() {
  const { projects } = await liveData();
  const research = projects.filter((x) => x.research);
  return (
    <main id="content" className="archive-page">
      <nav className="archive-top">
        <Link href="/" className="wordmark">
          shan<span>X</span>AI
        </Link>
        <Link href="/">← Home</Link>
      </nav>
      <header className="archive-header">
        <p className="eyebrow">THE RESEARCH LAB / INDEX</p>
        <h1>Questions worth testing.</h1>
        <p>Read methods, evidence and limitations—not only the headline.</p>
      </header>
      <div className="archive-items">
        {research.map((p, i) => (
          <Link href={`/research/${p.slug}/`} className="archive-item" key={p.slug}>
            <span className="mono minor">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <strong>{p.name}</strong>
              <p>{p.summary}</p>
            </div>
            <span className="pill">{p.stage}</span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
