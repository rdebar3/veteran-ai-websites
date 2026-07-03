'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import CircuitOverlay from '@/components/CircuitOverlay';
import { getViewProgress } from '@/lib/scroll-cinema';

interface VisualInterludeProps {
  image: string;
  imageAlt: string;
  landmark?: string;
  outpost?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  align?: 'left' | 'center';
}

export default function VisualInterlude({
  image,
  imageAlt,
  landmark,
  outpost,
  eyebrow,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  align = 'center',
}: VisualInterludeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const imgWrap = el.querySelector<HTMLElement>('.interlude__img-wrap');
    const content = el.querySelector<HTMLElement>('.interlude__content');
    const eyebrowEl = el.querySelector<HTMLElement>('.interlude__eyebrow');
    const titleEl = el.querySelector<HTMLElement>('.interlude__title');
    const subtitleEl = el.querySelector<HTMLElement>('.interlude__subtitle');
    const ctaEl = el.querySelector<HTMLElement>('.interlude__cta');

    let raf = 0;

    const tick = () => {
      const p = getViewProgress(el);
      el.style.setProperty('--interlude-p', String(p));

      if (imgWrap) {
        const y = (0.5 - p) * 10;
        const scale = 1.08 + p * 0.06;
        imgWrap.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }

      if (content) {
        content.style.opacity = String(0.35 + p * 0.65);
        content.style.transform = `translate3d(0, ${(1 - p) * 36}px, 0)`;
      }

      if (eyebrowEl) {
        const ep = Math.min(1, p * 1.4);
        eyebrowEl.style.opacity = String(ep);
        eyebrowEl.style.transform = `translate3d(0, ${(1 - ep) * 16}px, 0)`;
      }
      if (titleEl) {
        const tp = Math.min(1, Math.max(0, (p - 0.08) * 1.3));
        titleEl.style.opacity = String(tp);
        titleEl.style.transform = `translate3d(0, ${(1 - tp) * 40}px, 0) scale(${0.97 + tp * 0.03})`;
      }
      if (subtitleEl) {
        const sp = Math.min(1, Math.max(0, (p - 0.18) * 1.2));
        subtitleEl.style.opacity = String(sp);
        subtitleEl.style.transform = `translate3d(0, ${(1 - sp) * 28}px, 0)`;
      }
      if (ctaEl) {
        const cp = Math.min(1, Math.max(0, (p - 0.32) * 1.1));
        ctaEl.style.opacity = String(cp);
        ctaEl.style.transform = `translate3d(0, ${(1 - cp) * 20}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={ref} className={`interlude interlude--${align} interlude--driven interlude--outpost`}>
      <div className="interlude__visual" aria-hidden="true">
        <div className="interlude__img-wrap">
          <Image src={image} alt="" fill sizes="100vw" className="interlude__img" quality={90} />
        </div>
        <div className="interlude__outpost-frame" />
        <div className="interlude__outpost-hud" />
        <div className="interlude__circuit">
          <CircuitOverlay />
        </div>
        <div className="interlude__veil" />
        <div className="interlude__glow" />
        {landmark && (
          <div className="interlude__landmark-badge">
            <span className="interlude__landmark-name">{landmark}</span>
            {outpost && <span className="interlude__landmark-outpost">{outpost}</span>}
          </div>
        )}
      </div>
      <div className="interlude__content">
        {eyebrow && <span className="interlude__eyebrow">{eyebrow}</span>}
        <h2 className="interlude__title">{title}</h2>
        {subtitle && <p className="interlude__subtitle">{subtitle}</p>}
        {ctaHref && ctaLabel && (
          <a href={ctaHref} className="btn btn--primary btn--lg btn--glow interlude__cta">
            {ctaLabel}
          </a>
        )}
      </div>
      <span className="sr-only">{imageAlt}</span>
    </section>
  );
}