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
  body?: string;
  imageCaption?: string;
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
  body,
  imageCaption,
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
    const bodyEl = el.querySelector<HTMLElement>('.interlude__body');
    const ctaEl = el.querySelector<HTMLElement>('.interlude__cta');

    let raf = 0;

    const tick = () => {
      const p = getViewProgress(el);
      el.style.setProperty('--interlude-p', String(p));

      if (imgWrap) {
        const y = (0.5 - p) * 8;
        const scale = 1.06 + p * 0.04;
        imgWrap.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }

      if (content) {
        content.style.opacity = String(0.4 + p * 0.6);
        content.style.transform = `translate3d(0, ${(1 - p) * 28}px, 0)`;
      }

      const reveal = (node: HTMLElement | null, delay: number, y = 24) => {
        if (!node) return;
        const ep = Math.min(1, Math.max(0, (p - delay) * 1.25));
        node.style.opacity = String(ep);
        node.style.transform = `translate3d(0, ${(1 - ep) * y}px, 0)`;
      };

      reveal(eyebrowEl, 0, 16);
      reveal(titleEl, 0.06, 32);
      reveal(subtitleEl, 0.12, 24);
      reveal(bodyEl, 0.2, 20);
      reveal(ctaEl, 0.34, 16);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={ref} className={`interlude interlude--${align} interlude--driven interlude--outpost interlude--rich`}>
      <div className="interlude__visual" aria-hidden="true">
        <div className="interlude__img-wrap">
          <Image src={image} alt="" fill sizes="100vw" className="interlude__img" quality={90} />
        </div>
        <div className="interlude__outpost-frame" />
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
        {body && <p className="interlude__body">{body}</p>}
        {imageCaption && <p className="interlude__caption">{imageCaption}</p>}
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