'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';
import { navLinks } from '@/lib/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['hero', ...navLinks.map((l) => l.href.slice(1))];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <a href="#hero" className="nav__logo">
          Veteran AI Websites
        </a>

        <div className="nav__links">
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav__link"
          >
            <FacebookIcon className="h-3 w-3 inline-block mr-1 -mt-px" />
            Social
          </a>
          <a href="#build" className="nav__cta">
            $397 Offer
          </a>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[var(--text-muted)]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-6 py-5 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="nav__link text-sm py-1"
            >
              {link.label}
            </a>
          ))}
          <a href="#build" onClick={() => setIsOpen(false)} className="nav__cta text-center mt-2">
            $397 Offer
          </a>
        </div>
      )}
    </nav>
  );
}