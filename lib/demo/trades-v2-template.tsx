import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { artTradeFor, pickArt, publicArtUrl, type ArtRow } from './art';
import {
  HONEST_STRIP,
  HONEST_STRIP_LINK_TEXT,
} from './copy';
import { parseBlurbItems, parseDemoFacts, parseHeroLine } from './facts';
import { hoursRows, isOpenNow, summarizeOpenHours } from './hours';
import { kitFor } from './kits';
import type { DemoSiteRow, Provenanced } from './types';

const GOOGLE_FONTS_PRECONNECT = 'https://fonts.googleapis.com';
const GOOGLE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap';

const PHONE_PATH =
  'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z';

const REVEAL_SCRIPT =
  "(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.demo-trades-v2 .rv').forEach(el=>io.observe(el));})();";

const COUNT_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

function telHref(tel: string): string {
  return /^tel:/i.test(tel) ? tel : `tel:${tel}`;
}

function smsHref(tel: string): string {
  return `sms:${tel.replace(/^tel:/i, '')}`;
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function categoryLabel(raw?: string): string {
  if (!raw) return '';
  return titleCase(raw.replace(/[_-]+/g, ' '));
}

export function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

const STOP = new Set([
  'and',
  'or',
  '&',
  'in',
  'of',
  'for',
  'with',
  'to',
  'the',
  'a',
  'an',
  'on',
  'at',
  'by',
  'from',
  'near',
]);

export function accentHeadline(line: string): ReactNode {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 6) return line;
  const n = words.length === 6 ? 2 : 3;
  let s = words.length - n;
  while (s > 1 && STOP.has(words[s].toLowerCase())) s -= 1;
  if (words.length - s > 5) s = words.length - n;
  const head = words.slice(0, s).join(' ');
  const tail = words.slice(s).join(' ');
  return (
    <>
      {head} <em>{tail}</em>
    </>
  );
}

const REPUTATION =
  /\b(customers?|clients?|reviewers?|known for|praise[sd]?|report|recommend(ed)?|trusted)\b/i;
const SPECIALTY =
  /\b(specializ\w*|focus\w*|custom\w*|expert\w*|dedicated|precis\w*|everything from)\b/i;

export function pickBlurbs(
  blurbs: Provenanced<string>[],
  heroLine: string | null,
): {
  heroSub?: Provenanced<string>;
  bandQuote?: Provenanced<string>;
} {
  const heroSub =
    blurbs.find((b) => REPUTATION.test(b.value)) ?? blurbs[0];
  const rest = heroSub
    ? blurbs.filter((b) => b.value !== heroSub.value)
    : blurbs;
  const specialty = rest.find((b) => SPECIALTY.test(b.value));
  let bandQuote: Provenanced<string> | undefined =
    specialty ??
    rest[0] ??
    (heroLine ? { value: heroLine, source: '' } : undefined);
  if (heroSub && bandQuote && heroSub.value === bandQuote.value) {
    bandQuote =
      heroLine && heroLine !== heroSub.value
        ? { value: heroLine, source: '' }
        : undefined;
  }
  return { heroSub, bandQuote };
}

export function starFillWidth(rating: number): string {
  const clamped = Math.min(5, Math.max(0, rating));
  return `${Math.round((clamped / 5) * 100)}%`;
}

export function isReviewsProvenance(source: string): boolean {
  return /review/i.test(source);
}

export function bandCaption(source: string): string {
  return isReviewsProvenance(source)
    ? "From the shop's own reviews"
    : "From the shop's public listing";
}

function serviceIconKind(name: string): string {
  const s = name.toLowerCase();
  if (/tire/.test(s)) return 'tire';
  if (/wheel|align/.test(s)) return 'wheel';
  if (/brake/.test(s)) return 'brake';
  if (/engine/.test(s)) return 'engine';
  if (/inspect/.test(s)) return 'inspect';
  if (/electric/.test(s)) return 'electrical';
  if (/roof/.test(s)) return 'roof';
  if (/plumb/.test(s)) return 'plumbing';
  if (/hvac|heat|cool/.test(s)) return 'hvac';
  return 'wrench';
}

function SvcIcon({ kind }: { kind: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (kind) {
    case 'engine':
      return (
        <svg {...common}>
          <path d="M4 10h3l2-3h6l2 3h3v7H4z" />
          <path d="M8 17v2M16 17v2M2 12h2M20 12h2" />
        </svg>
      );
    case 'tire':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      );
    case 'wheel':
      return (
        <svg {...common}>
          <path d="M3 12h18M6 8l-3 4 3 4M18 8l3 4-3 4" />
        </svg>
      );
    case 'brake':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4a8 8 0 0 1 8 8h-8z" />
        </svg>
      );
    case 'inspect':
      return (
        <svg {...common}>
          <path d="M9 11l2 2 4-5" />
          <rect x="4" y="3" width="16" height="18" rx="2" />
        </svg>
      );
    case 'electrical':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 10-14h-7z" />
        </svg>
      );
    case 'roof':
      return (
        <svg {...common}>
          <path d="M12 3 2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        </svg>
      );
    case 'plumbing':
      return (
        <svg {...common}>
          <path d="M8 3v4M16 3v4M5 7h14v3a7 7 0 0 1-14 0V7zM12 14v7" />
        </svg>
      );
    case 'hvac':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-1.4-1.4 2.1-2.1z" />
        </svg>
      );
  }
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PHONE_PATH} />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

function StarGlyphs({ size }: { size: 18 | 14 }) {
  const width = size === 14 ? 70 : 90;
  return (
    <svg
      viewBox="0 0 120 24"
      width={width}
      height={size}
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={STAR_PATH}
          transform={`translate(${i * 24} 0)`}
        />
      ))}
    </svg>
  );
}

function Stars({
  rating,
  size = 18,
}: {
  rating: number;
  size?: 18 | 14;
}) {
  return (
    <span className="stars">
      <StarGlyphs size={size} />
      <b style={{ width: starFillWidth(rating) }}>
        <StarGlyphs size={size} />
      </b>
    </span>
  );
}

function MapsArrow() {
  return (
    <svg
      className="maps-arrow"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path
        d="M3 9L9 3M4.5 3H9v4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function proofAddress(address: string): { bold: string; rest: string } {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) return { bold: parts[0], rest: parts[1] };
  return { bold: address, rest: '' };
}

function thingsHeading(n: number): string {
  if (n === 1) return 'One thing done right';
  const word = COUNT_WORDS[n];
  return word ? `${word} things done right` : `${n} things done right`;
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
    <div className="honest">
      {stripBefore}
      <Link href="/">{HONEST_STRIP_LINK_TEXT}</Link>
      {stripAfter}
    </div>
  );
}

function kitVars(kit: ReturnType<typeof kitFor>): CSSProperties {
  return {
    '--ground': kit.ground,
    '--panel': kit.panel,
    '--panel2': kit.panel2,
    '--line': kit.line,
    '--ink': kit.ink,
    '--muted': kit.muted,
    '--dim': kit.dim,
    '--amber': kit.accent,
    '--amber2': kit.accent2,
    '--steel': kit.steel,
    '--display': kit.displayFont,
    '--body': kit.bodyFont,
  } as CSSProperties;
}

export function TradesV2Template({
  site,
  pool = [],
  now,
}: {
  site: DemoSiteRow;
  pool?: ArtRow[];
  now?: Date;
}) {
  const facts = parseDemoFacts(site.facts);
  const heroLine = parseHeroLine(site.hero_line);
  const blurbs = parseBlurbItems(site.blurbs);
  const name = facts.name.value;
  const town = facts.town?.value;
  const category = facts.category?.value;
  const trade = artTradeFor(category);
  const kit = kitFor(trade);
  const picked = pickArt(trade, site.slug, pool);
  const heroUrl = picked.hero ? publicArtUrl(picked.hero.path) : null;
  const bandUrl = picked.band ? publicArtUrl(picked.band.path) : null;

  const phone = facts.phone;
  const tel = phone ? telHref(phone.tel) : null;
  const sms = phone ? smsHref(phone.tel) : null;
  const mapsUrl = facts.maps_url?.value;
  const address = facts.address?.value;
  const services = facts.services || [];
  const reviews = (facts.reviews || []).map((item) => item.value);
  const hours = facts.hours?.value || [];
  const clock = now ?? new Date();
  const open = hours.length ? isOpenNow(hours, clock) : false;
  const todayName = hours.length
    ? new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
      }).format(clock)
    : '';
  const hoursSummary = hours.length ? summarizeOpenHours(hours) : null;
  const parsedHours = hours.length ? hoursRows(hours) : [];

  const showTrust =
    facts.rating != null && facts.ratings_count != null;
  const { heroSub, bandQuote: quoteBlurb } = pickBlurbs(blurbs, heroLine);
  const kickerParts = [town, categoryLabel(category)].filter(Boolean);
  const showServices = services.length > 0;
  const showReviews = reviews.length > 0;
  const showHours = parsedHours.length > 0;
  const showContact = Boolean(tel || address || mapsUrl);
  const showDock = Boolean(tel || sms || mapsUrl);
  const proofCells: ReactNode[] = [];
  if (hoursSummary) {
    const split = hoursSummary.match(/^(Open \S+)\s+(.*)$/);
    proofCells.push(
      <div key="hours">
        <ClockIcon />
        <span>
          <b>{split ? split[1] : hoursSummary}</b>
          {split ? ` ${split[2]}` : null}
        </span>
      </div>,
    );
  }
  if (address) {
    const bits = proofAddress(address);
    proofCells.push(
      <div key="addr">
        <PinIcon />
        <span>
          <b>{bits.bold}</b>
          {bits.rest ? `, ${bits.rest}` : null}
        </span>
      </div>,
    );
  }
  if (tel && phone) {
    proofCells.push(
      <div key="phone">
        <PhoneIcon />
        <span>
          <a href={tel}>
            <b>{phone.value}</b>
          </a>
        </span>
      </div>,
    );
  }

  const brandPlace = town ? `${town}, West Virginia` : null;
  const footerPlace = town ? `${town}, WV` : null;

  return (
    <>
      <link rel="preconnect" href={GOOGLE_FONTS_PRECONNECT} />
      <link href={GOOGLE_FONTS_HREF} rel="stylesheet" />
      <style>{TRADES_V2_CSS}</style>
      <div
        className={`demo-trades-v2${showDock ? ' has-dock' : ''}${heroUrl ? '' : ' no-hero-photo'}`}
        data-kit={kit.kickerWord}
        style={kitVars(kit)}
      >
        <header className="bar">
          <div className="wrap">
            <div className="brand">
              {name ? <b>{name}</b> : null}
              {brandPlace ? <span>{brandPlace}</span> : null}
            </div>
            <nav>
              {showServices ? <a href="#services">Services</a> : null}
              {showReviews ? <a href="#reviews">Reviews</a> : null}
              {showHours ? <a href="#hours">Hours</a> : null}
              {showContact ? <a href="#contact">Contact</a> : null}
            </nav>
            {tel ? (
              <a className="call" href={tel}>
                <PhoneIcon />
                Call
              </a>
            ) : null}
          </div>
        </header>

        <section className="hero">
          {heroUrl ? (
            <div
              className="photo"
              style={{ backgroundImage: `url("${heroUrl}")` }}
            />
          ) : null}
          <div className="art" />
          <div className="noise" />
          <div className="wrap">
            {kickerParts.length ? (
              <span className="kick">{kickerParts.join(' · ')}</span>
            ) : null}
            {heroLine ? (
              <h1 style={{ marginTop: 18 }}>{accentHeadline(heroLine)}</h1>
            ) : null}
            {showTrust && facts.rating && facts.ratings_count ? (
              <div className="trust" style={{ marginTop: 22 }}>
                <Stars rating={facts.rating.value} />
                <strong>
                  {Number.isInteger(facts.rating.value)
                    ? facts.rating.value.toFixed(1)
                    : String(facts.rating.value)}
                </strong>
                <span>
                  {Math.round(facts.ratings_count.value)} Google reviews
                </span>
              </div>
            ) : null}
            {heroSub ? <p className="sub">{heroSub.value}</p> : null}
            {tel && phone ? (
              <div className="ctas">
                <a className="call" href={tel}>
                  <PhoneIcon />
                  {phone.value}
                </a>
                {sms ? (
                  <a className="ghost" href={sms}>
                    Text us
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>

        {proofCells.length > 0 ? (
          <div className="strip">
            <div
              className="wrap"
              style={{
                gridTemplateColumns: `repeat(${proofCells.length}, 1fr)`,
              }}
            >
              {proofCells}
            </div>
          </div>
        ) : null}

        {showServices ? (
          <section id="services">
            <div className="wrap">
              <div className="sec-head rv">
                <div>
                  <span className="kick">What we do</span>
                  <h2>{thingsHeading(services.length)}</h2>
                </div>
              </div>
              <div className="services" data-n={services.length}>
                {services.map((svc, i) => (
                  <div className="svc rv" key={`${svc.value}:${i}`}>
                    <i>{String(i + 1).padStart(2, '0')}</i>
                    <SvcIcon kind={serviceIconKind(svc.value)} />
                    <h3>{titleCase(svc.value)}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <div
          className={`band rv${bandUrl ? ' has-photo' : ' no-photo'}`}
          style={
            bandUrl
              ? ({ '--band-url': `url("${bandUrl}")` } as CSSProperties)
              : undefined
          }
        >
          <div className="noise" />
          {quoteBlurb ? (
            <q
              data-len={
                quoteBlurb.value.trim().split(/\s+/).filter(Boolean).length <= 12
                  ? 'short'
                  : 'long'
              }
            >
              {quoteBlurb.value}
              <small>{bandCaption(quoteBlurb.source)}</small>
            </q>
          ) : null}
        </div>

        {showReviews ? (
          <section id="reviews">
            <div className="wrap">
              <div className="sec-head rv">
                <div>
                  <span className="kick">Google reviews</span>
                  <h2>In their words</h2>
                </div>
                {facts.rating && facts.ratings_count ? (
                  <p>
                    Quoted exactly as written.{' '}
                    {facts.rating.value} stars across{' '}
                    {Math.round(facts.ratings_count.value)} reviews.
                  </p>
                ) : (
                  <p>Quoted exactly as written.</p>
                )}
              </div>
              <div className="reviews">
                {reviews.map((review, i) => (
                  <div className="rev rv" key={`${review.author}:${i}`}>
                    <div className="who">
                      <div className="ava">{authorInitials(review.author)}</div>
                      <div>
                        <b>{review.author}</b>
                        <span>
                          Google review · {review.rating} stars
                        </span>
                      </div>
                    </div>
                    <p>{review.body}</p>
                    <Stars rating={review.rating} size={14} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {showHours || showContact ? (
          <section id="hours">
            <div className="wrap">
              <div className="split">
                {showHours ? (
                  <div className="card rv">
                    <span className="kick">Hours</span>
                    <h2 style={{ fontSize: 36 }}>When we&apos;re open</h2>
                    <ul className="hours">
                      {parsedHours.map((row) => {
                        const isToday =
                          row.day.toLowerCase() === todayName.toLowerCase();
                        return (
                          <li
                            key={row.day}
                            className={isToday ? 'today' : undefined}
                          >
                            <b>
                              {row.day}
                              {isToday && open ? <em>Open now</em> : null}
                            </b>
                            <span>{row.hours}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
                {showContact ? (
                  <div className="card contact rv" id="contact">
                    <span className="kick">Contact</span>
                    <h2 style={{ fontSize: 36 }}>Call the shop</h2>
                    {tel && phone ? (
                      <a className="big" href={tel}>
                        {phone.value}
                      </a>
                    ) : null}
                    {address ? <p>{address}</p> : null}
                    {mapsUrl ? (
                      <p>
                        <a className="maps-link" href={mapsUrl}>
                          Directions on Google Maps <MapsArrow />
                        </a>
                      </p>
                    ) : null}
                    {tel ? (
                      <div className="ctas">
                        <a className="call" href={tel}>
                          Call now
                        </a>
                        {sms ? (
                          <a className="ghost" href={sms}>
                            Text us
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <footer>
          <div className="wrap">
            <span>
              © {name}
              {footerPlace ? ` · ${footerPlace}` : ''}
            </span>
          </div>
        </footer>

        <HonestStrip />

        {showDock ? (
          <div className="dock">
            {tel ? (
              <a className="primary" href={tel}>
                Call
              </a>
            ) : null}
            {sms ? <a href={sms}>Text</a> : null}
            {mapsUrl ? <a href={mapsUrl}>Directions</a> : null}
          </div>
        ) : null}
      </div>
      <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
    </>
  );
}

const TRADES_V2_CSS = `
  .demo-trades-v2, .demo-trades-v2 *{box-sizing:border-box}
  .demo-trades-v2{min-height:100vh;background:var(--ground);color:var(--ink);font:16px/1.6 var(--body);-webkit-font-smoothing:antialiased}
  .demo-trades-v2 a{color:inherit}
  .demo-trades-v2 .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
  .demo-trades-v2 .kick{font:700 12px/1 var(--display);letter-spacing:.32em;text-transform:uppercase;color:var(--amber);display:inline-flex;align-items:center;gap:10px}
  .demo-trades-v2 .kick:before{content:"";width:26px;height:2px;background:var(--amber)}
  .demo-trades-v2 h1,.demo-trades-v2 h2,.demo-trades-v2 h3{font-family:var(--display);margin:0;line-height:1.02;letter-spacing:.005em}
  .demo-trades-v2 .noise{position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.28;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='.55'/></svg>")}
  .demo-trades-v2 .bar{position:sticky;top:0;z-index:30;background:var(--ground);border-bottom:1px solid var(--line)}
  .demo-trades-v2 .bar .wrap{display:flex;align-items:center;gap:22px;height:66px}
  .demo-trades-v2 .brand{display:flex;flex-direction:column;line-height:1}
  .demo-trades-v2 .brand b{font:800 22px/1 var(--display);letter-spacing:.06em;text-transform:uppercase}
  .demo-trades-v2 .brand span{font:600 10px/1 var(--display);letter-spacing:.3em;color:var(--dim);text-transform:uppercase;margin-top:4px}
  .demo-trades-v2 nav{margin-left:auto;display:flex;gap:22px;font:600 13px var(--body);color:var(--muted)}
  .demo-trades-v2 nav a{text-decoration:none}
  .demo-trades-v2 nav a:hover{color:var(--ink)}
  .demo-trades-v2 .call{display:inline-flex;align-items:center;gap:8px;background:var(--amber);color:#1a1200;border-radius:999px;padding:11px 18px;font:700 14px var(--body);letter-spacing:.02em;text-decoration:none;box-shadow:0 8px 24px rgba(245,165,36,.25)}
  .demo-trades-v2 .call svg{width:15px;height:15px}
  .demo-trades-v2 .ghost{display:inline-flex;align-items:center;gap:8px;border:1px solid #3a414c;color:var(--ink);border-radius:999px;padding:11px 18px;font:600 14px var(--body);text-decoration:none;background:rgba(255,255,255,.03)}
  .demo-trades-v2 .hero{position:relative;overflow:hidden;min-height:82vh;display:grid;grid-template-columns:1.02fr .98fr;align-items:center;border-bottom:1px solid var(--line);background:var(--ground)}
  .demo-trades-v2 .hero .photo{position:absolute;top:0;bottom:0;right:0;width:60%;background-position:center 40%;background-size:cover;background-repeat:no-repeat;animation:trades-v2-drift 40s ease-in-out infinite alternate;transform-origin:60% 50%;
    -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 34%),linear-gradient(180deg,transparent 0%,#000 18%,#000 82%,transparent 100%);-webkit-mask-composite:source-in;mask-image:linear-gradient(90deg,transparent 0%,#000 34%),linear-gradient(180deg,transparent 0%,#000 18%,#000 82%,transparent 100%);mask-composite:intersect}
  .demo-trades-v2 .hero .art{position:absolute;inset:0;pointer-events:none;grid-column:1/3;grid-row:1;
    background:
      linear-gradient(90deg, rgba(15,18,22,.35) 0%, rgba(15,18,22,.2) 45%, rgba(15,18,22,0) 60%),
      linear-gradient(180deg, rgba(15,18,22,.4), transparent 25%, transparent 70%, rgba(15,18,22,.85))}
  .demo-trades-v2 .hero .wrap{position:relative;grid-column:1;grid-row:1;padding:72px 24px 96px 0;margin:0 0 0 max(24px,calc((100vw - 1120px)/2));max-width:640px;z-index:2}
  .demo-trades-v2 .hero h1{font-size:clamp(36px,4.9vw,62px);font-weight:800;text-transform:uppercase;max-width:18ch;text-shadow:0 2px 0 rgba(0,0,0,.4)}
  .demo-trades-v2 .hero h1 em{font-style:normal;color:var(--amber)}
  .demo-trades-v2 .sub{font-size:19px;color:var(--muted);max-width:56ch;margin:18px 0 26px}
  .demo-trades-v2 .trust{display:inline-flex;align-items:center;gap:12px;background:rgba(23,27,33,.82);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:0 0 26px}
  .demo-trades-v2 .stars{position:relative;display:inline-block;line-height:0;color:#3a414c}
  .demo-trades-v2 .stars svg{display:block;fill:currentColor}
  .demo-trades-v2 .stars b{position:absolute;left:0;top:0;overflow:hidden;color:var(--amber)}
  .demo-trades-v2 .trust strong{font:800 22px/1 var(--display);color:var(--ink)}
  .demo-trades-v2 .trust span{font-size:13px;color:var(--muted)}
  .demo-trades-v2 .ctas{display:flex;gap:12px;flex-wrap:wrap}
  .demo-trades-v2 .ctas .call{font-size:17px;padding:15px 24px}
  .demo-trades-v2 .ctas .ghost{font-size:16px;padding:15px 22px}
  @keyframes trades-v2-drift{from{transform:scale(1) translate(0,0)}to{transform:scale(1.07) translate(-1.5%,1%)}}
  .demo-trades-v2 .strip{background:var(--panel);border-bottom:1px solid var(--line)}
  .demo-trades-v2 .strip .wrap{display:grid;gap:0}
  .demo-trades-v2 .strip .wrap > div{padding:18px 22px;border-right:1px solid var(--line);display:flex;gap:12px;align-items:center;font-size:14px;color:var(--muted)}
  .demo-trades-v2 .strip .wrap > div:first-child{padding-left:0}
  .demo-trades-v2 .strip .wrap > div:last-child{border-right:0}
  .demo-trades-v2 .strip svg{width:20px;height:20px;color:var(--amber);flex:none}
  .demo-trades-v2 .strip b{color:var(--ink);font-weight:600}
  .demo-trades-v2 section{padding:76px 0}
  .demo-trades-v2 .sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:34px}
  .demo-trades-v2 h2{font-size:clamp(34px,4.6vw,52px);font-weight:800;text-transform:uppercase;margin-top:10px}
  .demo-trades-v2 .sec-head p{color:var(--muted);max-width:44ch;margin:0}
  .demo-trades-v2 .services{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .demo-trades-v2 .services[data-n="2"]{grid-template-columns:repeat(2,1fr)}
  .demo-trades-v2 .services[data-n="3"]{grid-template-columns:repeat(3,1fr)}
  .demo-trades-v2 .services[data-n="5"]{grid-template-columns:repeat(5,1fr)}
  .demo-trades-v2 .services[data-n="5"] .svc{padding:20px 16px 18px}
  .demo-trades-v2 .services[data-n="5"] .svc h3{font-size:19px}
  .demo-trades-v2 .services[data-n="6"]{grid-template-columns:repeat(3,1fr)}
  .demo-trades-v2 .svc{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:22px 20px 20px;position:relative;overflow:hidden;transition:transform .25s,border-color .25s}
  .demo-trades-v2 .svc:hover{transform:translateY(-3px);border-color:#3d4550}
  .demo-trades-v2 .svc i{position:absolute;right:14px;top:10px;font:800 44px/1 var(--display);color:rgba(245,165,36,.12)}
  .demo-trades-v2 .svc svg{width:30px;height:30px;color:var(--amber);margin-bottom:14px}
  .demo-trades-v2 .svc h3{font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:.02em}
  .demo-trades-v2 .band{position:relative;height:360px;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  .demo-trades-v2 .band.has-photo{background:linear-gradient(90deg, rgba(15,18,22,.15) 0%, rgba(15,18,22,.55) 55%, rgba(15,18,22,.85) 100%), var(--band-url) center 40%/cover no-repeat}
  .demo-trades-v2 .band.no-photo{background:radial-gradient(50% 80% at 25% 50%, rgba(245,165,36,.18), transparent 60%),radial-gradient(40% 70% at 80% 60%, rgba(143,163,184,.14), transparent 60%),linear-gradient(180deg,#0c0f13,#191d24 60%,#0c0f13)}
  .demo-trades-v2 .band q{position:absolute;right:6%;bottom:34px;max-width:38ch;font:700 clamp(22px,3vw,34px)/1.1 var(--display);text-transform:uppercase;color:var(--ink);quotes:none;z-index:2}
  .demo-trades-v2 .band q[data-len="long"]{font-size:clamp(20px,2.4vw,27px)}
  .demo-trades-v2 .band q small{display:block;font:600 12px var(--body);letter-spacing:.2em;color:var(--amber);text-transform:uppercase;margin-top:10px}
  .demo-trades-v2 .reviews{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .demo-trades-v2 .rev{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:26px 26px 22px;position:relative}
  .demo-trades-v2 .rev:before{content:"“";position:absolute;right:22px;top:6px;font:800 90px/1 var(--display);color:rgba(245,165,36,.14)}
  .demo-trades-v2 .rev .who{display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .demo-trades-v2 .ava{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--amber),var(--amber2));color:#1a1200;display:grid;place-items:center;font:800 15px var(--display);letter-spacing:.05em}
  .demo-trades-v2 .rev .who b{display:block;font-weight:600}
  .demo-trades-v2 .rev .who span{font-size:12px;color:var(--dim)}
  .demo-trades-v2 .rev p{margin:0;color:#dcd7cd;font-size:16px}
  .demo-trades-v2 .rev .stars{margin-top:14px}
  .demo-trades-v2 .split{display:grid;grid-template-columns:1.1fr .9fr;gap:18px}
  .demo-trades-v2 .card{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:26px}
  .demo-trades-v2 .hours{list-style:none;margin:14px 0 0;padding:0}
  .demo-trades-v2 .hours li{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--line);font-size:15px;color:var(--muted)}
  .demo-trades-v2 .hours li b{color:var(--ink);font-weight:600}
  .demo-trades-v2 .hours li.today{color:var(--ink)}
  .demo-trades-v2 .hours li.today em{font-style:normal;color:#5fd68a;font-size:12px;margin-left:8px}
  .demo-trades-v2 .contact .big{font:800 clamp(30px,4vw,44px)/1 var(--display);color:var(--amber);text-decoration:none;display:block;margin:10px 0 6px}
  .demo-trades-v2 .contact p{color:var(--muted);margin:6px 0}
  .demo-trades-v2 .contact .ctas{margin-top:18px}
  .demo-trades-v2 .maps-link{display:inline-flex;align-items:center;gap:6px;color:var(--steel);text-decoration:none}
  .demo-trades-v2 .maps-arrow{flex:none}
  .demo-trades-v2 footer{border-top:1px solid var(--line);padding:26px 0 120px;color:var(--dim);font-size:13px}
  .demo-trades-v2 footer .wrap{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
  .demo-trades-v2 .honest{position:fixed;left:0;right:0;bottom:0;z-index:40;background:#0b0d10;border-top:1px solid var(--line);color:var(--muted);font-size:12.5px;padding:9px 16px;text-align:center}
  .demo-trades-v2 .honest a{color:var(--amber)}
  .demo-trades-v2 .dock{display:none}
  @media (max-width:720px){
    .demo-trades-v2 .bar nav,.demo-trades-v2 .bar .call{display:none}
    .demo-trades-v2 .hero{display:block;min-height:auto}
    .demo-trades-v2 .hero .photo{position:absolute;inset:0;width:auto;min-height:0;animation:none;background-position:center 0%;
      -webkit-mask-image:none;mask-image:none}
    .demo-trades-v2 .hero .wrap{margin:0;max-width:none;padding:330px 20px 70px}
    .demo-trades-v2.no-hero-photo .hero .wrap{padding:72px 20px 70px}
    .demo-trades-v2 .strip .wrap{grid-template-columns:1fr !important}
    .demo-trades-v2 .strip .wrap > div{border-right:0;border-bottom:1px solid var(--line);padding:14px 0}
    .demo-trades-v2 .reviews,.demo-trades-v2 .split{grid-template-columns:1fr}
    .demo-trades-v2 .services,
    .demo-trades-v2 .services[data-n="2"],
    .demo-trades-v2 .services[data-n="3"],
    .demo-trades-v2 .services[data-n="5"],
    .demo-trades-v2 .services[data-n="6"]{grid-template-columns:repeat(2,1fr)}
    .demo-trades-v2 .services .svc:last-child:nth-child(odd){grid-column:1/-1}
    .demo-trades-v2 .band{height:220px}
    .demo-trades-v2 .band q{right:20px;left:20px;max-width:none}
    .demo-trades-v2.has-dock .honest{bottom:64px;font-size:11.5px;padding:7px 12px}
    .demo-trades-v2 .hero .ctas{display:none}
    .demo-trades-v2 .hero .art{background:linear-gradient(180deg, rgba(15,18,22,.55) 0%, rgba(15,18,22,.35) 35%, rgba(15,18,22,.7) 70%, rgba(15,18,22,.95) 100%)}
    .demo-trades-v2 .dock{display:grid;grid-template-columns:1fr 1fr 1fr;position:fixed;left:0;right:0;bottom:0;z-index:50;background:#0b0d10;border-top:1px solid var(--line);padding:8px 10px calc(8px + env(safe-area-inset-bottom))}
    .demo-trades-v2 .dock a{display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;font:700 13px var(--body);padding:12px 6px;border-radius:10px;color:var(--ink)}
    .demo-trades-v2 .dock a.primary{background:var(--amber);color:#1a1200}
    .demo-trades-v2.has-dock footer{padding-bottom:150px}
  }
  .demo-trades-v2 .rv{opacity:0;transform:translateY(14px);transition:opacity .6s ease,transform .6s ease}
  .demo-trades-v2 .rv.in{opacity:1;transform:none}
  @media (prefers-reduced-motion:reduce){
    .demo-trades-v2 .hero .photo{animation:none}
    .demo-trades-v2 .rv{opacity:1;transform:none;transition:none}
  }
  .demo-shot .demo-trades-v2 .honest{position:static}
  .demo-shot .demo-trades-v2 footer{padding-bottom:26px}
`;
