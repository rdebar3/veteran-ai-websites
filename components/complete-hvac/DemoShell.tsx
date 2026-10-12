'use client';

import { Source_Sans_3, Zilla_Slab } from 'next/font/google';
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
  requestHref,
  requestLabel,
} from '@/lib/complete-hvac-data';

const slab = Zilla_Slab({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--hv-serif',
  display: 'swap',
});

const sans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--hv-sans',
  display: 'swap',
});

const home = '/examples/complete-hvac';

function useReveal(pathname: string) {
  useLayoutEffect(() => {
    const root = document.querySelector('.hv');
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('is-ready');
    const nodes = root.querySelectorAll('.hv-reveal');
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

  return (
    <div className={`hv ${slab.variable} ${sans.variable}`}>
      <header className="hv-header">
        <div className="hv-wrap hv-header-in">
          <Link className="hv-brand" href={home}>
            {name}
          </Link>
          <nav className="hv-nav" aria-label="Pages">
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
          <div className="hv-actions">
            <a className="hv-btn hv-btn--solid" href={phoneHref}>
              {callLabel}
            </a>
            <Link className="hv-btn" href={requestHref}>
              {requestLabel}
            </Link>
          </div>
          <button
            className="hv-burger"
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
        <div className="hv-menu">
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
      <footer className="hv-footer">
        <div className="hv-wrap">
          <p className="hv-brand">{name}</p>
          <p>
            <a href={phoneHref}>{phone}</a>
          </p>
          <p>{hours.map((row) => `${row.days} ${row.time}`).join(' · ')}</p>
          <p className="hv-note">{demoNote}</p>
        </div>
      </footer>
      <div className="hv-bar">
        <a href={phoneHref}>{callLabel}</a>
        <Link href={requestHref}>{requestLabel}</Link>
      </div>
    </div>
  );
}
