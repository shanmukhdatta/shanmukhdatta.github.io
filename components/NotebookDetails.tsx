'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import type { WorkItem } from '@/content/work';

export function NotebookPage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.05 });
    ref.current?.querySelectorAll('.paper-section,.blackboard,.about-subsection').forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [reduced]);
  return <div ref={ref}>{children}</div>;
}

export function NotebookSketch({ research = false }: { research?: boolean }) {
  return <svg className="notebook-sketch" viewBox="0 0 230 150" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 22 93 18 95 57 24 59Z M137 83 209 80 211 123 135 126Z M94 37C147 24 177 40 175 78 M135 106C78 127 59 104 60 63" />
      <path d="m168 70 7 10 9-10 M52 72l8-11 8 10 M196 20v16 M188 28h16 M18 114l9 10-9 10 M18 124H8" />
    </g>
    <text x="59" y="43" textAnchor="middle">{research ? 'question' : 'idea'}</text>
    <text x="173" y="108" textAnchor="middle">{research ? 'evidence' : 'build'}</text>
    <text x="90" y="146" textAnchor="middle" className="sketch-note">{research ? 'test. learn. repeat.' : 'make it useful.'}</text>
  </svg>;
}

export function FeaturedWorkbench({ items, onSelect, viewAll }: { items: WorkItem[]; onSelect: (item: WorkItem) => void; viewAll: () => void }) {
  const reduced = useReducedMotion();
  const project = items.find(item => item.featured && item.category === 'projects') ?? items.find(item => item.featured);
  const research = items.find(item => item.category === 'research');
  const featured = [project, research].filter((item): item is WorkItem => Boolean(item));
  if (!featured.length) return null;
  return <section className="workbench paper-section notebook-grid" id="workbench" aria-labelledby="workbench-heading">
    <div className="section-heading"><div><span className="eyebrow">02 / IDEAS IN PRACTICE</span><h2 id="workbench-heading">From the <span className="ink-highlight">workbench.</span></h2></div><span className="scribble">ideas, with the sleeves rolled up ↙</span></div>
    <div className="featured-grid">{featured.map((item, i) => <motion.button type="button" key={item.id}
      className={`featured-paper featured-${i}`} onClick={() => onSelect(item)} aria-label={`Open notebook for ${item.name}`}
      whileHover={reduced ? undefined : { y: -7, rotate: i ? 1 : -1 }} whileTap={reduced ? undefined : { scale: 0.99 }} transition={{ type: 'spring', stiffness: 250, damping: 23 }}>
      <span className="paper-pin" aria-hidden="true" /><span className="eyebrow">{item.category} / {String(i + 1).padStart(2, '0')}</span>
      <div className="featured-copy"><h3>{item.name}</h3><span className="paper-tag">{item.status}</span><p>{item.summary}</p><span className="paper-open">OPEN NOTES <span aria-hidden="true">↗</span></span></div>
      <NotebookSketch research={item.category === 'research'} />
    </motion.button>)}</div>
    <button type="button" className="text-action" onClick={viewAll}>Explore all projects & research <span aria-hidden="true">↗</span></button>
  </section>;
}
