import type { ReactNode } from 'react';
import ScrollReveal from '@/components/ScrollReveal';

interface SectionShellProps {
  id: string;
  location: string;
  elevation: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}

export default function SectionShell({
  id,
  location,
  elevation,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  wide = false,
}: SectionShellProps) {
  return (
    <section id={id} className={`journey-section ${className}`}>
      <div className={`journey-section__inner ${wide ? 'journey-section__inner--wide' : ''}`}>
        <ScrollReveal>
          <div className="journey-location">
            <span className="journey-location__pin" aria-hidden="true" />
            <span className="journey-location__text">
              {location}
              <span className="journey-location__elevation">{elevation}</span>
            </span>
          </div>
          {eyebrow && <p className="premium-eyebrow">{eyebrow}</p>}
          <h2 className="premium-title">{title}</h2>
          {subtitle && <p className="premium-subtitle">{subtitle}</p>}
        </ScrollReveal>
        <div className="journey-section__content">{children}</div>
      </div>
    </section>
  );
}