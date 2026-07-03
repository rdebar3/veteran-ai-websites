'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import Image from 'next/image';
import type { CinematicChapter } from '@/lib/cinematic';
import {
  getCaptionChildProgress,
  getPanelLocalProgress,
  getPanelOpacity,
  getTrackProgress,
} from '@/lib/scroll-cinema';

interface CinematicScrollProps {
  id?: string;
  chapters: CinematicChapter[];
  className?: string;
}

export default function CinematicScroll({ id, chapters, className = '' }: CinematicScrollProps) {
  const count = chapters.length;
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const layers = Array.from(track.querySelectorAll<HTMLElement>('.cinema__layer'));
    const imgWraps = Array.from(track.querySelectorAll<HTMLElement>('.cinema__img-wrap'));
    const captions = Array.from(track.querySelectorAll<HTMLElement>('.cinema__caption'));
    const dots = Array.from(track.querySelectorAll<HTMLElement>('.cinema__dot'));
    const grids = Array.from(track.querySelectorAll<HTMLElement>('.cinema__grid-drift'));
    const glows = Array.from(track.querySelectorAll<HTMLElement>('.cinema__glow-drift'));

    let raf = 0;

    const tick = () => {
      const p = getTrackProgress(track);
      track.style.setProperty('--cinema-p', String(p));

      layers.forEach((layer, i) => {
        const opacity = getPanelOpacity(p, i, count);
        const local = getPanelLocalProgress(p, i, count);
        layer.style.opacity = String(opacity);

        const wrap = imgWraps[i];
        if (wrap) {
          const y = (0.5 - local) * 14;
          const scale = 1.06 + local * 0.1;
          wrap.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
        }

        const grid = grids[i];
        if (grid) {
          const gx = (local - 0.5) * 6;
          grid.style.transform = `translate3d(${gx}%, ${(local - 0.5) * -4}%, 0)`;
          grid.style.opacity = String(opacity * 0.55);
        }

        const glow = glows[i];
        if (glow) {
          glow.style.transform = `translate3d(${(local - 0.5) * -8}%, ${(0.5 - local) * 5}%, 0)`;
          glow.style.opacity = String(opacity * 0.85);
        }
      });

      captions.forEach((caption, i) => {
        const panelOpacity = getPanelOpacity(p, i, count);
        const local = getPanelLocalProgress(p, i, count);
        caption.style.opacity = String(panelOpacity);

        const indexEl = caption.querySelector<HTMLElement>('.cinema__caption-index');
        const eyebrowEl = caption.querySelector<HTMLElement>('.cinema__caption-eyebrow');
        const titleEl = caption.querySelector<HTMLElement>('.cinema__caption-title');
        const bodyEl = caption.querySelector<HTMLElement>('.cinema__caption-body');

        const idxP = getCaptionChildProgress(local, 0.04, 0.45);
        const eyeP = getCaptionChildProgress(local, 0.1, 0.45);
        const titleP = getCaptionChildProgress(local, 0.16, 0.5);
        const bodyP = getCaptionChildProgress(local, 0.28, 0.5);

        if (indexEl) {
          indexEl.style.opacity = String(idxP * panelOpacity);
          indexEl.style.transform = `translate3d(0, ${(1 - idxP) * 20}px, 0)`;
        }
        if (eyebrowEl) {
          eyebrowEl.style.opacity = String(eyeP * panelOpacity);
          eyebrowEl.style.transform = `translate3d(0, ${(1 - eyeP) * 24}px, 0)`;
        }
        if (titleEl) {
          titleEl.style.opacity = String(titleP * panelOpacity);
          titleEl.style.transform = `translate3d(0, ${(1 - titleP) * 48}px, 0) scale(${0.96 + titleP * 0.04})`;
        }
        if (bodyEl) {
          bodyEl.style.opacity = String(bodyP * panelOpacity);
          bodyEl.style.transform = `translate3d(0, ${(1 - bodyP) * 32}px, 0)`;
        }

        if (panelOpacity > 0.4) {
          caption.setAttribute('aria-hidden', 'false');
        } else {
          caption.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach((dot, i) => {
        const active = getPanelOpacity(p, i, count);
        dot.style.opacity = String(0.35 + active * 0.65);
        dot.style.transform = `scale3d(${0.85 + active * 0.15}, ${0.85 + active * 0.15}, 1)`;
        if (active > 0.55) {
          dot.classList.add('cinema__dot--active');
        } else {
          dot.classList.remove('cinema__dot--active');
        }
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [count]);

  return (
    <section
      id={id}
      className={`cinema cinema--panels-${count} cinema--driven ${className}`.trim()}
      style={{ '--cinema-panels': count } as CSSProperties}
      aria-label="Cinematic story section"
    >
      <div className="cinema__track" ref={trackRef}>
        <div className="cinema__stage">
          <div className="cinema__visuals" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <div
                key={chapter.index}
                className={`cinema__layer cinema__layer--${i}`}
                data-panel={i}
              >
                <div className="cinema__img-wrap">
                  <Image
                    src={chapter.image}
                    alt=""
                    fill
                    sizes="100vw"
                    className="cinema__img"
                    quality={90}
                    priority={i === 0}
                  />
                </div>
                <div className="cinema__grid-drift" />
                <div className="cinema__glow-drift" />
                <div className="cinema__veil" />
                <div className="cinema__glow" />
              </div>
            ))}
          </div>

          <div className="cinema__captions">
            {chapters.map((chapter, i) => (
              <article
                key={`caption-${chapter.index}`}
                className={`cinema__caption cinema__caption--${i}`}
                aria-hidden={i !== 0}
              >
                <span className="cinema__caption-index">{chapter.index}</span>
                <span className="cinema__caption-eyebrow">{chapter.eyebrow}</span>
                <h2 className="cinema__caption-title">{chapter.title}</h2>
                <p className="cinema__caption-body">{chapter.body}</p>
              </article>
            ))}
          </div>

          <div className="cinema__progress" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <span key={`dot-${chapter.index}`} className={`cinema__dot cinema__dot--${i}`} />
            ))}
          </div>

          <div className="cinema__scroll-hint" aria-hidden="true">
            <span>Keep scrolling</span>
            <div className="cinema__scroll-bar">
              <div className="cinema__scroll-fill" />
            </div>
          </div>
        </div>
      </div>

      <div className="cinema__fallback">
        {chapters.map((chapter) => (
          <article key={`fallback-${chapter.index}`} className="cinema__fallback-panel">
            <div className="cinema__fallback-visual">
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                sizes="100vw"
                className="cinema__img"
                quality={85}
              />
              <div className="cinema__veil" />
            </div>
            <div className="cinema__fallback-copy">
              <span className="cinema__caption-index">{chapter.index}</span>
              <span className="cinema__caption-eyebrow">{chapter.eyebrow}</span>
              <h2 className="cinema__caption-title">{chapter.title}</h2>
              <p className="cinema__caption-body">{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}