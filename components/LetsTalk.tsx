'use client';

import { useState, type FormEvent } from 'react';
import ScheduleCall from '@/components/ScheduleCall';
import { SOFTWARE_REVIEW_TOPIC } from '@/lib/data';
import { validateInquiry } from '@/lib/inquiry';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const styles = `
.lt{position:relative;color:#eef4f8;padding:clamp(44px,6vw,84px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.lt__inner{max-width:720px;margin:0 auto}
.lt__head{text-align:center;margin:0 auto clamp(26px,3.5vw,40px)}
.lt__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.lt__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.lt__panel{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,36px)}
.lt__panel::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#6cc79a,#e0912f);z-index:2;pointer-events:none}
.lt__lead{margin:0;font-size:clamp(15.5px,1.2vw,17.5px);line-height:1.6;color:rgba(233,240,246,.92)}
.lt__actions{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px;margin-top:22px}
.lt__review .sched__btn{color:#fff;background:#12161d;border:1px solid rgba(255,255,255,.38);box-shadow:0 12px 30px rgba(0,0,0,.5)}
.lt__review .sched__btn:hover{color:#0a0e14;background:#fff;border-color:#fff;transform:translateY(-2px);box-shadow:0 16px 38px rgba(0,0,0,.5)}
.lt__callnote{margin:14px 0 0;text-align:center;font-family:var(--font-sans);font-size:12.5px;line-height:1.35;color:rgba(233,240,246,.72)}
.lt__rule{border:0;border-top:1px solid rgba(233,240,246,.14);margin:26px 0 22px}
.lt__type{margin:0 0 16px;font-family:var(--font-sans);font-size:clamp(18px,2vw,22px);font-weight:600;letter-spacing:-.02em;line-height:1.2;color:#fff}
.lt__block{margin-bottom:14px}
.lt__label{display:block;font-size:13px;font-weight:600;color:rgba(233,240,246,.88);margin:0 0 7px}
.lt__field{width:100%;font-family:var(--font-sans);font-size:15px;color:#eef4f8;background:rgba(255,255,255,.04);border:1px solid rgba(233,240,246,.22);border-radius:12px;padding:13px 15px;transition:border-color .2s}
.lt__field:focus{outline:2px solid #e3b23c;outline-offset:2px;border-color:transparent}
.lt__field::placeholder{color:rgba(233,240,246,.62)}
textarea.lt__field{resize:vertical;min-height:0;line-height:1.5}
.lt__fielderr{color:#ff9b9b;font-size:13px;line-height:1.4;margin:6px 0 0}
.lt__submit{width:100%;position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:16px;font-weight:600;padding:16px;border-radius:999px;border:1px solid rgba(233,240,246,.3);cursor:pointer;background:rgba(255,255,255,.06);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s}
.lt__submit::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.lt__submit:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.5)}
.lt__submit:hover::after{opacity:1;transform:scale(1)}
.lt__submit:disabled{opacity:.6;cursor:default;transform:none}
.lt__msg{text-align:center;font-size:14px;line-height:1.45;color:#ff9b9b;margin:14px 0 0}
.lt__reassure{text-align:center;font-size:13px;line-height:1.45;color:rgba(233,240,246,.82);margin:16px 0 0}
.lt__thanks{border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:16px;padding:28px 22px;text-align:center}
.lt__thanks h3{font-family:var(--font-sans);font-size:22px;font-weight:600;letter-spacing:-.02em;color:#fff;margin:0 0 8px}
.lt__thanks p{font-size:16px;line-height:1.5;color:rgba(216,245,228,.9);margin:0}
@media(max-width:640px){
  .lt__actions{flex-direction:column;align-items:stretch}
  .lt__actions .sched{display:flex;width:100%;align-items:stretch}
  .lt__actions .sched__btn{width:100%;white-space:normal;text-align:center;line-height:1.25}
}
`;

export default function LetsTalk() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<{
    field: 'name' | 'phone';
    message: string;
  } | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const result = validateInquiry({ name, phone, message });
    if (!result.ok) {
      if (result.field === 'name' || result.field === 'phone') {
        setFieldError({ field: result.field, message: result.message });
        setError('');
      } else {
        setFieldError(null);
        setError(result.message);
      }
      return;
    }
    setFieldError(null);
    if (!SUPA_URL || !SUPA_KEY) {
      setError('The note isn’t connected right now — grab a time above instead.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/inquiries`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(result.row),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError('Something went wrong sending your note. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="lt" aria-labelledby="lt-title">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="lt__inner">
        <div className="lt__head">
          <p className="lt__eyebrow">Let’s talk</p>
          <h2 id="lt-title" className="lt__title">
            Twenty minutes. I call you.
          </h2>
        </div>

        <div className="lt__panel">
          <p className="lt__lead">
            Want a site? Pick a plan above and grab a time. Not sure what you need? Book a free
            business software review: tell me how your day runs and I’ll tell you where software
            could save you hours, and whether it’s worth building at all. No pitch, no obligation.
          </p>

          <div className="lt__actions">
            <ScheduleCall />
            <ScheduleCall
              className="lt__review"
              label="Book a software review"
              query={`topic=${SOFTWARE_REVIEW_TOPIC}`}
            />
          </div>
          <p className="lt__callnote">20 minutes. I call you. Calls are weekdays, Eastern time.</p>

          {done ? (
            <>
              <hr className="lt__rule" />
              <div className="lt__thanks">
                <h3>Got it — thank you.</h3>
                <p>I’ll call you within a day, usually sooner.</p>
              </div>
            </>
          ) : (
            <>
              <hr className="lt__rule" />
              <h3 className="lt__type">Rather type? Send me a note.</h3>
              <form className="lt__form" onSubmit={submit} noValidate>
                <div className="lt__block">
                  <label className="lt__label" htmlFor="lt-name">
                    Your name *
                  </label>
                  <input
                    id="lt-name"
                    className="lt__field"
                    value={name}
                    maxLength={100}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldError?.field === 'name') setFieldError(null);
                    }}
                    autoComplete="name"
                    required
                    aria-invalid={fieldError?.field === 'name' || undefined}
                  />
                  {fieldError?.field === 'name' && (
                    <p className="lt__fielderr">{fieldError.message}</p>
                  )}
                </div>

                <div className="lt__block">
                  <label className="lt__label" htmlFor="lt-phone">
                    Phone *
                  </label>
                  <input
                    id="lt-phone"
                    className="lt__field"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    maxLength={40}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldError?.field === 'phone') setFieldError(null);
                    }}
                    autoComplete="tel"
                    required
                    aria-invalid={fieldError?.field === 'phone' || undefined}
                  />
                  {fieldError?.field === 'phone' && (
                    <p className="lt__fielderr">{fieldError.message}</p>
                  )}
                </div>

                <div className="lt__block">
                  <label className="lt__label" htmlFor="lt-message">
                    What’s going on?
                  </label>
                  <textarea
                    id="lt-message"
                    className="lt__field"
                    value={message}
                    rows={3}
                    maxLength={3000}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button className="lt__submit" type="submit" disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send my note'}
                </button>
                {error && <p className="lt__msg">{error}</p>}
                <p className="lt__reassure">
                  Your note comes straight to me — not a sales team.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
