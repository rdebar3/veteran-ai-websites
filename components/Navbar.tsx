'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import FacebookIcon from '@/components/FacebookIcon';
import { FACEBOOK_URL } from '@/lib/data';
import { navRooms, scrollToRoom } from '@/lib/base-rooms';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = ['hero', ...navRooms.map((r) => r.sectionId)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = (sectionId: string) => {
    setIsOpen(false);
    scrollToRoom(sectionId);
  };

  return (
    <nav className={`nav-premium ${scrolled ? 'nav-premium--scrolled' : ''}`}>
      <div className="nav-premium__inner">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNav('hero');
          }}
          className="nav-premium__logo"
        >
          Veteran AI Websites
        </a>

        <div className="nav-premium__links">
          {navRooms.map((room) => (
            <button
              key={room.sectionId}
              type="button"
              onClick={() => handleNav(room.sectionId)}
              className={`nav-premium__link nav-premium__room-link ${
                activeSection === room.sectionId ? 'nav-premium__room-link--active' : ''
              }`}
            >
              <span className="nav-premium__room-name">{room.navLabel}</span>
              <span className="nav-premium__room-sector">{room.codename.split('—')[1]?.trim()}</span>
            </button>
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
          <button
            type="button"
            onClick={() => handleNav('build')}
            className="nav-premium__cta"
          >
            $397 Offer
          </button>
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
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[rgba(8,12,18,0.95)] backdrop-blur-xl px-6 py-6 flex flex-col gap-3">
          {navRooms.map((room) => (
            <button
              key={room.sectionId}
              type="button"
              onClick={() => handleNav(room.sectionId)}
              className="nav-premium__link text-left text-sm py-2"
            >
              {room.navLabel} — {room.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNav('build')}
            className="nav-premium__cta text-center mt-2"
          >
            $397 Offer — Ends July 4th
          </button>
        </div>
      )}
    </nav>
  );
}