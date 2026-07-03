'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BistroShell from '@/components/ridge-bistro/BistroShell';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About | The Ridge Bistro | Ridgeview, WV';
  }, []);

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/interior.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Our Story</p>
          <h1 className="rb-hero__title">Rooted in the ridge</h1>
          <p className="rb-hero__lead">
            A destination for those who appreciate restraint, craft, and the quiet beauty of these mountains.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner rb-split rb-reveal">
          <div>
            <p className="rb-section__eyebrow">Philosophy</p>
            <h2 className="rb-section__title">Appalachian luxury, thoughtfully composed</h2>
            <p className="rb-section__lead">
              The Ridge Bistro opened with a singular vision: to create a fine dining experience
              that honors West Virginia&apos;s landscape without pretense. Our kitchen works closely
              with local farmers, foragers, and artisans to build a menu that changes with the seasons.
            </p>
            <p className="text-[var(--rb-muted)] leading-relaxed mb-6">
              The dining room was designed around materials found in these hills — reclaimed oak
              from century-old barns, stone quarried nearby, and lighting warm enough to feel like
              an embrace. Every detail was considered. Nothing is accidental.
            </p>
            <p className="text-[var(--rb-muted)] leading-relaxed">
              Executive Chef Elena Marsh brings fifteen years of experience from kitchens in
              Charleston, Asheville, and New York, returning home to cook the food of her upbringing
              with the precision of classical training.
            </p>
          </div>
          <Image
            src="/demos/ridge-bistro/dish-trout.jpg"
            alt="Pan-seared Appalachian trout"
            width={700}
            height={520}
            className="rb-split__img"
          />
        </div>
      </section>

      <section className="rb-section rb-section--dark">
        <div className="rb-section__inner text-center rb-reveal">
          <p className="rb-section__eyebrow">Craft &amp; Provenance</p>
          <h2 className="rb-section__title">Ingredients with a sense of place</h2>
          <div className="rb-divider" />
          <p className="rb-section__lead" style={{ margin: '0 auto' }}>
            Trout from cold mountain streams. Mushrooms foraged from Monongahela forest.
            Beef aged in-house. Wine selected to complement, never overpower.
            This is dining that tastes like where we are.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner text-center rb-reveal">
          <Link href="/examples/premium-restaurant/reservations" className="rb-btn rb-btn--gold">
            Join Us for Dinner
          </Link>
        </div>
      </section>
    </BistroShell>
  );
}