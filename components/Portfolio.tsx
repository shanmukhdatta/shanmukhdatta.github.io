'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Command,
  ExternalLink,
  FileText,
  Github,
  Globe2,
  Mail,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Send,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import type { Project } from '../content/projects';
import { ProjectVisual } from './ProjectVisual';
import {
  SignalCursor,
  SignalSound,
  RoadScene,
  ChalkCanvas,
  PhotoGallery,
} from './SceneEnhancements';
import { ContactForm } from './ContactForm';
import type { PublicData } from '../lib/portfolio-store';
import { topicConnections, topicPoint } from '../lib/relations';
import { useDialogFocus } from './useDialogFocus';

type Mode = 'quick' | 'explore';
const nav = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Toolkit', 'toolkit'],
  ['Journey', 'journey'],
  ['My Mind', 'mind'],
  ['Research', 'research'],
  ['Projects', 'projects'],
  ['Connect', 'contact'],
] as const;
const suggested = [
  'What research have you done?',
  'Show me healthcare AI projects',
  'What is RiskPulse AI?',
  'What is still in development?',
];
const hours = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function Stage({ stage }: { stage: Project['stage'] }) {
  return (
    <span
      className={
        'stage ' + (stage === 'Architecture' || stage === 'In development' ? 'stage-amber' : '')
      }
    >
      {stage}
    </span>
  );
}
function Label({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow section-label">
      <span>{num} /</span> {children}
    </p>
  );
}
function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
function readStorage(key: string, session = false) {
  try {
    return (session ? sessionStorage : localStorage).getItem(key);
  } catch {
    return null;
  }
}
function writeSession(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
}
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  });
}

export function Portfolio({ initialData }: { initialData: PublicData }) {
  const [data, setData] = useState(initialData);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const {
    site,
    milestones,
    mindTopics,
    skills,
    projects,
    intro: introSettings,
    skillLinks,
    knowledge,
  } = data;
  const mindEdges = useMemo(() => topicConnections(mindTopics, projects), [mindTopics, projects]);
  const marked = projects.filter((p) => p.featured);
  const featured = marked.length ? marked : projects;
  const research = projects.filter((p) => p.research);
  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => {
        if (x && Array.isArray(x.projects) && x.site) setData(x);
      })
      .catch(() => {});
  }, []);
  const [mode, setMode] = useState<Mode>('quick');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [palQuery, setPalQuery] = useState('');
  const [intro, setIntro] = useState(false);
  const [active, setActive] = useState('home');
  const [focusIndex, setFocusIndex] = useState(0);
  const [mindIndex, setMindIndex] = useState<number | null>(0);
  const connectedMind = new Set(
    mindEdges
      .filter((e) => e.from === mindIndex || e.to === mindIndex)
      .flatMap((e) => [e.from, e.to]),
  );

  const [journeyFilter, setJourneyFilter] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [journeyStop, setJourneyStop] = useState<number | null>(null);
  const journeyDialog = useRef<HTMLDivElement>(null);
  useDialogFocus(journeyStop !== null, journeyDialog);
  const nudgeSeen = useRef(new Set<string>());
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [greeting, setGreeting] = useState('Namaste');
  const [mayaNudge, setMayaNudge] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const [contactSignal, setContactSignal] = useState<'idle' | 'sending' | 'success' | 'error'>(
    'idle',
  );
  const mayaBusy = useRef(false);
  const [mayaPending, setMayaPending] = useState(false);
  const [mayaSources, setMayaSources] = useState<{ title: string; url: string }[]>([]);
  const [maya, setMaya] = useState(false);
  const [mayaQuery, setMayaQuery] = useState('');
  const [mayaMessages, setMayaMessages] = useState<
    {
      role: 'visitor' | 'maya';
      content: string;
      project?: string;
      sources?: { title: string; url: string }[];
    }[]
  >([
    {
      role: 'maya',
      content:
        'Hi! I am Maya, your guide to this public portfolio. Ask about a project, research area, or current build status. I use only the published project catalog.',
    },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'shanxai terminal v2 · type help to see commands',
  ]);
  const [time, setTime] = useState('IST');
  const paletteDialog = useRef<HTMLDivElement>(null),
    introDialog = useRef<HTMLDivElement>(null),
    menuDialog = useRef<HTMLElement>(null);
  useDialogFocus(palette, paletteDialog);
  useDialogFocus(intro, introDialog);
  useDialogFocus(mobileMenu, menuDialog);
  const paletteRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chooseMode = useCallback((v: Mode) => {
    setMode(v);
    try {
      localStorage.setItem('shanx-mode', v);
    } catch {}
  }, []);
  const chooseTheme = useCallback((v: 'dark' | 'light') => {
    setTheme(v);
    try {
      localStorage.setItem('shanx-theme', v);
    } catch {}
  }, []);
  useEffect(() => {
    const storedMode = readStorage('shanx-mode');
    if (storedMode === 'quick' || storedMode === 'explore') setMode(storedMode);
    const storedTheme = readStorage('shanx-theme');
    if (storedTheme === 'dark' || storedTheme === 'light') setTheme(storedTheme);
    if (
      introSettings.enabled &&
      !readStorage('shanx-intro-seen', true) &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIntro(true);
    }
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.signal = site.signalAccent === false ? 'off' : 'on';
  }, [theme, site.signalAccent]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setMobileMenu(false);
        setJourneyStop(null);
        setIntro(false);
        setPalette((x) => !x);
      }
      if (e.key === 'Escape') {
        setMobileMenu(false);
        setPalette(false);
        setMaya(false);
        setIntro(false);
        setJourneyStop(null);
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth > 920) setMobileMenu(false);
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (longPress.current) clearTimeout(longPress.current);
    };
  }, []);
  useEffect(() => {
    if (palette) paletteRef.current?.focus();
  }, [palette]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-36% 0px -53% 0px' },
    );
    nav.forEach(([_, id]) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const update = () => setTime(hours.format(new Date()) + ' IST');
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (maya) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [maya, mayaMessages]);
  useEffect(() => {
    if (!intro) return;
    const end = setTimeout(() => {
      setIntro(false);
      writeSession('shanx-intro-seen', 'yes');
    }, introSettings.durationMs);
    const words = introSettings.greetings;
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % words.length;
      setGreeting(words[i]);
    }, 210);
    return () => {
      clearInterval(timer);
      clearTimeout(end);
    };
  }, [intro, introSettings.durationMs, introSettings.greetings]);
  useEffect(() => {
    if (nudgeSeen.current.has(active) || maya) return;
    setDismissedNudge(false);
    setMayaNudge(false);
    const timer = setTimeout(() => {
      nudgeSeen.current.add(active);
      setMayaNudge(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [active, maya]);
  useEffect(() => {
    const handler = (e: Event) =>
      setContactSignal((e as CustomEvent<'sending' | 'success' | 'error'>).detail);
    window.addEventListener('shanx-contact-state', handler);
    return () => window.removeEventListener('shanx-contact-state', handler);
  }, []);
  const paletteItems = useMemo(
    () =>
      [
        ...nav.map(([label, id]) => ({ title: label, sub: 'Jump to section', id })),
        { title: 'Resume', sub: 'Open public resume', id: 'resume' },
        { title: 'Ask Maya', sub: 'Portfolio guide', id: 'maya' },
        { title: 'Experience', sub: 'Journey filter', id: 'experience' },
        { title: 'Achievements', sub: 'Journey filter', id: 'achievements' },
        ...projects.map((p) => ({ title: p.name, sub: p.category, id: `project:${p.slug}` })),
      ]
        .filter((x) => (x.title + ' ' + x.sub).toLowerCase().includes(palQuery.toLowerCase()))
        .slice(0, 12),
    [palQuery, projects],
  );
  const selected = featured[focusIndex % Math.max(featured.length, 1)] || projects[0];
  function navigateCommand(id: string) {
    setPalette(false);
    setPalQuery('');
    if (id === 'resume') {
      if (site.links.resume) window.open(site.links.resume, '_blank', 'noopener');
      return;
    }
    if (id === 'maya') {
      setMaya(true);
      return;
    }
    if (id === 'experience' || id === 'achievements') {
      setJourneyFilter(id === 'experience' ? 'Experience' : 'Achievements');
      scrollTo('journey');
      return;
    }
    if (id.startsWith('project:')) window.location.href = '/projects/' + id.slice(8) + '/';
    else {
      if (id === 'mind') {
        chooseMode('explore');
        requestAnimationFrame(() => scrollTo(id));
        return;
      }
      scrollTo(id);
    }
  }
  function finishIntro() {
    setIntro(false);
    writeSession('shanx-intro-seen', 'yes');
  }
  function getAnswer(question: string): { content: string; project?: string } {
    const q = question.toLowerCase();
    const fact = knowledge.find((k) => k.question.toLowerCase() === q);
    if (fact) return { content: fact.answer, project: fact.projects[0] };
    if (/(research|papers|publication|experiment)/.test(q))
      return {
        content:
          'The Research Lab includes QTagger+, Dravidian cultural-alignment evaluation, facial-skin research, health AI, security and financial risk prototypes. The research pages distinguish evidence from planned work.',
        project: 'qtagger-plus',
      };
    const match = projects
      .map((p) => ({
        p,
        score:
          (q.includes(p.name.toLowerCase()) ? 8 : 0) +
          p.name
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter((w) => w.length > 3 && q.includes(w)).length *
            3 +
          p.tags.filter((t) => q.includes(t.toLowerCase())).length * 2 +
          q.split(/[^a-z0-9]+/).filter((w) => w.length > 3 && p.summary.toLowerCase().includes(w))
            .length,
      }))
      .sort((a, b) => b.score - a.score)[0];
    if (match && match.score > 0)
      return {
        content: `${match.p.name} — ${match.p.summary} Current stage: ${match.p.stage}. ${match.p.evidence}`,
        project: match.p.slug,
      };
    if (/(develop|complete|status|live|build)/.test(q))
      return {
        content:
          'Stages vary. Some are demos or research prototypes; Voice Doctor, DermaLens, No Hack and ChronoMind have outstanding integration or validation work. CLARION is an architecture scaffold. Every project case study explains what is and is not verified.',
      };
    if (/(contact|email|hire)/.test(q))
      return { content: `You can connect through the Contact section or email ${site.email}.` };
    return {
      content:
        'I could not find enough evidence in this public portfolio to answer that specifically. Try a project name, “research,” “healthcare,” “agents,” or “status.”',
    };
  }
  async function askMaya(text: string) {
    const q = text.trim();
    if (!q || mayaBusy.current) return;
    mayaBusy.current = true;
    setMayaPending(true);
    const recent = mayaMessages
      .slice(-6)
      .map((m) => ({ role: m.role === 'visitor' ? 'user' : 'assistant', content: m.content }));
    setMayaMessages((prev) => [
      ...prev,
      { role: 'visitor', content: q },
      { role: 'maya', content: 'Thinking…' },
    ]);
    setMayaQuery('');
    try {
      const res = await fetch('/api/maya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history: recent }),
      });
      if (!res.ok || !res.body) throw new Error('Live Maya unavailable');
      const sourceRefs = JSON.parse(
        decodeURIComponent(res.headers.get('X-Maya-Sources') || '%5B%5D'),
      ) as { title: string; url: string }[];
      setMayaSources(sourceRefs);
      const reader = res.body.getReader(),
        decoder = new TextDecoder();
      let buffer = '',
        response = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let cut;
        while ((cut = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, cut);
          buffer = buffer.slice(cut + 2);
          for (const line of frame.split('\n'))
            if (line.startsWith('data: ')) {
              const d = line.slice(6);
              if (d === '[DONE]') continue;
              try {
                const part = JSON.parse(d).choices?.[0]?.delta?.content || '';
                response += part;
              } catch {}
            }
        }
        setMayaMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? { role: 'maya', content: response || 'Thinking…', sources: sourceRefs }
              : m,
          ),
        );
      }
      if (!response.trim()) throw new Error('Empty response');
    } catch {
      setMayaSources([]);
      setMayaMessages((prev) =>
        prev.map((m, i) => (i === prev.length - 1 ? { role: 'maya', ...getAnswer(q) } : m)),
      );
    } finally {
      mayaBusy.current = false;
      setMayaPending(false);
    }
  }
  function terminalCommand(raw: string) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    }
    let reply = 'Command not recognized. Type help.';
    if (cmd === 'help')
      reply =
        'Commands: help · whoami · projects · research · skills · resume · connect datta · clear';
    else if (cmd === 'whoami')
      reply = 'You are visiting the shanXAI research and engineering portfolio.';
    else if (cmd === 'projects') {
      reply = 'Opening the project archive…';
      setTimeout(() => window.location.assign('/projects/'), 600);
    } else if (cmd === 'research') {
      reply = 'Jumping to Research Lab…';
      setTimeout(() => scrollTo('research'), 300);
    } else if (cmd === 'skills') {
      reply = 'Jumping to Toolkit…';
      setTimeout(() => scrollTo('toolkit'), 300);
    } else if (cmd === 'resume') {
      reply = site.links.resume
        ? 'Opening public resume…'
        : 'Public resume is not attached yet. Please use the email contact link.';
      if (site.links.resume) window.open(site.links.resume, '_blank', 'noopener');
    } else if (cmd === 'connect datta') {
      reply =
        'Opening your email app with a prepared message. Nothing has been sent by this website.';
      window.location.href = `mailto:${site.email}?subject=Hello%20from%20shanXAI`;
    }
    setTerminalHistory((prev) => [...prev, `> ${raw}`, reply]);
    setTerminalInput('');
  }
  return (
    <div className="portfolio" data-mode={mode} data-ready={ready}>
      {intro && (
        <div
          ref={introDialog}
          className="intro-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome introduction"
        >
          <button onClick={finishIntro} className="intro-skip">
            Skip intro <X size={15} />
          </button>
          <div className="intro-inner">
            <p className="intro-greeting">
              {greeting} <span>·</span> Hello <span>·</span> నమస్తే
            </p>
            <h2>
              {introSettings.firstLine}
              <br />
              <em>{introSettings.secondLine}</em>
            </h2>
            <span className="intro-line" />
          </div>
        </div>
      )}
      <div
        className="progress-bar"
        style={{
          width: `${Math.max(4, ((nav.findIndex(([, id]) => id === active) + 1) / nav.length) * 100)}%`,
        }}
      />
      {mobileMenu && (
        <button
          className="menu-backdrop"
          aria-label="Close navigation backdrop"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <header className="site-nav">
        <div className="nav-inner">
          <button
            className="wordmark brand-button"
            onPointerDown={() => {
              longPress.current = setTimeout(() => window.location.assign('/control-center/'), 800);
            }}
            onPointerUp={() => {
              if (longPress.current) clearTimeout(longPress.current);
            }}
            onPointerCancel={() => {
              if (longPress.current) clearTimeout(longPress.current);
            }}
            onPointerLeave={() => {
              if (longPress.current) clearTimeout(longPress.current);
            }}
            onDoubleClick={() => window.location.assign('/control-center/')}
            title="Double-click for owner Control Center"
            onClick={() => scrollTo('home')}
            aria-label="Return to start"
          >
            shan<span>X</span>AI<span className="brand-period">.</span>
          </button>
          <nav
            ref={menuDialog}
            id="main-menu"
            className={'nav-links ' + (mobileMenu ? 'nav-open' : '')}
            aria-label="Main navigation"
          >
            {nav
              .filter(([name]) => mode === 'explore' || !['My Mind'].includes(name))
              .map(([name, id]) => (
                <button
                  key={id}
                  className={active === id ? 'nav-active' : ''}
                  onClick={() => {
                    scrollTo(id);
                    setMobileMenu(false);
                  }}
                >
                  {name}
                </button>
              ))}
            <Link href="/writing/">Writing</Link>
            {site.links.resume && (
              <a href={site.links.resume} target="_blank" rel="noopener noreferrer">
                Resume ↗
              </a>
            )}
            <button
              className="mobile-menu-search"
              onClick={() => {
                setMobileMenu(false);
                setPalette(true);
              }}
            >
              Search portfolio
            </button>
            <button className="mobile-menu-close" onClick={() => setMobileMenu(false)}>
              Close menu
            </button>
          </nav>
          <div className="nav-actions">
            <div className="mode-toggle" role="group" aria-label="Portfolio view mode">
              <button
                className={mode === 'quick' ? 'active' : ''}
                aria-pressed={mode === 'quick'}
                onClick={() => chooseMode('quick')}
              >
                Quick
              </button>
              <button
                className={mode === 'explore' ? 'active' : ''}
                aria-pressed={mode === 'explore'}
                onClick={() => chooseMode('explore')}
              >
                Explore
              </button>
            </div>
            <button
              className="icon-button command-nav"
              onClick={() => setPalette(true)}
              aria-label="Open command palette"
            >
              <Command size={16} />
              <small>K</small>
            </button>
            <button
              className="icon-button theme-toggle"
              aria-label="Toggle theme"
              onClick={() => chooseTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              className="icon-button burger"
              aria-controls="main-menu"
              aria-expanded={mobileMenu}
              aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenu((x) => !x)}
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <main id="content">
        {site.demoAssets && (
          <div className="demo-notice" role="note">
            DEMO ASSETS · Gallery photographs and resume are samples.{' '}
            <Link href="/demo/">Open the interactive demo lab ↗</Link>
          </div>
        )}
        <div className="home-flow">
          <section id="home" className="hero scene">
            <div className="hero-neural" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero-content">
              <div className="hero-intro">
                <div className="overline">
                  <span className="status-dot" />
                  {site.availability}
                </div>
                <p className="hero-eyebrow">HELLO, I&apos;M</p>
                <h1>
                  {site.shortName.split(' ').slice(0, -1).join(' ').toUpperCase()}
                  <br />
                  <span>
                    {site.shortName.split(' ').at(-1)?.toUpperCase()}
                    <span className="period">.</span>
                  </span>
                </h1>
                <p className="hero-role">{site.tagline}</p>
                <p className="hero-description">
                  {site.headline}{' '}
                  <span>
                    From cultural LLM evaluation and quantum security to open-source agents and
                    real-world products.
                  </span>
                </p>
                <p className="hero-now">
                  <span className="status-dot" />
                  NOW / {site.currentlyExploring}
                </p>
                <div className="hero-cta">
                  <button className="btn btn-subtle" onClick={() => scrollTo('research')}>
                    Research lab <BookOpen size={16} />
                  </button>
                  <button className="btn btn-primary" onClick={() => scrollTo('projects')}>
                    Explore my work <ArrowUpRight size={18} />
                  </button>
                  {site.links.resume && (
                    <a
                      className="btn btn-subtle"
                      href={site.links.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {site.demoAssets ? 'Demo resume' : 'Download resume'} <FileText size={15} />
                    </a>
                  )}
                  <a
                    className="btn btn-subtle"
                    href={site.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} /> GitHub
                  </a>
                  <a
                    className="btn btn-subtle"
                    href={site.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn <ArrowUpRight size={15} />
                  </a>
                </div>
                <div className="hero-mini-meta">
                  <span>
                    <b>{projects.length}</b> documented works & ideas
                  </span>
                  <i />
                  <span>
                    <b>{research.length}</b> research threads
                  </span>
                  <i />
                  <span>Built in India</span>
                </div>
              </div>
              <div
                className="hero-art"
                onPointerMove={(e) => {
                  if (
                    !window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)')
                      .matches
                  )
                    return;
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty(
                    '--tilt-x',
                    ((e.clientY - r.top) / r.height - 0.5) * -5 + 'deg',
                  );
                  e.currentTarget.style.setProperty(
                    '--tilt-y',
                    ((e.clientX - r.left) / r.width - 0.5) * 6 + 'deg',
                  );
                }}
                onPointerLeave={(e) => {
                  e.currentTarget.style.setProperty('--tilt-x', '0deg');
                  e.currentTarget.style.setProperty('--tilt-y', '0deg');
                }}
              >
                <div className="portrait-glow" />
                <div className="portrait-mask">
                  <img
                    src="https://avatars.githubusercontent.com/u/200479838?v=4"
                    alt={`${site.shortName} GitHub profile portrait`}
                    loading="eager"
                  />
                </div>
                <div className="portrait-corner p-top">FIG. 01 / THE BUILDER</div>
                <div className="portrait-corner p-bottom">
                  RESEARCHER <span>×</span> ENGINEER
                </div>
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
              </div>
            </div>
            <div className="name-marquee" aria-hidden="true">
              <span>
                {site.shortName} · RESEARCH · BUILD · {site.shortName} · RESEARCH · BUILD ·{' '}
              </span>
            </div>
            <div className="hero-bottom">
              <div className="hero-ticker">
                THINK <span>•</span> RESEARCH <span>•</span> BUILD <span>•</span> SHIP
              </div>
              <button className="scroll-link" onClick={() => scrollTo('about')}>
                SCROLL TO EXPLORE <ArrowDown size={17} />
              </button>
            </div>
          </section>
          <section id="about" className="scene about wrap">
            <Label num="01">THE PERSON BEHIND THE SYSTEMS</Label>
            <div className="about-grid">
              <div className="about-collage">
                <div className="collage-panel">
                  <p className="collage-kicker">Field notes / 2024 — today</p>
                  <PhotoGallery photos={site.gallery || []} />
                  <span className="collage-credit">
                    {site.demoAssets
                      ? 'Demo gallery: sample images, not personal photographs.'
                      : 'Original photographs shared by the portfolio owner.'}
                  </span>
                </div>
                <div className="collage-mark">
                  “The interesting part is finding out what the system cannot do yet.”
                </div>
              </div>
              <div className="about-text">
                <SectionTitle eyebrow="ABOUT / A LITTLE CONTEXT" title={site.aboutTitle} />
                <p>{site.aboutIntro}</p>
                <p>{site.aboutDetail}</p>
                <div className="about-facts">
                  <div>
                    <small>STUDYING</small>
                    <strong>{site.program}</strong>
                  </div>
                  <div>
                    <small>WORKING ON</small>
                    <strong>{site.currentlyExploring}</strong>
                  </div>
                  <div>
                    <small>BASED IN</small>
                    <strong>{site.location}</strong>
                  </div>
                </div>
                <a
                  href={site.links.github}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My GitHub story <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </section>
          <section id="toolkit" className="scene toolkit">
            <div className="wrap">
              <Label num="02">TOOLKIT</Label>
              <div className="toolkit-heading">
                <SectionTitle
                  eyebrow="HOW I BUILD"
                  title="Tools in my orbit."
                  subtitle="Skills are more meaningful when connected to actual projects. Explore a cluster or open the full archive."
                />
                <Link href="/projects/" className="text-link">
                  Project library <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="skill-orbits">
                {Object.entries(skills).map(([group, items], index) => (
                  <div className={'skill-cluster skill-cluster-' + index} key={group}>
                    <div className="skill-cluster-head">
                      <span className="cluster-num">0{index + 1}</span>
                      <h3>{group}</h3>
                    </div>
                    <svg className="skill-graph-lines" viewBox="0 0 340 280" aria-hidden="true">
                      {items.map((_, i) => {
                        const angle = (i / items.length) * Math.PI * 2;
                        return (
                          <line
                            key={i}
                            x1="170"
                            y1="140"
                            x2={170 + 135 * Math.cos(angle)}
                            y2={140 + 100 * Math.sin(angle)}
                          />
                        );
                      })}
                    </svg>
                    <div className="skill-items">
                      {items.map((t, i) => (
                        <button
                          key={t}
                          style={
                            {
                              '--node-x': `${50 + 39 * Math.cos((i / items.length) * Math.PI * 2)}%`,
                              '--node-y': `${50 + 35 * Math.sin((i / items.length) * Math.PI * 2)}%`,
                            } as React.CSSProperties
                          }
                          title={skillLinks.find((s) => s.skill === t)?.state || 'Exploring'}
                          onClick={() => setSelectedSkill(selectedSkill === t ? null : t)}
                          className={'skill-token ' + (selectedSkill === t ? 'active' : '')}
                          aria-pressed={selectedSkill === t}
                        >
                          {t}
                          <small>
                            {skillLinks.find((s) => s.skill === t)?.state || 'Exploring'}
                          </small>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="skill-caption">
                {selectedSkill ? (
                  <>
                    Selected: <strong>{selectedSkill}</strong>. Browse the project library and
                    search for the matching technology.{' '}
                    <Link href={'/projects/?q=' + encodeURIComponent(selectedSkill || '')}>
                      Projects using this skill →
                    </Link>
                  </>
                ) : (
                  'Hover, focus or select a skill to explore the engineering toolkit.'
                )}
              </div>
              {selectedSkill && (
                <div className="skill-proof" aria-live="polite">
                  <h3>
                    {selectedSkill} ·{' '}
                    {skillLinks.find((s) => s.skill === selectedSkill)?.state || 'Exploring'}
                  </h3>
                  {skillLinks.find((s) => s.skill === selectedSkill)?.projects.length ? (
                    skillLinks
                      .find((s) => s.skill === selectedSkill)
                      ?.projects.map((slug) => {
                        const p = projects.find((p) => p.slug === slug);
                        return p ? (
                          <Link className="pill" href={`/projects/${p.slug}/`} key={slug}>
                            {p.name} ↗
                          </Link>
                        ) : null;
                      })
                  ) : (
                    <p>
                      No linked proof project yet. This skill is not represented as verified project
                      experience.
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
          <section
            id="journey"
            className={'scene journey ' + (mode === 'quick' ? 'journey-compact' : '')}
          >
            <div className="wrap">
              <Label num="03">THE JOURNEY</Label>
              <SectionTitle
                eyebrow="MILESTONES / NOT JUST DATES"
                title="An unfinished road."
                subtitle="Every stop is part of the story. More milestones are still ahead."
              />
              <div className="journey-filters" role="group" aria-label="Filter milestones">
                {[
                  'All',
                  'Education',
                  'Experience',
                  'Leadership',
                  'Research',
                  'Open Source',
                  'Achievements',
                ].map((t) => (
                  <button
                    key={t}
                    className={journeyFilter === t ? 'active' : ''}
                    onClick={() => setJourneyFilter(t)}
                    aria-pressed={journeyFilter === t}
                  >
                    {t}
                    <small>{skillLinks.find((s) => s.skill === t)?.state || 'Exploring'}</small>
                  </button>
                ))}
              </div>
              <div className="journey-landscape">
                <div className="landscape-hill hill-one" />
                <div className="landscape-hill hill-two" />
                <svg
                  className="winding-road"
                  viewBox="0 0 1000 1200"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    className="road-outline"
                    d="M500 -50 C200 150 800 300 500 450 S200 700 500 850 S800 1100 500 1250"
                  />
                  <path
                    className="road-asphalt"
                    d="M500 -50 C200 150 800 300 500 450 S200 700 500 850 S800 1100 500 1250"
                  />
                  <path
                    className="road-dashes"
                    d="M500 -50 C200 150 800 300 500 450 S200 700 500 850 S800 1100 500 1250"
                  />
                </svg>
                {Array.from({ length: 8 }, (_, i) => (
                  <span
                    key={i}
                    className="road-tree"
                    aria-hidden="true"
                    style={{ top: `${8 + i * 11}%`, left: i % 2 ? '85%' : '9%' }}
                  >
                    ♠
                  </span>
                ))}
                <RoadScene />
                <div className="milepost-list">
                  {milestones
                    .filter((m) => journeyFilter === 'All' || m.type === journeyFilter)
                    .map((m, i) => (
                      <div className={'milestone mile-' + (i % 2)} key={m.label}>
                        <button
                          className="milestone-sign"
                          onClick={() => setJourneyStop(milestones.indexOf(m))}
                          aria-label={`Open milestone: ${m.label}`}
                        >
                          <span>
                            {m.date} <i>·</i> {m.type}
                          </span>
                          <h3>{m.label}</h3>
                          <p>{m.note}</p>
                          <small>Open field note ↗</small>
                        </button>
                        <div className="milestone-dot" />
                      </div>
                    ))}
                </div>
                <div className="you-are-here">● YOU ARE HERE / STILL BUILDING</div>
                <div className="journey-horizon">
                  THE JOURNEY CONTINUES <span>→</span>
                </div>
              </div>
            </div>
          </section>
          <section id="mind" className="scene mind">
            <div className="wrap">
              <Label num="04">MY MIND / AN OPEN NOTEBOOK</Label>
              <SectionTitle
                eyebrow="IDEAS IN MOTION"
                title="Inside the curiosity engine."
                subtitle="Questions on the board are connected to real research and projects."
              />
              <div className="mind-room">
                <div className="mind-wall">
                  <span className="wall-clock">
                    <Clock3 size={21} />
                  </span>
                  <div className="chalk-frame">
                    <div className="chalk-room-clock" aria-label="A study room wall clock">
                      ◷
                    </div>
                    <div className="chalk-window" aria-hidden="true" />
                    <div className="chalk-sticky" aria-hidden="true">
                      WHAT IF?
                    </div>
                    <div className="chalkboard">
                      <span className="board-label">THINGS I KEEP THINKING ABOUT ↗</span>
                      <svg
                        className="chalk-connections"
                        viewBox={`0 0 600 ${Math.ceil(mindTopics.length / 3) * 135}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        {mindEdges.map((e) => {
                          const a = topicPoint(e.from),
                            b = topicPoint(e.to);
                          return (
                            <line
                              key={e.from + '-' + e.to}
                              x1={a.x}
                              y1={a.y}
                              x2={b.x}
                              y2={b.y}
                              className={
                                e.from === mindIndex || e.to === mindIndex ? 'edge-active' : ''
                              }
                            />
                          );
                        })}
                      </svg>
                      <div className="chalk-topics">
                        {mindTopics.map((t, i) => (
                          <button
                            key={t.title}
                            className={
                              'chalk-topic ' +
                              (mindIndex === i
                                ? 'chalk-selected'
                                : connectedMind.has(i)
                                  ? 'chalk-connected'
                                  : '')
                            }
                            onClick={() => setMindIndex(i)}
                            aria-pressed={mindIndex === i}
                          >
                            <span className="chalk-star">✳</span>
                            <span>{t.title}</span>
                            <small>{t.chain}</small>
                            <small className="topic-stage">
                              {projects.find((p) => p.slug === t.project)?.stage === 'Research'
                                ? 'Research question'
                                : projects.find((p) => p.slug === t.project)?.stage ===
                                    'Open source'
                                  ? 'Built'
                                  : 'Experimenting'}
                            </small>
                          </button>
                        ))}
                      </div>
                      <span className="chalk-scribble">what if...?</span>
                      <ChalkCanvas />
                    </div>
                    <div className="chalk-tray">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
                <div className="mind-drawer" aria-live="polite">
                  <p className="eyebrow">SELECTED RESEARCH THREAD</p>
                  <h3>{mindTopics[(mindIndex ?? 0) % mindTopics.length].title}</h3>
                  <p>{mindTopics[(mindIndex ?? 0) % mindTopics.length].detail}</p>
                  <div className="mind-related">
                    <small>Connected topics</small>
                    {Array.from(connectedMind)
                      .filter((i) => i !== mindIndex)
                      .map((i) => (
                        <button key={i} className="pill" onClick={() => setMindIndex(i)}>
                          {mindTopics[i].title}
                        </button>
                      ))}
                    {connectedMind.size === 0 && (
                      <p>No shared project links or technologies in the current graph.</p>
                    )}
                  </div>
                  <div className="mind-path">
                    {mindTopics[(mindIndex ?? 0) % mindTopics.length].chain}
                  </div>
                  <Link
                    href={`/projects/${mindTopics[(mindIndex ?? 0) % mindTopics.length].project}/`}
                    className="text-link"
                  >
                    Connected case study <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section id="research" className="scene research-lab wrap">
            <Label num="05">THE RESEARCH LAB</Label>
            <div className="split-heading">
              <SectionTitle
                eyebrow="METHOD > HYPE"
                title="Questions worth testing."
                subtitle="Actual studies, methods, caveats and engineering research—not unverified achievements."
              />
              <Link href="/research/" className="btn btn-subtle">
                Browse research <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="research-grid">
              {research.slice(0, 6).map((p, i) => (
                <Link
                  key={p.slug}
                  className={'research-card research-' + i}
                  href={`/projects/${p.slug}/`}
                >
                  <div className="research-card-head">
                    <span>STUDY / {String(i + 1).padStart(2, '0')}</span>
                    <Stage stage={p.stage} />
                  </div>
                  <div className="research-glyph" aria-hidden="true">
                    <span>{['∑', 'λ', '◉', '∆', '≋', '⌘'][i]}</span>
                    <i />
                    <i />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.summary}</p>
                  <div className="research-card-bottom">
                    <span>{p.tags.slice(0, 2).join(' · ')}</span>
                    <ArrowUpRight size={19} />
                  </div>
                </Link>
              ))}
            </div>
            <p className="research-note">
              Every study is tagged with its present stage and available evidence. Submissions are
              not represented as acceptances; medical research is not clinical guidance.
            </p>
          </section>
          <section id="projects" className="scene featured-work">
            <div className="wrap">
              <Label num="06">SELECTED WORK</Label>
              <div className="split-heading">
                <SectionTitle
                  eyebrow="MADE TO BE EXAMINED"
                  title="Projects beyond the slide deck."
                  subtitle="Explore representative builds from applied AI, agents, research and systems engineering."
                />
                <Link href="/projects/" className="btn btn-outline">
                  View every project <ArrowUpRight size={17} />
                </Link>
              </div>
              <div
                data-cursor="Drag"
                className="featured-stage"
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured projects"
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setFocusIndex(
                      (i) =>
                        (i + (e.key === 'ArrowRight' ? 1 : featured.length - 1)) %
                        Math.max(1, featured.length),
                    );
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.dataset.x = String(e.touches[0].clientX);
                }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - Number(e.currentTarget.dataset.x || 0);
                  if (Math.abs(dx) > 70)
                    setFocusIndex(
                      (i) => (i + (dx < 0 ? 1 : featured.length - 1)) % featured.length,
                    );
                }}
              >
                <button
                  className="carousel-control prev"
                  aria-label="Previous featured project"
                  onClick={() => setFocusIndex((x) => (x - 1 + featured.length) % featured.length)}
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="featured-copy">
                  <div className="featured-meta">
                    <span>
                      FEATURED / {String(focusIndex + 1).padStart(2, '0')}—
                      {String(featured.length).padStart(2, '0')}
                    </span>
                    <Stage stage={selected.stage} />
                  </div>
                  <p className="eyebrow">{selected.eyebrow}</p>
                  <h3>{selected.name}</h3>
                  <p>{selected.summary}</p>
                  <div className="pill-row">
                    {selected.tags.slice(0, 4).map((t) => (
                      <span className="pill" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="feature-actions">
                    <Link href={`/projects/${selected.slug}/`} className="btn btn-primary">
                      Read case study <ArrowUpRight size={17} />
                    </Link>
                    {selected.repo && (
                      <a
                        href={selected.repo}
                        className="btn btn-subtle"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github size={16} /> Source
                      </a>
                    )}
                  </div>
                </div>
                <ProjectVisual project={selected} />
                <button
                  className="carousel-control next"
                  aria-label="Next featured project"
                  onClick={() => setFocusIndex((x) => (x + 1) % featured.length)}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              <div className="feature-nav">
                <div className="feature-dots" aria-label="Choose featured project">
                  {featured.map((p, i) => (
                    <button
                      key={p.slug}
                      aria-label={`Show ${p.name}`}
                      aria-current={focusIndex === i}
                      onClick={() => setFocusIndex(i)}
                      className={focusIndex === i ? 'current' : ''}
                    />
                  ))}
                </div>
                <span>
                  ← <span>Drag-free. Keyboard and buttons supported.</span> →
                </span>
              </div>
              <div
                className="neighbor-previews visual-neighbors"
                aria-label="Nearby featured projects"
              >
                {[-1, 1].map((offset) => {
                  const p = featured[(focusIndex + offset + featured.length) % featured.length];
                  return (
                    <button
                      key={offset}
                      onClick={() =>
                        setFocusIndex((i) => (i + offset + featured.length) % featured.length)
                      }
                    >
                      <small>{offset < 0 ? '← PREVIOUS' : 'NEXT →'}</small>
                      <ProjectVisual project={p} />
                      <strong>{p.name}</strong>
                      <span>{p.stage}</span>
                    </button>
                  );
                })}
              </div>
              <div className="more-work">
                <h3>More than a highlight reel.</h3>
                <p>
                  Soochana AI · RiskPulse AI · ChronoMind AI · Voice Doctor AI · Facial Skin
                  Research · DermaLens AI · CLARION · No Hack · MCP tools · and many more.
                </p>
                <Link href="/projects/" className="text-link">
                  Open the complete work archive <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          </section>
          <section id="contact" className="scene connect wrap">
            <Label num="07">THE NEXT CONNECTION</Label>
            <SectionTitle
              eyebrow="LET'S BUILD SOMETHING CONSIDERED"
              title="The signal is open."
              subtitle="For research, engineering conversations, open source, and thoughtful collaborations."
            />
            <div className="contact-grid">
              <div className="traffic-card">
                <div className="traffic-caption">CHANNEL SELECTOR / PICK A SIGNAL</div>
                <div className="traffic-row">
                  <div className={'traffic-light traffic-state-' + contactSignal}>
                    <a
                      href={`mailto:${site.email}`}
                      className="light red"
                      aria-label="Email Shanmukh Datta"
                      title="Email"
                    >
                      <Mail size={19} />
                    </a>
                    <Link
                      href="/research/"
                      className="light orange"
                      title="Research"
                      aria-label="Explore research"
                    >
                      <BookOpen size={19} />
                    </Link>
                    <a
                      href={site.links.linkedin}
                      className="light yellow"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <Globe2 size={19} />
                    </a>
                    <a
                      href={site.links.github}
                      className="light green"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <Github size={19} />
                    </a>
                  </div>
                  <div className="signal-labels">
                    <a href={`mailto:${site.email}`}>
                      Email <ArrowUpRight size={15} />
                    </a>
                    <Link href="/research/">
                      Research <ArrowUpRight size={15} />
                    </Link>
                    <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn <ArrowUpRight size={15} />
                    </a>
                    <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                      GitHub <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
                <div className="signal-base" />
              </div>
              <div className="terminal-card">
                <div className="terminal-titlebar">
                  <div>
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>SHANXAI : CONNECT</span>
                  <small>POWERED BY HUMAN CURIOSITY</small>
                </div>
                <div className="terminal-content">
                  <p className="term-subtitle">
                    Welcome to the contact console. Commands are interactive; no message is sent
                    without your email app.
                  </p>
                  <div className="terminal-lines" aria-live="polite">
                    {terminalHistory.slice(-8).map((s, i) => (
                      <p key={i} className={s.startsWith('>') ? 'term-command' : ''}>
                        {s}
                      </p>
                    ))}
                  </div>
                  <form
                    className="terminal-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      terminalCommand(terminalInput);
                    }}
                  >
                    <label htmlFor="terminal-input">C:\Visitors\shanXAI&gt;</label>
                    <input
                      id="terminal-input"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="help"
                      autoComplete="off"
                      maxLength={90}
                    />
                    <button type="submit" aria-label="Run command">
                      <ArrowRight size={18} />
                    </button>
                  </form>
                  <div className="terminal-shortcuts">
                    {['help', 'whoami', 'connect datta'].map((c) => (
                      <button key={c} onClick={() => terminalCommand(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <ContactForm email={site.email} />
      <footer className="site-footer">
        <div className="wrap">
          <p className="eyebrow">THE BOOKEND / SHANXAI 2026</p>
          <h2>
            {introSettings.firstLine}
            <br />
            <em>{introSettings.secondLine}</em>
          </h2>
          <div className="footer-bottom">
            <SignalSound />
            <span>© 2026 {site.shortName} · Built with curiosity and evidence.</span>
            <span>
              {time} · {site.location}
            </span>
            <div>
              <button
                onClick={() => {
                  setIntro(true);
                }}
              >
                Replay intro
              </button>
              <Link href="/writing/">Writing</Link>
              <a href={`mailto:${site.email}`}>Email</a>
              <button onClick={() => scrollTo('home')}>Back to top ↑</button>
            </div>
          </div>
        </div>
      </footer>
      <aside className="journey-rail" aria-label="Page sections">
        {nav
          .filter(([name]) => mode === 'explore' || !['My Mind'].includes(name))
          .map(([label, id]) => (
            <button
              title={label}
              key={id}
              className={active === id ? 'active' : ''}
              onClick={() => scrollTo(id)}
              aria-label={`Jump to ${label}`}
            >
              <span />
            </button>
          ))}
      </aside>
      <button
        className="maya-fab"
        aria-label={maya ? 'Close Maya portfolio guide' : 'Ask Maya about the portfolio'}
        aria-expanded={maya}
        onClick={() => setMaya((x) => !x)}
      >
        <span className="maya-orb">
          <Sparkles size={22} />
        </span>
        <span>{maya ? 'Close' : 'Ask Maya'}</span>
      </button>
      {maya && (
        <section className="maya-chat" aria-label="Maya portfolio guide">
          <header>
            <div>
              <span className="maya-orb mini">
                <Sparkles size={13} />
              </span>
              <div>
                <strong>Maya</strong>
                <small>Evidence-based portfolio guide</small>
              </div>
            </div>
            <button onClick={() => setMaya(false)} aria-label="Close assistant">
              <X size={19} />
            </button>
          </header>
          <div className="chat-log" role="log" aria-live="polite" aria-busy={mayaPending}>
            {mayaMessages.map((m, i) => (
              <div className={'chat-message ' + m.role} key={i}>
                <p>{m.content}</p>
                {m.project && (
                  <Link href={`/projects/${m.project}/`}>
                    Read case study <ArrowUpRight size={13} />
                  </Link>
                )}
                {m.sources && (
                  <div className="maya-citations">
                    <small>Public sources</small>
                    {m.sources.map((s) => (
                      <Link key={s.url} href={s.url}>
                        {s.title} ↗
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {mayaMessages.length <= 1 && (
            <div className="chat-prompts">
              {suggested.map((q) => (
                <button key={q} disabled={mayaPending} onClick={() => askMaya(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              askMaya(mayaQuery);
            }}
            className="chat-compose"
          >
            <input
              value={mayaQuery}
              onChange={(e) => setMayaQuery(e.target.value)}
              placeholder="Ask about a project…"
              maxLength={220}
              aria-label="Ask Maya"
            />
            <button
              type="submit"
              disabled={mayaPending}
              aria-label={mayaPending ? 'Waiting for Maya' : 'Send question'}
            >
              <Send size={18} />
            </button>
          </form>
          {mayaSources.length > 0 && (
            <div
              className="maya-citations"
              aria-label="Published sources retrieved for this answer"
            >
              <small>Retrieved public sources</small>
              {mayaSources.map((s) => (
                <Link key={s.url} href={s.url}>
                  {s.title} ↗
                </Link>
              ))}
            </div>
          )}
          <p className="maya-disclaimer">
            Grounded in public portfolio facts. Uses live AI only when configured; otherwise local
            catalog search.
          </p>
        </section>
      )}
      {mayaNudge && !dismissedNudge && !maya && (
        <div className="maya-nudge">
          <button
            onClick={() => {
              setMaya(true);
              setMayaQuery(`Tell me about ${active}`);
              setDismissedNudge(true);
              setMayaNudge(false);
            }}
          >{`Explore ${active === 'home' ? 'this portfolio' : active} with Maya ↗`}</button>
          <button
            aria-label="Dismiss suggestion"
            onClick={() => {
              setMayaNudge(false);
              setDismissedNudge(true);
            }}
          >
            ×
          </button>
        </div>
      )}
      {journeyStop !== null && milestones[journeyStop] && (
        <div
          className="palette-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setJourneyStop(null);
          }}
        >
          <div
            ref={journeyDialog}
            className="milestone-detail"
            role="dialog"
            aria-modal="true"
            aria-label={milestones[journeyStop].label}
          >
            <button
              className="icon-button"
              aria-label="Close milestone"
              onClick={() => setJourneyStop(null)}
            >
              <X size={20} />
            </button>
            <p className="eyebrow">
              {milestones[journeyStop].date} / {milestones[journeyStop].type}
            </p>
            <h2>{milestones[journeyStop].label}</h2>
            <p>{milestones[journeyStop].note}</p>
            {milestones[journeyStop].evidence && (
              <div className="milestone-evidence">
                <a
                  href={milestones[journeyStop].evidence?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {milestones[journeyStop].evidence?.label} ↗
                </a>
                <p>{milestones[journeyStop].evidence?.verification}</p>
              </div>
            )}
            <button
              className="btn"
              onClick={() => {
                setJourneyStop(null);
                scrollTo('projects');
              }}
            >
              Explore related work ↗
            </button>
          </div>
        </div>
      )}
      <SignalCursor />
      {palette && (
        <div
          className="palette-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPalette(false);
          }}
        >
          <div
            ref={paletteDialog}
            className="palette-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="palette-input">
              <Search size={19} />
              <input
                ref={paletteRef}
                value={palQuery}
                onChange={(e) => setPalQuery(e.target.value)}
                placeholder="Search sections or projects…"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && paletteItems.length) navigateCommand(paletteItems[0].id);
                }}
              />
              <button aria-label="Close search" onClick={() => setPalette(false)}>
                <X size={19} />
              </button>
            </div>
            <div className="palette-results">
              {paletteItems.map((it) => (
                <button key={it.id} onClick={() => navigateCommand(it.id)}>
                  <span>
                    <b>{it.title}</b>
                    <small>{it.sub}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
              {paletteItems.length === 0 && <p>No matching sections or projects</p>}
            </div>
            <div className="palette-foot">Ctrl/Cmd + K to open · Esc to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
