'use client';

import { useState } from 'react';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const projectTypes = ['New website', 'Redesign', 'Online store', 'Not sure yet'];

const styles = `
.iq{position:relative;background:transparent;color:#eef4f8;padding:clamp(48px,7vw,100px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.iq__wrap{max-width:760px;margin:0 auto}
.iq__head{text-align:center;margin:0 auto clamp(28px,4vw,44px);max-width:600px}
.iq__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.iq__title{font-family:var(--font-sans);font-size:clamp(26px,3.4vw,44px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.iq__sub{margin:14px auto 0;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.72)}
.iq__form{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:22px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,40px)}
.iq__form::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#e0912f,#c2452f);z-index:3}
.iq__row{display:flex;gap:14px;margin-bottom:14px}
.iq__row>*{flex:1}
.iq__label{display:block;font-size:13px;font-weight:500;color:rgba(233,240,246,.7);margin:0 0 7px}
.iq__field{width:100%;font-family:var(--font-sans);font-size:15px;color:#eef4f8;background:rgba(255,255,255,.04);border:1px solid rgba(233,240,246,.16);border-radius:12px;padding:13px 15px;transition:border-color .2s}
.iq__field:focus{outline:none;border-color:rgba(233,240,246,.72)}
.iq__field::placeholder{color:rgba(233,240,246,.55)}
select.iq__field{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23aeb8c2' d='M6 8 0 0h12z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 15px center}
.iq__field option{background:#10151f;color:#eef4f8}
textarea.iq__field{resize:vertical;min-height:120px;line-height:1.5}
.iq__block{margin-bottom:14px}
.iq__submit{width:100%;position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:16px;font-weight:600;padding:16px;border-radius:999px;border:1px solid rgba(233,240,246,.3);cursor:pointer;background:rgba(255,255,255,.06);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s;margin-top:6px}
.iq__submit::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.iq__submit:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.5)}
.iq__submit:hover::after{opacity:1;transform:scale(1)}
.iq__submit:disabled{opacity:.6;cursor:default;transform:none}
.iq__msg{text-align:center;font-size:14px;margin-top:14px}
.iq__msg.err{color:#ff9b9b}
.iq__note{text-align:center;font-size:13px;color:rgba(233,240,246,.72);margin:16px 0 0}
.iq__thanks{border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:22px;padding:40px 28px;text-align:center;color:#d8f5e4}
.iq__thanks h3{font-size:22px;color:#fff;margin:0 0 8px}
.iq__thanks p{font-size:16px;color:rgba(216,245,228,.9);margin:0}
@media(max-width:560px){.iq__row{flex-direction:column;gap:14px}}
`;

export default function Intake() {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !SUPA_URL || !SUPA_KEY) return;
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
        body: JSON.stringify({
          name: name.trim().slice(0, 100),
          business: business.trim() ? business.trim().slice(0, 140) : null,
          email: email.trim() ? email.trim().slice(0, 160) : null,
          phone: phone.trim() ? phone.trim().slice(0, 40) : null,
          project_type: projectType,
          message: message.trim().slice(0, 3000),
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError('Something went wrong sending your inquiry. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="iq">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="iq__wrap">
        <div className="iq__head">
          <p className="iq__eyebrow">Start your project</p>
          <h2 className="iq__title">Have a site in mind? Let’s talk.</h2>
          <p className="iq__sub">
            Tell me a little about your business and what you’re after. I’ll get back to you
            personally — no obligation, no pressure.
          </p>
        </div>

        {done ? (
          <div className="iq__thanks">
            <h3>Got it — thank you! 🎉</h3>
            <p>Your inquiry came through. I’ll reach out personally, usually within a day.</p>
          </div>
        ) : (
          <form className="iq__form" onSubmit={submit}>
            <div className="iq__row">
              <div>
                <label className="iq__label">Your name *</label>
                <input className="iq__field" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" required />
              </div>
              <div>
                <label className="iq__label">Business name</label>
                <input className="iq__field" value={business} maxLength={140} onChange={(e) => setBusiness(e.target.value)} placeholder="Smith &amp; Co." />
              </div>
            </div>

            <div className="iq__row">
              <div>
                <label className="iq__label">Email</label>
                <input className="iq__field" type="email" value={email} maxLength={160} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div>
                <label className="iq__label">Phone</label>
                <input className="iq__field" type="tel" value={phone} maxLength={40} onChange={(e) => setPhone(e.target.value)} placeholder="(304) 555-0000" />
              </div>
            </div>

            <div className="iq__block">
              <label className="iq__label">What do you need?</label>
              <select className="iq__field" value={projectType} onChange={(e) => setProjectType(e.target.value)}>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="iq__block">
              <label className="iq__label">Tell me about your project *</label>
              <textarea className="iq__field" value={message} maxLength={3000} onChange={(e) => setMessage(e.target.value)} placeholder="What kind of site are you looking for? Any examples you like, timeline, or goals?" required />
            </div>

            <button className="iq__submit" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send my inquiry'}
            </button>
            {error && <p className="iq__msg err">{error}</p>}
            <p className="iq__note">Prefer to talk? Your inquiry reaches me directly — I’ll follow up personally.</p>
          </form>
        )}
      </div>
    </section>
  );
}
