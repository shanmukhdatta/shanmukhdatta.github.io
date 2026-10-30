'use client';

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '@/lib/bujji-core';

const suggestions = ['What are you building?', 'Show me the research', 'How can I get in touch?'];
export default function Bujji({ navigate }: { navigate: (page: 'home' | 'work' | 'blogs' | 'about') => void }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [mode, setMode] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => { if (open) dialog.current?.showModal(); else dialog.current?.close(); }, [open]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, error]);
  useEffect(() => () => abort.current?.abort(), []);
  function close() { setOpen(false); launcher.current?.focus(); }
  function cancel() { abort.current?.abort(); }
  async function send(question: string) {
    if (!question.trim() || busy) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: question.trim() }];
    setMessages(next); setInput(''); setBusy(true); setError(''); setNotice('');
    const controller = new AbortController(); abort.current = controller;
    try {
      // Four complete turns plus the current question keep provider cost bounded.
      const response = await fetch('/api/bujji', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-9).map(message => ({ ...message, content: message.content.slice(0, 1600) })) }), signal: AbortSignal.any([controller.signal, AbortSignal.timeout(28_000)]) });
      const result = await response.json();
      if (!response.ok || typeof result.reply !== 'string') throw new Error(result.error || 'Bujji could not answer. Please try again.');
      setMessages([...next, { role: 'assistant', content: result.reply }]); setMode(result.mode); setNotice(result.notice || '');
    } catch (err) {
      setMessages(next.slice(0, -1)); setInput(question);
      setError(controller.signal.aborted ? 'Reply stopped. Your question is ready to edit or resend.' : err instanceof Error ? err.message : 'Please try again.');
    } finally { setBusy(false); abort.current = null; }
  }
  return <>
    <button ref={launcher} type="button" className="bujji-launcher" aria-haspopup="dialog" aria-expanded={open} aria-controls="bujji-dialog" onClick={() => setOpen(true)}>
      <span className="bujji-face" aria-hidden="true">:)</span><span><strong>Ask Bujji</strong><small>Your notebook guide</small></span><span aria-hidden="true">↗</span>
    </button>
    <dialog ref={dialog} id="bujji-dialog" className="bujji-dialog" aria-labelledby="bujji-title" onCancel={close} onClose={close}>
      <header className="bujji-head"><span className="bujji-face" aria-hidden="true">:)</span><div><h2 id="bujji-title">Meet Bujji.</h2><p>A little help finding your way.</p></div><button type="button" className="bujji-close" onClick={close} aria-label="Close Bujji">✕</button></header>
      <div className="bujji-log" ref={log} role="log" aria-label="Conversation with Bujji" aria-live="polite" aria-relevant="additions text">
        <div className="bujji-message assistant"><span className="eyebrow">BUJJI / NOTEBOOK GUIDE</span><p>Hello! I can help you explore Shanmukh’s projects, research, and experience. What would you like to know?</p></div>
        {messages.map((message, i) => <div key={i} className={`bujji-message ${message.role}`}><span className="eyebrow">{message.role === 'user' ? 'YOU' : 'BUJJI'}</span><p>{message.content}</p></div>)}
        {busy && <p className="bujji-thinking" role="status">Turning a page<span aria-hidden="true">…</span></p>}
        {notice && <p className="bujji-notice">{notice}</p>}
        {error && <p className="bujji-error" role="alert">{error}</p>}
      </div>
      {!messages.length && <div className="bujji-suggestions">{suggestions.map(question => <button type="button" key={question} disabled={busy} onClick={() => void send(question)}>{question} ↗</button>)}</div>}
      <div className="bujji-shortcuts"><button type="button" onClick={() => { close(); navigate('work'); }}>Explore work ↗</button><button type="button" onClick={() => { close(); navigate('about'); }}>About Shanmukh ↗</button><button type="button" disabled={busy || !messages.length} onClick={() => { setMessages([]); setError(''); setNotice(''); }}>Clear chat</button></div>
      <form className="bujji-form" onSubmit={e => { e.preventDefault(); void send(input); }}>
        <label htmlFor="bujji-question" className="sr-only">Your question for Bujji</label>
        <input id="bujji-question" autoComplete="off" maxLength={1600} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the notebook…" disabled={busy} />
        {busy ? <button type="button" onClick={cancel}>Stop</button> : <button type="submit" disabled={!input.trim()} aria-label="Send question">↑</button>}
      </form>
      <p className="bujji-disclosure">{mode === 'notebook' ? 'Notebook answers · ' : 'AI guide · '}Replies may be imperfect. Live questions are sent to Groq. Please avoid sensitive information.</p>
    </dialog>
  </>;
}
