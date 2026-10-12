'use client';

import Link from 'next/link';

const pillStyles = `
.demo-home-pill{position:fixed;left:16px;bottom:16px;z-index:99999;display:inline-flex;align-items:center;gap:8px;font-family:var(--font-sans),system-ui,-apple-system,'Segoe UI',sans-serif;font-size:14px;font-weight:600;color:#0a0e14;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(0,0,0,.08);padding:11px 18px;border-radius:999px;text-decoration:none;box-shadow:0 8px 28px rgba(0,0,0,.3);transition:transform .2s ease,background .2s ease}
.demo-home-pill:hover{background:#fff;transform:translateY(-2px)}
.demo-home-pill .demo-home-pill__arrow{font-size:16px;line-height:1}
.demo-home-pill__full{display:inline-flex;align-items:center;gap:8px}
.demo-home-pill__short{display:none}
@media(max-width:760px){.demo-home-pill{left:auto;right:12px;bottom:88px;padding:9px 13px;font-size:13px}.demo-home-pill__full{display:none}.demo-home-pill__short{display:inline}}
`;

/**
 * Shared layout for all /examples/* demo sites.
 * Adds a persistent "back to Veteran AI Websites" pill without touching the demos.
 */
export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Link
        href="/"
        scroll={false}
        onClick={() => {
          try {
            sessionStorage.setItem('vaw:restore', '1');
          } catch {}
        }}
        className="demo-home-pill"
        aria-label="Back to Veteran AI Websites"
      >
        <span className="demo-home-pill__full">
          <span className="demo-home-pill__arrow" aria-hidden="true">
            ←
          </span>
          Back to Veteran AI Websites
        </span>
        <span className="demo-home-pill__short">← Back</span>
      </Link>
      <style dangerouslySetInnerHTML={{ __html: pillStyles }} />
    </>
  );
}
