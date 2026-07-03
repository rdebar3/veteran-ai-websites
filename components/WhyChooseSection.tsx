'use client';

import Image from 'next/image';
import { Award, Clock, Shield, MapPin } from 'lucide-react';
import Reveal from '@/components/Reveal';
import ScrollLift from '@/components/ScrollLift';
import { whyChooseLead, whyChoosePillars } from '@/lib/content-sections';

const pillarIcons = [Award, Clock, Shield, MapPin];

export default function WhyChooseSection() {
  return (
    <section id="story" className="why-choose">
      <div className="why-choose__inner">
        <Reveal variant="up">
          <p className="why-choose__eyebrow">Rooted in West Virginia</p>
          <h2 className="why-choose__title">Why Local Businesses Choose Us</h2>
          <p className="why-choose__lead">{whyChooseLead}</p>
        </Reveal>

        <div className="why-choose__grid">
          {whyChoosePillars.map((pillar, i) => {
            const Icon = pillarIcons[i] ?? Award;
            return (
              <ScrollLift key={pillar.title} delay={i * 0.08} className="why-choose__card card">
                <div className="why-choose__card-visual">
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="why-choose__card-img"
                    quality={88}
                  />
                  <div className="why-choose__card-veil" />
                  <div className="why-choose__card-icon">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="why-choose__card-body">
                  <h3 className="why-choose__card-title">{pillar.title}</h3>
                  <p className="why-choose__card-text">{pillar.body}</p>
                  <p className="why-choose__card-caption">{pillar.imageCaption}</p>
                </div>
              </ScrollLift>
            );
          })}
        </div>
      </div>
    </section>
  );
}