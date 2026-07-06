'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CinematicSectionProps {
  video: string;
  poster: string;
  side?: 'left' | 'right' | 'center';
  eyebrow: string;
  title: ReactNode;
  body?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

const styles = `
.cine-sec{position:relative;min-height:88vh;display:flex;align-items:center;overflow:hidden;isolation:isolate}
.cine-sec__bg{position:absolute;inset:0;z-index:0}
.cine-sec__video{width:100%;height:100%;object-fit:cover;opacity:1}
.cine-sec__veil{position:absolute;inset:0}
.cine-sec[data-side="left"] .cine-sec__veil{background:linear-gradient(90deg,rgba(10,14,20,.66),rgba(10,14,20,.22) 44%,transparent 64%),linear-gradient(180deg,rgba(10,14,20,.35),transparent 22%,transparent 80%,var(--bg))}
.cine-sec[data-side="right"] .cine-sec__veil{background:linear-gradient(270deg,rgba(10,14,20,.66),rgba(10,14,20,.22) 44%,transparent 64%),linear-gradient(180deg,rgba(10,14,20,.35),transparent 22%,transparent 80%,var(--bg))}
.cine-sec[data-side="center"] .cine-sec__veil{background:radial-gradient(72% 62% at 50% 50%,transparent 34%,rgba(10,14,20,.52)),linear-gradient(180deg,rgba(10,14,20,.3),transparent 24%,transparent 80%,var(--bg))}
.cine-sec__content{position:relative;z-index:2;width:100%;max-width:1180px;margin:0 auto;padding:80px clamp(20px,6vw,72px)}
.cine-sec__box{max-width:560px}
.cine-sec[data-side="right"] .cine-sec__box{margin-left:auto;text-align:right}
.cine-sec[data-side="center"] .cine-sec__box{margin:0 auto;text-align:center;max-width:840px}
.cine-sec__eyebrow{font-family:var(--font-mono);font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--cyan);margin-bottom:16px;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.cine-sec__title{font-family:var(--font-sans);font-weight:800;font-size:clamp(30px,4.8vw,64px);line-height:1;letter-spacing:-.02em;color:var(--text);text-shadow:0 2px 12px rgba(0,0,0,.7),0 10px 40px rgba(0,0,0,.5);margin:0}
.cine-sec__grad{background:linear-gradient(100deg,var(--cyan),#dff6fc 55%,var(--cyan-light));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.cine-sec__body{margin-top:18px;font-size:clamp(15px,1.4vw,19px);line-height:1.6;color:#eaf1f6;text-shadow:0 2px 6px rgba(0,0,0,.8),0 2px 18px rgba(0,0,0,.7)}
.cine-sec__cta{margin-top:28px;display:inline-block}
`;

export default function CinematicSection({
  video,
  poster,
  side = 'left',
  eyebrow,
  title,
  body,
  ctaHref,
  ctaLabel,
}: CinematicSectionProps) {
  const x = side === 'right' ? 64 : side === 'center' ? 0 : -64;
  const y = side === 'center' ? 34 : 0;

  return (
    <section className="cine-sec" data-side={side}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="cine-sec__bg" aria-hidden="true">
        <video className="cine-sec__video" autoPlay muted loop playsInline poster={poster}>
          <source src={video} type="video/mp4" />
        </video>
        <div className="cine-sec__veil" />
      </div>
      <div className="cine-sec__content">
        <motion.div
          className="cine-sec__box"
          initial={{ opacity: 0, x, y }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="cine-sec__eyebrow">&#9670; {eyebrow}</div>
          <h2 className="cine-sec__title">{title}</h2>
          {body ? <p className="cine-sec__body">{body}</p> : null}
          {ctaHref ? (
            <a href={ctaHref} className="btn btn--primary btn--lg btn--glow cine-sec__cta">
              {ctaLabel}
            </a>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
