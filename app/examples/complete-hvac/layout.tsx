'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Phone, Menu, X, Siren } from 'lucide-react';
import './complete-hvac.css';
import {
  navLinks,
  HVAC_NAME,
  HVAC_TAGLINE,
  HVAC_PHONE,
  HVAC_PHONE_HREF,
  HVAC_ADDRESS1,
  HVAC_ADDRESS2,
  HVAC_HOURS,
  HVAC_EMERGENCY,
  HVAC_FOUNDED,
  HVAC_OWNERSHIP,
  HVAC_LICENSE,
} from '@/lib/complete-hvac-data';

const HOME = '/examples/complete-hvac';

export default function CompleteHvacLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navProgress, setNavProgress] = useState(0);

  // Hide the main Veteran AI Websites nav/footer while inside the demo.
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    if (mainNav?.textContent?.includes('Veteran AI Websites')) {
      (mainNav as HTMLElement).style.display = 'none';
    }
    const mainFooter = document.querySelector('footer');
    if (mainFooter?.textContent?.includes('Veteran AI Websites')) {
      (mainFooter as HTMLElement).style.display = 'none';
    }
    document.body.classList.add('hv-demo-body');
    return () => {
      if (mainNav) (mainNav as HTMLElement).style.display = '';
      if (mainFooter) (mainFooter as HTMLElement).style.display = '';
      document.body.classList.remove('hv-demo-body');
    };
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Sticky-nav scroll state + page progress.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavScrolled(y > 12);
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
    const cur = pathname || '';
    if (href === HOME) return cur === HOME || cur === `${HOME}/`;
    return cur.startsWith(href);
  };

  return (
    <div className="hv">
      <a href={HVAC_PHONE_HREF} className="hv__emerg">
        <Siren size={15} /> No heat? No AC? 24/7 emergency service — <b>call {HVAC_PHONE}</b>
      </a>
      <header className={`hv__hdr${navScrolled ? ' hv__hdr--scrolled' : ''}`}>
        <div className="hv__wrap hv__hdr-in">
          <Link href={HOME} className="hv__brand">
            <span className="hv__brand-mark"><Flame size={18} /></span>
            <span>
              {HVAC_NAME}
              <span className="hv__brand-sub">{HVAC_TAGLINE}</span>
            </span>
          </Link>

          <nav className="hv__nav">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'is-active' : ''}>
                {l.label}
              </Link>
            ))}
          </nav>

          <a href={HVAC_PHONE_HREF} className="hv__call"><Phone size={16} /> {HVAC_PHONE}</a>

          <button
            type="button"
            className="hv__burger"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          className="hv__hdr-progress"
          aria-hidden="true"
          style={{ transform: `scaleX(${navProgress})` }}
        />

        {menuOpen && (
          <div className="hv__wrap">
            <div className="hv__mnav">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={isActive(l.href) ? 'is-active' : ''}>
                  {l.label}
                </Link>
              ))}
              <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--primary hv__call"><Phone size={16} /> {HVAC_PHONE}</a>
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="hv__ft">
        <div className="hv__wrap">
          <div className="hv__ft-grid">
            <div>
              <div className="hv__brand" style={{ color: '#fdf6ec', marginBottom: 12 }}>
                <span className="hv__brand-mark"><Flame size={18} /></span>
                {HVAC_NAME}
              </div>
              <p style={{ maxWidth: '32ch' }}>
                {HVAC_OWNERSHIP} heating &amp; cooling, keeping West Virginia comfortable since {HVAC_FOUNDED}.
              </p>
            </div>
            <div>
              <h5>Contact</h5>
              <p>
                <a href={HVAC_PHONE_HREF}>{HVAC_PHONE}</a>
                {HVAC_ADDRESS1}<br />{HVAC_ADDRESS2}<br />
                {HVAC_HOURS}<br />{HVAC_EMERGENCY}
              </p>
            </div>
            <div>
              <h5>Explore</h5>
              <p>
                {navLinks.filter((l) => l.href !== HOME).map((l) => (
                  <Link key={l.href} href={l.href}>{l.label}</Link>
                ))}
              </p>
            </div>
            <div>
              <h5>Why us</h5>
              <p>
                {HVAC_OWNERSHIP}<br />
                Upfront pricing<br />
                Financing available<br />
                Licensed &amp; insured
              </p>
            </div>
          </div>
          <div className="hv__ft-bottom">
            <span>© {HVAC_FOUNDED}–present {HVAC_NAME} · {HVAC_LICENSE}</span>
            <span>Demo site by Veteran AI Websites</span>
          </div>
        </div>
      </footer>

      <div className="hv__callbar">
        <a href={HVAC_PHONE_HREF} className="hv__btn hv__btn--primary"><Phone size={17} /> Call now</a>
        <Link href="/examples/complete-hvac/contact" className="hv__btn hv__btn--dark">Book service</Link>
      </div>
    </div>
  );
}
