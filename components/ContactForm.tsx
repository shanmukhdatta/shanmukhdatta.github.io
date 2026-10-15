'use client';
import { useState } from 'react';
export function ContactForm({ email }: { email: string }) {
  const [status, setStatus] = useState(''),
    [sending, setSending] = useState(false),
    [useEmail, setUseEmail] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = new FormData(form);
    const body = Object.fromEntries(fields.entries());
    setSending(true);
    setStatus('Sending securely…');
    window.dispatchEvent(new CustomEvent('shanx-contact-state', { detail: 'sending' }));
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Unable to confirm delivery');
      setStatus('Your message was accepted by the email provider. Thank you.');
      window.dispatchEvent(new CustomEvent('shanx-contact-state', { detail: 'success' }));
      form.reset();
    } catch (e) {
      setUseEmail(true);
      window.dispatchEvent(new CustomEvent('shanx-contact-state', { detail: 'error' }));
      setStatus(
        e instanceof Error ? e.message : 'Message not delivered. Use the email link below.',
      );
    } finally {
      setSending(false);
    }
  }
  return (
    <section className="contact-form-panel" aria-label="Send a message">
      <p className="eyebrow">TRANSMIT A MESSAGE / SECURE CONTACT</p>
      <h3>Send a real message.</h3>
      <p>Fields are checked before delivery. An error never appears as a successful submission.</p>
      <form onSubmit={submit}>
        <label>
          Name
          <input required name="name" minLength={2} maxLength={100} autoComplete="name" />
        </label>
        <label>
          Email
          <input required name="email" type="email" maxLength={180} autoComplete="email" />
        </label>
        <label>
          Message
          <textarea required name="message" minLength={10} maxLength={4000} rows={5} />
        </label>
        <label className="sr-only">
          Leave blank
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button className="btn btn-primary" disabled={sending}>
          {sending ? 'Delivering…' : 'Send message ↗'}
        </button>
      </form>
      <p role="status" aria-live="polite">
        {status}
      </p>
      {useEmail && (
        <a className="text-link" href={`mailto:${email}`}>
          Use your email application instead ↗
        </a>
      )}
    </section>
  );
}
