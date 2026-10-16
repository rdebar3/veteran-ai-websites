import Image from 'next/image';
import Link from 'next/link';
import RequestForm from '@/components/complete-hvac/RequestForm';
import { TodayHours } from '@/components/examples/TodayHours';
import {
  hero,
  homeTiles,
  line,
  name,
  phone,
  phoneHref,
  rating,
  requestHref,
  requestLabel,
  reviews,
  serviceArea,
  town,
  whyPlan,
} from '@/lib/complete-hvac-data';

function Stars() {
  return (
    <span className="hv-stars" aria-label="5 out of 5 stars">
      ★★★★★
    </span>
  );
}

export default function CompleteHvacPage() {
  return (
    <>
      <section className="hv-wrap hv-hero">
        <div>
          <p className="hv-kicker">{town}</p>
          <h1 className="hv-rule">{name}</h1>
          <p className="hv-lead">{line}</p>
          <div className="hv-hero-actions">
            <a className="hv-btn hv-btn--solid" href={phoneHref}>
              {phone}
            </a>
            <Link prefetch={false} className="hv-btn" href={requestHref}>
              {requestLabel}
            </Link>
          </div>
          <TodayHours demo="hvac" className="hv-today" />
        </div>
        <div className="hv-mount">
          <div className="hv-mount-in">
            <Image src={hero.photo.src} alt={hero.photo.alt} fill priority unoptimized sizes="(max-width: 760px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <section className="hv-sec hv-reveal">
        <div className="hv-wrap">
          <h2 className="hv-rule">Services</h2>
          <div className="hv-tiles">
            {homeTiles.map((tile) => (
              <Link prefetch={false} className="hv-tile" key={tile.id} href={`/examples/complete-hvac/services#${tile.id}`}>
                <h3>{tile.title}</h3>
                <p>{tile.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-sec hv-reveal">
        <div className="hv-wrap hv-plan">
          <div>
            <h2 className="hv-rule">Maintenance plans</h2>
            <p className="hv-lead">{whyPlan}</p>
          </div>
          <Link prefetch={false} className="hv-btn hv-btn--solid" href="/examples/complete-hvac/maintenance-plans">
            See the plans
          </Link>
        </div>
      </section>

      <section className="hv-sec hv-reveal" id="reviews">
        <div className="hv-wrap">
          <h2 className="hv-rule">Reviews</h2>
          <p className="hv-badge">
            {rating.score}
            <span> · {rating.count}, {rating.note}</span>
          </p>
          <div className="hv-reviews">
            {reviews.map((review) => (
              <figure key={review.name}>
                <Stars />
                <blockquote>“{review.quote}”</blockquote>
                <figcaption>
                  {review.name} · {review.town}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-sec hv-reveal">
        <div className="hv-wrap">
          <h2 className="hv-rule">Service area</h2>
          <p className="hv-lead">{serviceArea.title}</p>
          <ul className="hv-towns">
            {serviceArea.towns.map((town) => (
              <li key={town}>{town}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hv-sec hv-reveal" id="request">
        <div className="hv-wrap hv-contact">
          <div>
            <h2 className="hv-rule">Request service</h2>
            <p className="hv-lead">Tell us what the house is doing. We call you back.</p>
          </div>
          <RequestForm />
        </div>
      </section>
    </>
  );
}
