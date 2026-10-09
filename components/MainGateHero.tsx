'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { baseRooms } from '@/lib/base-rooms';

interface MainGateHeroProps {
  onClaimOffer?: () => void;
}

export default function MainGateHero({ onClaimOffer }: MainGateHeroProps) {
  const room = baseRooms['main-gate'];
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const gateOpen = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const doorLeftX = useTransform(gateOpen, [0, 1], ['0%', '-55%']);
  const doorRightX = useTransform(gateOpen, [0, 1], ['0%', '55%']);

  const motionProps = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 48, rotateX: 12, scale: 0.9 } as const,
          animate: { opacity: 1, y: 0, rotateX: 0, scale: 1 } as const,
          transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      id="hero"
      ref={ref}
      className="main-gate"
      style={{ '--room-accent': room.accent, '--room-glow': room.glow } as React.CSSProperties}
    >
      <div className="main-gate__environment">
        <motion.div className="main-gate__bg" style={{ scale: bgScale, y: bgY }}>
          <Image
            src={room.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="main-gate__bg-image"
            quality={90}
          />
        </motion.div>
        <div className="main-gate__veil" />
        <div
          className="main-gate__glow"
          style={{ background: `radial-gradient(ellipse at 50% 20%, ${room.glow}, transparent 60%)` }}
        />

        {!prefersReducedMotion && (
          <>
            <motion.div className="main-gate__door main-gate__door--left" style={{ x: doorLeftX }} />
            <motion.div className="main-gate__door main-gate__door--right" style={{ x: doorRightX }} />
          </>
        )}
      </div>

      <motion.div className="main-gate__perspective" style={{ opacity: contentOpacity }}>
        <motion.div className="main-gate__chamber" style={{ transformPerspective: 1600 }}>
          <motion.div className="main-gate__status" {...motionProps(0.05)}>
            <span className="base-room__status-dot" />
            <span className="base-room__codename">{room.codename}</span>
          </motion.div>

          <motion.div className="cinematic-hero__badge" {...motionProps(0.15)}>
            <span className="cinematic-hero__badge-star">★</span>
            West Virginia Veteran Owned
            <span className="cinematic-hero__badge-star">★</span>
          </motion.div>

          <motion.h1 className="cinematic-hero__brand" {...motionProps(0.3)}>
            Veteran AI Websites
            <span className="cinematic-hero__tagline">Professional Websites · Built in One Day</span>
          </motion.h1>

          <motion.p className="cinematic-hero__lead" {...motionProps(0.45)}>
            One-day websites by a local West Virginia builder — built with the discipline,
            precision, and pride of a U.S. veteran.
          </motion.p>

          <motion.div className="cinematic-hero__offer" {...motionProps(0.58)}>
            <div className="cinematic-hero__offer-label">Nothing down</div>
            <p className="cinematic-hero__offer-title">Starter</p>
            <p className="cinematic-hero__offer-price">
              <span className="cinematic-hero__price-now">$49</span>
              <span>/month</span>
            </p>
            <p className="cinematic-hero__offer-urgency">No contract. Cancel anytime. After 12 payments the site is yours.</p>
          </motion.div>

          <motion.div className="cinematic-hero__cta-group" {...motionProps(0.72)}>
            <a href="#build" onClick={onClaimOffer} className="btn-premium">
              Start Starter — $49/mo
            </a>
            <a href="#pricing" className="btn-premium btn-premium--outline">
              Tour Command Center
            </a>
          </motion.div>

          <motion.p className="cinematic-hero__footnote" {...motionProps(0.85)}>
            Same-day delivery · Nothing down · No contract. Yours after 12 payments.
          </motion.p>
        </motion.div>

        <div className="cinematic-hero__scroll-hint" aria-hidden="true">
          <span>Enter the facility</span>
          <div className="cinematic-hero__scroll-line" />
        </div>
      </motion.div>
    </section>
  );
}