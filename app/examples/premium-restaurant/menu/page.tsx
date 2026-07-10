'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import { menuSections, tastingMenu } from '@/lib/ridge-bistro-data';

export default function MenuPage() {
  useEffect(() => {
    document.title = 'Menu | The Ridge Bistro | Ridgeview, WV';
  }, []);

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/dish-charcuterie.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Seasonal · Local · Refined</p>
          <h1 className="rb-hero__title">The Menu</h1>
          <p className="rb-hero__lead">
            Our menu evolves with the Appalachian seasons. All prices per person unless noted.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner">
          <div className="rb-tasting-card rb-reveal">
            <div className="rb-tasting-card__head">
              <div>
                <p className="rb-section__eyebrow">The Signature Experience</p>
                <h2 className="rb-tasting-card__title">{tastingMenu.title}</h2>
              </div>
              <div className="rb-tasting-card__price">
                <span className="rb-tasting-card__amt">${tastingMenu.price}</span>
                <span className="rb-tasting-card__unit">{tastingMenu.courses} · per guest</span>
                <span className="rb-tasting-card__pair">
                  with wine pairings ${tastingMenu.pairingPrice}
                </span>
              </div>
            </div>
            <p className="rb-tasting-card__blurb">{tastingMenu.blurb}</p>
            <ul className="rb-tasting-card__list">
              {tastingMenu.highlights.map((h, i) => (
                <li key={h}>
                  <span className="rb-tasting__num">{String(i + 1).padStart(2, '0')}</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <nav className="rb-menu-nav rb-reveal" aria-label="Menu sections">
            {menuSections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>

          {menuSections.map((section) => (
            <div key={section.id} id={section.id} className="rb-menu-section rb-reveal">
              <div className="rb-menu-section__head">
                <h2 className="rb-menu-section__title">{section.title}</h2>
                <p className="rb-menu-section__sub">{section.subtitle}</p>
              </div>

              <div>
                {section.items.map((item) => (
                  <div key={item.name} className="rb-menu-item">
                    <div>
                      <div className="rb-menu-item__top">
                        <span className="rb-menu-item__name">{item.name}</span>
                        {item.note && (
                          <span className="rb-menu-item__note">{item.note}</span>
                        )}
                      </div>
                      <p className="rb-menu-item__desc">{item.desc}</p>
                    </div>
                    <span
                      className={`rb-menu-item__price${item.price === 'Complimentary' ? ' rb-menu-item__price--plain' : ''}`}
                    >
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-8 rb-reveal">
            <p className="text-sm text-[var(--rb-muted)] mb-6 italic">
              Please inform your server of any allergies or dietary restrictions.
            </p>
            <Link href="/examples/premium-restaurant/reservations" className="rb-btn rb-btn--gold">
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>
    </BistroShell>
  );
}