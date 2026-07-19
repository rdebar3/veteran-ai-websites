'use client';

import type { ReactNode } from 'react';

interface BrowserFrameProps {
  url: string;
  statusText: string;
  statusDone?: boolean;
  children: ReactNode;
}

export default function BrowserFrame({
  url,
  statusText,
  statusDone = false,
  children,
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
      <div className="monti-frame">
        <div className="monti-bar">
          <span className="monti-dot" />
          <span className="monti-dot" />
          <span className="monti-dot" />
          <span className="monti-url">{url}</span>
        </div>
        <div className="monti-cv">{children}</div>
      </div>
    </div>
  );
}
