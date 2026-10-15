'use client';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  PenTool,
  RotateCcw,
} from 'lucide-react';

type Photo = { title: string; place: string; src: string; year?: string };
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    if (
      paused ||
      photos.length < 2 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const id = window.setInterval(() => setIndex((x) => (x + 1) % photos.length), 3500);
    return () => clearInterval(id);
  }, [paused, photos.length]);
  if (!photos.length)
    return (
      <div className="photo-gallery-fallback" aria-label="Gallery assets not published yet">
        <ImageIcon size={25} />
        <p>Field notes are taking shape.</p>
        <small>
          Original photographs will appear here when published through the private Control Center.
        </small>
      </div>
    );
  const current = photos[index % photos.length];
  return (
    <div
      className="photo-gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img src={current.src} alt={`${current.title}, ${current.place}`} loading="lazy" />
      <div className="photo-caption">
        <span>
          {current.title} · {current.place}
          {current.year ? ' · ' + current.year : ''}
        </span>
        <div>
          <button
            onClick={() => setIndex((x) => (x - 1 + photos.length) % photos.length)}
            aria-label="Previous photograph"
          >
            <ChevronLeft size={18} />
          </button>
          <small>
            {index + 1} / {photos.length}
          </small>
          <button
            onClick={() => setIndex((x) => (x + 1) % photos.length)}
            aria-label="Next photograph"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
export function SignalCursor() {
  const dot = useRef<HTMLDivElement>(null),
    ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine) and (prefers-reduced-motion: no-preference)').matches)
      return;
    let raf = 0,
      px = 0,
      py = 0,
      target: Element | null = null;
    function move(e: PointerEvent) {
      px = e.clientX;
      py = e.clientY;
      target =
        e.target instanceof Element
          ? e.target.closest('[data-cursor],button,a,[role=button],input')
          : null;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        if (dot.current && ring.current) {
          dot.current.style.transform = `translate3d(${px}px,${py}px,0)`;
          ring.current.style.transform = `translate3d(${px}px,${py}px,0)`;
          ring.current.dataset.active = target ? 'yes' : 'no';
          ring.current.dataset.label =
            target?.getAttribute('data-cursor') ||
            (target?.tagName === 'INPUT'
              ? 'Type'
              : target?.tagName === 'A'
                ? 'View'
                : target
                  ? 'Open'
                  : '');
        }
        raf = 0;
      });
    }
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="signal-dot" aria-hidden="true" />
      <div ref={ring} className="signal-cursor" aria-hidden="true" />
    </>
  );
}
export function SignalSound() {
  const [enabled, setEnabled] = useState(false);
  const ctx = useRef<AudioContext | null>(null);
  useEffect(() => {
    try {
      setEnabled(localStorage.getItem('shanx-sound') === 'on');
    } catch {}
  }, []);
  useEffect(() => {
    if (!enabled) return;
    function click(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest('button,.light,.milestone-sign')) return;
      try {
        ctx.current ??= new AudioContext();
        const context = ctx.current;
        const osc = context.createOscillator(),
          gain = context.createGain();
        osc.frequency.setValueAtTime(520, context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(360, context.currentTime + 0.055);
        gain.gain.setValueAtTime(0.016, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.085);
        osc.connect(gain).connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + 0.085);
      } catch {}
    }
    document.addEventListener('pointerup', click);
    return () => document.removeEventListener('pointerup', click);
  }, [enabled]);
  return (
    <button
      className="sound-toggle"
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable interface sounds' : 'Enable interface sounds'}
      onClick={() => {
        const next = !enabled;
        setEnabled(next);
        try {
          localStorage.setItem('shanx-sound', next ? 'on' : 'off');
        } catch {}
      }}
    >
      {enabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
      <span>{enabled ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
export function RoadScene() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    function update() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = document.getElementById('journey');
        if (el) {
          const r = el.getBoundingClientRect(),
            ratio = (window.innerHeight - r.top) / (r.height + window.innerHeight);
          setProgress(Math.max(0, Math.min(1, ratio)));
        }
        raf = 0;
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(raf);
    };
  }, []);
  const [scooter, setScooter] = useState({ x: 50, y: 15 });
  useEffect(() => {
    const path = document.querySelector<SVGPathElement>('.road-asphalt');
    if (path?.getPointAtLength) {
      const p = path.getPointAtLength(path.getTotalLength() * (0.1 + progress * 0.8));
      setScooter({ x: p.x / 10, y: p.y / 12 });
    }
  }, [progress]);
  return (
    <div
      className="road-scene"
      aria-hidden="true"
      data-day={progress < 0.35 ? 'dawn' : progress < 0.65 ? 'afternoon' : 'dusk'}
    >
      <div className="road-sun" />
      <div className="road-cloud cloud-a" />
      <div className="road-cloud cloud-b" />
      <div className="road-scooter" style={{ top: `${scooter.y}%`, left: `${scooter.x}%` }}>
        <span className="scooter-body">◉―◉</span>
        <span className="scooter-light" />
      </div>
      <div className="road-km">KM {Math.round(progress * 100)} / 100</div>
    </div>
  );
}
export function ChalkCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const drawing = useRef(false),
    last = useRef<{ x: number; y: number } | null>(null),
    timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const r = c.getBoundingClientRect();
      c.width = Math.round(r.width * devicePixelRatio);
      c.height = Math.round(r.height * devicePixelRatio);
      const context = c.getContext('2d');
      if (context) context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !active) return;
    const p = point(e),
      cx = canvas.current?.getContext('2d');
    if (cx && last.current) {
      cx.strokeStyle = 'rgba(247,247,217,.88)';
      cx.lineWidth = 2.6;
      cx.lineCap = 'round';
      cx.beginPath();
      cx.moveTo(last.current.x, last.current.y);
      cx.lineTo(p.x, p.y);
      cx.stroke();
    }
    last.current = p;
  };
  const erase = () => {
    const c = canvas.current;
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height);
  };
  return (
    <div className="chalk-painter">
      <canvas
        className={active ? 'chalk-draw-on' : ''}
        aria-label="Freehand chalk drawing area"
        ref={canvas}
        onPointerDown={(e) => {
          if (!active) return;
          drawing.current = true;
          last.current = point(e);
          e.currentTarget.setPointerCapture(e.pointerId);
          if (timeout.current) clearTimeout(timeout.current);
        }}
        onPointerCancel={() => {
          drawing.current = false;
          last.current = null;
        }}
        onPointerMove={onMove}
        onPointerUp={() => {
          drawing.current = false;
          last.current = null;
          if (timeout.current) clearTimeout(timeout.current);
          timeout.current = setTimeout(erase, 9000);
        }}
      />
      <div className="chalk-actions">
        <button className="chalk-tool" aria-pressed={active} onClick={() => setActive((x) => !x)}>
          <PenTool size={15} />
          {active ? 'Stop drawing' : 'Try the chalk'}
        </button>
        {active && (
          <button className="chalk-tool" onClick={erase}>
            <RotateCcw size={15} /> Erase
          </button>
        )}
      </div>
    </div>
  );
}
