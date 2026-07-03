'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import { featuredDishes } from '@/lib/ridge-bistro-data';

export default function RidgeBistroHome() {
  useEffect(() => {
    document.title = 'The Ridge Bistro | Appalachian Fine Dining | Ridgeview, WV';
  }, []);

  return (
    <BistroShell>
      <section className="rb-hero">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={92}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
          <div className="rb-hero__grain" />
        </div>

        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Ridgeview, West Virginia</p>
          <h1 className="rb-hero__title">
            Quiet luxury<br />
            <em>at the ridge.</em>
          </h1>
          <p className="rb-hero__lead">
            Appalachian ingredients, modern technique, and an atmosphere of refined warmth —
            where reclaimed wood, stone, and candlelight meet the art of the plate.
          </p>
          <div className="rb-hero__actions">
            <Link href="/examples/premium-restaurant/reservations" className="rb-btn rb-btn--gold">
              Reserve a Table
            </Link>
            <Link href="/examples/premium-restaurant/menu" className="rb-btn rb-btn--outline">
              View the Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner rb-reveal">
          <div className="text-center">
            <p className="rb-section__eyebrow">From Our Kitchen</p>
            <h2 className="rb-section__title">Seasonal plates, impeccably composed</h2>
            <div className="rb-divider" />
            <p className="rb-section__lead" style={{ margin: '0 auto 3rem' }}>
              Each dish reflects the mountains around us — trout from cold streams,
              foraged mushrooms from the forest floor, and produce from neighboring farms.
            </p>
          </div>

          <div className="rb-dish-grid">
            {featuredDishes.map((dish) => (
              <article key={dish.name} className="rb-dish rb-reveal">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  width={500}
                  height={375}
                  className="rb-dish__img"
                />
                <div className="rb-dish__body">
                  <h3 className="rb-dish__name">{dish.name}</h3>
                  <p className="rb-dish__desc">{dish.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/examples/premium-restaurant/menu" className="rb-btn rb-btn--outline">
              Explore the Full Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="rb-section rb-section--dark">
        <div className="rb-section__inner rb-split rb-reveal">
          <div>
            <p className="rb-section__eyebrow">The Experience</p>
            <h2 className="rb-section__title">Modern elegance, mountain soul</h2>
            <p className="rb-section__lead">
              The Ridge Bistro sits above the valley where reclaimed oak beams frame
              walls of local stone, and every table is lit with the quiet glow of warm amber light.
              Service is attentive yet unobtrusive — the kind of evening that lingers.
            </p>
            <Link href="/examples/premium-restaurant/about" className="rb-btn rb-btn--gold">
              Our Story
            </Link>
          </div>
          <Image
            src="/demos/ridge-bistro/interior.jpg"
            alt="The Ridge Bistro dining room with reclaimed wood and stone"
            width={700}
            height={520}
            className="rb-split__img"
          />
        </div>
      </section>

      <section className="rb-section rb-section--burgundy">
        <div className="rb-section__inner text-center rb-reveal">
          <p className="rb-section__eyebrow">Private Dining</p>
          <h2 className="rb-section__title">Intimate gatherings, elevated</h2>
          <p className="rb-section__lead" style={{ margin: '0 auto 2rem' }}>
            Our private room accommodates intimate celebrations with custom tasting menus
            and dedicated service — all overlooking the ridge.
          </p>
          <Link href="/examples/premium-restaurant/private-dining" className="rb-btn rb-btn--gold">
            Private Dining
          </Link>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner text-center rb-reveal">
          <p className="rb-section__eyebrow">Reservations</p>
          <h2 className="rb-section__title">An evening awaits</h2>
          <p className="rb-section__lead" style={{ margin: '0 auto 2rem' }}>
            Tables are limited. We recommend reserving in advance for weekend service.
          </p>
          <Link href="/examples/premium-restaurant/reservations" className="rb-btn rb-btn--gold">
            Reserve Your Table
          </Link>
        </div>
      </section>
    </BistroShell>
  );
}