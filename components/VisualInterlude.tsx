'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

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
    if (prefersReduced) {
      el.classList.add('interlude--visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('interlude--visible');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`interlude interlude--split interlude--${align} interlude--rich`}
    >
      <div className="interlude__panel">
        <div className="interlude__visual">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="interlude__img"
            quality={92}
            loading="lazy"
          />
          {landmark && (
            <span className="interlude__landmark-tag">{landmark}</span>
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
      </div>
    </section>
  );
}