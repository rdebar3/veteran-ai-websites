'use client';

/**
 * Quiet "Monti coming soon" teaser — same type scale as other dark-section headers.
 * No glow, animation, waveform, or CTA.
 */
const styles = `
.mt{position:relative;color:#eef4f8;padding:clamp(48px,6vw,80px) clamp(20px,6vw,72px);border-top:1px solid rgba(233,240,246,.08);background:transparent}
.mt__head{position:relative;max-width:640px;margin:0 auto;text-align:center}
.mt__eyebrow{font-family:var(--font-sans);font-size:13px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(233,240,246,.72);margin:0 0 16px;text-shadow:0 1px 10px rgba(0,0,0,.7)}
.mt__title{font-family:var(--font-sans);font-size:clamp(26px,3.2vw,42px);font-weight:700;letter-spacing:-.03em;line-height:1.04;color:#fff;margin:0;text-shadow:0 2px 20px rgba(0,0,0,.6)}
.mt__sub{margin:14px auto 0;max-width:52ch;font-size:clamp(14px,1.1vw,16px);line-height:1.6;color:rgba(233,240,246,.82);text-shadow:0 1px 12px rgba(0,0,0,.7)}
`;

export default function MontiTeaser() {
  return (
    <section id="monti" className="mt" aria-labelledby="monti-heading">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="mt__head">
        <p className="mt__eyebrow">Coming soon</p>
        <h2 id="monti-heading" className="mt__title">
          Monti is almost here.
        </h2>
        <p className="mt__sub">
          A faster way to see what your site could look like — built live while you talk.
        </p>
      </div>
    </section>
  );
}
