'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import type { BaseRoomConfig } from '@/lib/base-rooms';

interface BaseRoomProps {
  room: BaseRoomConfig;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
  headerExtra?: ReactNode;
}

function RoomEnvironment({
  room,
  scrollYProgress,
}: {
  room: BaseRoomConfig;
  scrollYProgress: MotionValue<number>;
}) {
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.06, 1.1]);
  const windowGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.7]);

  return (
    <div className="base-room__environment">
      <motion.div className="base-room__bg" style={{ y: bgY, scale: bgScale }}>
        <Image
          src={room.image}
          alt=""
          fill
          sizes="100vw"
          className="base-room__bg-image"
          quality={85}
        />
      </motion.div>
      <motion.div
        className="base-room__window-glow"
        style={{ opacity: windowGlow, background: `radial-gradient(ellipse at 50% 30%, ${room.glow}, transparent 65%)` }}
      />
      <div className="base-room__room-veil" style={{ '--room-accent': room.accent } as CSSProperties} />
      <div className="base-room__arch-frame" aria-hidden="true">
        <div className="base-room__door base-room__door--left" />
        <div className="base-room__door base-room__door--right" />
      </div>
    </div>
  );
}

export default function BaseRoom({
  room,
  eyebrow,
  title,
  subtitle,
  children,
  wide = false,
  headerExtra,
}: BaseRoomProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { amount: 0.12, margin: '-10% 0px' });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const chamberY = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [80, 0, 0, -40]);
  const chamberScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.94]);
  const chamberRotateX = useTransform(scrollYProgress, [0, 0.25, 0.5], [10, 0, 0]);

  const displayTitle = title ?? room.title;
  const displaySubtitle = subtitle ?? room.subtitle;

  return (
    <section
      id={room.sectionId}
      ref={ref}
      className="base-room"
      data-room={room.id}
      style={{ '--room-accent': room.accent, '--room-glow': room.glow } as CSSProperties}
    >
      <RoomEnvironment room={room} scrollYProgress={scrollYProgress} />

      <div className="base-room__perspective">
        <motion.div
          className={`base-room__chamber ${wide ? 'base-room__chamber--wide' : ''}`}
          style={
            prefersReducedMotion
              ? undefined
              : { y: chamberY, scale: chamberScale, rotateX: chamberRotateX }
          }
          initial={prefersReducedMotion ? false : { opacity: 0.4, rotateX: 14, scale: 0.86 }}
          animate={
            prefersReducedMotion
              ? undefined
              : isInView
                ? { opacity: 1, rotateX: 0, scale: 1 }
                : { opacity: 0.5, rotateX: 8, scale: 0.92 }
          }
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="base-room__header"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="base-room__status">
              <span className="base-room__status-dot" />
              <span className="base-room__codename">{room.codename}</span>
            </div>
            {eyebrow && <p className="premium-eyebrow">{eyebrow}</p>}
            <h2 className="premium-title">{displayTitle}</h2>
            <p className="premium-subtitle">{displaySubtitle}</p>
            {headerExtra}
            <div className="base-room__threshold" aria-hidden="true" />
          </motion.div>

          <div className="base-room__floor">
            <div className="base-room__content">{children}</div>
          </div>
        </motion.div>
      </div>

      <div className="base-room__corridor" aria-hidden="true">
        <div className="base-room__corridor-line" />
        <span className="base-room__corridor-label">Transit corridor → {room.navLabel}</span>
      </div>
    </section>
  );
}