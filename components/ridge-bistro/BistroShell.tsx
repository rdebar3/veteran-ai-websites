'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X } from 'lucide-react';
import { Cormorant_Garamond } from 'next/font/google';

const rbSerif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--rb-serif-font',
  display: 'swap',
});
import {
  navLinks,
  BISTRO_PHONE,
  BISTRO_PHONE_HREF,
  BISTRO_ADDRESS,
  BISTRO_EMAIL,
  hours,
} from '@/lib/ridge-bistro-data';

export function useBistroReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.rb-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('rb-reveal--in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function BistroShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);

  useBistroReveal();

  useEffect(() => {
    let last = window.scrollY;
    let nearTop = false; // pointer reaching toward the top edge
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Reveal near the top; hide as you read down; show on scroll-up or when
      // the pointer moves toward the top of the screen.
      if (y < 120 || nearTop) setHidden(false);
      else if (y > last + 4) setHidden(true);
      else if (y < last - 4) setHidden(false);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      last = y;
    };
    const onMove = (e: MouseEvent) => {
      const top = e.clientY <= 90;
      if (top !== nearTop) {
        nearTop = top;
        if (top) setHidden(false);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    const current = pathname || '';
    if (href === '/examples/premium-restaurant') {
      return current === href || current === '/examples/premium-restaurant/';
    }
    return current.startsWith(href);
  };

  return (
    <div className={`rb-demo ${rbSerif.variable}`}>
      <header
        className={`rb-header ${scrolled ? 'rb-header--scrolled' : ''} ${hidden ? 'rb-header--hidden' : ''}`}
      >
        <div className="rb-header__bar">
          <a href={BISTRO_PHONE_HREF} className="rb-header__phone">
            <Phone className="h-3.5 w-3.5" />
            {BISTRO_PHONE}
          </a>
          <span className="rb-header__note">Ridgeview, West Virginia</span>
        </div>

        <nav className="rb-nav">
          <div className="rb-nav__inner">
            <Link href="/examples/premium-restaurant" className="rb-nav__logo">
              <span className="rb-nav__logo-mark">RB</span>
              <span>
                <span className="rb-nav__logo-name">The Ridge Bistro</span>
                <span className="rb-nav__logo-sub">Appalachian Fine Dining</span>
              </span>
            </Link>

            <div className="rb-nav__links">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rb-nav__link ${isActive(link.href) ? 'rb-nav__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link href="/examples/premium-restaurant/reservations" className="rb-nav__cta">
              Reserve
            </Link>

            <button
              type="button"
              className="rb-nav__toggle lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen && (
            <div className="rb-nav__mobile lg:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rb-nav__link ${isActive(link.href) ? 'rb-nav__link--active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/examples/premium-restaurant/reservations" className="rb-nav__cta rb-nav__cta--mobile">
                Reserve a Table
              </Link>
            </div>
          )}
        </nav>
        <div
          className="rb-header__progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      <main>{children}</main>

      <footer className="rb-footer">
        <div className="rb-footer__grid">
          <div>
            <div className="rb-footer__brand">The Ridge Bistro</div>
            <p className="rb-footer__tag">Quiet luxury at the edge of the Appalachians.</p>
          </div>
          <div>
            <div className="rb-footer__label">Visit</div>
            <p className="rb-footer__text">{BISTRO_ADDRESS}</p>
            <a href={BISTRO_PHONE_HREF} className="rb-footer__link">{BISTRO_PHONE}</a>
            <a href={`mailto:${BISTRO_EMAIL}`} className="rb-footer__link">{BISTRO_EMAIL}</a>
          </div>
          <div>
            <div className="rb-footer__label">Hours</div>
            {hours.map((h) => (
              <p key={h.days} className="rb-footer__text">
                <span className="text-[var(--rb-cream)]">{h.days}</span> · {h.time}
              </p>
            ))}
          </div>
        </div>
        <p className="rb-footer__demo">
          This is a demonstration site showing the quality of a Premium package website.
        </p>
      </footer>
    </div>
  );
}