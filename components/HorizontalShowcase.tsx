'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import type { ShowcaseDemo } from '@/lib/cinematic';

interface HorizontalShowcaseProps {
  demos: ShowcaseDemo[];
}

export default function HorizontalShowcase({ demos }: HorizontalShowcaseProps) {
  return (
    <div className="h-showcase">
      <div className="h-showcase__scroll" role="list">
        {demos.map((demo) => (
          <article key={demo.tier} className="h-showcase__card" role="listitem">
            <div className="h-showcase__visual">
              <Image
                src={demo.image}
                alt=""
                fill
                sizes="(max-width: 768px) 88vw, 42vw"
                className="h-showcase__img"
                quality={88}
              />
              <div className="h-showcase__veil" />
              <div className="h-showcase__badge">
                <span className="h-showcase__tier">{demo.tier}</span>
                <span className="h-showcase__pages">{demo.pages}</span>
              </div>
              <div className="h-showcase__landmark">
                <span className="h-showcase__landmark-label">WV Overlook</span>
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
              <a href={demo.href} className="btn btn--ghost btn--lg h-showcase__cta">
                View Live Demo
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="h-showcase__hint">Scroll horizontally to explore demos</p>
    </div>
  );
}