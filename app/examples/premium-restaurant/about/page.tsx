import Image from 'next/image';
import { about, reviews } from '@/lib/ridge-bistro-data';

export default function AboutPage() {
  return (
    <>
      <section className="rb-sec">
        <div className="rb-wrap rb-room">
          <div className="rb-photo">
            <Image
              src={about.photo.src}
              alt={about.photo.alt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 480px"
            />
          </div>
          <div>
            <h1>{about.title}</h1>
            {about.paragraphs.map((paragraph) => (
              <p className="rb-deck" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="rb-sec rb-reveal" id="reviews">
        <div className="rb-wrap">
          <h2>Reviews</h2>
          <div className="rb-reviews">
            {reviews.map((review) => (
              <figure key={review.name}>
                <blockquote>“{review.quote}”</blockquote>
                <figcaption>
                  {review.name} · {review.town}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
