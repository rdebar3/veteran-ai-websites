'use client';

import { Inter } from 'next/font/google';
import { useLayoutEffect, type ReactNode } from 'react';
import {
  callLabel,
  demoNote,
  hours,
  name,
  phone,
  phoneHref,
  quoteHref,
  quoteLabel,
} from '@/lib/starter-plumbing-data';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--sp-font',
  display: 'swap',
});

function useReveal() {
  useLayoutEffect(() => {
    const root = document.querySelector('.sp');
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('is-ready');
    const nodes = root.querySelectorAll('.sp-reveal');
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
  }, []);
}

export default function DemoShell({ children }: { children: ReactNode }) {
  useReveal();
  return (
    <div className={`sp ${inter.variable}`}>
      <header className="sp-header">
        <div className="sp-wrap sp-header-in">
          <a className="sp-brand" href="/examples/starter-plumbing">
            {name}
          </a>
          <div className="sp-header-end">
            <a className="sp-phone" href={phoneHref}>
              {phone}
            </a>
            <div className="sp-actions">
              <a className="sp-btn sp-btn--solid" href={phoneHref}>
                {callLabel}
              </a>
              <a className="sp-btn sp-btn--line" href={quoteHref}>
                {quoteLabel}
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="sp-footer">
        <div className="sp-wrap">
          <p className="sp-footer-name">{name}</p>
          <p>
            <a href={phoneHref}>{phone}</a>
          </p>
          <p>{hours.map((row) => `${row.days} ${row.time}`).join(' · ')}</p>
          <p className="sp-note">{demoNote}</p>
        </div>
      </footer>
      <div className="sp-bar">
        <a href={phoneHref}>{callLabel}</a>
        <a href={quoteHref}>{quoteLabel}</a>
      </div>
    </div>
  );
}
