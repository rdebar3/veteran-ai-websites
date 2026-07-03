'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';

const navLinks = [
  { label: 'Build', href: '#build' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Process', href: '#how-it-works' },
  { label: 'Examples', href: '#examples' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav-premium ${scrolled ? 'nav-premium--scrolled' : ''}`}>
      <div className="nav-premium__inner">
        <a href="#hero" className="nav-premium__logo">
          Veteran AI Websites
        </a>

        <div className="nav-premium__links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-premium__link">
              {link.label}
            </a>
          ))}
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-premium__link"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-3.5 w-3.5 inline-block mr-1 -mt-0.5" />
            Social
          </a>
          <a href="#build" className="nav-premium__cta">
            $397 Offer
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[var(--text-muted)]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[rgba(8,12,18,0.95)] backdrop-blur-xl px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="nav-premium__link text-sm py-1"
            >
              {link.label}
            </a>
          ))}
          <a href="#build" onClick={() => setIsOpen(false)} className="nav-premium__cta text-center mt-2">
            $397 Offer — Ends July 4th
          </a>
        </div>
      )}
    </nav>
  );
}