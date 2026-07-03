import type { CSSProperties } from 'react';
import Image from 'next/image';
import type { CinematicChapter } from '@/lib/cinematic';

interface CinematicScrollProps {
  id?: string;
  chapters: CinematicChapter[];
  className?: string;
}

export default function CinematicScroll({ id, chapters, className = '' }: CinematicScrollProps) {
  const count = chapters.length;

  return (
    <section
      id={id}
      className={`cinema cinema--panels-${count} ${className}`.trim()}
      style={{ '--cinema-panels': count } as CSSProperties}
      aria-label="Cinematic story section"
    >
      <div className="cinema__track">
        <div className="cinema__stage">
          <div className="cinema__visuals" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <div
                key={chapter.index}
                className={`cinema__layer cinema__layer--${i}`}
                data-panel={i}
              >
                <Image
                  src={chapter.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="cinema__img"
                  quality={90}
                  priority={i === 0}
                />
                <div className="cinema__veil" />
                <div className="cinema__glow" />
              </div>
            ))}
          </div>

          <div className="cinema__captions">
            {chapters.map((chapter, i) => (
              <article
                key={`caption-${chapter.index}`}
                className={`cinema__caption cinema__caption--${i}`}
                aria-hidden={i !== 0}
              >
                <span className="cinema__caption-index">{chapter.index}</span>
                <span className="cinema__caption-eyebrow">{chapter.eyebrow}</span>
                <h2 className="cinema__caption-title">{chapter.title}</h2>
                <p className="cinema__caption-body">{chapter.body}</p>
              </article>
            ))}
          </div>

          <div className="cinema__progress" aria-hidden="true">
            {chapters.map((chapter, i) => (
              <span key={`dot-${chapter.index}`} className={`cinema__dot cinema__dot--${i}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="cinema__fallback">
        {chapters.map((chapter) => (
          <article key={`fallback-${chapter.index}`} className="cinema__fallback-panel">
            <div className="cinema__fallback-visual">
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                sizes="100vw"
                className="cinema__img"
                quality={85}
              />
              <div className="cinema__veil" />
            </div>
            <div className="cinema__fallback-copy">
              <span className="cinema__caption-index">{chapter.index}</span>
              <span className="cinema__caption-eyebrow">{chapter.eyebrow}</span>
              <h2 className="cinema__caption-title">{chapter.title}</h2>
              <p className="cinema__caption-body">{chapter.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}