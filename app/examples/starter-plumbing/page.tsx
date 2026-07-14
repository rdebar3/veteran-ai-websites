'use client';

import Image from 'next/image';
import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import {
  Phone,
  Siren,
  Droplet,
  Flame,
  Wrench,
  Hammer,
  Home,
  Shield,
  Clock,
  CheckCircle,
  Star,
  MapPin,
} from 'lucide-react';

const PHONE = '(304) 555-0192';
const PHONE_HREF = 'tel:+13045550192';

const IMG_HERO = '/demos/starter-plumbing/hero-bathroom.jpg';
const IMG_FAUCET = '/demos/starter-plumbing/kitchen-faucet.jpg';
const IMG_PRO = '/demos/starter-plumbing/summit-pro.jpg';

const services = [
  { icon: Droplet, title: 'Leak Detection & Repair', desc: 'Pinpoint and fix leaks fast — before they become water damage.' },
  { icon: Flame, title: 'Water Heaters', desc: 'Repair, replacement, and tankless upgrades, installed same day.' },
  { icon: Wrench, title: 'Drain & Sewer', desc: 'Clogs, backups, and camera inspections handled cleanly.' },
  { icon: Hammer, title: 'Repiping & Remodels', desc: 'Whole-home repipes and fixture upgrades done right the first time.' },
  { icon: Home, title: 'Fixtures & Faucets', desc: 'Sinks, toilets, showers, and faucets — installed and sealed to last.' },
  { icon: Clock, title: '24/7 Emergency', desc: 'Burst pipe at midnight? We answer the phone and roll out.' },
];

const proPoints = [
  { icon: Shield, text: 'Licensed & fully insured on every job' },
  { icon: CheckCircle, text: 'Upfront flat pricing — you approve before we start' },
  { icon: Clock, text: 'On time, or your dispatch fee is on us' },
];

const steps = [
  { n: '01', title: 'Call or book online', desc: 'Tell us what’s going on. We’ll give you a straight answer and a time.' },
  { n: '02', title: 'We arrive prepared', desc: 'A clean, uniformed pro shows up on time with the right parts.' },
  { n: '03', title: 'Fixed & guaranteed', desc: 'We fix it right, clean up, and stand behind the work.' },
];

const reviews = [
  { quote: 'Fast, friendly, and honest. Had our water heater replaced the same day I called. Fair price, no upsell.', name: 'Karen M.', place: 'Ridgeview, WV' },
  { quote: 'Showed up on time, explained everything, and left the place cleaner than they found it. Our new go-to.', name: 'Dwayne P.', place: 'Elkview, WV' },
  { quote: 'Burst pipe on a Sunday night — they answered and had it handled in an hour. Absolute lifesavers.', name: 'Sara L.', place: 'Clendenin, WV' },
];

const styles = `
.sp{--navy:#0c2a43;--navy-2:#0a2033;--blue:#1f8fe0;--blue-d:#1774c0;--ink:#122536;--muted:#586a7a;--line:#e4ebf2;--bg:#f6f9fc;background:#fff;color:var(--ink);font-family:var(--font-sans),system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:clip}
.sp *{box-sizing:border-box}
.sp a{color:inherit;text-decoration:none}
.sp__wrap{max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,40px)}
.sp__hdr{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.85);backdrop-filter:blur(12px) saturate(1.1);border-bottom:1px solid var(--line);transition:background .3s ease,box-shadow .3s ease,border-color .3s ease}
.sp__hdr-in{display:flex;align-items:center;justify-content:space-between;height:70px;transition:height .3s ease}
.sp__brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:19px;letter-spacing:-.01em;color:var(--navy)}
.sp__brand-mark{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:linear-gradient(150deg,var(--blue),var(--navy));color:#fff}
.sp__nav{display:flex;align-items:center;gap:30px}
.sp__nav a{position:relative;font-size:15px;font-weight:500;color:var(--muted);transition:color .2s}
.sp__nav a:hover{color:var(--navy)}
.sp__hdr--scrolled{background:rgba(255,255,255,.95);box-shadow:0 10px 30px rgba(12,42,67,.10);border-bottom-color:transparent}
.sp__hdr--scrolled .sp__hdr-in{height:58px}
.sp__nav a::after{content:'';position:absolute;left:0;right:0;bottom:-7px;height:2px;border-radius:2px;background:var(--blue);transform:scaleX(0);transform-origin:center;transition:transform .28s cubic-bezier(.4,0,.2,1)}
.sp__nav a:hover::after{transform:scaleX(.5)}
.sp__nav a.is-active{color:var(--navy);font-weight:600}
.sp__nav a.is-active::after{transform:scaleX(1)}
.sp__hdr-progress{position:absolute;left:0;bottom:-1.5px;height:3px;width:100%;transform-origin:left center;transform:scaleX(0);background:linear-gradient(90deg,var(--blue),var(--navy));border-radius:0 3px 3px 0;will-change:transform;pointer-events:none}
.sp__call{display:inline-flex;align-items:center;gap:8px;background:var(--blue);color:#fff;font-weight:600;font-size:15px;padding:11px 18px;border-radius:999px;box-shadow:0 8px 20px rgba(31,143,224,.3);transition:background .2s,transform .2s,box-shadow .2s}
.sp__call:hover{background:var(--blue-d);transform:translateY(-1px);box-shadow:0 10px 26px rgba(31,143,224,.42)}
@media(max-width:820px){.sp__nav{display:none}}
@media(max-width:640px){.sp__call{font-size:13px;padding:8px 14px;gap:6px;box-shadow:0 5px 14px rgba(31,143,224,.26)}.sp__call svg{width:15px;height:15px}}
/* Split hero */
.sp__hero{display:grid;grid-template-columns:1.05fr 1fr;min-height:640px}
.sp__hero-text{display:flex;flex-direction:column;justify-content:center;padding:clamp(48px,6vw,90px) clamp(24px,5vw,72px);background:linear-gradient(180deg,#fff,#f2f7fc)}
.sp__eyebrow{display:inline-flex;align-items:center;gap:9px;align-self:flex-start;font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--blue);background:#eaf4fd;border:1px solid #d3e8f9;padding:8px 14px;border-radius:999px;margin-bottom:24px}
.sp__h1{font-size:clamp(32px,4.4vw,58px);font-weight:700;line-height:1.04;letter-spacing:-.03em;margin:0;color:var(--navy);max-width:16ch}
.sp__lead{margin:22px 0 0;max-width:46ch;font-size:clamp(16px,1.3vw,18px);line-height:1.6;color:var(--muted)}
.sp__cta{margin-top:30px;display:flex;flex-wrap:wrap;gap:14px}
.sp__btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:16px;padding:15px 26px;border-radius:999px;cursor:pointer;transition:transform .2s,background .2s,box-shadow .2s}
.sp__btn--primary{background:var(--blue);color:#fff;box-shadow:0 12px 30px rgba(31,143,224,.35)}
.sp__btn--primary:hover{background:var(--blue-d);transform:translateY(-2px)}
.sp__btn--ghost{background:#fff;color:var(--navy);border:1px solid var(--line)}
.sp__btn--ghost:hover{border-color:var(--blue);color:var(--blue)}
.sp__hero-trust{margin-top:30px;display:flex;flex-wrap:wrap;gap:8px 22px;font-size:13.5px;color:var(--muted)}
.sp__hero-trust span{display:inline-flex;align-items:center;gap:7px}
.sp__hero-trust svg{color:#28a06a}
.sp__hero-img{position:relative;min-height:420px}
.sp__hero-img img{object-fit:cover;object-position:center}
@media(max-width:820px){.sp__hero{grid-template-columns:1fr}.sp__hero-img{min-height:380px;order:-1}}
/* Sections */
.sp__sec{padding:clamp(60px,8vw,104px) 0}
.sp__sec--tint{background:var(--bg);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.sp__kicker{font-size:13px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin:0 0 12px}
.sp__title{font-size:clamp(26px,3.4vw,42px);font-weight:700;letter-spacing:-.02em;line-height:1.08;margin:0;color:var(--navy)}
.sp__intro{max-width:620px;margin:0 0 clamp(34px,5vw,52px)}
.sp__intro .sp__sub{margin:15px 0 0;font-size:17px;line-height:1.6;color:var(--muted)}
.sp__center{text-align:center;margin-left:auto;margin-right:auto}
.sp__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.sp__card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px 22px;transition:transform .25s,box-shadow .25s,border-color .25s}
.sp__card:hover{transform:translateY(-4px);box-shadow:0 24px 50px rgba(12,42,67,.1);border-color:#cfe0ee}
.sp__ic{display:grid;place-items:center;width:48px;height:48px;border-radius:13px;background:linear-gradient(150deg,#e8f4fd,#d5ebfb);color:var(--blue);margin-bottom:16px}
.sp__card h3{font-size:18px;font-weight:700;margin:0 0 8px;color:var(--navy)}
.sp__card p{font-size:14.5px;line-height:1.55;color:var(--muted);margin:0}
/* Feature bands */
.sp__feature{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center}
.sp__feature--rev .sp__feature-img{order:2}
.sp__feature-img{position:relative;aspect-ratio:4/3;border-radius:20px;overflow:hidden;box-shadow:0 30px 60px rgba(12,42,67,.16)}
.sp__feature-img img{object-fit:cover}
.sp__feature-body h2{font-size:clamp(24px,3vw,38px);font-weight:700;color:var(--navy);letter-spacing:-.02em;line-height:1.1;margin:0 0 16px}
.sp__feature-body p{font-size:16.5px;line-height:1.65;color:var(--muted);margin:0 0 20px}
.sp__points{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px}
.sp__points li{display:flex;align-items:center;gap:12px;font-size:15.5px;color:var(--ink);font-weight:500}
.sp__points li span{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#eaf4fd;color:var(--blue);flex:0 0 auto}
@media(max-width:820px){.sp__feature{grid-template-columns:1fr}.sp__feature--rev .sp__feature-img{order:0}}
/* Steps */
.sp__steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.sp__step{position:relative;padding-top:14px}
.sp__step-n{font-size:15px;font-weight:800;color:var(--blue);letter-spacing:.1em}
.sp__step h4{font-size:20px;font-weight:700;color:var(--navy);margin:12px 0 8px}
.sp__step p{font-size:15.5px;line-height:1.55;color:var(--muted);margin:0}
.sp__step::before{content:'';position:absolute;top:0;left:0;width:44px;height:3px;border-radius:3px;background:var(--blue)}
/* Reviews */
.sp__reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.sp__rev{background:#fff;border:1px solid var(--line);border-radius:18px;padding:26px;display:flex;flex-direction:column}
.sp__stars{color:#f5b53d;letter-spacing:2px;margin-bottom:14px;font-size:15px}
.sp__rev p{font-size:15.5px;line-height:1.6;color:var(--ink);margin:0 0 18px;flex:1}
.sp__rev-who{font-weight:700;color:var(--navy);font-size:15px}
.sp__rev-who span{display:block;font-weight:500;color:var(--muted);font-size:13.5px;margin-top:2px}
/* CTA band */
.sp__band{position:relative;background:linear-gradient(120deg,var(--navy),#123a5c);color:#fff;border-radius:28px;padding:clamp(40px,6vw,72px);text-align:center;overflow:hidden}
.sp__band h2{font-size:clamp(27px,4vw,46px);font-weight:700;letter-spacing:-.02em;margin:0;line-height:1.05}
.sp__band p{margin:16px auto 0;max-width:46ch;font-size:17px;color:rgba(255,255,255,.82)}
.sp__band .sp__cta{justify-content:center;margin-top:30px}
.sp__band .sp__btn--ghost{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.3)}
.sp__band .sp__btn--ghost:hover{background:rgba(255,255,255,.18);color:#fff}
.sp__band-glow{position:absolute;inset:0;background:radial-gradient(50% 60% at 82% 8%,rgba(31,143,224,.42),transparent 60%);pointer-events:none}
/* Footer */
.sp__ft{background:var(--navy-2);color:rgba(255,255,255,.75);padding:52px 0 30px}
.sp__ft-grid{display:flex;flex-wrap:wrap;gap:32px 60px;justify-content:space-between;margin-bottom:34px}
.sp__ft h5{color:#fff;font-size:15px;font-weight:700;margin:0 0 14px}
.sp__ft p,.sp__ft a{font-size:14.5px;line-height:1.9;color:rgba(255,255,255,.72)}
.sp__ft a:hover{color:#fff}
.sp__ft-bottom{border-top:1px solid rgba(255,255,255,.12);padding-top:20px;display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:space-between;font-size:13px;color:rgba(255,255,255,.5)}
@media(max-width:900px){.sp__grid,.sp__reviews{grid-template-columns:1fr 1fr}.sp__steps{grid-template-columns:1fr}}
@media(max-width:620px){.sp__grid,.sp__reviews{grid-template-columns:1fr}}

/* Emergency top bar */
.sp__emerg{display:flex;align-items:center;justify-content:center;gap:9px;text-align:center;flex-wrap:wrap;background:#c0392b;color:#fff;font-size:14px;font-weight:500;padding:9px 18px;line-height:1.3}
.sp__emerg b{font-weight:700}
.sp__emerg svg{flex:0 0 auto}
.sp__emerg:hover{background:#a93226}
/* Trust stats strip */
.sp__stats{background:var(--navy);color:#fff;padding:22px clamp(20px,5vw,40px)}
.sp__stats-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:18px 24px}
.sp__stat{flex:1 1 150px;text-align:center;display:flex;flex-direction:column;gap:3px}
.sp__stat b{font-size:clamp(22px,2.6vw,30px);font-weight:800;letter-spacing:-.02em;color:#fff}
.sp__stat span{font-size:13px;color:rgba(255,255,255,.72)}
/* Quote form */
.sp__quote{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,56px);align-items:start}
.sp__quote-or{margin:22px 0 0;font-size:15px;color:var(--muted)}
.sp__quote-or a{color:var(--blue);font-weight:700}
.sp__quote-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:clamp(24px,3.5vw,34px);box-shadow:0 24px 60px rgba(12,42,67,.12)}
.sp__field{display:flex;flex-direction:column;gap:7px;margin-bottom:15px}
.sp__field label{font-size:13.5px;font-weight:600;color:var(--navy)}
.sp__field input,.sp__field select,.sp__field textarea{width:100%;font-family:inherit;font-size:15px;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:11px;padding:12px 14px;transition:border-color .2s}
.sp__field input:focus,.sp__field select:focus,.sp__field textarea:focus{outline:none;border-color:var(--blue)}
.sp__field textarea{min-height:96px;resize:vertical;line-height:1.5}
.sp__quote-submit{width:100%;justify-content:center;margin-top:4px}
.sp__quote-fine{margin:12px 0 0;font-size:12.5px;color:var(--muted);text-align:center}
.sp__quote-done{text-align:center;padding:22px 6px}
.sp__quote-check{display:grid;place-items:center;width:60px;height:60px;border-radius:50%;background:#e8f6ef;color:#28a06a;margin:0 auto 16px}
.sp__quote-done h3{font-size:22px;font-weight:700;color:var(--navy);margin:0 0 8px}
.sp__quote-done p{font-size:15.5px;color:var(--muted);margin:0}
@media(max-width:820px){.sp__quote{grid-template-columns:1fr}}
/* Sticky mobile call bar */
.sp__callbar{display:none}
@media(max-width:820px){
  .sp__callbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:80;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);backdrop-filter:blur(10px);border-top:1px solid var(--line);box-shadow:0 -8px 24px rgba(12,42,67,.14)}
  .sp__callbar .sp__btn{flex:1;justify-content:center;padding:14px 12px;font-size:15px}
  .sp__ft{padding-bottom:96px}
}
/* Focus visibility */
.sp a:focus-visible,.sp button:focus-visible,.sp input:focus-visible,.sp select:focus-visible,.sp textarea:focus-visible{outline:2px solid var(--blue);outline-offset:3px}
`;

export default function SummitPlumbingDemo() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('top');

  useEffect(() => {
    const ids = ['top', 'services', 'work', 'pro', 'reviews', 'quote'];
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  const set =
    (k: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.phone.trim()) setSent(true);
  };
  return (
    <div className="sp">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <a href={PHONE_HREF} className="sp__emerg">
        <Siren size={15} /> 24/7 Emergency Plumbing — burst pipe or no water? <b>Call {PHONE}</b>
      </a>

      <header className={`sp__hdr${scrolled ? ' sp__hdr--scrolled' : ''}`}>
        <div className="sp__wrap sp__hdr-in">
          <a href="#top" className="sp__brand">
            <span className="sp__brand-mark"><Droplet size={18} /></span>
            Summit Plumbing
          </a>
          <nav className="sp__nav">
            {[
              { id: 'services', label: 'Services' },
              { id: 'work', label: 'Our work' },
              { id: 'pro', label: 'Meet your plumber' },
              { id: 'reviews', label: 'Reviews' },
              { id: 'quote', label: 'Contact' },
            ].map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href={PHONE_HREF} className="sp__call"><Phone size={16} /> {PHONE}</a>
        </div>
        <div className="sp__hdr-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
      </header>

      <section className="sp__hero" id="top">
        <div className="sp__hero-text">
          <span className="sp__eyebrow"><MapPin size={14} /> Licensed &amp; insured · Ridgeview, WV</span>
          <h1 className="sp__h1">Plumbing you can count on, right here in the mountains.</h1>
          <p className="sp__lead">
            Fast, honest, professional plumbing for homes and businesses across West Virginia —
            same-day service, upfront pricing, and every job backed by our guarantee.
          </p>
          <div className="sp__cta">
            <a href="#quote" className="sp__btn sp__btn--primary">Get a fast quote</a>
            <a href={PHONE_HREF} className="sp__btn sp__btn--ghost"><Phone size={17} /> {PHONE}</a>
          </div>
          <div className="sp__hero-trust">
            <span><CheckCircle size={15} /> 24/7 emergency</span>
            <span><CheckCircle size={15} /> Upfront pricing</span>
            <span><CheckCircle size={15} /> Satisfaction guaranteed</span>
          </div>
        </div>
        <div className="sp__hero-img">
          <Image src={IMG_HERO} alt="Beautiful modern bathroom plumbed by Summit Plumbing" fill priority sizes="(max-width:820px) 100vw, 50vw" quality={90} />
        </div>
      </section>

      <section className="sp__stats" aria-label="Why homeowners trust us">
        <div className="sp__wrap sp__stats-in">
          <div className="sp__stat"><b>15+</b><span>Years serving WV</span></div>
          <div className="sp__stat"><b>2,000+</b><span>Jobs completed</span></div>
          <div className="sp__stat"><b>4.9&#9733;</b><span>Average rating</span></div>
          <div className="sp__stat"><b>Licensed</b><span>&amp; fully insured</span></div>
        </div>
      </section>

      <section className="sp__sec" id="services">
        <div className="sp__wrap">
          <div className="sp__intro">
            <p className="sp__kicker">What we do</p>
            <h2 className="sp__title">Every plumbing job, done right.</h2>
            <p className="sp__sub">From a dripping faucet to a whole-home repipe, our licensed pros handle it with clean work and honest pricing.</p>
          </div>
          <div className="sp__grid">
            {services.map((s) => (
              <div key={s.title} className="sp__card">
                <span className="sp__ic"><s.icon size={22} /></span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp__sec sp__sec--tint" id="work">
        <div className="sp__wrap">
          <div className="sp__feature">
            <div className="sp__feature-img">
              <Image src={IMG_FAUCET} alt="New kitchen faucet installed by Summit Plumbing" fill sizes="(max-width:820px) 100vw, 50vw" quality={90} />
            </div>
            <div className="sp__feature-body">
              <p className="sp__kicker">Clean workmanship</p>
              <h2>Craftsmanship you’ll notice every day.</h2>
              <p>We treat your home like our own — tidy installs, quality fixtures, and no mess left behind. The little details are what separate a quick fix from work that lasts.</p>
              <ul className="sp__points">
                <li><span><CheckCircle size={18} /></span> Quality parts &amp; fixtures that last</li>
                <li><span><CheckCircle size={18} /></span> Clean, respectful of your home</li>
                <li><span><CheckCircle size={18} /></span> Guaranteed workmanship</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sp__sec" id="pro">
        <div className="sp__wrap">
          <div className="sp__feature sp__feature--rev">
            <div className="sp__feature-img">
              <Image src={IMG_PRO} alt="Your Summit Plumbing technician" fill sizes="(max-width:820px) 100vw, 50vw" quality={90} />
            </div>
            <div className="sp__feature-body">
              <p className="sp__kicker">Meet your plumber</p>
              <h2>A real local pro — not a call center.</h2>
              <p>When you call Summit, you talk to the person doing the work. Straight answers, fair prices, and a friendly face at your door on time.</p>
              <ul className="sp__points">
                {proPoints.map((p) => (
                  <li key={p.text}><span><p.icon size={18} /></span> {p.text}</li>
                ))}
              </ul>
              <div className="sp__cta" style={{ marginTop: 26 }}>
                <a href={PHONE_HREF} className="sp__btn sp__btn--primary"><Phone size={17} /> Call {PHONE}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sp__sec sp__sec--tint">
        <div className="sp__wrap">
          <div className="sp__intro">
            <p className="sp__kicker">How it works</p>
            <h2 className="sp__title">Simple, from call to clean-up.</h2>
          </div>
          <div className="sp__steps">
            {steps.map((s) => (
              <div key={s.n} className="sp__step">
                <span className="sp__step-n">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp__sec" id="reviews">
        <div className="sp__wrap">
          <div className="sp__intro sp__center">
            <p className="sp__kicker">Reviews</p>
            <h2 className="sp__title">Loved by folks across WV.</h2>
          </div>
          <div className="sp__reviews">
            {reviews.map((r) => (
              <div key={r.name} className="sp__rev">
                <div className="sp__stars">★★★★★</div>
                <p>“{r.quote}”</p>
                <div className="sp__rev-who">{r.name}<span>{r.place}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sp__sec sp__sec--tint" id="quote">
        <div className="sp__wrap sp__quote">
          <div className="sp__quote-info">
            <p className="sp__kicker">Get a fast quote</p>
            <h2 className="sp__title">Tell us what’s going on.</h2>
            <p className="sp__sub" style={{ marginTop: 14 }}>
              Send a few details and we’ll call you right back with a straight answer and a time.
              Free estimates, upfront flat pricing, and no surprise fees.
            </p>
            <ul className="sp__points" style={{ marginTop: 22 }}>
              <li><span><CheckCircle size={18} /></span> Free, no-obligation estimates</li>
              <li><span><CheckCircle size={18} /></span> Upfront flat pricing — approve before we start</li>
              <li><span><CheckCircle size={18} /></span> Most calls answered same day</li>
            </ul>
            <p className="sp__quote-or">Prefer to talk now? <a href={PHONE_HREF}>{PHONE}</a></p>
          </div>
          <div className="sp__quote-card">
            {sent ? (
              <div className="sp__quote-done">
                <span className="sp__quote-check"><CheckCircle size={30} /></span>
                <h3>Thanks, {form.name.split(' ')[0] || 'friend'}!</h3>
                <p>We got your request and will call you at {form.phone} shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="sp__field">
                  <label>Your name *</label>
                  <input value={form.name} onChange={set('name')} placeholder="Jane Smith" required />
                </div>
                <div className="sp__field">
                  <label>Phone *</label>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder={PHONE} required />
                </div>
                <div className="sp__field">
                  <label>What do you need?</label>
                  <select value={form.service} onChange={set('service')}>
                    <option value="">Select a service</option>
                    <option>Emergency / no water</option>
                    <option>Leak repair</option>
                    <option>Water heater</option>
                    <option>Drain / sewer</option>
                    <option>Fixture / faucet</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sp__field">
                  <label>Details</label>
                  <textarea value={form.message} onChange={set('message')} placeholder="Tell us what’s going on…" />
                </div>
                <button type="submit" className="sp__btn sp__btn--primary sp__quote-submit">Request my quote</button>
                <p className="sp__quote-fine">No spam, ever. We only use your info to reach you about your request.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="sp__sec">
        <div className="sp__wrap">
          <div className="sp__band">
            <div className="sp__band-glow" aria-hidden="true" />
            <h2>Need a plumber? Let’s get it fixed.</h2>
            <p>Call now for same-day service, or book online and we’ll reach out within the hour.</p>
            <div className="sp__cta">
              <a href={PHONE_HREF} className="sp__btn sp__btn--primary"><Phone size={18} /> {PHONE}</a>
              <a href="#quote" className="sp__btn sp__btn--ghost">Request a quote</a>
            </div>
          </div>
        </div>
      </section>

      <footer className="sp__ft">
        <div className="sp__wrap">
          <div className="sp__ft-grid">
            <div>
              <div className="sp__brand" style={{ color: '#fff', marginBottom: 12 }}>
                <span className="sp__brand-mark"><Droplet size={18} /></span>
                Summit Plumbing
              </div>
              <p style={{ maxWidth: '30ch' }}>Honest, professional plumbing for the mountains of West Virginia.</p>
            </div>
            <div>
              <h5>Contact</h5>
              <p><a href={PHONE_HREF}>{PHONE}</a><br />Ridgeview, WV<br />Mon–Sat · 24/7 emergency</p>
            </div>
            <div>
              <h5>Services</h5>
              <p>Leak repair · Water heaters<br />Drains &amp; sewer · Repiping<br />Fixtures · Emergency service</p>
            </div>
            <div>
              <h5>Service area</h5>
              <p>Ridgeview · Elkview<br />Clendenin · Charleston<br />&amp; surrounding WV</p>
            </div>
          </div>
          <div className="sp__ft-bottom">
            <span>© Summit Plumbing LLC · WV Master Plumber Lic. #PL-024178</span>
            <span>Demo site by Veteran AI Websites</span>
          </div>
        </div>
      </footer>

      <div className="sp__callbar">
        <a href={PHONE_HREF} className="sp__btn sp__btn--primary"><Phone size={17} /> Call now</a>
        <a href="#quote" className="sp__btn sp__btn--ghost">Get a quote</a>
      </div>
    </div>
  );
}
