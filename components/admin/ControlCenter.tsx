'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Project } from '../../content/projects';

import type { DocumentKey } from '../../lib/validate';
type DocKey = DocumentKey;
type Row = {
  key: string;
  draft: unknown;
  published: unknown;
  revision: number;
  updated_at: string;
};
const tabs: { key: DocKey; label: string; description: string }[] = [
  {
    key: 'articles',
    label: 'Writing · Articles',
    description: 'Author notes as drafts or published articles. Demo content must remain labeled.',
  },
  {
    key: 'research',
    label: 'Research · Study records',
    description:
      'Datasets, collaborators, methods, evidence, publication status, sources and figures.',
  },
  {
    key: 'seo',
    label: 'SEO · OpenGraph · Redirects',
    description: 'Public metadata and local, cycle-free redirects.',
  },
  {
    key: 'intro',
    label: 'Intro · Greetings · Timing',
    description: 'Enabled state, 1–3 second duration, greetings and motto.',
  },
  {
    key: 'knowledge',
    label: 'Maya · Published knowledge',
    description: 'Published-only answers and project references. Private drafts never reach Maya.',
  },
  {
    key: 'skillLinks',
    label: 'Toolkit · Proof links',
    description: 'Per-skill Used in project, Learning or Exploring states and project links.',
  },
  {
    key: 'register',
    label: 'Private editorial register',
    description:
      '76 public/private inventory slots, source provenance, permission, verification and placement. Never public.',
  },
  {
    key: 'site',
    label: 'Hero · About · Connect · Settings · Resume',
    description: 'Site identity, social links, quote, hero text, contact address and resume URL.',
  },
  {
    key: 'milestones',
    label: 'My Journey · Experience · Achievements',
    description: 'Road signs, years, roles and categories.',
  },
  {
    key: 'mindTopics',
    label: 'My Mind · Research Threads',
    description: 'Chalkboard nodes and related project links.',
  },
  { key: 'skills', label: 'Toolkit · Skills', description: 'Groups of skill nodes.' },
  {
    key: 'projects',
    label: 'Projects · Research · Media',
    description: 'Published case studies, feature status, screenshots and demos.',
  },
];
const steps = [
  ['slug', 'URL slug'],
  ['name', 'Project title'],
  ['eyebrow', 'Short category heading'],
  ['summary', 'Concise overview'],
  ['problem', 'Problem statement'],
  ['approach', 'Technical architecture'],
  ['features', 'Implemented features (comma separated)'],
  ['tags', 'Technologies (comma separated)'],
  ['evidence', 'Real results & limitations'],
  ['demo', 'Public demo URL (optional)'],
  ['repo', 'Public source URL (optional)'],
  ['next', 'Roadmap & next steps'],
  ['role', 'Your role / attribution'],
  ['screenshots', 'Screenshot URLs (comma separated)'],
  ['paper', 'Public paper URL (optional)'],
  ['metrics', 'Measured evidence JSON: label, value, source, dataset, version, setup'],
] as const;
const blank: Project = {
  slug: '',
  name: '',
  eyebrow: 'PROJECT',
  summary: '',
  problem: '',
  approach: '',
  evidence: '',
  next: '',
  category: 'AI Products',
  stage: 'In development',
  tags: [],
};
const roles: Project['category'][] = [
  'Research',
  'AI Products',
  'Agents & Infrastructure',
  'Cybersecurity',
  'Healthcare',
  'Applied Engineering',
  'Explorations',
];
const statuses: Project['stage'][] = [
  'Research',
  'Prototype',
  'In development',
  'Architecture',
  'Open source',
  'Demo',
  'Experiment',
];

function DraftPreview({ tab, value }: { tab: DocKey; value: unknown }) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  if (!value || typeof value !== 'object') return <p>Enter a valid draft to preview.</p>;
  const x = value as Record<string, unknown>;
  const short = (v: unknown) => (typeof v === 'string' ? v : '');
  return (
    <div className="draft-preview-wrapper">
      <div className="viewport-tabs" role="group" aria-label="Preview screen size">
        {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
          <button key={d} aria-pressed={device === d} onClick={() => setDevice(d)}>
            {d}
          </button>
        ))}
      </div>
      <div className={'draft-viewport preview-' + device}>
        {tab === 'site' && (
          <>
            <span className="eyebrow">INTRO / HERO</span>
            <h3>{short(x.shortName) || short(x.name)}</h3>
            <p className="accent-line">{short(x.tagline)}</p>
            <p>{short(x.headline)}</p>
            <span className="eyebrow">ABOUT</span>
            <h4>{short(x.aboutTitle)}</h4>
            <p>{short(x.aboutIntro)}</p>
            <p>{short(x.aboutDetail)}</p>
            <div className="preview-links">
              {x.links && typeof x.links === 'object'
                ? Object.keys(x.links).map((k) => <span key={k}>{k}</span>)
                : null}
            </div>
          </>
        )}
        {tab === 'projects' && Array.isArray(value) && (
          <>
            <span className="eyebrow">PROJECT COLLECTION / {value.length}</span>
            {value.slice(0, 6).map((item, i) => {
              const p = item as Record<string, unknown>;
              return (
                <div className="preview-record" key={i}>
                  <span>
                    {short(p.category)} · {short(p.stage)}
                  </span>
                  <h4>{short(p.name)}</h4>
                  <p>{short(p.summary)}</p>
                </div>
              );
            })}
          </>
        )}
        {tab === 'milestones' && Array.isArray(value) && (
          <>
            <span className="eyebrow">JOURNEY TIMELINE</span>
            {value.slice(0, 10).map((item, i) => {
              const m = item as Record<string, unknown>;
              return (
                <div className="preview-record" key={i}>
                  <span>
                    {short(m.date)} · {short(m.type)}
                  </span>
                  <h4>{short(m.label)}</h4>
                  <p>{short(m.note)}</p>
                </div>
              );
            })}
          </>
        )}
        {tab === 'mindTopics' && Array.isArray(value) && (
          <div className="preview-chalk">
            <span>MY MIND</span>
            {value.slice(0, 9).map((item, i) => {
              const t = item as Record<string, unknown>;
              return (
                <div key={i}>
                  {short(t.title)}
                  <small>{short(t.chain)}</small>
                </div>
              );
            })}
          </div>
        )}
        {tab === 'skills' &&
          Object.entries(x).map(([name, list]) => (
            <div className="preview-record" key={name}>
              <h4>{name}</h4>
              <div className="preview-links">
                {Array.isArray(list) && list.map((v, i) => <span key={i}>{String(v)}</span>)}
              </div>
            </div>
          ))}
        {['articles', 'research', 'knowledge', 'skillLinks', 'register', 'seo', 'intro'].includes(
          tab,
        ) && <pre className="structured-preview">{JSON.stringify(value, null, 2)}</pre>}
      </div>
      <details>
        <summary>Inspect full draft data</summary>
        <pre>{JSON.stringify(value, null, 2).slice(0, 5000)}</pre>
      </details>
    </div>
  );
}

export function ControlCenter() {
  const [reviewed, setReviewed] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null),
    [otp, setOtp] = useState(''),
    [note, setNote] = useState(''),
    [busy, setBusy] = useState(false),
    [documents, setDocuments] = useState<Record<string, Row>>({});
  const [baseline, setBaseline] = useState<Record<DocKey, unknown> | null>(null),
    [tab, setTab] = useState<DocKey>('site'),
    [text, setText] = useState(''),
    [dirty, setDirty] = useState(false),
    [selected, setSelected] = useState(''),
    [wizard, setWizard] = useState(false),
    [step, setStep] = useState(0),
    [project, setProject] = useState<Project>(blank),
    [mediaUrl, setMediaUrl] = useState('');
  const [media, setMedia] = useState<{ name: string; url: string; created_at?: string }[]>([]);
  const [mediaVisible, setMediaVisible] = useState(false);
  const [history, setHistory] = useState<
    { id: number; key: string; revision: number; action: string; snapshot: { draft: unknown } }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [inbox, setInbox] = useState<
    { id: number; name: string; email: string; message: string; created_at: string }[]
  >([]);
  const [showInbox, setShowInbox] = useState(false);
  const fetchDocs = useCallback(async () => {
    const r = await fetch('/api/admin/documents', { cache: 'no-store' });
    if (!r.ok) throw new Error('Unable to read dashboard');
    const data = await r.json();
    setDocuments(Object.fromEntries((data.documents as Row[]).map((d) => [d.key, d])));
    setBaseline(data.baseline);
  }, []);
  useEffect(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAuthorized(Boolean(d.authorized)))
      .catch(() => setAuthorized(false));
  }, []);
  useEffect(() => {
    if (authorized)
      fetchDocs().catch(() =>
        setNote('Backend database is not ready. Check environment and SQL setup.'),
      );
  }, [authorized, fetchDocs]);
  useEffect(() => {
    if (!baseline) return;
    const value = documents[tab]?.draft ?? documents[tab]?.published ?? baseline[tab];
    setText(JSON.stringify(value, null, 2));
    setDirty(false);
    setReviewed(false);
  }, [tab, documents, baseline]);
  const parsed = useMemo(() => {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }, [text]);
  async function requestCode() {
    setBusy(true);
    setNote('');
    try {
      const r = await fetch('/api/admin/request-code', { method: 'POST' });
      const x = await r.json();
      setNote(x.message || x.error || 'Request failed');
    } catch {
      setNote('Service unavailable');
    } finally {
      setBusy(false);
    }
  }
  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch('/api/admin/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otp }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error);
      setAuthorized(true);
      setOtp('');
      setNote('Authenticated. Your draft changes are private until published.');
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }
  async function action(kind: 'save' | 'publish' | 'restore', override?: unknown) {
    if (kind === 'publish' && !reviewed) {
      setNote('Review the preview and evidence before publishing.');
      return;
    }
    setBusy(true);
    try {
      const value = override ?? parsed;
      if (value == null && kind !== 'restore')
        throw new Error('Invalid JSON. Please correct the editor.');
      const current = documents[tab];
      const r = await fetch('/api/admin/documents', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: tab, value, action: kind, revision: current?.revision ?? 0 }),
      });
      const x = await r.json();
      if (!r.ok) throw new Error(x.error || 'Save failed');
      await fetchDocs();
      setNote(
        kind === 'publish'
          ? 'Published. The public website will reflect the updated content.'
          : kind === 'save'
            ? 'Private draft saved.'
            : 'Draft reset to published content.',
      );
      setDirty(false);
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }
  function editProject(p: Project) {
    setWizard(true);
    setProject({ ...p });
    setStep(0);
    setSelected(p.slug);
  }
  function newProject() {
    editProject({ ...blank });
  }
  function applyProject() {
    const all = Array.isArray(parsed) ? (parsed as Project[]) : [];
    const i = all.findIndex((p) => p.slug === selected);
    const update = { ...project, slug: project.slug.trim(), name: project.name.trim() };
    if (!update.slug || !update.name) {
      setNote('A slug and title are required.');
      return;
    }
    const next = [...all];
    if (i >= 0) next[i] = update;
    else next.push(update);
    setText(JSON.stringify(next, null, 2));
    setDirty(true);
    setWizard(false);
    setNote('Project added to your local draft. Select Save draft, then Publish when ready.');
  }
  function editField(name: string, value: string) {
    if (name === 'metrics') {
      try {
        const metrics = JSON.parse(value);
        if (!Array.isArray(metrics)) throw new Error();
        setProject((p) => ({ ...p, metrics }));
        setNote('Measurement records updated. Include a verifiable source.');
      } catch {
        setNote('Measurements must be a JSON array; invalid input was not applied.');
      }
      return;
    }
    setProject((p) => ({
      ...p,
      [name]:
        name === 'features' || name === 'tags' || name === 'screenshots'
          ? value
              .split(',')
              .map((v) => v.trim())
              .filter(Boolean)
          : value,
    }));
  }
  async function upload(file: File) {
    setBusy(true);
    try {
      const f = new FormData();
      f.append('file', file);
      const r = await fetch('/api/admin/media', { method: 'POST', body: f });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setMediaUrl(j.url);
      setNote('Image uploaded. Copy its URL into a project record or site profile.');
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }
  if (authorized === null)
    return (
      <main className="admin-auth">
        <p>Checking administrator session…</p>
      </main>
    );
  if (!authorized)
    return (
      <main className="admin-auth">
        <Link href="/" className="wordmark">
          shan<span>X</span>AI
        </Link>
        <div className="admin-login">
          <p className="eyebrow">CONTROL CENTER / OWNER ACCESS</p>
          <h1>Private mission control.</h1>
          <p>
            Access is granted exclusively through a six-digit, short-lived code delivered to the
            owner email configured on the server. The hidden logo shortcut is not authentication.
          </p>
          <button type="button" disabled={busy} className="btn btn-primary" onClick={requestCode}>
            Send one-time code
          </button>
          <form onSubmit={signIn}>
            <label htmlFor="admin-code">One-time code</label>
            <input
              id="admin-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              pattern="[0-9]{6}"
            />
            <button disabled={busy || otp.length !== 6} type="submit" className="btn">
              Verify & enter
            </button>
          </form>
          {note && <p role="status">{note}</p>}
        </div>
      </main>
    );
  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link href="/" className="wordmark">
          shan<span>X</span>AI
        </Link>
        <p className="eyebrow">CONTROL CENTER V2</p>
        <h1>Mission control.</h1>
        <nav aria-label="Dashboard sections">
          {tabs.map((x) => (
            <button
              key={x.key}
              aria-current={tab === x.key}
              onClick={() => {
                if (dirty && !window.confirm('Discard unsaved editor changes?')) return;
                setTab(x.key);
                setWizard(false);
              }}
            >
              {x.label}
            </button>
          ))}
        </nav>
        <button
          className="btn"
          onClick={async () => {
            try {
              const r = await fetch('/api/admin/inbox');
              if (!r.ok) throw new Error('Inbox unavailable');
              setInbox((await r.json()).messages || []);
              setShowInbox(true);
            } catch {
              setNote('Unable to load inbox. Check your backend setup.');
            }
          }}
        >
          Inbox · Messages
        </button>
        <button
          className="btn"
          onClick={async () => {
            try {
              const r = await fetch('/api/admin/history');
              if (!r.ok) throw new Error();
              setHistory((await r.json()).history || []);
              setShowHistory(true);
            } catch {
              setNote('Revision history unavailable. Apply the current database schema.');
            }
          }}
        >
          Revision history
        </button>
        <a className="btn" href="/api/admin/history?download=1" download>
          Download private backup
        </a>
        <Link href="/demo/" className="btn">
          Open sample sandbox ↗
        </Link>
        <Link href="/" className="btn">
          Preview public website ↗
        </Link>
        <button
          className="btn"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            setAuthorized(false);
          }}
        >
          Secure sign out
        </button>
      </aside>
      <div className="admin-main">
        {showHistory && (
          <section className="inbox-panel">
            <div className="admin-section-heading">
              <h2>Private revision history</h2>
              <button className="btn" onClick={() => setShowHistory(false)}>
                Close history
              </button>
            </div>
            {history.length === 0 ? (
              <p>No saved revisions.</p>
            ) : (
              history.map((h) => (
                <article key={h.id}>
                  <p>
                    {h.key} · Revision {h.revision} · {h.action}
                  </p>
                  <button
                    className="btn"
                    onClick={() => {
                      if (dirty && !window.confirm('Replace unsaved editor content?')) return;
                      setTab(h.key as DocKey);
                      setTimeout(() => {
                        setText(JSON.stringify(h.snapshot.draft, null, 2));
                        setDirty(true);
                        setNote(
                          'Historical snapshot loaded into editor. Save draft or Publish explicitly.',
                        );
                      }, 0);
                    }}
                  >
                    Load snapshot into draft
                  </button>
                </article>
              ))
            )}
          </section>
        )}
        {showInbox && (
          <section className="inbox-panel">
            <div className="admin-section-heading">
              <h2>Recent contact messages</h2>
              <button className="btn" onClick={() => setShowInbox(false)}>
                Close
              </button>
            </div>
            {inbox.length === 0 ? (
              <p>No messages received yet.</p>
            ) : (
              inbox.map((m) => (
                <article key={m.id}>
                  <p>
                    <strong>{m.name}</strong> · {m.email} ·{' '}
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                  <p>{m.message}</p>
                </article>
              ))
            )}
          </section>
        )}
        <header className="admin-heading">
          <div>
            <p className="eyebrow">PRIVATE DRAFTS · SAFE PUBLISHING</p>
            <h2>{tabs.find((x) => x.key === tab)?.label}</h2>
            <p>{tabs.find((x) => x.key === tab)?.description}</p>
          </div>
          <span className="stage">Revision {documents[tab]?.revision ?? 0}</span>
        </header>
        <p className="admin-alert" role="status">
          {note ||
            'Use Save draft to keep changes private; Publish to make them public. Existing public content remains untouched until published.'}
        </p>
        <div className="admin-controls">
          <button className="btn" disabled={busy} onClick={() => action('save')}>
            Save private draft
          </button>
          <button
            className="btn btn-primary"
            onClick={() => action('publish')}
            disabled={busy || !reviewed || tab === 'register'}
          >
            Publish changes
          </button>
          <button
            className="btn"
            disabled={busy}
            onClick={() => {
              if (window.confirm('Discard your draft and restore published content?'))
                action('restore');
            }}
          >
            Restore published
          </button>
          <button
            className="btn"
            onClick={() => {
              if (!baseline) return;
              setText(JSON.stringify(documents[tab]?.published ?? baseline[tab], null, 2));
              setDirty(true);
            }}
          >
            View published snapshot
          </button>
        </div>
        {tab === 'projects' && (
          <section className="admin-projects">
            <div className="admin-section-heading">
              <h3>Project publishing wizard</h3>
              <button onClick={newProject} className="btn">
                + New project
              </button>
            </div>
            <div className="admin-project-list">
              {(Array.isArray(parsed) ? (parsed as Project[]) : []).map((p) => (
                <button key={p.slug} onClick={() => editProject(p)}>
                  <strong>{p.name}</strong>
                  <small>
                    {p.stage} · {p.slug}
                  </small>
                </button>
              ))}
            </div>
          </section>
        )}
        {wizard && (
          <section className="wizard" aria-label="Project publishing wizard">
            <p className="eyebrow">
              STEP {step + 1} / {steps.length + 1}
            </p>
            <h3>{step < steps.length ? steps[step][1] : 'Review evidence & preview'}</h3>
            <label htmlFor="wizard-entry">
              {step < steps.length ? steps[step][1] : 'Review evidence & preview'}
            </label>
            {step < steps.length ? (
              <textarea
                id="wizard-entry"
                rows={4}
                value={
                  Array.isArray(project[steps[step][0] as keyof Project])
                    ? steps[step][0] === 'metrics'
                      ? JSON.stringify(project.metrics || [])
                      : (project[steps[step][0] as keyof Project] as string[]).join(', ')
                    : String(project[steps[step][0] as keyof Project] || '')
                }
                onChange={(e) => editField(steps[step][0], e.target.value)}
              />
            ) : (
              <DraftPreview tab="projects" value={[project]} />
            )}
            <div className="wizard-selects">
              <label>
                Track
                <select
                  value={project.category}
                  onChange={(e) =>
                    setProject((p) => ({ ...p, category: e.target.value as Project['category'] }))
                  }
                >
                  {roles.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  value={project.stage}
                  onChange={(e) =>
                    setProject((p) => ({ ...p, stage: e.target.value as Project['stage'] }))
                  }
                >
                  {statuses.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="admin-controls">
              <button
                className="btn"
                onClick={() => setStep((x) => Math.max(0, x - 1))}
                disabled={step === 0}
              >
                Previous
              </button>
              {step < steps.length ? (
                <button className="btn btn-primary" onClick={() => setStep((x) => x + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn btn-primary" onClick={applyProject}>
                  Add to draft
                </button>
              )}
              <button className="btn" onClick={() => setWizard(false)}>
                Close
              </button>
            </div>
          </section>
        )}
        <section className="admin-editor-grid">
          <div>
            <div className="admin-section-heading">
              <h3>Structured content editor</h3>
              <span className={parsed === null ? 'stage stage-amber' : 'stage'}>
                {parsed === null ? 'Invalid JSON' : 'JSON valid'}
              </span>
            </div>
            <label htmlFor="json-editor" className="sr-only">
              Edit content as JSON
            </label>
            <textarea
              id="json-editor"
              className="json-editor"
              spellCheck={false}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setDirty(true);
                setReviewed(false);
              }}
            />
            <p className="small-note">
              For precise changes, edit the typed JSON. Academic performance statistics are
              prohibited. External URLs must be HTTPS.
            </p>
          </div>
          <aside className="admin-preview">
            <h3>Live draft preview</h3>
            <p>Updates as you type. Only the Publish action changes the public website.</p>
            <DraftPreview tab={tab} value={parsed} />
            <label className="review-check">
              <input
                type="checkbox"
                checked={reviewed}
                onChange={(e) => setReviewed(e.target.checked)}
              />{' '}
              I reviewed the preview, evidence, links and public permission.
            </label>
            <h3>Media library / Resume</h3>
            <button
              className="btn"
              onClick={async () => {
                try {
                  const r = await fetch('/api/admin/media');
                  if (!r.ok) throw new Error('Storage unavailable');
                  setMedia((await r.json()).files || []);
                  setMediaVisible(true);
                } catch {
                  setNote('Configure your public Supabase Storage bucket to list assets.');
                }
              }}
            >
              Browse uploaded assets
            </button>
            {mediaVisible && (
              <div className="admin-media-list">
                {media.length === 0 ? (
                  <p>No uploaded media.</p>
                ) : (
                  media.map((m) => (
                    <div key={m.name}>
                      <a href={m.url} target="_blank" rel="noopener noreferrer">
                        {m.name}
                      </a>
                      <button onClick={() => navigator.clipboard.writeText(m.url)}>Copy URL</button>
                    </div>
                  ))
                )}
              </div>
            )}
            <label className="media-upload">
              Upload PNG / JPEG / WebP / PDF resume
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
            </label>
            {mediaUrl && (
              <>
                {!mediaUrl.toLowerCase().endsWith('.pdf') && (
                  <img
                    src={mediaUrl}
                    alt="Recently uploaded portfolio asset"
                    style={{ maxWidth: '100%', maxHeight: 180 }}
                  />
                )}
                <button className="btn" onClick={() => navigator.clipboard.writeText(mediaUrl)}>
                  Copy image URL
                </button>
              </>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}
