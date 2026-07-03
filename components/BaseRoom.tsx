'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { BaseRoomConfig } from '@/lib/base-rooms';
import CircuitOverlay from '@/components/CircuitOverlay';
import { getViewProgress } from '@/lib/scroll-cinema';

interface BaseRoomProps {
  room: BaseRoomConfig;
  index?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
  headerExtra?: ReactNode;
  hideHeader?: boolean;
}

export default function BaseRoom({
  room,
  index,
  eyebrow,
  title,
  subtitle,
  children,
  wide = false,
  headerExtra,
  hideHeader = false,
}: BaseRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.08, margin: '-8% 0px' });

  useEffect(() => {
    const section = ref.current;
    if (!section || prefersReducedMotion) return;

    const vista = section.querySelector<HTMLElement>('.base-room__vista-wrap');
    const interior = section.querySelector<HTMLElement>('.base-room__interior-wrap');
    const circuit = section.querySelector<HTMLElement>('.base-room__circuit');
    const chamber = section.querySelector<HTMLElement>('.base-room__chamber');
    let raf = 0;

    const tick = () => {
      const p = getViewProgress(section);
      const scrollP = (() => {
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh;
        const traveled = vh - rect.top;
        return Math.min(1, Math.max(0, traveled / total));
      })();

      if (vista) {
        const y = (0.5 - scrollP) * 14;
        const scale = 1.1 + scrollP * 0.08;
        vista.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }

      if (interior) {
        interior.style.opacity = String(0.35 + p * 0.45);
        interior.style.transform = `translate3d(0, ${(1 - p) * 4}%, 0) scale(1.04)`;
      }

      if (circuit) {
        circuit.style.opacity = String(0.25 + p * 0.35);
        circuit.style.transform = `translate3d(${(scrollP - 0.5) * 3}%, 0, 0)`;
      }

      if (chamber) {
        const lift = 1 - (1 - p) * 0.06;
        const y = (1 - p) * 48;
        chamber.style.opacity = String(0.5 + p * 0.5);
        chamber.style.transform = `translate3d(0, ${y}px, 0) scale(${lift}) perspective(1400px) rotateX(${(1 - p) * 6}deg)`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  const displayTitle = title ?? room.title;
  const displaySubtitle = subtitle ?? room.subtitle;

  return (
    <section
      id={room.sectionId}
      ref={ref}
      className={`base-room base-room--${room.mood}`}
      data-room={room.id}
      style={{ '--room-accent': room.accent, '--room-glow': room.glow } as CSSProperties}
    >
      <div className="base-room__environment" aria-hidden="true">
        <div className="base-room__vista-wrap">
          <Image
            src={room.vistaImage}
            alt=""
            fill
            sizes="100vw"
            className="base-room__vista-img"
            quality={92}
          />
        </div>
        <div className="base-room__interior-wrap">
          <Image
            src={room.image}
            alt=""
            fill
            sizes="100vw"
            className="base-room__interior-img"
            quality={85}
          />
        </div>
        <div className="base-room__window-frame" />
        <div className="base-room__circuit">
          <CircuitOverlay />
        </div>
        <div className="base-room__room-veil" />
        <div className="base-room__room-glow" />
        <div className="base-room__vista-badge">
          <span className="base-room__vista-label">Live Vista</span>
          <span className="base-room__vista-name">{room.vistaName}</span>
          <span className="base-room__vista-outpost">{room.vistaOutpost}</span>
        </div>
      </div>

      <div className="base-room__corridor-entry" aria-hidden="true">
        <span className="base-room__corridor-tag">Entering chamber</span>
        <div className="base-room__corridor-line" />
      </div>

      <div className="base-room__perspective">
        <motion.div
          className={`base-room__chamber ${wide ? 'base-room__chamber--wide' : ''}`}
          initial={prefersReducedMotion ? false : { opacity: 0.45, rotateX: 10, scale: 0.9 }}
          animate={
            prefersReducedMotion
              ? undefined
              : isInView
                ? { opacity: 1, rotateX: 0, scale: 1 }
                : { opacity: 0.55, rotateX: 6, scale: 0.94 }
          }
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {!hideHeader && (
            <motion.div
              className="base-room__header"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="base-room__status">
                <span className="base-room__status-dot" />
                <span className="base-room__codename">{room.codename}</span>
              </div>
              {index && <span className="base-room__index">{index}</span>}
              {eyebrow && <p className="base-room__eyebrow">{eyebrow}</p>}
              <h2 className="base-room__title">{displayTitle}</h2>
              <p className="base-room__subtitle">{displaySubtitle}</p>
              {headerExtra}
              <div className="base-room__threshold" aria-hidden="true" />
            </motion.div>
          )}

          <div className="base-room__floor">
            <div className="base-room__content">{children}</div>
          </div>
        </motion.div>
      </div>

      <div className="base-room__corridor-exit" aria-hidden="true">
        <span className="base-room__corridor-label">Transit corridor → {room.navLabel}</span>
      </div>
    </section>
  );
}