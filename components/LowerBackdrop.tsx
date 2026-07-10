'use client';

/**
 * Wraps the lower sections with a pinned backdrop layer behind them.
 * (Video removed — currently a clean dark backdrop; ready to drop in a
 * fixed background image.)
 */
export default function LowerBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="lower">
      <div className="lower-bg" aria-hidden="true">
        <div className="lower-veil" />
      </div>
      {children}
    </div>
  );
}
