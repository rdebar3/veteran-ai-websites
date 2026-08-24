import Link from 'next/link';
import {
  HONEST_STRIP,
  HONEST_STRIP_LINK_TEXT,
} from './copy';
import { parseBlurbs, parseDemoFacts, parseHeroLine } from './facts';
import type { DemoSiteRow } from './types';

function formatRating(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function formatReviewCount(value: number): string {
  const n = Math.round(value);
  return n === 1 ? '1 review' : `${n} reviews`;
}

/**
 * v0 plumbing template. Deliberately plain. Replaced by trades_v1 in D3.
 * Renders only facts that are present. No photos.
 */
export function V0Template({ site }: { site: DemoSiteRow }) {
  const facts = parseDemoFacts(site.facts);
  const hero = parseHeroLine(site.hero_line);
  const blurbs = parseBlurbs(site.blurbs);
  const name = facts.name.value;
  const stripBefore = HONEST_STRIP.slice(
    0,
    HONEST_STRIP.indexOf(HONEST_STRIP_LINK_TEXT),
  );
  const stripAfter = HONEST_STRIP.slice(
    HONEST_STRIP.indexOf(HONEST_STRIP_LINK_TEXT) + HONEST_STRIP_LINK_TEXT.length,
  );

  return (
    <div className="demo-v0">
      <style>{V0_CSS}</style>
      <main className="demo-v0__main">
        {name ? <h1 className="demo-v0__name">{name}</h1> : null}
        {facts.town ? (
          <p className="demo-v0__town">{facts.town.value}</p>
        ) : null}
        {facts.phone ? (
          <p className="demo-v0__call">
            <a href={facts.phone.tel}>{facts.phone.value}</a>
          </p>
        ) : null}
        {facts.rating || facts.ratings_count ? (
          <p className="demo-v0__rating">
            {facts.rating ? (
              <span>★ {formatRating(facts.rating.value)}</span>
            ) : null}
            {facts.rating && facts.ratings_count ? ' · ' : null}
            {facts.ratings_count
              ? formatReviewCount(facts.ratings_count.value)
              : null}
          </p>
        ) : null}
        {hero ? <p className="demo-v0__hero">{hero}</p> : null}
        {blurbs.length > 0 ? (
          <div className="demo-v0__blurbs">
            {blurbs.map((blurb) => (
              <p key={blurb}>{blurb}</p>
            ))}
          </div>
        ) : null}
        {facts.hours_text ? (
          <p className="demo-v0__hours">{facts.hours_text.value}</p>
        ) : null}
      </main>
      <aside className="demo-v0__strip" role="note">
        <p>
          {stripBefore}
          <Link href="/">{HONEST_STRIP_LINK_TEXT}</Link>
          {stripAfter}
        </p>
      </aside>
    </div>
  );
}

const V0_CSS = `
.demo-v0{min-height:100vh;display:flex;flex-direction:column;background:#f7f7f5;color:#161616;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}
.demo-v0__main{flex:1;max-width:40rem;margin:0 auto;padding:4.5rem 1.5rem 7rem;width:100%;}
.demo-v0__name{margin:0 0 .4rem;font-size:2rem;font-weight:650;letter-spacing:-.02em;line-height:1.15;}
.demo-v0__town{margin:0 0 1.25rem;color:#4a4a4a;font-size:1.05rem;}
.demo-v0__call{margin:0 0 1rem;}
.demo-v0__call a{font-size:1.15rem;font-weight:600;color:#0b57d0;text-decoration:underline;text-underline-offset:3px;}
.demo-v0__rating{margin:0 0 1.5rem;color:#333;font-size:.95rem;}
.demo-v0__hero{margin:0 0 1.25rem;font-size:1.2rem;line-height:1.45;}
.demo-v0__blurbs{display:flex;flex-direction:column;gap:.85rem;margin:0 0 1.5rem;}
.demo-v0__blurbs p{margin:0;line-height:1.5;color:#222;}
.demo-v0__hours{margin:0;color:#333;font-size:.95rem;white-space:pre-wrap;}
.demo-v0__strip{position:sticky;bottom:0;margin-top:auto;border-top:1px solid #ddd;background:#fff;padding:.85rem 1.25rem;}
.demo-v0__strip p{margin:0 auto;max-width:44rem;font-size:.82rem;line-height:1.45;color:#444;text-align:center;}
.demo-v0__strip a{color:#161616;font-weight:600;text-decoration:underline;text-underline-offset:2px;}
`;
