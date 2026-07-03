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
import { isInViewport, registerScrollTask } from '@/lib/scroll-driver';

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
    const roomAccents = Array.from(track.querySelectorAll<HTMLElement>('.cinema__room-accent'));
    const captions = Array.from(track.querySelectorAll<HTMLElement>('.cinema__caption'));
    const dots = Array.from(track.querySelectorAll<HTMLElement>('.cinema__dot'));
    const grids = Array.from(track.querySelectorAll<HTMLElement>('.cinema__grid-drift'));
    const glows = Array.from(track.querySelectorAll<HTMLElement>('.cinema__glow-drift'));

    const tick = () => {
      const p = getTrackProgress(track);
      track.style.setProperty('--cinema-p', String(p));

      layers.forEach((layer, i) => {
        const opacity = getPanelOpacity(p, i, count);
        const local = getPanelLocalProgress(p, i, count);
        layer.style.opacity = String(opacity);

        const wrap = imgWraps[i];
        if (wrap) {
          const y = (0.5 - local) * 16;
          const x = (local - 0.5) * 4;
          const scale = 1.08 + local * 0.12;
          wrap.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
        }

        const room = roomAccents[i];
        if (room) {
          room.style.opacity = String(opacity * (0.22 + local * 0.18));
          room.style.transform = `translate3d(0, ${(1 - local) * 3}%, 0) scale(1.05)`;
        }

        const grid = grids[i];
        if (grid) {
          const gx = (local - 0.5) * 8;
          grid.style.transform = `translate3d(${gx}%, ${(local - 0.5) * -5}%, 0)`;
          grid.style.opacity = String(opacity * 0.55);
        }

        const glow = glows[i];
        if (glow) {
          glow.style.transform = `translate3d(${(local - 0.5) * -10}%, ${(0.5 - local) * 6}%, 0)`;
          glow.style.opacity = String(opacity * 0.9);
        }
      });

      captions.forEach((caption, i) => {
        const panelOpacity = getPanelOpacity(p, i, count);
        const local = getPanelLocalProgress(p, i, count);

        const indexEl = caption.querySelector<HTMLElement>('.cinema__caption-index');
        const eyebrowEl = caption.querySelector<HTMLElement>('.cinema__caption-eyebrow');
        const landmarkEl = caption.querySelector<HTMLElement>('.cinema__caption-landmark');
        const titleEl = caption.querySelector<HTMLElement>('.cinema__caption-title');
        const bodyEl = caption.querySelector<HTMLElement>('.cinema__caption-body');

        const idxP = getCaptionChildProgress(local, 0.02, 0.4);
        const eyeP = getCaptionChildProgress(local, 0.08, 0.42);
        const landP = getCaptionChildProgress(local, 0.12, 0.45);
        const titleP = getCaptionChildProgress(local, 0.18, 0.5);
        const bodyP = getCaptionChildProgress(local, 0.3, 0.5);

        if (indexEl) {
          indexEl.style.opacity = String(idxP * panelOpacity);
          indexEl.style.transform = `translate3d(0, ${(1 - idxP) * 20}px, 0)`;
        }
        if (eyebrowEl) {
          eyebrowEl.style.opacity = String(eyeP * panelOpacity);
          eyebrowEl.style.transform = `translate3d(0, ${(1 - eyeP) * 24}px, 0)`;
        }
        if (landmarkEl) {
          landmarkEl.style.opacity = String(landP * panelOpacity);
          landmarkEl.style.transform = `translate3d(0, ${(1 - landP) * 28}px, 0)`;
        }
        if (titleEl) {
          titleEl.style.opacity = String(titleP * panelOpacity);
          titleEl.style.transform = `translate3d(0, ${(1 - titleP) * 48}px, 0) scale(${0.96 + titleP * 0.04})`;
        }
        if (bodyEl) {
          bodyEl.style.opacity = String(bodyP * panelOpacity);
          bodyEl.style.transform = `translate3d(0, ${(1 - bodyP) * 32}px, 0)`;
        }

        caption.setAttribute('aria-hidden', panelOpacity > 0.4 ? 'false' : 'true');
      });

      dots.forEach((dot, i) => {
        const active = getPanelOpacity(p, i, count);
        dot.style.opacity = String(0.35 + active * 0.65);
        dot.style.transform = `scale3d(${0.85 + active * 0.15}, ${0.85 + active * 0.15}, 1)`;
        dot.classList.toggle('cinema__dot--active', active > 0.55);
      });
    };

    tick();

    return registerScrollTask({
      isActive: () => isInViewport(track, 240),
      run: tick,
    });
  }, [count]);

  return (
    <section
      id={id}
      className={`cinema cinema--panels-${count} cinema--driven cinema--outpost ${className}`.trim()}
      style={{ '--cinema-panels': count } as CSSProperties}
      aria-label="Cinematic West Virginia landmark story"
    >
      <div className="cinema__track" ref={trackRef}>
        <div className="cinema__stage">
          <div className="cinema__visuals" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <div key={chapter.index} className={`cinema__layer cinema__layer--${i}`}>
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
                {chapter.roomAccent && (
                  <div className="cinema__room-accent">
                    <Image src={chapter.roomAccent} alt="" fill sizes="100vw" className="cinema__room-img" quality={75} />
                  </div>
                )}
                <div className="cinema__outpost-frame" />
                <div className="cinema__outpost-hud" />
                <div className="cinema__grid-drift" />
                <div className="cinema__glow-drift" />
                <div className="cinema__veil" />
                <div className="cinema__glow" />
                <div className="cinema__landmark-badge">
                  <span className="cinema__landmark-name">{chapter.landmark}</span>
                  <span className="cinema__landmark-outpost">{chapter.outpost}</span>
                </div>
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
                <span className="cinema__caption-landmark">{chapter.landmark}</span>
                <h2 className="cinema__caption-title">{chapter.title}</h2>
                <p className="cinema__caption-body">{chapter.body}</p>
              </article>
            ))}
          </div>

          <div className="cinema__progress" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <span key={`dot-${chapter.index}`} className={`cinema__dot cinema__dot--${i}`} title={chapter.landmark} />
            ))}
          </div>

          <div className="cinema__scroll-hint" aria-hidden="true">
            <span>Scenic transit</span>
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
              <Image src={chapter.image} alt={chapter.imageAlt} fill sizes="100vw" className="cinema__img" quality={85} />
              <div className="cinema__veil" />
            </div>
            <div className="cinema__fallback-copy">
              <span className="cinema__caption-index">{chapter.index}</span>
              <span className="cinema__caption-eyebrow">{chapter.outpost}</span>
              <span className="cinema__caption-landmark">{chapter.landmark}</span>
              <h2 className="cinema__caption-title">{chapter.title}</h2>
              <p className="cinema__caption-body">{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}