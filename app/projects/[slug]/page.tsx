import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectVisual } from '../../../components/ProjectVisual';
import { getProject, projects } from '../../../content/projects';

export function generateStaticParams() {return projects.map(p => ({slug:p.slug}));}
export function generateMetadata({params}: {params: Promise<{slug:string}>}): Promise<Metadata> {
  return params.then(({slug})=>{const p=getProject(slug);return p?{title:p.name,description:p.summary}:{title:'Project not found'};});
}
export default async function ProjectCase({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const p=getProject(slug);if(!p) notFound();
 const sibling=(p.related||[]).map(getProject).filter((x)=>Boolean(x));
 return <main id="content" className="case-page"><div className="case-shell"><nav className="case-top" aria-label="Breadcrumb"><Link href="/" className="wordmark">shan<span>X</span>AI</Link><Link href="/projects/">← All projects</Link></nav>
 <div className="case-hero"><div><p className="eyebrow">{p.eyebrow}</p><div className="pill-row"><span className="pill amber">{p.stage}</span><span className="pill">{p.category}</span></div><h1>{p.name}</h1><p className="case-lead">{p.summary}</p><div className="pill-row">{p.tags.map(t=><span className="pill" key={t}>{t}</span>)}</div><div className="case-actions">{p.repo&&<a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">View source ↗</a>}{p.demo&&<a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn">Open demo ↗</a>}</div></div><ProjectVisual project={p}/></div>
 <div className="case-grid"><article className="case-main"><section><p className="eyebrow">01 / The problem</p><h2>Why this exists</h2><p>{p.problem}</p></section><section><p className="eyebrow">02 / The approach</p><h2>Architecture & decisions</h2><p>{p.approach}</p></section><section><p className="eyebrow">03 / What is verified</p><h2>Evidence & limitations</h2><p>{p.evidence}</p></section><section><p className="eyebrow">04 / What is next</p><h2>Roadmap</h2><p>{p.next}</p></section></article><aside className="case-aside"><span className="eyebrow">PROJECT RECORD</span><dl><dt>Current stage</dt><dd>{p.stage}</dd><dt>Track</dt><dd>{p.category}</dd><dt>Evidence</dt><dd>{p.repo?'Public repository':'Design note; no public repo linked'}</dd></dl><p className="small-note">Descriptions distinguish shipped code, experimental work, proposals and unverified integrations.</p></aside></div>
 {sibling.length>0&&<section className="related"><p className="eyebrow">CONNECTED IDEAS</p><h2>Related work</h2><div className="related-grid">{sibling.map(s=><Link className="related-link" href={`/projects/${s!.slug}/`} key={s!.slug}><span>{s!.category}</span><strong>{s!.name}</strong><span>Explore ↗</span></Link>)}</div></section>}
 <footer className="case-footer"><Link href="/projects/">← Project library</Link><Link href="/">Back home ↑</Link></footer></div></main>;
}
