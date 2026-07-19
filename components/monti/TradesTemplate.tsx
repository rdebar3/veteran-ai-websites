'use client';

import { useEffect, useRef, useState } from 'react';
import type { FillSection, MontiRecord } from '@/lib/monti/types';
import { hasPhoto, photoUrl } from '@/lib/monti/photos';
import './trades-template.css';

function cap(s: unknown, n: number): string {
  const t = s == null ? '' : String(s).trim();
  if (t.length <= n) return t;
  return t.slice(0, Math.max(0, n - 1)).trimEnd() + '…';
}

function initials(name: string): string {
  return (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();
}

function ImgSlot({
  name,
  preset,
  alt,
}: {
  name: string;
  preset: 'hero' | 'feature' | 'band';
  alt: string;
}) {
  const [hide, setHide] = useState(false);
  const src = photoUrl(name, preset);
  return (
    <div className="img">
      {!hide && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onError={() => setHide(true)} />
      )}
    </div>
  );
}

export interface TradesTemplateProps {
  record: MontiRecord;
  fill: FillSection[];
  /** Show hero skeleton while waiting for first hero fill */
  showHeroSkeleton?: boolean;
  showServicesSkeleton?: boolean;
}

export default function TradesTemplate({
  record,
  fill,
  showHeroSkeleton = false,
  showServicesSkeleton = false,
}: TradesTemplateProps) {
  const filled = new Set(fill);
  const hasAny = filled.size > 0 || showHeroSkeleton;
  const b = record.business || { name: '', phone: '', service_area: '', established: null };
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hdrSolid, setHdrSolid] = useState(false);

  useEffect(() => {
    const el = scrollRef.current?.parentElement;
    if (!el) return;
    const onScroll = () => setHdrSolid(el.scrollTop > 40);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!hasAny) {
    return (
      <div className="mt-trades" data-palette={record.palette || 'ember'}>
        <div className="empty-hint">Your site will appear here as we talk…</div>
      </div>
    );
  }

  const name = cap(b.name, 40) || 'Your business';
  const phone = cap(b.phone, 20);
  const area = cap(b.service_area, 60);
  const heroImg =
    record.hero?.image_id && hasPhoto(record.hero.image_id)
      ? record.hero.image_id
      : 'wv_hero';
  const heroCta = cap(record.hero?.cta_text, 22) || 'Get a quote';
  const contactCta = cap(record.contact?.cta_text, 22) || heroCta;
  const phonePrompt =
    cap(record.contact?.phone_prompt, 48) || 'Call for a free estimate';
  const services = (record.services || []).slice(0, 6);
  const badges = (record.trust?.badges || []).slice(0, 4);
  const reviews = (record.trust?.reviews || []).slice(0, 3);
  const emergency = !!record.contact?.emergency;
  const est = b.established;
  const showHero = filled.has('hero');
  const showTrust = filled.has('trust') || filled.has('hero');
  const showServices = filled.has('services');
  const showAbout = filled.has('about');
  const showContact = filled.has('contact');
  const showFrameChrome = showHero; // band + steps once hero exists

  return (
    <div
      ref={scrollRef}
      className="mt-trades"
      data-palette={record.palette || 'ember'}
    >
      <header
        className={`hdr ${hdrSolid ? 'solid' : ''} ${!showHero ? 'on-light' : ''}`}
      >
        <div className="wrap hdr-in">
          <div className="brand">
            <span className="brand-mark">{initials(name)}</span>
            {cap(name, 34)}
          </div>
          <nav className="nav" aria-hidden="true">
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          {phone ? (
            <span className="call">☎ {phone}</span>
          ) : (
            <span className="call" style={{ opacity: 0.5 }}>
              ☎ …
            </span>
          )}
        </div>
      </header>

      {showHero ? (
        <section className="hero fillin">
          <ImgSlot
            name={heroImg}
            preset="hero"
            alt={`${name} — serving ${area || 'West Virginia'}`}
          />
          <div className="scrim" />
          <div className="wrap hero-in">
            <span className="hero-chip">
              ◆ {cap(area, 46) || 'Serving West Virginia'}
            </span>
            <h1>{cap(record.hero?.headline, 64) || name}</h1>
            {record.hero?.subhead ? (
              <p className="lead fillin">{cap(record.hero.subhead, 150)}</p>
            ) : null}
            <div className="hero-cta">
              <span className="btn btn--primary">{heroCta}</span>
              {phone ? (
                <span className="btn btn--ghost">☎ {phone}</span>
              ) : null}
            </div>
            <div className="hero-trust">
              <span>
                <i className="dot" /> Licensed & insured
              </span>
              <span>
                <i className="dot" /> Upfront pricing
              </span>
              <span>
                <i className="dot" /> {est ? `Since ${est}` : 'Local crew'}
              </span>
            </div>
          </div>
        </section>
      ) : showHeroSkeleton ? (
        <section className="hero-skel">
          <div className="wrap" style={{ width: '100%' }}>
            <div className="sk sk-line" style={{ width: 120, height: 11 }} />
            <div className="sk" style={{ height: 34, width: '70%', margin: '14px 0' }} />
            <div className="sk sk-line" style={{ width: '52%' }} />
          </div>
        </section>
      ) : null}

      {showTrust && showHero ? (
        <section className="trustbar fillin">
          <div className="wrap trustbar-in">
            {badges.length > 0 ? (
              badges.map((x) => (
                <div className="tstat" key={x}>
                  <b>✓</b>
                  <span>{cap(x, 24)}</span>
                </div>
              ))
            ) : (
              <>
                <div className="tstat">
                  <b>Local</b>
                  <span>& family-owned</span>
                </div>
                <div className="tstat">
                  <b>Fast</b>
                  <span>response, done right</span>
                </div>
                <div className="tstat">
                  <b>Honest</b>
                  <span>upfront pricing</span>
                </div>
                <div className="tstat">
                  <b>WV</b>
                  <span>owned & operated</span>
                </div>
              </>
            )}
          </div>
        </section>
      ) : null}

      {showServices ? (
        <section className="sec fillin" id="services">
          <div className="wrap">
            <div className="head">
              <p className="kicker">What we do</p>
              <h2 className="title">Every job, done right the first time.</h2>
            </div>
            <div className="grid">
              {services.map((s) => (
                <div className="card" key={s.title}>
                  <span className="ic">◆</span>
                  <h3>{cap(s.title, 30)}</h3>
                  <p>{cap(s.description, 120)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : showServicesSkeleton ? (
        <section className="sec">
          <div className="wrap">
            <div className="sk sk-line" style={{ width: 90, height: 10 }} />
            <div className="sk" style={{ height: 24, width: '40%', margin: '12px 0 20px' }} />
            <div className="grid">
              {[0, 1, 2].map((i) => (
                <div className="card" key={i}>
                  <div
                    className="sk"
                    style={{ width: 38, height: 38, borderRadius: 10, marginBottom: 11 }}
                  />
                  <div className="sk sk-line" style={{ width: '80%' }} />
                  <div className="sk sk-line" style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showAbout ? (
        <section className="sec sec--tint fillin" id="about">
          <div className="wrap">
            <div className="feature">
              <ImgSlot name="work_truck" preset="feature" alt={`${name} — local crew`} />
              <div>
                <p className="kicker">Who you&apos;re hiring</p>
                <h2>A real local crew — not a call center.</h2>
                <p>{cap(record.about?.body, 320)}</p>
                <ul className="points">
                  <li>
                    <i>✓</i> Straight answers and honest quotes
                  </li>
                  <li>
                    <i>✓</i> Clean, and respectful of your property
                  </li>
                  <li>
                    <i>✓</i> Work we stand behind, every time
                  </li>
                </ul>
                <span className="btn btn--primary">{contactCta}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showFrameChrome ? (
        <>
          <section className="band-photo fillin">
            <ImgSlot
              name="wv_band"
              preset="band"
              alt={`${area || 'West Virginia'} — West Virginia`}
            />
            <div className="scrim" />
            <div className="wrap inner">
              <h2 className="disp">Proud to work where we live.</h2>
              <p>
                Born and raised in these mountains — the same hills you call home. When
                you hire us, you&apos;re hiring a neighbor.
              </p>
            </div>
          </section>

          <section className="sec">
            <div className="wrap">
              <div className="head">
                <p className="kicker">How it works</p>
                <h2 className="title">Simple, from first call to clean-up.</h2>
              </div>
              <div className="steps">
                <div className="step">
                  <span className="n">01</span>
                  <h4>Reach out</h4>
                  <p>
                    Call or drop a message. We give you a straight answer and a real time —
                    no runaround.
                  </p>
                </div>
                <div className="step">
                  <span className="n">02</span>
                  <h4>We show up prepared</h4>
                  <p>
                    A clean, uniformed crew arrives on time with the right tools for the job.
                  </p>
                </div>
                <div className="step">
                  <span className="n">03</span>
                  <h4>Done & guaranteed</h4>
                  <p>
                    We finish right, clean up after ourselves, and stand behind the work.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {showAbout && reviews.length > 0 ? (
        <section className="sec sec--tint fillin" id="reviews">
          <div className="wrap">
            <div className="head center">
              <p className="kicker">Reviews</p>
              <h2 className="title">Trusted in homes across WV.</h2>
            </div>
            <div className="reviews">
              {reviews.map((r) => (
                <div className="rev" key={r.name + r.quote.slice(0, 12)}>
                  <div className="stars">★★★★★</div>
                  <q>{cap(r.quote, 200)}</q>
                  <div className="who">
                    {cap(r.name, 28)}
                    <span>{cap(r.detail, 32)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showContact ? (
        <section className="sec fillin" id="contact">
          <div className="wrap">
            <div className="cta-band">
              <div className="glow" />
              <h2>
                {emergency
                  ? "Need help now? We're standing by."
                  : "Let's get your project started."}
              </h2>
              <p>{phonePrompt}.</p>
              <div className="row">
                {phone ? <span className="btn btn--primary">☎ {phone}</span> : null}
                <span className="btn btn--ondark">{contactCta}</span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {showHero ? (
        <footer className="ft">
          <div className="wrap">
            <div className="ft-grid">
              <div style={{ maxWidth: '30ch' }}>
                <div className="brand" style={{ color: '#fff', marginBottom: 12 }}>
                  <span className="brand-mark">{initials(name)}</span>
                  {cap(name, 34)}
                </div>
                <p>Honest, professional work for the mountains of West Virginia.</p>
              </div>
              <div>
                <h5>CONTACT</h5>
                <p>
                  {phone || '—'}
                  <br />
                  {cap(area, 50) || 'West Virginia'}
                </p>
              </div>
              <div>
                <h5>SERVICE AREA</h5>
                <p>
                  {cap(area, 60) || 'West Virginia'}
                  <br />& surrounding WV
                </p>
              </div>
            </div>
            <div className="ft-bottom">
              <span>
                © {cap(name, 40)}
                {est ? ` · Since ${est}` : ''}
              </span>
              <span>Site by Veteran AI Websites</span>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
