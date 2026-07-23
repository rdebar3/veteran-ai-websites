'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { FillSection, MontiRecord, MontiService, SiteLayout } from '@/lib/monti/types';
import {
  hasPhoto,
  photoUrl,
  type PhotoVariants,
} from '@/lib/monti/photos';
import {
  getNichePreset,
  type NicheBlock,
  type NichePreset,
  type SitePage,
} from '@/lib/monti/niche-presets';
import { tradeLabel } from '@/lib/monti/trade-labels';
import { resolveServiceIcon, ServiceIcon } from '@/components/monti/TradeIcons';
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
  variant = 0,
}: {
  name: string;
  preset: 'hero' | 'feature' | 'band';
  alt: string;
  variant?: number;
}) {
  const [hide, setHide] = useState(false);
  const src = photoUrl(name, preset, variant);
  return (
    <div className="img">
      {!hide && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={alt}
          loading={preset === 'hero' ? 'eager' : 'lazy'}
          onError={() => setHide(true)}
        />
      )}
    </div>
  );
}

/**
 * Hero media: photo always (poster + mobile/reduced-motion/saveData fallback).
 * Video only on desktop-class screens when the session drew a video clip —
 * muted autoplay loop, paused off-screen / hidden tab.
 */
function HeroMedia({
  name,
  alt,
  variant = 0,
  videoSrc = null,
}: {
  name: string;
  alt: string;
  variant?: number;
  videoSrc?: string | null;
}) {
  const [hideImg, setHideImg] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = photoUrl(name, 'hero', variant);

  // Gate video: desktop min-width 769, no reduced-motion, no saveData.
  useEffect(() => {
    if (!videoSrc || typeof window === 'undefined') {
      setAllowVideo(false);
      return;
    }
    const desktopMq = window.matchMedia('(min-width: 769px)');
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean };
      }
    ).connection;
    const compute = () => {
      const saveData = !!conn?.saveData;
      setAllowVideo(desktopMq.matches && !motionMq.matches && !saveData);
    };
    compute();
    desktopMq.addEventListener('change', compute);
    motionMq.addEventListener('change', compute);
    return () => {
      desktopMq.removeEventListener('change', compute);
      motionMq.removeEventListener('change', compute);
    };
  }, [videoSrc]);

  // Pause when hero off-screen or tab hidden — no background GPU burn.
  useEffect(() => {
    if (!allowVideo || !videoSrc) return;
    const el = wrapRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    let visible = true;
    let inView = true;

    const sync = () => {
      if (visible && inView) {
        const p = vid.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } else {
        vid.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    const onVis = () => {
      visible = document.visibilityState === 'visible';
      sync();
    };
    document.addEventListener('visibilitychange', onVis);
    sync();

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      vid.pause();
    };
  }, [allowVideo, videoSrc, videoReady]);

  return (
    <div className="img hero-media" ref={wrapRef}>
      {!hideImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={poster}
          src={poster}
          alt={alt}
          loading="eager"
          onError={() => setHideImg(true)}
        />
      )}
      {allowVideo && videoSrc ? (
        <video
          ref={videoRef}
          className={`hero-video${videoReady ? ' hero-video--ready' : ''}`}
          src={videoSrc}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
        />
      ) : null}
    </div>
  );
}

function resolveLayout(raw: MontiRecord['layout']): SiteLayout {
  if (raw === 'bold' || raw === 'split') return raw;
  return 'classic';
}

const NAV_PAGES: { id: SitePage; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

function ServicesList({
  layout,
  services,
  presentation,
  kicker,
  title,
  trade,
  preview,
  onViewAll,
}: {
  layout: SiteLayout;
  services: MontiService[];
  presentation: NichePreset['servicesPresentation'];
  kicker: string;
  title: string;
  trade: string | null;
  preview?: boolean;
  onViewAll?: () => void;
}) {
  const list = preview ? services.slice(0, 3) : services;

  const body =
    presentation === 'checklist' ? (
      <ul className="svc-check">
        {list.map((s) => {
          const ic = resolveServiceIcon(trade, s.title, s.description);
          return (
            <li className="svc-check-item" key={s.title}>
              {ic ? (
                <ServiceIcon id={ic} className="svc-ic svc-ic--check" />
              ) : (
                <i className="svc-check-mark" aria-hidden="true">
                  ✓
                </i>
              )}
              <div>
                <h3>{cap(s.title, 30)}</h3>
                <p>{cap(s.description, 120)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    ) : presentation === 'list' || layout === 'bold' ? (
      <div className="svc-list">
        {list.map((s, i) => {
          const ic = resolveServiceIcon(trade, s.title, s.description);
          return (
            <div className="svc-row" key={s.title}>
              {ic ? (
                <ServiceIcon id={ic} className="svc-ic" />
              ) : (
                <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
              )}
              <div>
                <h3>{cap(s.title, 30)}</h3>
                <p>{cap(s.description, 120)}</p>
              </div>
            </div>
          );
        })}
      </div>
    ) : layout === 'split' && !preview ? (
      <div className="svc-alt">
        {list.map((s, i) => (
          <div
            className={`svc-alt-row${i % 2 === 1 ? ' rev' : ''}`}
            key={s.title}
          >
            <div className="svc-alt-copy">
              <span className="svc-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{cap(s.title, 30)}</h3>
              <p>{cap(s.description, 120)}</p>
            </div>
            <div className="svc-alt-rule" aria-hidden="true" />
          </div>
        ))}
      </div>
    ) : (
      <div className={`grid${presentation === 'proof' ? ' grid--proof' : ''}`}>
        {list.map((s) => {
          const ic = resolveServiceIcon(trade, s.title, s.description);
          return (
            <div className="card" key={s.title}>
              {ic ? <ServiceIcon id={ic} className="svc-ic svc-ic--card" /> : null}
              <h3>{cap(s.title, 30)}</h3>
              <p>{cap(s.description, 120)}</p>
            </div>
          );
        })}
      </div>
    );

  return (
    <section className={`sec fillin${preview ? ' sec--preview' : ''}`} id={preview ? undefined : 'services'}>
      <div className="wrap">
        <div className="head">
          <p className="kicker">{kicker}</p>
          <h2 className="title">{preview ? 'What we do best.' : title}</h2>
        </div>
        {body}
        {preview && onViewAll ? (
          <button type="button" className="page-link" onClick={onViewAll}>
            View all services →
          </button>
        ) : null}
      </div>
    </section>
  );
}

export interface TradesTemplateProps {
  record: MontiRecord;
  fill: FillSection[];
  showHeroSkeleton?: boolean;
  showServicesSkeleton?: boolean;
  photoVariants?: PhotoVariants;
  /** Session-locked video hero path, or null for photo-only. */
  heroVideoSrc?: string | null;
}

export default function TradesTemplate({
  record,
  fill,
  showHeroSkeleton = false,
  showServicesSkeleton = false,
  photoVariants = { hero: 0, support: 0 },
  heroVideoSrc = null,
}: TradesTemplateProps) {
  const filled = new Set(fill);
  const hasAny = filled.size > 0 || showHeroSkeleton;
  const b = record.business || {
    name: '',
    phone: '',
    service_area: '',
    established: null,
    hours: null,
  };
  const rootRef = useRef<HTMLDivElement>(null);
  const [hdrSolid, setHdrSolid] = useState(false);
  const [page, setPage] = useState<SitePage>('home');
  const unlockedOnce = useRef<Set<SitePage>>(new Set(['home']));
  const [, bump] = useState(0);

  const layout = resolveLayout(record.layout);
  const palette = record.palette || 'ember';
  const mood = record.theme_mood === 'rugged' ? 'rugged' : 'clean';

  const heroImgEarly =
    record.hero?.image_id && hasPhoto(record.hero.image_id)
      ? record.hero.image_id
      : 'wv_hero';
  const tradeKey =
    record.trade_key || (hasPhoto(heroImgEarly) ? heroImgEarly : null);
  const niche = getNichePreset(tradeKey);

  const showHero = filled.has('hero');
  const showTrust = filled.has('trust') || filled.has('hero');
  const showServices = filled.has('services');
  const showAbout = filled.has('about');
  const showContact = filled.has('contact');

  const unlocked: Record<SitePage, boolean> = {
    home: hasAny,
    services: showServices,
    about: showAbout,
    contact: showContact,
  };

  // Track unlock pops
  useEffect(() => {
    let changed = false;
    (Object.keys(unlocked) as SitePage[]).forEach((p) => {
      if (unlocked[p] && !unlockedOnce.current.has(p)) {
        unlockedOnce.current.add(p);
        changed = true;
      }
    });
    if (changed) bump((n) => n + 1);
  });

  useEffect(() => {
    const scroller = rootRef.current?.parentElement;
    if (!scroller) return;
    const onScroll = () => setHdrSolid(scroller.scrollTop > 40);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  const go = (p: SitePage) => {
    if (!unlocked[p]) return;
    setPage(p);
    const scroller = rootRef.current?.parentElement;
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hasAny) {
    return (
      <div
        className="mt-trades"
        data-layout={layout}
        data-palette={palette}
        data-mood={mood}
        data-niche={niche.shape}
        data-page="home"
      >
        <div className="empty-hint">Your site will appear here as we talk…</div>
      </div>
    );
  }

  const name = cap(b.name, 40) || 'Your business';
  const phone = cap(b.phone, 20);
  const area = cap(b.service_area, 60);
  const hours = b.hours ? cap(b.hours, 40) : '';
  const heroImg =
    record.hero?.image_id && hasPhoto(record.hero.image_id)
      ? record.hero.image_id
      : 'wv_hero';
  const featureImg =
    hasPhoto(heroImg) && heroImg !== 'wv_hero' ? heroImg : 'work_truck';
  const heroVariant = photoVariants.hero ?? 0;
  const supportVariant = photoVariants.support ?? 0;

  const emergency = !!record.contact?.emergency;
  const phoneDominant = niche.heroPhoneDominant || emergency;
  const heroCta = cap(record.hero?.cta_text, 22) || niche.defaultHeroCta;
  const contactCta = cap(record.contact?.cta_text, 22) || niche.defaultContactCta;
  const phonePrompt =
    cap(record.contact?.phone_prompt, 48) || niche.defaultPhonePrompt;

  const services = (record.services || []).slice(0, 6);
  const badges = (record.trust?.badges || []).slice(0, 4);
  const reviews = (record.trust?.reviews || []).slice(0, 3);
  const est = b.established;

  const safeChipLabels: string[] = [];
  if (area) safeChipLabels.push(`Serving ${cap(area, 40)}`);
  if (emergency) safeChipLabels.push('24/7');
  if (hours) safeChipLabels.push(hours);
  const chipLabels =
    badges.length > 0
      ? badges.map((x) => cap(x, 24)).filter(Boolean)
      : safeChipLabels;
  const showChipRow = chipLabels.length > 0;

  const stripItems: { title: string; sub: string }[] =
    badges.length > 0
      ? badges.map((x) => ({ title: '✓', sub: cap(x, 24) }))
      : emergency
        ? [
            { title: '24/7', sub: 'when you need us' },
            { title: 'Local', sub: area ? cap(area, 28) : 'West Virginia' },
            { title: 'Fast', sub: 'we pick up' },
            {
              title: 'WV',
              sub: tradeLabel(record.trade_key || heroImg) || 'home base',
            },
          ]
        : [
            { title: 'Local', sub: area ? cap(area, 28) : 'West Virginia' },
            { title: 'Fast', sub: 'easy to reach' },
            { title: 'Honest', sub: 'straight answers' },
            {
              title: 'WV',
              sub: tradeLabel(record.trade_key || heroImg) || 'home base',
            },
          ];

  const trustStats = stripItems.map((item) => (
    <div className="tstat" key={`${item.title}-${item.sub}`}>
      <b>{item.title}</b>
      <span>{item.sub}</span>
    </div>
  ));

  const showStickyCall =
    emergency && !!phone && niche.stickyCallOnEmergency && page !== 'contact';

  // ── Block renderers ───────────────────────────────────────────

  const renderHero = (key: string): ReactNode => {
    if (!showHero) {
      if (!showHeroSkeleton) return null;
      return (
        <section className="hero-skel fillin" key={key}>
          <div className="wrap" style={{ width: '100%' }}>
            <div className="sk sk-line" style={{ width: 120, height: 11 }} />
            <div className="sk" style={{ height: 34, width: '70%', margin: '14px 0' }} />
            <div className="sk sk-line" style={{ width: '52%' }} />
          </div>
        </section>
      );
    }

    const heroCtas = (
      <div className={`hero-cta${phoneDominant ? ' hero-cta--phone' : ''}`}>
        {phoneDominant && phone ? (
          <>
            <span className="hero-phone-xl">☎ {phone}</span>
            <span className="btn btn--primary">{heroCta}</span>
          </>
        ) : (
          <>
            <span className="btn btn--primary">{heroCta}</span>
            {phone ? (
              <span
                className={
                  layout === 'split' ? 'btn btn--outline' : 'btn btn--ghost'
                }
              >
                ☎ {phone}
              </span>
            ) : null}
          </>
        )}
      </div>
    );

    if (layout === 'split') {
      return (
        <section className="hero-split fillin" key={key}>
          <div className="hero-split-text">
            <div className="wrap hero-split-in">
              <span className="hero-chip hero-chip--ink">
                ◆ {cap(area, 46) || 'Serving West Virginia'}
              </span>
              <h1>{cap(record.hero?.headline, 64) || name}</h1>
              {record.hero?.subhead ? (
                <p className="lead fillin">{cap(record.hero.subhead, 150)}</p>
              ) : null}
              {heroCtas}
            </div>
          </div>
          <div className="hero-split-media">
            <HeroMedia
              name={heroImg}
              variant={heroVariant}
              videoSrc={heroVideoSrc}
              alt={`${name} — serving ${area || 'West Virginia'}`}
            />
          </div>
        </section>
      );
    }

    return (
      <section
        className={`hero fillin${layout === 'bold' ? ' hero--bold' : ''}${
          phoneDominant ? ' hero--call' : ''
        }`}
        key={key}
      >
        <HeroMedia
          name={heroImg}
          variant={heroVariant}
          videoSrc={heroVideoSrc}
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
          {heroCtas}
          {layout === 'classic' && showChipRow ? (
            <div className="hero-trust">
              {chipLabels.map((label) => (
                <span key={label}>
                  <i className="dot" /> {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {layout === 'bold' && showTrust ? (
          <div className="hero-accent-strip fillin">
            <div className="wrap trustbar-in">{trustStats}</div>
          </div>
        ) : null}
      </section>
    );
  };

  const renderAvailability = (key: string): ReactNode => {
    if (!showTrust || !showHero) return null;
    if (layout === 'bold' && page === 'home') return null;

    if (layout === 'split' && showChipRow) {
      return (
        <section
          className="trust-chips availability-strip fillin"
          key={key}
        >
          <div className="wrap trust-chips-in">
            {chipLabels.map((label) => (
              <span className="trust-chip" key={label}>
                {label}
              </span>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section className="trustbar availability-strip fillin" key={key}>
        <div className="wrap trustbar-in">{trustStats}</div>
      </section>
    );
  };

  const renderServices = (key: string, preview: boolean): ReactNode => {
    if (showServices && services.length) {
      return (
        <ServicesList
          key={key}
          layout={layout}
          services={services}
          presentation={niche.servicesPresentation}
          kicker={niche.servicesKicker}
          title={niche.servicesTitle}
          trade={typeof tradeKey === 'string' ? tradeKey : null}
          preview={preview}
          onViewAll={preview ? () => go('services') : undefined}
        />
      );
    }
    if (preview && showServicesSkeleton) {
      return (
        <section className="sec" key={key}>
          <div className="wrap">
            <div className="sk sk-line" style={{ width: 90, height: 10 }} />
            <div
              className="sk"
              style={{ height: 24, width: '40%', margin: '12px 0 20px' }}
            />
            <div className="grid">
              {[0, 1, 2].map((i) => (
                <div className="card" key={i}>
                  <div
                    className="sk"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      marginBottom: 11,
                    }}
                  />
                  <div className="sk sk-line" style={{ width: '80%' }} />
                  <div className="sk sk-line" style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  const renderAbout = (key: string, teaser: boolean): ReactNode => {
    if (!showAbout || !record.about?.body) return null;
    const body = cap(record.about.body, teaser ? 160 : 320);

    if (teaser) {
      return (
        <section className="sec sec--tint fillin" key={key}>
          <div className="wrap about-teaser">
            <p className="kicker">Who you&apos;re hiring</p>
            <h2 className="title">A real local crew.</h2>
            <p className="about-stack-body">{body}</p>
            <button type="button" className="page-link" onClick={() => go('about')}>
              Our story →
            </button>
          </div>
        </section>
      );
    }

    if (layout === 'bold') {
      return (
        <section className="about-bold fillin" id="about" key={key}>
          <div className="about-bold-photo">
            <ImgSlot
              name={featureImg}
              preset="feature"
              variant={supportVariant}
              alt={`${name} — local crew`}
            />
            <div className="scrim" />
          </div>
          <div className="wrap about-bold-copy">
            <p className="kicker">Who you&apos;re hiring</p>
            <h2>A real local crew — not a call center.</h2>
            {est ? (
              <p className="about-years">Serving the area since {est}</p>
            ) : null}
            <p>{body}</p>
            {badges.length > 0 ? (
              <div className="trust-chips-in about-badges">
                {badges.map((x) => (
                  <span className="trust-chip" key={x}>
                    {cap(x, 24)}
                  </span>
                ))}
              </div>
            ) : null}
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
          </div>
        </section>
      );
    }

    return (
      <section className="sec sec--tint fillin" id="about" key={key}>
        <div className="wrap">
          <div className="feature">
            <ImgSlot
              name={featureImg}
              preset="feature"
              variant={supportVariant}
              alt={`${name} — local crew`}
            />
            <div>
              <p className="kicker">Who you&apos;re hiring</p>
              <h2>A real local crew — not a call center.</h2>
              {est ? (
                <p className="about-years">Serving the area since {est}</p>
              ) : null}
              <p>{body}</p>
              {badges.length > 0 ? (
                <div className="trust-chips-in about-badges">
                  {badges.map((x) => (
                    <span className="trust-chip" key={x}>
                      {cap(x, 24)}
                    </span>
                  ))}
                </div>
              ) : null}
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
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderBand = (key: string): ReactNode => {
    if (!showHero) return null;
    return (
      <section className="band-photo fillin" key={key}>
        <ImgSlot
          name="wv_band"
          preset="band"
          alt={`${area || 'West Virginia'} — West Virginia`}
        />
        <div className="scrim" />
        <div className="wrap inner">
          <h2 className="disp">{niche.bandHeadline}</h2>
          <p>{niche.bandBody}</p>
        </div>
      </section>
    );
  };

  const renderSteps = (key: string): ReactNode => {
    if (!showHero) return null;
    return (
      <section className="sec fillin" key={key}>
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
                Call or drop a message. We give you a straight answer and a real
                time — no runaround.
              </p>
            </div>
            <div className="step">
              <span className="n">02</span>
              <h4>We show up prepared</h4>
              <p>
                A clean, uniformed crew arrives on time with the right tools for
                the job.
              </p>
            </div>
            <div className="step">
              <span className="n">03</span>
              <h4>Done & guaranteed</h4>
              <p>
                We finish right, clean up after ourselves, and stand behind the
                work.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderReviews = (key: string): ReactNode => {
    if (!showAbout || reviews.length === 0) return null;
    return (
      <section className="sec sec--tint fillin" id="reviews" key={key}>
        <div className="wrap">
          <div className="head center">
            <p className="kicker">Reviews</p>
            <h2 className="title">Trusted in homes across WV.</h2>
          </div>
          <div
            className={`reviews${layout === 'bold' ? ' reviews--stack' : ''}`}
          >
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
    );
  };

  const renderContact = (key: string): ReactNode => {
    if (!showContact) return null;
    const heading = emergency
      ? "Need help now? We're standing by."
      : "Let's get your project started.";

    return (
      <section className="sec fillin contact-page" id="contact" key={key}>
        <div className="wrap">
          <div className={`cta-band${emergency ? ' cta-band--emergency' : ''}`}>
            <div className="glow" />
            <h2>{heading}</h2>
            <p>{phonePrompt}.</p>
            {phone ? <div className="contact-phone-xl">☎ {phone}</div> : null}
            {area ? (
              <p className="contact-meta">
                Serving {cap(area, 60)}
                {hours ? ` · ${hours}` : ''}
              </p>
            ) : null}
            <div className="row">
              {phone ? (
                <span className="btn btn--primary">☎ {phone}</span>
              ) : null}
              <span className="btn btn--ondark">{contactCta}</span>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderCta = (key: string): ReactNode => {
    if (!showHero && !showContact) return null;
    return (
      <section className="sec fillin" key={key}>
        <div className="wrap">
          <div className="home-cta">
            <h2 className="title">
              {emergency ? 'Ready when you are.' : 'Let’s talk about your project.'}
            </h2>
            <p className="home-cta-sub">{phonePrompt}.</p>
            <div className="row" style={{ justifyContent: 'flex-start', marginTop: 16 }}>
              {phone ? (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => go('contact')}
                >
                  ☎ {phone}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => (unlocked.contact ? go('contact') : undefined)}
                  disabled={!unlocked.contact}
                >
                  {contactCta}
                </button>
              )}
              {unlocked.services ? (
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => go('services')}
                >
                  See services
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  };

  const blockRender = (block: NicheBlock, idx: number): ReactNode => {
    const key = `${page}-${block}-${idx}`;
    switch (block) {
      case 'hero':
        return renderHero(key);
      case 'availability':
        return renderAvailability(key);
      case 'services':
        return renderServices(key, false);
      case 'servicesPreview':
        return renderServices(key, true);
      case 'about':
        return renderAbout(key, false);
      case 'aboutTeaser':
        return renderAbout(key, true);
      case 'band':
        return renderBand(key);
      case 'steps':
        return renderSteps(key);
      case 'reviews':
        return renderReviews(key);
      case 'contact':
        return renderContact(key);
      case 'cta':
        return renderCta(key);
      default:
        return null;
    }
  };

  const pageBlocks = niche.pages[page] || niche.pages.home;

  return (
    <div
      ref={rootRef}
      className={`mt-trades${showStickyCall ? ' has-sticky-call' : ''}`}
      data-layout={layout}
      data-palette={palette}
      data-mood={mood}
      data-niche={niche.shape}
      data-svc={niche.servicesPresentation}
      data-emergency={emergency ? 'true' : 'false'}
      data-page={page}
    >
      <header
        className={`hdr ${hdrSolid ? 'solid' : ''} ${
          !showHero || page !== 'home' ? 'on-light solid' : ''
        } ${layout === 'split' && showHero && page === 'home' ? 'on-light' : ''}`}
      >
        <div className="wrap hdr-in">
          <button
            type="button"
            className="brand brand-btn"
            onClick={() => go('home')}
          >
            <span className="brand-mark">{initials(name)}</span>
            {cap(name, 28)}
          </button>
          <nav className="nav" aria-label="Site">
            {NAV_PAGES.map(({ id, label }) => {
              const isOn = page === id;
              const isOpen = unlocked[id];
              const justUnlocked =
                isOpen &&
                unlockedOnce.current.has(id) &&
                id !== 'home';
              return (
                <button
                  key={id}
                  type="button"
                  className={`nav-item${isOn ? ' is-active' : ''}${
                    !isOpen ? ' is-locked' : ''
                  }${justUnlocked ? ' is-unlock' : ''}`}
                  disabled={!isOpen}
                  aria-current={isOn ? 'page' : undefined}
                  onClick={() => go(id)}
                >
                  {label}
                </button>
              );
            })}
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

      <main className="mt-page" key={page}>
        {pageBlocks.map((block, i) => blockRender(block, i))}
      </main>

      {showHero ? (
        <footer className="ft">
          <div className="wrap">
            <div className="ft-grid">
              <div style={{ maxWidth: '30ch' }}>
                <div
                  className="brand"
                  style={{ color: '#fff', marginBottom: 12 }}
                >
                  <span className="brand-mark">{initials(name)}</span>
                  {cap(name, 34)}
                </div>
                <p>
                  Honest, professional work for the mountains of West Virginia.
                </p>
              </div>
              <div>
                <h5>PAGES</h5>
                <p className="ft-nav">
                  {NAV_PAGES.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      className="ft-link"
                      disabled={!unlocked[id]}
                      onClick={() => go(id)}
                    >
                      {label}
                    </button>
                  ))}
                </p>
              </div>
              <div>
                <h5>CONTACT</h5>
                <p>
                  {phone || '—'}
                  <br />
                  {cap(area, 50) || 'West Virginia'}
                  {hours ? (
                    <>
                      <br />
                      {hours}
                    </>
                  ) : null}
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

      {showStickyCall ? (
        <div className="sticky-call" role="complementary" aria-label="Call now">
          <span className="sticky-call-label">Need help now?</span>
          <span className="sticky-call-phone">☎ {phone}</span>
        </div>
      ) : null}
    </div>
  );
}
