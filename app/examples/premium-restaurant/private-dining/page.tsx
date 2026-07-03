'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import { privateDiningFeatures, BISTRO_EMAIL } from '@/lib/ridge-bistro-data';

export default function PrivateDiningPage() {
  useEffect(() => {
    document.title = 'Private Dining | The Ridge Bistro | Ridgeview, WV';
  }, []);

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/private-dining.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Private Dining</p>
          <h1 className="rb-hero__title">Intimate by design</h1>
          <p className="rb-hero__lead">
            A secluded room for celebrations, proposals, and gatherings that deserve
            an unhurried evening of exceptional food and service.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner rb-split rb-reveal">
          <Image
            src="/demos/ridge-bistro/private-dining.jpg"
            alt="Private dining room with fireplace and reclaimed wood table"
            width={700}
            height={520}
            className="rb-split__img"
          />
          <div>
            <p className="rb-section__eyebrow">The Room</p>
            <h2 className="rb-section__title">The Summit Room</h2>
            <p className="rb-section__lead">
              Tucked above the main dining room, The Summit Room seats eight to fourteen guests
              around a single reclaimed oak table, with views of the stone fireplace and the
              valley beyond the ridge.
            </p>
            <ul className="rb-list">
              {privateDiningFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rb-section rb-section--burgundy">
        <div className="rb-section__inner text-center rb-reveal">
          <p className="rb-section__eyebrow">Tasting Menus</p>
          <h2 className="rb-section__title">Curated for your occasion</h2>
          <p className="rb-section__lead" style={{ margin: '0 auto 2rem' }}>
            Our executive chef designs multi-course menus tailored to your preferences,
            with optional wine pairings from our sommelier. Private dining experiences
            begin at $125 per guest.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/examples/premium-restaurant/contact" className="rb-btn rb-btn--gold">
              Inquire About Private Dining
            </Link>
            <a href={`mailto:${BISTRO_EMAIL}`} className="rb-btn rb-btn--outline">
              Email Us
            </a>
          </div>
        </div>
      </section>
    </BistroShell>
  );
}