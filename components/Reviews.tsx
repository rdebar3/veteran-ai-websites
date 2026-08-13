'use client';

import { useEffect, useState } from 'react';


const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type Review = {
  name: string;
  business: string | null;
  rating: number;
  body: string;
  created_at: string;
};

const styles = `
.rv{position:relative;background:transparent;color:#eef4f8;padding:clamp(48px,7vw,96px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.07)}
.rv__head{max-width:640px;margin:0 auto clamp(30px,4vw,50px);text-align:center}
.rv__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px}
.rv__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:600;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0}
.rv__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.82)}
.rv__grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;max-width:1080px;margin:0 auto clamp(36px,5vw,56px)}
.rv__card{position:relative;overflow:hidden;border:1px solid rgba(233,240,246,.14);border-radius:16px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:26px 24px;transition:border-color .25s,transform .3s,box-shadow .3s}
.rv__card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc,#5b9bd5);z-index:3}
.rv__card:hover{border-color:rgba(233,240,246,.34);transform:translateY(-5px);box-shadow:0 24px 56px rgba(0,0,0,.5)}
.rv__grid .rv__card:nth-child(4n+1){--acc:#5b9bd5}
.rv__grid .rv__card:nth-child(4n+2){--acc:#e0912f}
.rv__grid .rv__card:nth-child(4n+3){--acc:#c2452f}
.rv__grid .rv__card:nth-child(4n){--acc:#6cc79a}
.rv__stars{color:#f0c56a;font-size:15px;letter-spacing:2px;margin-bottom:12px}
.rv__stars .off{color:rgba(233,240,246,.2)}
.rv__body{font-size:15px;line-height:1.6;color:rgba(233,240,246,.9);margin:0 0 16px}
.rv__who{font-size:14px;color:#fff;font-weight:600}
.rv__who span{display:block;font-weight:400;color:rgba(233,240,246,.72);font-size:13px;margin-top:2px}
.rv__form{position:relative;overflow:hidden;max-width:560px;margin:0 auto;border:1px solid rgba(233,240,246,.14);border-radius:20px;background:rgba(12,16,22,.62);backdrop-filter:blur(12px) saturate(1.15);-webkit-backdrop-filter:blur(12px) saturate(1.15);padding:clamp(24px,4vw,36px)}
.rv__form::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#5b9bd5,#e0912f,#c2452f);z-index:3}
.rv__form h3{font-family:var(--font-sans);font-size:19px;font-weight:600;color:#fff;margin:0 0 6px;text-align:center}
.rv__form p.hint{font-size:13.5px;color:rgba(233,240,246,.72);text-align:center;margin:0 0 22px}
.rv__row{display:flex;gap:12px;margin-bottom:14px}
.rv__row>*{flex:1}
.rv__label{display:block;font-size:13px;font-weight:600;color:rgba(233,240,246,.88);margin:0 0 7px}
.rv__field{width:100%;font-family:var(--font-sans);font-size:15px;color:#eef4f8;background:rgba(255,255,255,.04);border:1px solid rgba(233,240,246,.22);border-radius:11px;padding:13px 15px;transition:border-color .2s}
.rv__field:focus{outline:2px solid #e3b23c;outline-offset:2px;border-color:transparent}
.rv__field::placeholder{color:rgba(233,240,246,.62)}
textarea.rv__field{resize:vertical;min-height:110px;line-height:1.5}
.rv__rate{display:flex;align-items:center;gap:2px;margin-bottom:16px}
.rv__rate span{font-size:14px;color:rgba(233,240,246,.85)}
.rv__rate button{background:none;border:none;cursor:pointer;font-size:26px;line-height:1;color:rgba(233,240,246,.45);padding:6px;transition:color .15s}
.rv__rate button.on{color:#f0c56a}
.rv__rate button:focus-visible{outline:2px solid #e3b23c;outline-offset:2px;border-radius:4px}
.rv__submit{width:100%;position:relative;isolation:isolate;overflow:hidden;font-family:var(--font-sans);font-size:16px;font-weight:600;padding:15px;border-radius:999px;border:1px solid rgba(233,240,246,.3);cursor:pointer;background:rgba(255,255,255,.06);color:#eef4f8;transition:color .25s,border-color .25s,transform .25s,box-shadow .25s;margin-top:4px}
.rv__submit::after{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;background:linear-gradient(135deg,#fff,#dbe4ee);opacity:0;transform:scale(.92);transition:opacity .28s,transform .28s}
.rv__submit:hover{color:#0a0e14;border-color:transparent;transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,0,0,.5)}
.rv__submit:hover::after{opacity:1;transform:scale(1)}
.rv__submit:disabled{opacity:.6;cursor:default;transform:none}
.rv__cta-row{display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:4px}
.rv__phone{font-family:var(--font-sans);font-size:14px;font-weight:600;color:#f4f7fa;text-decoration:none;border-bottom:1px solid rgba(244,247,250,.35);padding:2px 0;transition:border-color .2s,color .2s}
.rv__phone:hover{color:#fff;border-bottom-color:#fff}
.rv__msg{text-align:center;font-size:15px;margin-top:14px}
.rv__msg.ok{color:#8fe3b0}
.rv__msg.err{color:#ff9b9b}
.rv__thanks{max-width:560px;margin:0 auto;border:1px solid rgba(143,227,176,.4);background:rgba(143,227,176,.08);border-radius:20px;padding:36px;text-align:center;color:#d8f5e4}
.rv__thanks h3{font-size:20px;color:#fff;margin:0 0 8px}
@media(max-width:560px){.rv__row{flex-direction:column;gap:14px}}
`;

function Stars({ value }: { value: number }) {
  return (
    <div className="rv__stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? '' : 'off'}>
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * Leave-a-review section (lives below the contact form).
 * Empty / “no reviews yet” UI intentionally removed — do not reintroduce.
 */
export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!SUPA_URL || !SUPA_KEY) return;
    fetch(
      `${SUPA_URL}/rest/v1/reviews?approved=eq.true&select=name,business,rating,body,created_at&order=created_at.desc`,
      { headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` } }
    )
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setReviews(d);
      })
      .catch(() => {});
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim() || !SUPA_URL || !SUPA_KEY) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${SUPA_URL}/rest/v1/reviews`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: name.trim().slice(0, 80),
          business: business.trim() ? business.trim().slice(0, 120) : null,
          rating,
          body: body.trim().slice(0, 1500),
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError('Could not submit your review. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="reviews" className="rv">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="rv__head">
        <p className="rv__eyebrow">Reviews</p>
        <h2 className="rv__title">Worked with me? Leave a review.</h2>
        <p className="rv__sub">
          If we’ve worked together, I’d be grateful for a few honest words. Your name and business
          help other local owners decide.
        </p>
      </div>

      {/*
        ─────────────────────────────────────────────────────────────
        TESTIMONIALS PLACEHOLDER — add real quotes here later.
        Structure each card as: quote / name / business / town, WV

        Example (uncomment and fill in when you have reviews):

        <div className="rv__grid">
          <div className="rv__card">
            <p className="rv__body">“QUOTE_HERE”</p>
            <p className="rv__who">
              NAME_HERE
              <span>BUSINESS_HERE · TOWN, WV</span>
            </p>
          </div>
          // …more cards
        </div>

        Approved Supabase reviews (if any) still render below automatically.
        ─────────────────────────────────────────────────────────────
      */}

      {reviews.length > 0 && (
        <div className="rv__grid">
          {reviews.map((r, i) => (
            <div key={i} className="rv__card">
              <Stars value={r.rating} />
              <p className="rv__body">“{r.body}”</p>
              <p className="rv__who">
                {r.name}
                {r.business && <span>{r.business}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {done ? (
        <div className="rv__thanks">
          <h3>Thank you</h3>
          <p>Your review has been submitted and will appear here once it’s approved.</p>
        </div>
      ) : (
        <form className="rv__form" onSubmit={submit}>
          <h3>Leave a review</h3>
          <p className="hint">Tell others what your experience was like.</p>
          <div className="rv__row">
            <div>
              <label className="rv__label" htmlFor="rv-name">
                Your name
              </label>
              <input
                id="rv-name"
                className="rv__field"
                placeholder="Jane Smith"
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="rv__label" htmlFor="rv-business">
                Business (optional)
              </label>
              <input
                id="rv-business"
                className="rv__field"
                placeholder="Smith & Co."
                value={business}
                maxLength={120}
                onChange={(e) => setBusiness(e.target.value)}
              />
            </div>
          </div>
          <div className="rv__rate">
            <span id="rv-rating-label">Your rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={n <= rating ? 'on' : ''}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-describedby="rv-rating-label"
              >
                ★
              </button>
            ))}
          </div>
          <div>
            <label className="rv__label" htmlFor="rv-body">
              Your experience
            </label>
            <textarea
              id="rv-body"
              className="rv__field"
              placeholder="What was your experience working with me?"
              value={body}
              maxLength={1500}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <div className="rv__cta-row">
            <button className="rv__submit" type="submit" disabled={submitting} style={{ marginTop: 0 }}>
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
          {error && <p className="rv__msg err">{error}</p>}
        </form>
      )}
    </section>
  );
}
