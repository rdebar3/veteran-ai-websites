'use client';

import type { ReactNode, Ref } from 'react';

interface BrowserFrameProps {
  url: string;
  statusText: string;
  statusDone?: boolean;
  children: ReactNode;
  /** Ref to the scrollable preview body (.monti-cv). */
  scrollContainerRef?: Ref<HTMLDivElement>;
  /** Show “↓ scroll the site” chip until first scroll. */
  showScrollHint?: boolean;
}

/**
 * Minimal site shell — no fake browser chrome.
 * Domain pill is decorative only (pointer-events: none).
 */
export default function BrowserFrame({
  url,
  statusText,
  statusDone = false,
  children,
  scrollContainerRef,
  showScrollHint = false,
}: BrowserFrameProps) {
  return (
    <div className="monti-site-pane">
      <div className="monti-pvhd">
        <span>Live preview</span>
        <span className={`monti-status${statusDone ? ' done' : ''}`}>
          <span className="monti-status-dot" />
          <span>{statusText}</span>
        </span>
      </div>
      <div className="monti-frame monti-frame--bare">
        {url ? (
          <div className="monti-domain-pill" aria-hidden="true">
            {url}
          </div>
        ) : null}
        <div className="monti-cv" ref={scrollContainerRef} data-scrollable>
          {children}
        </div>
        <div
          className={`monti-scroll-hint${showScrollHint ? ' is-visible' : ''}`}
          aria-hidden={!showScrollHint}
        >
          ↓ scroll the site
        </div>
      </div>
    </div>
  );
}
