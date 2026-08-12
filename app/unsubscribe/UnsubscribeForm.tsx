'use client';

import { useState } from 'react';

const styles = `
.unsub-form{display:flex;flex-direction:column;gap:12px;max-width:420px}
.unsub-label{font-size:13.5px;font-weight:600;color:rgba(233,240,246,.85)}
.unsub-input{width:100%;font-family:var(--font-sans);font-size:15px;color:#eef4f8;background:rgba(255,255,255,.04);border:1px solid rgba(233,240,246,.2);border-radius:12px;padding:13px 15px}
.unsub-input:focus{outline:2px solid #e3b23c;outline-offset:2px;border-color:transparent}
.unsub-btn{font-family:var(--font-sans);font-size:15px;font-weight:700;padding:14px 20px;border-radius:999px;border:1px solid rgba(233,240,246,.3);background:rgba(255,255,255,.08);color:#eef4f8;cursor:pointer}
.unsub-btn:hover{background:#f4f7fa;color:#0a0e14;border-color:transparent}
.unsub-btn:disabled{opacity:.6;cursor:default}
.unsub-msg{font-size:14.5px;line-height:1.5;margin:0}
.unsub-msg.ok{color:#8fe3b0}
.unsub-msg.err{color:#ff9b9b}
`;

export default function UnsubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again or call me.');
        return;
      }
      setStatus('done');
      setMessage(
        data.message ||
          `You’re unsubscribed. ${trimmed} will not receive marketing emails from Veteran AI Websites.`
      );
    } catch {
      setStatus('error');
      setMessage('Something went wrong reaching the server. Please try again.');
    }
  }

  if (status === 'done') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <p className="unsub-msg ok" role="status">
          {message}
        </p>
      </>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <form className="unsub-form" onSubmit={onSubmit} noValidate>
        <div>
          <label className="unsub-label" htmlFor="unsub-email">
            Email address
          </label>
          <input
            id="unsub-email"
            className="unsub-input"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <button className="unsub-btn" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting…' : 'Unsubscribe'}
        </button>
        {status === 'error' && (
          <p className="unsub-msg err" role="alert">
            {message}
          </p>
        )}
      </form>
    </>
  );
}
