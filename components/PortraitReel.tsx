'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { travelPortraits } from '@/content/portraits';

export default function PortraitReel({ portrait }: { portrait: string }) {
  const photos = [{ src: portrait, place: 'Jaipur', caption: 'A page from my camera roll', alt: 'Shanmukh standing in front of an ornate building' }, ...travelPortraits];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const active = !paused && !hovered && !focused && visible && inView && reduced === false;
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === 'visible');
    update(); document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % photos.length), 6500);
    return () => window.clearInterval(timer);
  }, [active, photos.length]);
  // Warm only the next frame; avoid loading four large portraits during first paint.
  useEffect(() => {
    if (!inView) return;
    const next = new Image(); next.src = photos[(index + 1) % photos.length].src;
  // photos is rebuilt from the single CMS portrait prop.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, inView, portrait]);
  const photo = photos[index];
  const missing = failed.includes(photo.src);
  function change(direction: number) { setPaused(true); setIndex(i => (i + direction + photos.length) % photos.length); }
  return <div ref={ref} className="hero-portrait portrait-reel" role="region" aria-label="Portrait gallery" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <AnimatePresence initial={false}>
      <motion.img key={photo.src} src={missing ? portrait : photo.src} alt={missing ? photos[0].alt : photo.alt}
        onError={() => setFailed(items => items.includes(photo.src) ? items : [...items, photo.src])}
        className="hero-image content-image-fill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.85, ease: 'easeInOut' }} fetchPriority={index === 0 ? 'high' : 'auto'} decoding="async" />
    </AnimatePresence>
    <div className="portrait-stamp"><span className="stamp-star" aria-hidden="true">✳</span><span>A LITTLE<br/>PERSPECTIVE</span></div>
    <div className="portrait-caption" aria-live={paused || reduced ? 'polite' : 'off'}>
      <span className="scribble">{missing ? 'A page from my camera roll' : photo.place} ↗</span><span className="photo-number">{String(index + 1).padStart(2, '0')} / 05</span>
    </div>
    <div className="portrait-controls">
      <button type="button" onClick={() => change(-1)} aria-label="Previous portrait">←</button>
      <button type="button" onClick={() => setPaused(p => !p)} disabled={Boolean(reduced)} aria-label={reduced ? 'Automatic rotation disabled for reduced motion' : paused ? 'Play portrait rotation' : 'Pause portrait rotation'}>{reduced || paused ? '▶' : 'Ⅱ'}</button>
      <button type="button" onClick={() => change(1)} aria-label="Next portrait">→</button>
    </div>
  </div>;
}
