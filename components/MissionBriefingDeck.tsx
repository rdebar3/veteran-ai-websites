'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react';
import Image from 'next/image';
import { Check, CheckCircle, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import {
  briefingChapters,
  briefingDemos,
  briefingTestimonials,
  type BriefingChapter,
  type BriefingOverlay,
} from '@/lib/briefing-deck';
import {
  getActiveChapterIndex,
  getChapterScrollY,
  getPanelLocalProgress,
  getPanelOpacity,
  getTrackProgress,
} from '@/lib/scroll-cinema';
import { isInViewport, registerScrollTask, scrollToY } from '@/lib/scroll-driver';
import {
  addOnsList,
  allPackagesInclude,
  getDisplayPrice,
  pricingTiers,
} from '@/lib/data';
import CircuitOverlay from '@/components/CircuitOverlay';
import NeuralOverlay from '@/components/NeuralOverlay';
import PatrioticOverlay from '@/components/PatrioticOverlay';
import MagneticButton from '@/components/MagneticButton';
import OfferCountdown from '@/components/OfferCountdown';
import FAQAccordion, { type FAQ } from '@/components/FAQAccordion';
import PricingCard from '@/components/PricingCard';

const NEAR = 0.03;

const faqs: FAQ[] = [
  {
    question: 'How quickly can I really get my website?',
    answer:
      'Most Starter and Complete sites are delivered the same day you approve the design. Premium with priority is usually ready in 1–2 business days. Clear scopes, no fluff.',
  },
  {
    question: 'Do I own the website and files?',
    answer:
      'Yes — 100% ownership. You receive all files and logins. No lock-in, no hidden fees.',
  },
  {
    question: 'What if I need changes after launch?',
    answer:
      'Starter and Complete include 1 revision round. Premium includes 2 rounds plus 30 days of support. Monthly Website Care is available after that.',
  },
  {
    question: 'Do I pay before I see the site?',
    answer:
      'No. Submit your order request free. Pay only after you review and approve the final design — then Stripe checkout is available.',
  },
];

function OverlayLayer({ type }: { type: BriefingOverlay }) {
  if (type === 'patriotic') return <PatrioticOverlay />;
  if (type === 'neural') return <NeuralOverlay />;
  if (type === 'circuit') return <CircuitOverlay />;
  return null;
}

interface BuilderForm {
  businessName: string;
  email: string;
  phone: string;
  description: string;
}

export default function MissionBriefingDeck() {
  const count = briefingChapters.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const activeRef = useRef(0);
  const pinnedRef = useRef(false);
  const wheelLock = useRef(0);
  const coarseRef = useRef(false);

  /* ── Commerce state (chapter 6–7) ── */
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [selectedPackage, setSelectedPackage] = useState('Starter');
  const [builderForm, setBuilderForm] = useState<BuilderForm>({
    businessName: '',
    email: '',
    phone: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const goToChapter = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.min(count - 1, Math.max(0, index));
      scrollToY(getChapterScrollY(track, clamped, count), { lock: true });
    },
    [count]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment_success') === 'true') {
      const saved = sessionStorage.getItem('pendingOrder');
      if (saved) {
        const details = JSON.parse(saved);
        setSelectedPackage(details.selectedBuilderPackage);
        setSelectedAddOnIds(details.selectedAddOnIds);
        setBuilderForm(details.builderForm);
        setIsSubmitted(true);
        setPaymentSuccess(true);
        sessionStorage.removeItem('pendingOrder');
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => goToChapter(6), 150);
      }
    }
  }, [goToChapter]);

  /* Hash navigation: #pricing #build #demos etc. → chapter jump */
  useEffect(() => {
    const jumpFromHash = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash || hash === 'briefing' || hash === 'hero') return;
      const idx = briefingChapters.findIndex((c) => c.id === hash);
      if (idx >= 0) {
        // slight delay so layout is ready
        requestAnimationFrame(() => goToChapter(idx));
      }
    };
    jumpFromHash();
    window.addEventListener('hashchange', jumpFromHash);
    return () => window.removeEventListener('hashchange', jumpFromHash);
  }, [goToChapter]);

  /* Scroll-driven panels — React state for activeIndex (visibility via CSS) */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    coarseRef.current = window.matchMedia('(pointer: coarse)').matches;

    if (reduce) {
      // Stack mode: no sticky scrub; still allow index via buttons
      return;
    }

    const layers = Array.from(track.querySelectorAll<HTMLElement>('.mb-layer'));

    const tick = () => {
      const p = getTrackProgress(track);
      track.style.setProperty('--cinema-p', String(p));

      const rect = track.getBoundingClientRect();
      const pinned = rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
      if (pinned !== pinnedRef.current) {
        pinnedRef.current = pinned;
        setIsPinned(pinned);
      }

      const next = getActiveChapterIndex(p, count);
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActiveIndex(next);
      }

      layers.forEach((layer, i) => {
        const opacity = getPanelOpacity(p, i, count);
        const local = getPanelLocalProgress(p, i, count);
        layer.style.opacity = String(opacity);
        layer.style.visibility = opacity < NEAR ? 'hidden' : 'visible';

        if (opacity < NEAR) return;

        const wrap = layer.querySelector<HTMLElement>('.mb-layer__img-wrap');
        if (wrap) {
          const amp = coarseRef.current ? 0.4 : 1;
          wrap.style.transform = `translate3d(${(local - 0.5) * 4 * amp}%, ${(0.5 - local) * 10 * amp}%, 0) scale(${1.05 + local * 0.06 * amp})`;
        }
      });
    };

    tick();
    return registerScrollTask({
      isActive: () => isInViewport(track, 240),
      run: tick,
    });
  }, [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!pinnedRef.current) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        goToChapter(activeRef.current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        goToChapter(activeRef.current - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToChapter(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToChapter(count - 1);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (coarseRef.current) return;
      if (!pinnedRef.current) return;
      if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;

      const now = performance.now();
      if (now - wheelLock.current < 450) {
        e.preventDefault();
        return;
      }

      const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primary) < 22) return;

      const atStart = activeRef.current <= 0 && primary < 0;
      const atEnd = activeRef.current >= count - 1 && primary > 0;
      if (atStart || atEnd) return;

      e.preventDefault();
      wheelLock.current = now;
      goToChapter(activeRef.current + (primary > 0 ? 1 : -1));
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
    };
  }, [count, goToChapter]);

  const estimatedTotal = (() => {
    const tier = pricingTiers.find((p) => p.name === selectedPackage);
    const base = tier ? getDisplayPrice(tier) : 0;
    return (
      base +
      selectedAddOnIds.reduce((sum, id) => {
        const a = addOnsList.find((x) => x.id === id);
        return sum + (a ? a.price : 0);
      }, 0)
    );
  })();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!builderForm.businessName || !builderForm.email) {
      alert('Please provide your business name and email.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    const selectedAddOnsDetails = addOnsList.filter((a) => selectedAddOnIds.includes(a.id));
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      formData.append('package', selectedPackage);
      formData.append(
        'addOns',
        selectedAddOnsDetails.length
          ? selectedAddOnsDetails.map((a) => `${a.name} (+$${a.price})`).join(', ')
          : 'None'
      );
      formData.append('estimatedTotal', `$${estimatedTotal} (one-time + any recurring)`);
      const response = await fetch('https://formspree.io/f/mwvjoklj', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error('fail');
      setIsSubmitted(true);
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setSubmitError('Failed to send your order. Please try again or contact us directly.');
    }
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const selectedAddOnNames = selectedAddOnIds
        .map((id) => addOnsList.find((a) => a.id === id)?.name)
        .filter(Boolean) as string[];
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({
          selectedBuilderPackage: selectedPackage,
          selectedAddOnIds,
          builderForm,
        })
      );
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ package: selectedPackage, addOns: selectedAddOnNames }),
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch {
      setIsPaying(false);
      sessionStorage.removeItem('pendingOrder');
    }
  };

  const onChapterCta = (chapter: BriefingChapter) => {
    if (typeof chapter.ctaChapter === 'number') goToChapter(chapter.ctaChapter);
  };

  const selectPackage = (name: string) => {
    setSelectedPackage(name);
    goToChapter(6);
  };

  return (
    <section
      id="briefing"
      className="mb-deck"
      style={{ '--mb-panels': count } as CSSProperties}
      aria-roledescription="carousel"
      aria-label="Mission Briefing Deck"
      data-pinned={isPinned ? 'true' : 'false'}
      data-chapter={activeIndex}
      data-hydrated="true"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Chapter {activeIndex + 1} of {count}: {briefingChapters[activeIndex]?.title}
      </p>

      <div className="mb-deck__track" ref={trackRef}>
        <div className="mb-deck__stage">
          {/* Background layers */}
          <div className="mb-deck__visuals" aria-hidden="true">
            {briefingChapters.map((ch, i) => (
              <div
                key={ch.index}
                className={`mb-layer${i === activeIndex ? ' is-active' : ''}${i === 0 ? ' mb-layer--first' : ''}`}
                data-i={i}
              >
                <div className="mb-layer__img-wrap">
                  <Image
                    src={ch.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="mb-layer__img"
                    quality={i === 0 ? 88 : 78}
                    priority={i <= 1}
                  />
                </div>
                <div className="mb-layer__veil" />
                <div className="mb-layer__fx">
                  {(i === activeIndex || Math.abs(i - activeIndex) <= 1) && (
                    <OverlayLayer type={ch.overlay} />
                  )}
                </div>
                <div className="mb-layer__frame" />
              </div>
            ))}
          </div>

          {/* Header chrome */}
          <div className="mb-deck__chrome">
            <span className="mb-deck__tag">◆ Mission Briefing Deck</span>
            <span className="mb-deck__counter">
              {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>

          {/* Chapter content panels — React-driven visibility */}
          <div className="mb-deck__panels">
            {briefingChapters.map((ch, i) => {
              const live = i === activeIndex;
              return (
                <div
                  key={ch.index}
                  id={ch.id}
                  className={`mb-panel mb-panel--${ch.layout}${live ? ' is-live' : ''}`}
                  aria-hidden={!live}
                  inert={!live ? true : undefined}
                >
                  <div className="mb-panel__scroll">
                    <header className="mb-panel__head">
                      <span className="mb-panel__index">{ch.index}</span>
                      <span className="mb-panel__eyebrow">{ch.eyebrow}</span>
                      <span className="mb-panel__landmark">{ch.landmark}</span>
                      <h2 className="mb-panel__title">{ch.title}</h2>
                      <p className="mb-panel__body">{ch.body}</p>
                    </header>

                    {/* 01 Intro bullets */}
                    {ch.layout === 'intro' && (
                      <ul className="mb-bullets">
                        <li>Veteran-owned · West Virginia roots</li>
                        <li>Same-day craft for focused scopes</li>
                        <li>100% ownership — no lock-in</li>
                      </ul>
                    )}

                    {/* 02 Command story */}
                    {ch.layout === 'command' && (
                      <div className="mb-points">
                        <div className="mb-point">
                          <strong>Direct line</strong>
                          <span>You talk to the builder — not a ticket queue</span>
                        </div>
                        <div className="mb-point">
                          <strong>Mission discipline</strong>
                          <span>Clear scope, honest timeline, no upsell pressure</span>
                        </div>
                        <div className="mb-point">
                          <strong>Mountain base</strong>
                          <span>Starlink · AI tools · flag on the wall</span>
                        </div>
                      </div>
                    )}

                    {/* 03 AI Arsenal */}
                    {ch.layout === 'arsenal' && (
                      <div className="mb-points">
                        <div className="mb-point">
                          <Zap className="mb-point__icon" aria-hidden="true" />
                          <strong>One-day delivery</strong>
                          <span>Starter & Complete often ship same day after approval</span>
                        </div>
                        <div className="mb-point">
                          <strong>AI + craft</strong>
                          <span>Faster production without template junk</span>
                        </div>
                        <div className="mb-point">
                          <strong>Business outcomes</strong>
                          <span>Forms, mobile, SEO foundation, ready for customers</span>
                        </div>
                      </div>
                    )}

                    {/* 04 Demos */}
                    {ch.layout === 'demos' && (
                      <div className="mb-demos" role="list">
                        {briefingDemos.map((demo) => (
                          <article key={demo.tier} className="mb-demo card" role="listitem">
                            <div className="mb-demo__img">
                              <Image
                                src={demo.image}
                                alt={demo.imageAlt}
                                fill
                                sizes="(max-width: 768px) 90vw, 320px"
                                style={{ objectPosition: demo.imageFocus }}
                                quality={80}
                              />
                              <div className="mb-demo__badge">
                                <span>{demo.tier}</span>
                                <span>{demo.pages}</span>
                              </div>
                            </div>
                            <div className="mb-demo__body">
                              <h3>{demo.title}</h3>
                              <p>{demo.desc}</p>
                              <ul>
                                {demo.features.map((f) => (
                                  <li key={f}>
                                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                              <a href={demo.href} className="btn btn--primary btn--lg btn--glow mb-demo__cta">
                                View Live Demo
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}

                    {/* 05 Testimonials */}
                    {ch.layout === 'testimonials' && (
                      <div className="mb-quotes" role="list">
                        {briefingTestimonials.map((t) => (
                          <blockquote key={t.author} className="mb-quote card" role="listitem">
                            <p>&ldquo;{t.quote}&rdquo;</p>
                            <footer>
                              <strong>{t.author}</strong>
                              <span>
                                {t.business} · {t.location}
                              </span>
                            </footer>
                          </blockquote>
                        ))}
                      </div>
                    )}

                    {/* 06 Pricing + add-ons */}
                    {ch.layout === 'pricing' && (
                      <div className="mb-pricing">
                        <div className="mb-pricing__grid">
                          {pricingTiers.map((tier) => (
                            <PricingCard
                              key={tier.name}
                              tier={tier}
                              onSelect={selectPackage}
                            />
                          ))}
                        </div>
                        <div className="mb-includes card card--flat">
                          <p className="mb-includes__label">Every package includes</p>
                          <ul>
                            {allPackagesInclude.map((item) => (
                              <li key={item}>
                                <Check className="h-4 w-4" aria-hidden="true" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-addons">
                          <p className="mb-includes__label">Optional upgrades</p>
                          <div className="mb-addons__grid">
                            {addOnsList.map((addon) => {
                              const on = selectedAddOnIds.includes(addon.id);
                              return (
                                <label
                                  key={addon.id}
                                  className={`card mb-addon${on ? ' card--selected' : ''}`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={on}
                                    onChange={() =>
                                      setSelectedAddOnIds((prev) =>
                                        prev.includes(addon.id)
                                          ? prev.filter((x) => x !== addon.id)
                                          : [...prev, addon.id]
                                      )
                                    }
                                  />
                                  <div>
                                    <div className="mb-addon__name">{addon.name}</div>
                                    <div className="mb-addon__price">
                                      +${addon.price}
                                      {addon.period}
                                    </div>
                                    <p>{addon.desc}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 07 Enlist — form + FAQ */}
                    {ch.layout === 'enlist' && (
                      <div className="mb-enlist" id="order-form">
                        {!isSubmitted ? (
                          <form
                            action="https://formspree.io/f/mwvjoklj"
                            method="POST"
                            onSubmit={handleSubmit}
                            className="mb-form card card--flat"
                          >
                            <div className="mb-form__pkg">
                              <span className="order-step-label">Package</span>
                              <div className="mb-form__pkg-row">
                                {pricingTiers.map((tier) => {
                                  const price = getDisplayPrice(tier);
                                  const sel = selectedPackage === tier.name;
                                  return (
                                    <button
                                      type="button"
                                      key={tier.name}
                                      className={`mb-form__pkg-btn${sel ? ' is-on' : ''}`}
                                      onClick={() => setSelectedPackage(tier.name)}
                                    >
                                      <span>{tier.name}</span>
                                      <strong>${price}</strong>
                                    </button>
                                  );
                                })}
                              </div>
                              {selectedPackage === 'Starter' && (
                                <div className="mb-form__promo">
                                  <OfferCountdown compact />
                                </div>
                              )}
                            </div>

                            <div className="mb-form__fields">
                              <div>
                                <label htmlFor="businessName" className="field-label">
                                  Business Name *
                                </label>
                                <input
                                  id="businessName"
                                  name="businessName"
                                  className="field-input"
                                  required
                                  value={builderForm.businessName}
                                  onChange={(e) =>
                                    setBuilderForm((f) => ({
                                      ...f,
                                      businessName: e.target.value,
                                    }))
                                  }
                                  placeholder="Smith Family Bakery"
                                />
                              </div>
                              <div>
                                <label htmlFor="email" className="field-label">
                                  Email *
                                </label>
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  className="field-input"
                                  required
                                  value={builderForm.email}
                                  onChange={(e) =>
                                    setBuilderForm((f) => ({ ...f, email: e.target.value }))
                                  }
                                  placeholder="you@yourbusiness.com"
                                />
                              </div>
                              <div>
                                <label htmlFor="phone" className="field-label">
                                  Phone
                                </label>
                                <input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  className="field-input"
                                  value={builderForm.phone}
                                  onChange={(e) =>
                                    setBuilderForm((f) => ({ ...f, phone: e.target.value }))
                                  }
                                  placeholder="(304) 555-0123"
                                />
                              </div>
                              <div className="mb-form__full">
                                <label htmlFor="description" className="field-label">
                                  About your business
                                </label>
                                <textarea
                                  id="description"
                                  name="description"
                                  className="field-textarea"
                                  rows={2}
                                  value={builderForm.description}
                                  onChange={(e) =>
                                    setBuilderForm((f) => ({
                                      ...f,
                                      description: e.target.value,
                                    }))
                                  }
                                  placeholder="What you need online — hours, services, contact…"
                                />
                              </div>
                            </div>

                            <div className="mb-form__total">
                              <span>Estimated total</span>
                              <strong>${estimatedTotal}</strong>
                            </div>
                            <p className="mb-form__trust">
                              No payment today. Pay after you approve the design.
                            </p>

                            <MagneticButton
                              type="submit"
                              disabled={isSubmitting}
                              magnetic={!isSubmitting}
                              className="btn btn--primary btn--lg btn--glow mb-form__submit"
                            >
                              {isSubmitting ? 'Submitting…' : 'Build Mine Now'}
                            </MagneticButton>
                            {submitError && <p className="order-error">{submitError}</p>}
                          </form>
                        ) : (
                          <div className="card card--flat success-card mb-success">
                            <div className="success-card__icon">
                              <CheckCircle className="h-8 w-8" />
                            </div>
                            <h3 className="success-card__title">Order request received</h3>
                            <p className="mt-3 text-[var(--text-muted)]">
                              Thank you
                              {builderForm.businessName
                                ? `, ${builderForm.businessName.split(' ')[0]}`
                                : ''}
                              . We have your{' '}
                              <span className="text-[var(--text-cream)]">{selectedPackage}</span>{' '}
                              package
                              {selectedAddOnIds.length > 0 &&
                                ` + ${selectedAddOnIds.length} add-on${
                                  selectedAddOnIds.length > 1 ? 's' : ''
                                }`}
                              .
                            </p>
                            <div className="success-card__actions">
                              {!paymentSuccess && (
                                <button
                                  type="button"
                                  className="btn btn--primary btn--lg btn--glow"
                                  disabled={isPaying}
                                  onClick={handlePayNow}
                                >
                                  {isPaying ? 'Processing…' : 'Pay Now with Stripe'}
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn--ghost btn--lg"
                                onClick={() => {
                                  setIsSubmitted(false);
                                  setPaymentSuccess(false);
                                  setBuilderForm({
                                    businessName: '',
                                    email: '',
                                    phone: '',
                                    description: '',
                                  });
                                }}
                              >
                                Start another
                              </button>
                            </div>
                            {paymentSuccess && (
                              <p className="mt-3 text-emerald-400 text-sm font-medium">
                                Payment successful — thank you.
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mb-faq">
                          <p className="mb-includes__label">FAQ</p>
                          <FAQAccordion faqs={faqs} />
                        </div>
                      </div>
                    )}

                    {ch.ctaLabel && typeof ch.ctaChapter === 'number' && (
                      <div className="mb-panel__cta">
                        <MagneticButton
                          type="button"
                          onClick={() => onChapterCta(ch)}
                          className="btn btn--primary btn--lg btn--glow"
                        >
                          {ch.ctaLabel}
                        </MagneticButton>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nav controls */}
          <div className="mb-deck__nav" role="group" aria-label="Chapter controls">
            <button
              type="button"
              className="mb-deck__arrow"
              aria-label="Previous chapter"
              disabled={activeIndex <= 0}
              onClick={() => goToChapter(activeIndex - 1)}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="mb-deck__dots">
              {briefingChapters.map((ch, i) => (
                <button
                  key={ch.index}
                  type="button"
                  className={`mb-deck__dot${i === activeIndex ? ' is-on' : ''}`}
                  aria-label={`Chapter ${i + 1}: ${ch.title}`}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  title={ch.landmark}
                  onClick={() => goToChapter(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="mb-deck__arrow"
              aria-label="Next chapter"
              disabled={activeIndex >= count - 1}
              onClick={() => goToChapter(activeIndex + 1)}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
