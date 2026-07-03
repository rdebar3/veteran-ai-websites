import Image from 'next/image';

interface VisualInterludeProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
  align?: 'left' | 'center';
}

export default function VisualInterlude({
  image,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  align = 'center',
}: VisualInterludeProps) {
  return (
    <section className={`interlude interlude--${align}`}>
      <div className="interlude__visual" aria-hidden="true">
        <Image src={image} alt="" fill sizes="100vw" className="interlude__img" quality={90} />
        <div className="interlude__veil" />
        <div className="interlude__glow" />
      </div>
      <div className="interlude__content reveal reveal--scale">
        {eyebrow && <span className="interlude__eyebrow">{eyebrow}</span>}
        <h2 className="interlude__title">{title}</h2>
        {subtitle && <p className="interlude__subtitle">{subtitle}</p>}
        {ctaHref && ctaLabel && (
          <a href={ctaHref} className="btn btn--primary btn--lg btn--glow interlude__cta">
            {ctaLabel}
          </a>
        )}
      </div>
      <span className="sr-only">{imageAlt}</span>
    </section>
  );
}