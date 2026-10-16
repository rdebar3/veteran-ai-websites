import Image from 'next/image';
import { FoldImage } from '@/components/examples/FoldImage';
import { TodayHours } from '@/components/examples/TodayHours';
import QuoteForm from '@/components/starter-plumbing/QuoteForm';
import {
  about,
  hero,
  hours,
  line,
  name,
  ownerLine,
  phone,
  phoneHref,
  quote,
  quoteHref,
  quoteLabel,
  reviews,
  serviceArea,
  services,
  town,
  work,
} from '@/lib/starter-plumbing-data';

const icons: Record<string, string> = {
  leak: 'M4 14c2-6 4-6 6 0s4 6 6 0',
  heaters: 'M12 3v10M8 7c0 4 8 4 8 0',
  drain: 'M6 5h12v4H6zM8 9v8M16 9v8M8 17h8',
  repipe: 'M5 8h6v8H5zM11 12h8M15 8v8',
  fixtures: 'M8 4h8v6a4 4 0 0 1-8 0zM12 14v6',
  emergency: 'M12 3l8 16H4zM12 9v4M12 16h.01',
};

function Stars() {
  return (
    <span className="sp-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 1.6l2.1 4.6 5 .6-3.7 3.4.9 5L10 13.2 5.7 15.2l.9-5L2.9 6.8l5-.6L10 1.6z"
          />
        </svg>
      ))}
    </span>
  );
}

export default function StarterPlumbingPage() {
  return (
    <>
      <section className="sp-wrap sp-hero">
        <div>
          <p className="sp-kicker">{town}</p>
          <h1>{name}</h1>
          <p className="sp-line">{line}</p>
          <div className="sp-hero-actions">
            <a className="sp-btn sp-btn--solid" href={phoneHref}>
              {phone}
            </a>
            <a className="sp-btn sp-btn--line" href={quoteHref}>
              {quoteLabel}
            </a>
          </div>
          <TodayHours demo="plumbing" className="sp-today" />
        </div>
        <div className="sp-frame">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 520px"
          />
        </div>
      </section>

      <section className="sp-sec sp-reveal">
        <div className="sp-wrap">
          <h2>What we do</h2>
          <div className="sp-services">
            {services.map((service) => (
              <article className="sp-card" key={service.id}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d={icons[service.id]} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-reveal">
        <div className="sp-wrap sp-about">
          <div className="sp-frame">
            <FoldImage
              src={about.photo.src}
              alt={about.photo.alt}
              fill
              sizes="(max-width: 760px) 100vw, 480px"
            />
          </div>
          <div>
            <h2>{about.title}</h2>
            <p className="sp-lead">{about.lead}</p>
            <p className="sp-owner">The owner says: “{ownerLine}”</p>
            <ul>
              {about.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sp-sec sp-reveal">
        <div className="sp-wrap">
          <h2>Recent work</h2>
          <div className="sp-work">
            {work.map((shot) => (
              <figure key={shot.src}>
                <div className="sp-shot">
                  <FoldImage src={shot.src} alt={shot.alt} fill sizes="(max-width: 760px) 100vw, 340px" />
                </div>
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-reveal">
        <div className="sp-wrap">
          <h2>What neighbors say</h2>
          <div className="sp-reviews">
            {reviews.map((review) => (
              <figure className="sp-card" key={review.name}>
                <Stars />
                <blockquote>“{review.quote}”</blockquote>
                <figcaption>
                  {review.name}
                  <br />
                  {review.town}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-reveal">
        <div className="sp-wrap sp-split">
          <div>
            <h2>Hours</h2>
            <table className="sp-hours">
              <tbody>
                {hours.map((row) => (
                  <tr key={row.days}>
                    <th scope="row">{row.days}</th>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Service area</h2>
            <p className="sp-lead">{serviceArea.title}</p>
            <ul className="sp-towns">
              {serviceArea.towns.map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sp-sec sp-reveal" id="quote">
        <div className="sp-wrap sp-quote">
          <div>
            <h2>{quote.title}</h2>
            <p className="sp-lead">{quote.lead}</p>
          </div>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
