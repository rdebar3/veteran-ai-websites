'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, ThermometerSun } from 'lucide-react';
import { navLinks, HVAC_PHONE, HVAC_PHONE_HREF } from '@/lib/complete-hvac-data';

export function useHvacReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.hv-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hv-reveal--in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

interface HvacShellProps {
  children: React.ReactNode;
  introActive?: boolean;
}

export default function HvacShell({ children, introActive = false }: HvacShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  useHvacReveal();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setNavProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const isActive = (href: string) => {
    const current = pathname || '';
    if (href === '/examples/complete-hvac') {
      return current === href || current === '/examples/complete-hvac/';
    }
    return current.startsWith(href);
  };

  return (
    <div className={`hv-demo ${introActive ? '' : 'hv-demo--ready'}`}>
      <div className="hv-topbar">
        <div className="hv-topbar__inner">
          <a href={HVAC_PHONE_HREF} className="hv-topbar__phone">
            <Phone className="h-3.5 w-3.5" />
            {HVAC_PHONE}
          </a>
          <span className="hv-topbar__note">24/7 Emergency · Veteran Owned · Ridgeview, WV</span>
        </div>
      </div>

      <nav className={`hv-nav ${navScrolled ? 'hv-nav--scrolled' : ''}`}>
        <div className="hv-nav__inner">
          <Link href="/examples/complete-hvac" className="hv-nav__logo">
            <span className="hv-nav__logo-icon">
              <ThermometerSun className="h-4 w-4" />
            </span>
            <span>
              <div className="hv-nav__logo-text">Appalachian HVAC</div>
              <div className="hv-nav__logo-sub">Comfort for Every Season</div>
            </span>
          </Link>

          <div className="hv-nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hv-nav__link ${isActive(link.href) ? 'hv-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/examples/complete-hvac/contact" className="hv-nav__cta">
              <Phone className="h-3.5 w-3.5" /> Get a Quote
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--hv-muted)]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <div
          className="hv-nav__progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${navProgress})` }}
        />

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--hv-border)] px-6 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`hv-nav__link py-1 ${isActive(link.href) ? 'hv-nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/examples/complete-hvac/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hv-nav__cta justify-center mt-2"
            >
              <Phone className="h-3.5 w-3.5" /> Get a Quote
            </Link>
          </div>
        )}
      </nav>

      <main>{children}</main>

      <footer className="hv-footer">
        <div className="hv-footer__grid">
          <div>
            <div className="hv-footer__brand">
              <span className="hv-nav__logo-icon">
                <ThermometerSun className="h-3.5 w-3.5" />
              </span>
              Appalachian HVAC Solutions
            </div>
            <p className="hv-footer__tag">Warm, reliable comfort for Ridgeview homes.</p>
          </div>

          <div>
            <div className="hv-footer__label">Company</div>
            <div className="hv-footer__links">
              <Link href="/examples/complete-hvac/about">About</Link>
              <Link href="/examples/complete-hvac/reviews">Projects / Reviews</Link>
              <a href={HVAC_PHONE_HREF}>24/7: {HVAC_PHONE}</a>
            </div>
          </div>

          <div>
            <div className="hv-footer__label">Services</div>
            <div className="hv-footer__links">
              <Link href="/examples/complete-hvac/services">Heating &amp; Cooling</Link>
              <Link href="/examples/complete-hvac/services">Whole-Home Comfort</Link>
              <Link href="/examples/complete-hvac/services">Indoor Air Quality</Link>
            </div>
          </div>

          <div className="hv-footer__meta">
            <div className="hv-footer__label">Ridgeview, WV</div>
            <div>124 Mountain View Road</div>
            <div>Ridgeview, WV 26501</div>
            <div className="mt-2">Mon–Fri 7:30am–5:30pm</div>
            <div>24/7 Emergency Response</div>
            <div className="mt-2 opacity-60">Veteran Owned &amp; Operated</div>
          </div>
        </div>

        <div className="hv-footer__demo">
          This is a demonstration site showing the quality of a Complete package website.
        </div>
      </footer>
    </div>
  );
}