'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { InViewItem, InViewStagger } from '@/components/InViewStagger';
import type { BaseRoomConfig } from '@/lib/base-rooms';
import { isInViewport, registerScrollTask } from '@/lib/scroll-driver';
import CircuitOverlay from '@/components/CircuitOverlay';
import NeuralOverlay from '@/components/NeuralOverlay';
import PatrioticOverlay from '@/components/PatrioticOverlay';

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
  className?: string;
  /** Atmospheric FX layered over the vista */
  overlay?: 'auto' | 'patriotic' | 'neural' | 'circuit' | 'none';
}

function moodOverlay(mood: BaseRoomConfig['mood']): 'patriotic' | 'neural' | 'circuit' {
  if (mood === 'crimson' || mood === 'amber') return 'patriotic';
  if (mood === 'gold' || mood === 'emerald') return 'circuit';
  return 'neural';
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
  className = '',
  overlay = 'auto',
}: BaseRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.1, margin: '-5% 0px', once: true });
  const isFunctional = className.includes('base-room--functional');
  const fx = overlay === 'auto' ? moodOverlay(room.mood) : overlay;

  useEffect(() => {
    const section = ref.current;
    if (!section || prefersReducedMotion) return;

    const vista = section.querySelector<HTMLElement>('.base-room__vista-wrap');
    const glow = section.querySelector<HTMLElement>('.base-room__room-glow');

    const run = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const scrollP = Math.min(1, Math.max(0, traveled / total));

      if (vista) {
        // Milder parallax on functional content rooms so forms stay readable
        const strength = isFunctional ? 4.5 : 8;
        const scaleBoost = isFunctional ? 0.025 : 0.04;
        const y = (0.5 - scrollP) * strength;
        const scale = 1.02 + scrollP * scaleBoost;
        vista.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }

      if (glow) {
        glow.style.opacity = String(0.55 + scrollP * 0.35);
      }
    };

    run();

    return registerScrollTask({
      isActive: () => isInViewport(section, 100),
      run,
    });
  }, [prefersReducedMotion, isFunctional]);

  const displayTitle = title ?? room.title;
  const displaySubtitle = subtitle ?? room.subtitle;

  const chamberClass = `base-room__chamber ${wide ? 'base-room__chamber--wide' : ''}`;
  const chamberContent = (
    <>
      {!hideHeader && (
        <InViewStagger className="base-room__header" stagger={0.09}>
          {!isFunctional && (
            <InViewItem>
              <div className="base-room__status">
                <span className="base-room__status-dot" />
                <span className="base-room__codename">{room.codename}</span>
              </div>
            </InViewItem>
          )}
          {index && (
            <InViewItem>
              <span className="base-room__index">{index}</span>
            </InViewItem>
          )}
          {eyebrow && (
            <InViewItem>
              <p className="base-room__eyebrow">{eyebrow}</p>
            </InViewItem>
          )}
          <InViewItem>
            <h2 className="base-room__title">{displayTitle}</h2>
          </InViewItem>
          <InViewItem>
            <p className="base-room__subtitle">{displaySubtitle}</p>
          </InViewItem>
          {headerExtra && <InViewItem>{headerExtra}</InViewItem>}
          <div className="base-room__threshold" aria-hidden="true" />
        </InViewStagger>
      )}

      <div className="base-room__floor">
        <div className="base-room__content">{children}</div>
      </div>
    </>
  );

  return (
    <section
      id={room.sectionId}
      ref={ref}
      className={`base-room base-room--${room.mood} ${className}`.trim()}
      data-room={room.id}
      style={{ '--room-accent': room.accent, '--room-glow': room.glow } as CSSProperties}
    >
      <div className="base-room__environment" aria-hidden="true">
        <div className="base-room__vista-wrap">
          <Image
            src={room.vistaImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="base-room__vista-img"
            quality={isFunctional ? 78 : 85}
            loading="lazy"
          />
        </div>
        {!isFunctional && (
          <div className="base-room__interior-wrap">
            <Image
              src={room.image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="base-room__interior-img"
              quality={72}
              loading="lazy"
            />
          </div>
        )}
        {fx !== 'none' && (
          <div className="base-room__fx">
            {fx === 'patriotic' && <PatrioticOverlay />}
            {fx === 'neural' && <NeuralOverlay />}
            {fx === 'circuit' && <CircuitOverlay />}
          </div>
        )}
        <div className="base-room__room-veil" />
        <div className="base-room__room-glow" />
      </div>

      <div className="base-room__perspective">
        {prefersReducedMotion || isFunctional ? (
          <div className={chamberClass}>{chamberContent}</div>
        ) : (
          <motion.div
            className={chamberClass}
            initial={{ opacity: 0.6, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 24 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {chamberContent}
          </motion.div>
        )}
      </div>
    </section>
  );
}