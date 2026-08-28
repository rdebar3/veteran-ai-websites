import Link from 'next/link';
import {
  DEMO_TEMPLATE_TRADES_V1,
  HONEST_STRIP,
  HONEST_STRIP_LINK_TEXT,
  layoutVariantFor,
  pickKicker,
  proofCardVisible,
  skinFor,
  slugSeed,
} from './copy';
import { parseBlurbs, parseDemoFacts, parseHeroLine } from './facts';
import type { DemoFacts, DemoSiteRow } from './types';

export { DEMO_TEMPLATE_TRADES_V1 };

const GOOGLE_FONTS_PRECONNECT = 'https://fonts.googleapis.com';
const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap';

const PHONE_ICON_PATH =
  'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z';
const SMS_ICON_PATH =
  'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z';
const BADGE_ICON_PATH =
  'M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z';

type TradeCopy = {
  kicker: string;
  servicesEyebrow: string;
  servicesHeading: string;
  areaEyebrow: string;
  areaHeading: string;
  closerHeading: string;
};

const TRADE_COPY: Record<string, TradeCopy> = {
  roofing: {
    kicker: 'Your roof, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for homes like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when your roof is.',
  },
  electrician: {
    kicker: 'Your power, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for homes like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when you need us.',
  },
  hvac: {
    kicker: 'Your air, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for homes like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when the heat is.',
  },
  plumber: {
    kicker: 'Your pipes, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for homes like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when the water is.',
  },
  excavation: {
    kicker: 'The ground, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for jobs like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when the site is.',
  },
  general_contractor: {
    kicker: 'Your project, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for homes like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when you are.',
  },
  auto_repair: {
    kicker: 'Your ride, handled right',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for vehicles like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when you are.',
  },
  default: {
    kicker: 'Handled right, locally',
    servicesEyebrow: 'What we do',
    servicesHeading: 'Built for work like yours',
    areaEyebrow: 'Service area',
    areaHeading: 'Proudly serving North-Central WV',
    closerHeading: 'Ready when you are.',
  },
};

type ServiceCopy = {
  title: string;
  body: string;
  icon: string;
};

const SERVICE_COPY: Record<string, ServiceCopy> = {
  roofing: {
    title: 'Roofing',
    body: 'Residential and commercial roof work, done right the first time — from small repairs to full tear-offs.',
    icon: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
  },
  asphalt: {
    title: 'Asphalt Shingles',
    body: 'Repair and full replacement with quality materials.',
    icon: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
  },
  storm: {
    title: 'Storm Restoration',
    body: "Storm damage repairs and restoration — there when the weather isn't.",
    icon: 'M6 16.5l-3 5h18l-6-10-3.5 5.8L9 13l-3 3.5zM19.5 2l-1.4 3.6L14.5 7l3.6 1.4L19.5 12l1.4-3.6L24.5 7l-3.6-1.4L19.5 2z',
  },
  consultation: {
    title: 'Free Consultation',
    body: 'Straight answers before any work begins — no obligation.',
    icon: 'M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.4 3 5.6V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.4c1.8-1.2 3-3.2 3-5.6a7 7 0 0 0-7-7zm-3 19h6v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1z',
  },
  electrical: {
    title: 'Electrical',
    body: 'Panel work, wiring, and troubleshooting — done to code, done once.',
    icon: 'M13 2 4 14h7l-1 8 10-14h-7l0-6z',
  },
  hvac: {
    title: 'HVAC',
    body: 'Heat, air, and the in-between — kept running so the house stays livable.',
    icon: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
  },
  plumbing: {
    title: 'Plumbing',
    body: 'Leaks, clogs, and the jobs that can wait — handled before they become the ones that cannot.',
    icon: 'M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z',
  },
  excavation: {
    title: 'Excavation',
    body: 'Site work done to grade — foundations, drainage, and the dirt that has to move first.',
    icon: 'M6 16.5l-3 5h18l-6-10-3.5 5.8L9 13l-3 3.5zM19.5 2l-1.4 3.6L14.5 7l3.6 1.4L19.5 12l1.4-3.6L24.5 7l-3.6-1.4L19.5 2z',
  },
  default: {
    title: '',
    body: 'Professional work, done right the first time.',
    icon: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z',
  },
};

const DEFAULT_SERVICE_BODY = SERVICE_COPY.default.body;
const MAX_SERVICES = 5;
const MAX_TOWNS = 9;

function telHref(tel: string): string {
  return /^tel:/i.test(tel) ? tel : `tel:${tel}`;
}

function smsHref(tel: string): string {
  return `sms:${tel.replace(/^tel:/i, '')}`;
}

function formatRating(value: number): string {
  return value.toFixed(1);
}

function formatReviewCount(value: number): string {
  const n = Math.round(value);
  return n === 1 ? '1 review' : `${n} reviews`;
}

function starString(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}`;
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function normalizeCategory(raw: string): string {
  return raw.toLowerCase().trim().replace(/[\s-]+/g, '_');
}

export function tradeCopyFor(category: string | undefined): TradeCopy {
  const raw = normalizeCategory(category || '');
  if (raw.includes('roof')) return TRADE_COPY.roofing;
  if (raw.includes('electric')) return TRADE_COPY.electrician;
  if (raw.includes('hvac') || raw.includes('heat') || raw.includes('air_condition')) {
    return TRADE_COPY.hvac;
  }
  if (raw.includes('plumb')) return TRADE_COPY.plumber;
  if (raw.includes('excav')) return TRADE_COPY.excavation;
  if (raw.includes('auto')) return TRADE_COPY.auto_repair;
  if (
    raw.includes('general_contractor') ||
    raw === 'contractor' ||
    raw.includes('construction')
  ) {
    return TRADE_COPY.general_contractor;
  }
  if (raw && raw in TRADE_COPY) return TRADE_COPY[raw];
  return TRADE_COPY.default;
}

function serviceKey(raw: string): string {
  const s = raw.toLowerCase().trim();
  if (/(roof)/.test(s)) return 'roofing';
  if (/(asphalt|shingle)/.test(s)) return 'asphalt';
  if (/(storm)/.test(s)) return 'storm';
  if (/(consult)/.test(s)) return 'consultation';
  if (/(electric)/.test(s)) return 'electrical';
  if (/(hvac|heating|cooling)/.test(s)) return 'hvac';
  if (/(plumb)/.test(s)) return 'plumbing';
  if (/(excav)/.test(s)) return 'excavation';
  return 'default';
}

function serviceCards(facts: DemoFacts): { key: string; title: string; body: string; icon: string }[] {
  const list = facts.services || [];
  const out: { key: string; title: string; body: string; icon: string }[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const key = serviceKey(item.value);
    const unique = key === 'default' ? `default:${item.value.toLowerCase()}` : key;
    if (seen.has(unique)) continue;
    seen.add(unique);
    const copy = SERVICE_COPY[key] || SERVICE_COPY.default;
    out.push({
      key: unique,
      title: copy.title || titleCase(item.value),
      body: copy.body || DEFAULT_SERVICE_BODY,
      icon: copy.icon,
    });
    if (out.length >= MAX_SERVICES) break;
  }
  return out;
}

function closerSub(facts: DemoFacts): string {
  const rating = facts.rating?.value;
  const count = facts.ratings_count?.value;
  if (proofCardVisible(rating) && count != null) {
    const stars =
      formatRating(rating as number) === '5.0'
        ? 'Five stars'
        : `${formatRating(rating as number)} stars`;
    return `${stars} across ${formatReviewCount(count)} · Free estimates`;
  }
  if (proofCardVisible(rating)) {
    return `Rated ${formatRating(rating as number)} · Free estimates`;
  }
  return 'Free estimates';
}



function sameTown(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d={d} />
    </svg>
  );
}

function HonestStrip() {
  const stripBefore = HONEST_STRIP.slice(
    0,
    HONEST_STRIP.indexOf(HONEST_STRIP_LINK_TEXT),
  );
  const stripAfter = HONEST_STRIP.slice(
    HONEST_STRIP.indexOf(HONEST_STRIP_LINK_TEXT) + HONEST_STRIP_LINK_TEXT.length,
  );
  return (
    <footer className="strip">
      {stripBefore}
      <Link href="/">{HONEST_STRIP_LINK_TEXT}</Link>
      {stripAfter}
    </footer>
  );
}

/**
 * trades_v1 — locked mock at design/trades-v1-mock.html.
 * Server component. No client JS. No photos.
 */
export function TradesV1Template({ site }: { site: DemoSiteRow }) {
  const facts = parseDemoFacts(site.facts);
  const hero = parseHeroLine(site.hero_line);
  const blurbs = parseBlurbs(site.blurbs);
  const name = facts.name.value;
  const town = facts.town?.value;
  const phone = facts.phone;
  const tel = phone ? telHref(phone.tel) : null;
  const sms = phone ? smsHref(phone.tel) : null;
  const category = facts.category?.value;
  const trade = tradeCopyFor(category);
  const seed = slugSeed(site.slug);
  const variant = layoutVariantFor(site.slug);
  const skin = skinFor(category);
  const kicker = pickKicker({ category, town, seed });
  const cards = serviceCards(facts);
  const spotlight = !(facts.services && facts.services.length > 0);
  const showServices = !spotlight && cards.length > 0;
  const towns = (facts.town_hits || []).slice(0, MAX_TOWNS);
  const showArea = !spotlight && towns.length > 0;
  const showTownChips = spotlight && towns.length > 0;
  const showProof = proofCardVisible(facts.rating?.value);
  const mapsUrl = facts.maps_url?.value;
  const badges = facts.badges || [];
  const address = facts.address?.value;
  const sub = blurbs[0] || null;

  const proofInner = facts.rating ? (
    <>
      <span className="stars">{starString(facts.rating.value)}</span>
      <b>{formatRating(facts.rating.value)}</b>
      <span className="src">
        {facts.ratings_count ? (
          <>
            <em>{formatReviewCount(facts.ratings_count.value)}</em> on Google
          </>
        ) : (
          'on Google'
        )}
      </span>
      {mapsUrl ? <span className="go">Read them →</span> : null}
    </>
  ) : null;

  return (
    <>
      <link rel="preconnect" href={GOOGLE_FONTS_PRECONNECT} />
      <link href={GOOGLE_FONTS_HREF} rel="stylesheet" />
      <style>{TRADES_V1_CSS}</style>
      <div
        className={`demo-trades-v1 skin-${skin}${spotlight ? ' is-spotlight' : ''}`}
        data-skin={skin}
        data-hero-align={variant.heroAlign}
        data-watermark={variant.watermark}
        data-grid={variant.gridStyle}
      >

      <header className="top">
        <div className="wrap">
          <div className="brand">
            {name ? <b>{name}</b> : null}
            {town ? <span>{town}, West Virginia</span> : null}
          </div>
          {tel ? (
            <a className="btn btn-primary" href={tel}>
              <Icon d={PHONE_ICON_PATH} />
              Call
            </a>
          ) : null}
        </div>
      </header>

      <section
        className={`hero ${variant.heroAlign}${spotlight ? ' spotlight' : ''}`}
      >
        {variant.watermark === 'shown' ? <div className="ghost">WV</div> : null}
        <div className="wrap">
          <div className="kicker">{kicker}</div>
          {spotlight && name ? <div className="biz">{name}</div> : null}
          {hero ? <h1>{hero}</h1> : null}
          {!spotlight && sub ? <p className="sub">{sub}</p> : null}
          {spotlight && tel && phone ? (
            <div className="hero-cta">
              <a className="btn btn-primary" href={tel}>
                <Icon d={PHONE_ICON_PATH} />
                {phone.value}
              </a>
            </div>
          ) : null}
          {!spotlight && tel && sms && phone ? (
            <div className="hero-cta">
              <a className="btn btn-primary" href={tel}>
                <Icon d={PHONE_ICON_PATH} />
                {phone.value}
              </a>
              <a className="btn btn-quiet" href={sms}>
                <Icon d={SMS_ICON_PATH} />
                Text Us
              </a>
            </div>
          ) : null}
          {badges.length > 0 ? (
            <div className="badges">
              {badges.map((badge) => (
                <span className="badge" key={badge.value}>
                  <Icon d={BADGE_ICON_PATH} />
                  {badge.value}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {showProof && proofInner ? (
        <div className="wrap">
          {mapsUrl ? (
            <a
              className="proof-card"
              href={mapsUrl}
              target="_blank"
              rel="noopener"
            >
              {proofInner}
            </a>
          ) : (
            <div className="proof-card">{proofInner}</div>
          )}
        </div>
      ) : null}

      {showServices ? (
        <section className="sect">
          <div className="wrap">
            <div className="eyebrow">{trade.servicesEyebrow}</div>
            <h2>{trade.servicesHeading}</h2>
            <div className={`cards ${variant.gridStyle}`}>
              {cards.map((card) => (
                <div className="card" key={card.key}>
                  <div className="ico">
                    <Icon d={card.icon} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showTownChips ? (
        <div className="wrap chips-row">
          <div className="towns">
            {towns.map((hit) => (
              <span
                className={
                  town && sameTown(hit.value, town) ? 'town home' : 'town'
                }
                key={hit.value}
              >
                {hit.value}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {showArea ? (
        <section className="area">
          <div className="wrap">
            <div className="eyebrow">{trade.areaEyebrow}</div>
            <h2>{trade.areaHeading}</h2>
            <div className="towns">
              {towns.map((hit) => (
                <span
                  className={
                    town && sameTown(hit.value, town) ? 'town home' : 'town'
                  }
                  key={hit.value}
                >
                  {hit.value}
                </span>
              ))}
              <span className="more">+ surrounding areas</span>
            </div>
          </div>
        </section>
      ) : null}

      {!spotlight ? (
        <section className="close">
          <h2>{trade.closerHeading}</h2>
          <p>{closerSub(facts)}</p>
          {tel && sms && phone ? (
            <div className="cta-row">
              <a className="btn btn-primary" href={tel}>
                <Icon d={PHONE_ICON_PATH} />
                {phone.value}
              </a>
              <a className="btn btn-quiet" href={sms}>
                <Icon d={SMS_ICON_PATH} />
                Text Us
              </a>
            </div>
          ) : null}
        </section>
      ) : null}

      {address ? (
        <div className="info">
          <div className="wrap">
            <span>{address}</span>
            {mapsUrl ? (
              <>
                <span className="dot">•</span>
                <a href={mapsUrl} target="_blank" rel="noopener">
                  Get directions →
                </a>
              </>
            ) : null}
            {spotlight && phone ? (
              <>
                <span className="dot">•</span>
                {tel ? <a href={tel}>{phone.value}</a> : <span>{phone.value}</span>}
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      <HonestStrip />

      {tel && sms ? (
        <div className="stickybar">
          <a className="s-call" href={tel}>
            <Icon d={PHONE_ICON_PATH} />
            Call Now
          </a>
          <a className="s-text" href={sms}>
            <Icon d={SMS_ICON_PATH} />
            Text Us
          </a>
        </div>
      ) : null}

      </div>
    </>
  );
}

/** Locked mock CSS, plus a host reset so the marketing-site body chrome cannot leak in. */
const TRADES_V1_CSS = `
  :root{
    --base:#10151d; --base2:#1a222e; --paper:#faf7f2; --card:#ffffff;
    --ink:#131a23; --muted:#5b6572; --line:#e7e1d7;
    --a1:#ff9a3d; --a2:#f0641e; --glow:rgba(240,100,30,.45);
    --btn-ink:#fff; --on-dark:#e8edf4; --dim:#93a1b5;
  }
  .demo-trades-v1.skin-ember{--base:#10151d;--base2:#1a222e;--a1:#ff9a3d;--a2:#f0641e;--glow:rgba(240,100,30,.45);--btn-ink:#fff}
  .demo-trades-v1.skin-summit{--base:#0b131e;--base2:#13202e;--a1:#4db5ff;--a2:#1273e6;--glow:rgba(18,115,230,.45);--btn-ink:#fff}
  .demo-trades-v1.skin-storm{--base:#0f1216;--base2:#181d24;--a1:#ffd23d;--a2:#f0a500;--glow:rgba(240,165,0,.45);--btn-ink:#10151d}
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',system-ui,sans-serif;background:var(--paper);color:var(--ink);-webkit-font-smoothing:antialiased}
  .wrap{max-width:1000px;margin:0 auto;padding:0 22px}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
  @media (max-width:719px){body{padding-bottom:74px}}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;font-weight:700;
    border-radius:999px;transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;will-change:transform}
  .btn-primary{background:linear-gradient(120deg,var(--a1),var(--a2));color:var(--btn-ink);
    padding:15px 28px;font-size:17px;letter-spacing:.01em;
    box-shadow:0 8px 24px var(--glow), inset 0 1px 0 rgba(255,255,255,.25)}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 32px var(--glow), inset 0 1px 0 rgba(255,255,255,.25);filter:saturate(1.06)}
  .btn-primary:active{transform:translateY(0) scale(.98)}
  .btn-quiet{border:1.5px solid rgba(255,255,255,.35);color:#fff;padding:13px 22px;font-size:15.5px;font-weight:600}
  .btn-quiet:hover{border-color:var(--a1);color:var(--a1);transform:translateY(-1px)}
  .btn svg{width:18px;height:18px;fill:currentColor;flex:none}
  .top{position:sticky;top:0;z-index:20;background:color-mix(in srgb, var(--base) 88%, transparent);
    backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.07)}
  .top .wrap{display:flex;align-items:center;justify-content:space-between;padding:14px 22px}
  .brand{color:#fff;line-height:1.1}
  .brand b{font-family:'Sora';font-weight:800;font-size:clamp(17px,4.2vw,21px);letter-spacing:-.01em}
  .brand span{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600;margin-top:2px}
  .top .btn-primary{padding:11px 20px;font-size:15px}
  .hero{position:relative;background:
      radial-gradient(90% 120% at 85% -10%, color-mix(in srgb, var(--a2) 26%, transparent) 0%, transparent 55%),
      radial-gradient(70% 90% at -10% 110%, color-mix(in srgb, var(--a1) 14%, transparent) 0%, transparent 50%),
      linear-gradient(160deg,var(--base) 20%,var(--base2) 100%);
    color:#fff;overflow:hidden}
  .hero .ghost{position:absolute;right:-3%;top:8%;font-family:'Sora';font-weight:800;
    font-size:clamp(120px,30vw,300px);line-height:.8;color:transparent;
    -webkit-text-stroke:1px color-mix(in srgb, var(--base) 55%, rgba(255,255,255,.18));
    user-select:none;pointer-events:none;letter-spacing:-.03em}
  .hero .wrap{position:relative;z-index:2;padding:64px 22px 96px}
  .hero.spotlight{min-height:70vh;display:flex;align-items:center}
  .hero.spotlight .wrap{padding:72px 22px 80px;width:100%}
  .hero.center .wrap{text-align:center}
  .hero.center h1,.hero.center .sub{margin-left:auto;margin-right:auto}
  .hero.center .kicker{justify-content:center}
  .hero.center .hero-cta,.hero.center .badges{justify-content:center}
  .hero .biz{font-family:'Sora';font-weight:800;font-size:clamp(22px,5.2vw,34px);letter-spacing:-.02em;color:var(--on-dark);margin-bottom:10px}
  .kicker{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:.18em;
    text-transform:uppercase;color:var(--a1);margin-bottom:18px}
  .kicker::before{content:"";width:26px;height:2px;background:linear-gradient(90deg,var(--a1),var(--a2));border-radius:2px}
  h1{font-family:'Sora';font-weight:800;font-size:clamp(32px,8vw,58px);line-height:1.06;letter-spacing:-.02em;max-width:15ch;
    animation:rise .6s ease both}
  .hero p.sub{margin-top:18px;font-size:clamp(16px,4.2vw,19px);color:rgba(255,255,255,.72);max-width:38ch;font-weight:500;
    animation:rise .6s .08s ease both}
  .hero-cta{margin-top:28px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;animation:rise .6s .16s ease both}
  .badges{margin-top:22px;display:flex;gap:18px;flex-wrap:wrap;animation:rise .6s .22s ease both}
  .badge{display:inline-flex;align-items:center;gap:7px;font-size:13.5px;font-weight:600;color:rgba(255,255,255,.75)}
  .badge svg{width:16px;height:16px;fill:var(--a1)}
  @keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .proof-card{position:relative;z-index:3;margin:-44px auto 0;max-width:640px;text-decoration:none;color:var(--ink);
    background:var(--card);border-radius:16px;padding:18px 24px;
    display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;
    box-shadow:0 18px 45px rgba(10,15,25,.16), 0 2px 8px rgba(10,15,25,.08);
    transition:transform .2s ease, box-shadow .2s ease}
  a.proof-card:hover{transform:translateY(-3px);box-shadow:0 24px 55px rgba(10,15,25,.20), 0 2px 8px rgba(10,15,25,.08)}
  .stars{color:#f5a623;font-size:19px;letter-spacing:2.5px}
  .proof-card b{font-family:'Sora';font-weight:800;font-size:22px}
  .proof-card .src{color:var(--muted);font-size:14.5px;font-weight:600}
  .proof-card .src em{font-style:normal;font-weight:700;color:var(--ink)}
  .proof-card .go{color:var(--a2);font-weight:700;font-size:14px;white-space:nowrap}
  .sect{padding:58px 0 8px}
  .eyebrow{font-size:12.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--a2)}
  .sect h2,.area h2{font-family:'Sora';font-weight:800;font-size:clamp(24px,6vw,34px);letter-spacing:-.015em;margin:8px 0 26px}
  .cards{display:grid;gap:16px;grid-template-columns:1fr}
  @media(min-width:720px){
    .cards{grid-template-columns:repeat(3,1fr)}
    .cards.feature-first .card:first-child{grid-column:span 2}
    .cards.uniform{grid-template-columns:repeat(3,1fr)}
  }
  .chips-row{padding:12px 0 8px}
  .card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px 22px;
    transition:transform .2s ease, box-shadow .2s ease}
  .card:hover{transform:translateY(-4px);box-shadow:0 14px 34px rgba(10,15,25,.10)}
  .card .ico{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;
    background:linear-gradient(130deg,var(--a1),var(--a2));margin-bottom:14px;box-shadow:0 6px 16px var(--glow)}
  .card .ico svg{width:22px;height:22px;fill:#fff}
  .card h3{font-family:'Sora';font-weight:700;font-size:18.5px;margin-bottom:6px}
  .card p{color:var(--muted);font-size:15px;line-height:1.55}
  .area{padding:46px 0 14px}
  .towns{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
  .town{font-size:14.5px;font-weight:600;padding:9px 16px;border-radius:999px;
    background:var(--card);border:1px solid var(--line);color:var(--ink);transition:transform .15s ease}
  .town:hover{transform:translateY(-2px)}
  .town.home{background:linear-gradient(120deg,var(--a1),var(--a2));border:none;color:#fff;box-shadow:0 6px 16px var(--glow)}
  .more{align-self:center;color:var(--muted);font-size:13.5px;font-weight:500}
  .close{margin:64px 0 0;background:
      radial-gradient(80% 130% at 90% -20%, color-mix(in srgb, var(--a1) 30%, transparent) 0%, transparent 55%),
      linear-gradient(150deg,var(--base) 10%,var(--base2) 100%);
    color:#fff;text-align:center;padding:64px 22px 58px}
  .close h2{font-family:'Sora';font-weight:800;font-size:clamp(26px,7vw,42px);letter-spacing:-.02em;line-height:1.08}
  .close p{margin-top:12px;font-weight:600;font-size:16.5px;color:rgba(255,255,255,.72)}
  .close .cta-row{margin-top:26px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
  .close .btn-primary{font-size:clamp(17px,4.6vw,20px);padding:17px 34px}
  .info{background:var(--base);color:rgba(255,255,255,.65);padding:22px;border-top:1px solid rgba(255,255,255,.08)}
  .info .wrap{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-size:14px;font-weight:500;text-align:center}
  .info a{color:var(--a1);font-weight:700;text-decoration:none;white-space:nowrap}
  .info a:hover{text-decoration:underline}
  .dot{opacity:.4}
  .strip{background:var(--base);padding:0 22px 18px;text-align:center;font-size:12.5px;color:rgba(255,255,255,.4)}
  .strip a{color:rgba(255,255,255,.7);font-weight:600}
  .stickybar{display:none}
  @media (max-width:719px){
    .stickybar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;gap:1px;
      box-shadow:0 -8px 24px rgba(10,15,25,.18)}
    .stickybar a{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;
      padding:16px 10px;font-weight:800;font-size:16px;text-decoration:none;letter-spacing:.01em}
    .stickybar a svg{width:19px;height:19px;fill:currentColor}
    .stickybar .s-call{background:linear-gradient(120deg,var(--a1),var(--a2));color:var(--btn-ink)}
    .stickybar .s-text{background:var(--base);color:#fff}
  }
  body{display:block!important;background:var(--paper)!important;color:var(--ink)!important;font-family:'Inter',system-ui,sans-serif!important}
  body::before, body::after { content: none !important; display: none !important; background: none !important; }
  .demo-trades-v1{min-height:100vh;background:var(--paper);color:var(--ink);font-family:'Inter',system-ui,sans-serif}
`;
