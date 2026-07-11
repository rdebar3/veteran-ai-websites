'use client';

import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks } from '@/lib/navigation';
import { registerScrollTask } from '@/lib/scroll-driver';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ left: 0, top: 0, width: 0, on: false });

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let scrolled = false;
    const run = () => {
      const y = window.scrollY;
      const next = y > 32;
      if (next !== scrolled) {
        scrolled = next;
        nav.classList.toggle('nav--scrolled', next);
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty('--nav-progress', String(max > 0 ? Math.min(1, y / max) : 0));
    };

    run();
    return registerScrollTask({ isActive: () => true, run });
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

  // Slide a glowing indicator to the active section link.
  useEffect(() => {
    const container = linksRef.current;
    if (!container) return;
    const measure = () => {
      const el = container.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
      if (!el || active === 'hero') {
        setInd((prev) => (prev.on ? { ...prev, on: false } : prev));
        return;
      }
      const c = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setInd({ left: r.left - c.left, top: r.bottom - c.top + 3, width: r.width, on: true });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  return (
    <nav ref={navRef} className="nav">
      <div className="nav__progress" aria-hidden="true" />
      <div className="nav__inner">
        <a href="#hero" className="nav__logo">
          <svg className="nav__logo-mark" viewBox="16 16 88 102" fill="#e3b23c" aria-hidden="true">
            <path d="M24 40 L60 22 L96 40 L96 51 L60 33 L24 51 Z" />
            <path d="M24 55 L60 37 L96 55 L96 66 L60 48 L24 66 Z" />
            <path d="M24 70 L60 52 L96 70 L96 81 L60 63 L24 81 Z" />
            <path d="M24 88 Q60 100 96 88 L96 99 Q60 111 24 99 Z" />
          </svg>
          <span className="nav__logo-text">Veteran <span className="nav__logo-accent">AI</span> Websites</span>
        </a>

        <div className="nav__links" ref={linksRef}>
          <span
            className="nav__indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${ind.left}px)`,
              top: ind.top,
              width: ind.width,
              opacity: ind.on ? 1 : 0,
            }}
          />
          {navLinks.map((link) => {
            const id = link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                data-nav-id={id}
                className={`nav__link ${active === id ? 'nav__link--active' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
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
        <div className="nav__mobile md:hidden border-t border-[var(--border)] px-6 py-5 flex flex-col gap-3">
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
