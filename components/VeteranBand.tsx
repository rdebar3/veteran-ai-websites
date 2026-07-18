'use client';

/**
 * Clean band directly under the hero — solid dark, high contrast.
 * Holds the veteran storyline off the photo so it stays legible.
 */
const styles = `
.vb{position:relative;color:#eef4f8;padding:clamp(36px,5vw,56px) clamp(20px,6vw,72px);background:#06090f;border-top:1px solid rgba(233,240,246,.08)}
.vb__line{margin:0 auto;max-width:52ch;text-align:center;font-family:var(--font-sans);font-size:clamp(15px,1.35vw,18px);font-weight:500;line-height:1.65;letter-spacing:-.01em;color:rgba(233,240,246,.9)}
`;

export default function VeteranBand() {
  return (
    <section className="vb" aria-label="About the builder">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <p className="vb__line">
        I spent 15 years working alongside small business owners before I ever built a website. I get
        what you&apos;re up against — and I build sites that actually help.
      </p>
    </section>
  );
}
