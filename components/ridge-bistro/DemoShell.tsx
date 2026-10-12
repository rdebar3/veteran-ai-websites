'use client';

import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLayoutEffect, useState, type ReactNode } from 'react';
import {
  callLabel,
  demoNote,
  hours,
  name,
  nav,
  phone,
  phoneHref,
  reserveHref,
  reserveLabel,
} from '@/lib/ridge-bistro-data';

const serif = Fraunces({
  subsets: ['latin'],
  weight: ['300', '500'],
  style: ['normal', 'italic'],
  variable: '--rb-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--rb-sans',
  display: 'swap',
});

const home = '/examples/premium-restaurant';

function useReveal(pathname: string) {
  useLayoutEffect(() => {
    const root = document.querySelector('.rb');
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('is-ready');
    const nodes = root.querySelectorAll('.rb-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0 },
    );
    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const seen = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (reduce || seen) node.classList.add('is-in');
      else io.observe(node);
    });
    return () => io.disconnect();
  }, [pathname]);
}

export default function DemoShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useReveal(pathname);
  useLayoutEffect(() => {
    setOpen(false);
  }, [pathname]);
  const overHero = pathname === home;

  return (
    <div className={`rb ${serif.variable} ${sans.variable}`}>
      <header className={overHero ? 'rb-header rb-header--over' : 'rb-header'}>
        <div className="rb-wrap rb-header-in">
          <Link className="rb-brand" href={home}>
            {name}
          </Link>
          <nav className="rb-nav" aria-label="Pages">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={pathname === item.href ? 'is-on' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="rb-actions">
            <a className="rb-btn rb-btn--solid" href={phoneHref}>
              {callLabel}
            </a>
            <Link className="rb-btn" href={reserveHref}>
              {reserveLabel}
            </Link>
          </div>
          <button
            className="rb-burger"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      {open ? (
        <div className="rb-menu">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            Close
          </button>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
      <main>{children}</main>
      <footer className="rb-footer">
        <div className="rb-wrap">
          <p className="rb-brand">{name}</p>
          <p>
            <a href={phoneHref}>{phone}</a>
          </p>
          <p>{hours.map((row) => `${row.days} ${row.time}`).join(' · ')}</p>
          <p className="rb-note">{demoNote}</p>
        </div>
      </footer>
      <div className="rb-bar">
        <a href={phoneHref}>{callLabel}</a>
        <Link href={reserveHref}>{reserveLabel}</Link>
      </div>
    </div>
  );
}
