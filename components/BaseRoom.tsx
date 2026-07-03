'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { BaseRoomConfig } from '@/lib/base-rooms';
import { isInViewport, notifyScroll, registerScrollTask } from '@/lib/scroll-driver';

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
}: BaseRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.1, margin: '-5% 0px', once: true });
  const isFunctional = className.includes('base-room--functional');

  useEffect(() => {
    const section = ref.current;
    if (!section || prefersReducedMotion || isFunctional) return;

    const vista = section.querySelector<HTMLElement>('.base-room__vista-wrap');

    const run = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      const scrollP = Math.min(1, Math.max(0, traveled / total));

      if (vista) {
        const y = (0.5 - scrollP) * 8;
        const scale = 1.03 + scrollP * 0.04;
        vista.style.transform = `translate3d(0, ${y}%, 0) scale(${scale})`;
      }
    };

    const unregister = registerScrollTask({
      isActive: () => isInViewport(section, 100),
      run,
    });

    const onScroll = () => notifyScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    notifyScroll();

    return () => {
      unregister();
      window.removeEventListener('scroll', onScroll);
    };
  }, [prefersReducedMotion, isFunctional]);

  const displayTitle = title ?? room.title;
  const displaySubtitle = subtitle ?? room.subtitle;

  const chamberClass = `base-room__chamber ${wide ? 'base-room__chamber--wide' : ''}`;
  const chamberContent = (
    <>
      {!hideHeader && (
        <div className="base-room__header">
          {!isFunctional && (
            <div className="base-room__status">
              <span className="base-room__status-dot" />
              <span className="base-room__codename">{room.codename}</span>
            </div>
          )}
          {index && <span className="base-room__index">{index}</span>}
          {eyebrow && <p className="base-room__eyebrow">{eyebrow}</p>}
          <h2 className="base-room__title">{displayTitle}</h2>
          <p className="base-room__subtitle">{displaySubtitle}</p>
          {headerExtra}
          <div className="base-room__threshold" aria-hidden="true" />
        </div>
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
            quality={isFunctional ? 72 : 80}
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