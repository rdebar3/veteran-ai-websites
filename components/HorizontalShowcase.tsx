'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { ShowcaseDemo } from '@/lib/cinematic';
import { InViewItem, InViewStagger } from '@/components/InViewStagger';
import Reveal from '@/components/Reveal';

interface HorizontalShowcaseProps {
  demos: ShowcaseDemo[];
}

export default function HorizontalShowcase({ demos }: HorizontalShowcaseProps) {
  return (
    <div className="h-showcase">
      <Reveal variant="up">
        <p className="h-showcase__intro">
          Each tier includes a live demo you can click through before ordering — so you know exactly
          what your package delivers for your business.
        </p>
      </Reveal>
      <InViewStagger className="h-showcase__grid" stagger={0.1} role="list">
        {demos.map((demo) => (
          <InViewItem key={demo.tier} variant="card" className="h-showcase__card" role="listitem">
            <div className="h-showcase__visual">
              <div className="h-showcase__img-wrap">
                <Image
                  src={demo.image}
                  alt={demo.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-showcase__img"
                  style={{ objectPosition: demo.imageFocus }}
                  quality={82}
                  loading="lazy"
                />
              </div>
              <div className="h-showcase__veil" />
              <div className="h-showcase__badge">
                <span className="h-showcase__tier">{demo.tier}</span>
                <span className="h-showcase__pages">{demo.pages}</span>
              </div>
              <div className="h-showcase__landmark">
                <span className="h-showcase__landmark-name">{demo.landmark}</span>
              </div>
            </div>
            <div className="h-showcase__body">
              <h3 className="h-showcase__title">{demo.title}</h3>
              <p className="h-showcase__desc">{demo.desc}</p>
              <ul className="h-showcase__features">
                {demo.features.map((f) => (
                  <li key={f}>
                    <Check className="h-3.5 w-3.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={demo.href} className="btn btn--ghost h-showcase__cta">
                View Live Demo
              </a>
            </div>
          </InViewItem>
        ))}
      </InViewStagger>
    </div>
  );
}