import Link from 'next/link';
import { notFound } from 'next/navigation';
import { liveData } from '../../../lib/portfolio-store';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = (await liveData()).articles.find((a) => a.slug === slug);
  return a
    ? { title: a.title, description: a.summary, robots: { index: !a.demo, follow: true } }
    : {};
}
export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = (await liveData()).articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <main id="content" className="case-shell writing-note">
      <nav className="case-top">
        <Link href="/writing/">← Writing & Notes</Link>
      </nav>
      <p className="eyebrow">
        {a.demo ? 'DEMO ARTICLE / FICTIONAL EXAMPLE' : 'FIELD NOTE'} · {a.date}
      </p>
      <h1>{a.title}</h1>
      <p className="case-lead">{a.summary}</p>
      {a.body.split('\n\n').map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </main>
  );
}
