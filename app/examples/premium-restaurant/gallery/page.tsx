'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BistroShell from '@/components/ridge-bistro/BistroShell';
import { galleryImages } from '@/lib/ridge-bistro-data';

export default function GalleryPage() {
  useEffect(() => {
    document.title = 'Gallery | The Ridge Bistro | Ridgeview, WV';
  }, []);

  return (
    <BistroShell>
      <section className="rb-hero rb-hero--page">
        <div className="rb-hero__bg">
          <Image
            src="/demos/ridge-bistro/hero.jpg"
            alt=""
            fill
            sizes="100vw"
            quality={88}
            className="rb-hero__img"
          />
          <div className="rb-hero__veil" />
        </div>
        <div className="rb-hero__content">
          <p className="rb-hero__eyebrow">Gallery</p>
          <h1 className="rb-hero__title">A visual journey</h1>
          <p className="rb-hero__lead">
            The room, the plate, and the details that define an evening at The Ridge.
          </p>
        </div>
      </section>

      <section className="rb-section">
        <div className="rb-section__inner rb-reveal">
          <div className="rb-gallery">
            {galleryImages.map((img, i) => (
              <div
                key={img.src}
                className={`rb-gallery__item ${i === 0 ? '' : ''}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={600}
                  className="rb-gallery__img"
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/examples/premium-restaurant/reservations" className="rb-btn rb-btn--gold">
              Reserve Your Table
            </Link>
          </div>
        </div>
      </section>
    </BistroShell>
  );
}