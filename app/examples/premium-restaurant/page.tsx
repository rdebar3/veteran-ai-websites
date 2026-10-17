import Image from 'next/image';
import Link from 'next/link';
import { FoldImage } from '@/components/examples/FoldImage';
import {
  dinnerLine,
  dishes,
  hero,
  phone,
  phoneHref,
  reviews,
  town,
} from '@/lib/ridge-bistro-data';

export default function BistroHomePage() {
  const quote = reviews[0];
  return (
    <>
      <section className="rb-hero">
        <div className="rb-hero-media">
          <Image src={hero.photo.src} alt={hero.photo.alt} fill priority unoptimized sizes="100vw" />
        </div>
        <div className="rb-scrim" aria-hidden="true" />
        <div className="rb-hero-copy">
          <p className="rb-town">{town}</p>
          <h1>{hero.headline}</h1>
          <p className="rb-dinner">{dinnerLine}</p>
          <div className="rb-hero-actions">
            <a className="rb-btn rb-btn--solid" href={phoneHref}>
              {phone}
            </a>
            <Link prefetch={false} className="rb-btn" href={hero.primaryHref}>
              {hero.primary}
            </Link>
            <Link prefetch={false} className="rb-btn" href={hero.secondaryHref}>
              {hero.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="rb-sec rb-reveal">
        <div className="rb-wrap">
          <h2>From the kitchen</h2>
          <div className="rb-dishes">
            {dishes.map((dish) => (
              <figure key={dish.src}>
                <div className="rb-photo">
                  <FoldImage src={dish.src} alt={dish.alt} fill sizes="(max-width: 760px) 100vw, 320px" />
                </div>
                <figcaption>
                  <strong>{dish.name}</strong>
                  <p>{dish.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-sec rb-reveal">
        <div className="rb-wrap">
          <figure className="rb-pull">
            <blockquote>“{quote.quote}”</blockquote>
            <figcaption>
              {quote.name} · {quote.town}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="rb-sec rb-reveal">
        <div className="rb-wrap rb-tease">
          <div>
            <h2>Private dining</h2>
            <p className="rb-deck">One table. The kitchen’s attention for the night.</p>
            <div className="rb-hero-actions">
              <Link prefetch={false} className="rb-btn" href="/examples/premium-restaurant/private-dining">
                See the room
              </Link>
            </div>
          </div>
          <div className="rb-photo">
            <FoldImage
              src="/demos/ridge-bistro/private-dining.webp"
              alt="The private dining room"
              fill
              sizes="(max-width: 760px) 100vw, 420px"
            />
          </div>
        </div>
      </section>
    </>
  );
}
