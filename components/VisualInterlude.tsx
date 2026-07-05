'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { InViewItem, InViewStagger } from '@/components/InViewStagger';
import {
  inViewViewport,
  scaleUpVariants,
} from '@/lib/scroll-motion';

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
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={`interlude interlude--split interlude--${align} interlude--rich interlude--visible`}>
      <div className="interlude__panel">
        {prefersReducedMotion ? (
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
        ) : (
          <motion.div
            className="interlude__visual"
            initial="hidden"
            whileInView="visible"
            viewport={inViewViewport}
            variants={scaleUpVariants}
          >
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
          </motion.div>
        )}

        <InViewStagger className="interlude__content" stagger={0.09}>
          {eyebrow && (
            <InViewItem>
              <span className="interlude__eyebrow">{eyebrow}</span>
            </InViewItem>
          )}
          <InViewItem>
            <h2 className="interlude__title">{title}</h2>
          </InViewItem>
          {subtitle && (
            <InViewItem>
              <p className="interlude__subtitle">{subtitle}</p>
            </InViewItem>
          )}
          {body && (
            <InViewItem>
              <p className="interlude__body">{body}</p>
            </InViewItem>
          )}
          {imageCaption && (
            <InViewItem>
              <p className="interlude__caption">{imageCaption}</p>
            </InViewItem>
          )}
          {ctaHref && ctaLabel && (
            <InViewItem>
              <a href={ctaHref} className="btn btn--primary btn--lg btn--glow interlude__cta">
                {ctaLabel}
              </a>
            </InViewItem>
          )}
        </InViewStagger>
      </div>
    </section>
  );
}