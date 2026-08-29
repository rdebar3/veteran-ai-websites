import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  HONEST_STRIP,
  HONEST_STRIP_LINK_TEXT,
  layoutVariantFor,
} from './copy';
import {
  eclipseRow,
  minimalRow,
  demoRow,
  ECLIPSE_FACTS,
  MINIMAL_FACTS,
} from './fixtures';
import { motifFamilyFor } from './hero-motifs';
import { DemoSiteView } from './render';
import {
  aboutHeading,
  closerSub,
  formatHoursLine,
  reviewAttribution,
  SERVICE_FALLBACK_BODIES,
  servingAreaLine,
  TradesV1Template,
} from './trades-v1-template';

const ECLIPSE_TEL = 'tel:+13042443334';
const ECLIPSE_SMS = 'sms:+13042443334';
const ECLIPSE_MAPS = 'https://maps.google.com/?cid=8348910066556641243';

describe('trades_v1 template', () => {
  it('Eclipse-shaped full fixture renders every section', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).toContain('Eclipse Construction');
    expect(html).toContain('Morgantown, West Virginia');
    expect(html).toContain('Over your head. Under control.');
    expect(html).toContain('Expert Roofing Services in West Virginia');
    expect(html).toContain('Roof repair and full replacements — free estimates.');
    expect(html).toContain('Licensed &amp; Insured');
    expect(html).toContain('Free Estimates');
    expect(html).toContain('class="proof-card"');
    expect(html).toContain('5.0');
    expect(html).toContain('83 reviews');
    expect(html).toContain('href="' + ECLIPSE_MAPS + '"');
    expect(html).toContain('Read them →');
    expect(html).toContain('What we do');
    expect(html).toContain('Built for homes like yours');
    expect(html).toContain('Roofing');
    expect(html).toContain('Asphalt Shingles');
    expect(html).toContain('Storm Restoration');
    expect(html).toContain('Free Consultation');
    expect(html).toContain('Service area');
    expect(html).toContain('Proudly serving North-Central WV');
    expect(html).toContain('class="town home"');
    expect(html).toContain('Bridgeport');
    expect(html).toContain('+ surrounding areas');
    expect(html).toContain('Ready when your roof is.');
    expect(html).toContain('Five stars across 83 reviews');
    expect(html).toContain('355 Brockway Ave, Morgantown, WV 26501');
    expect(html).toContain('Get directions →');
    expect(html).toContain('class="stickybar"');
    expect(html).toContain('Call Now');
    expect(html).toContain(HONEST_STRIP_LINK_TEXT);
    expect(html.replace(/<[^>]+>/g, '')).toContain(HONEST_STRIP);
    expect(html).toContain('href="/"');
    expect(html).toContain('fonts.googleapis.com');
    expect(html).not.toMatch(/<img\b/i);
  });

  it('minimal fixture (name+phone only) renders header/hero/CTAs/strip and omits proof/services/area/info', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={minimalRow()} />);
    expect(html).toContain('Bare Shop');
    expect(html).toMatch(/class="hero[\s"]/);
    expect(html).toContain('class="hero-cta"');
    expect(html).toContain('class="stickybar"');
    expect(html).toContain(HONEST_STRIP_LINK_TEXT);
    expect(html.replace(/<[^>]+>/g, '')).toContain(HONEST_STRIP);
    expect(html).not.toContain('class="proof-card"');
    expect(html).not.toContain('class="sect"');
    expect(html).not.toContain('What we do');
    expect(html).not.toContain('class="area"');
    expect(html).not.toContain('Service area');
    expect(html).not.toContain('class="info"');
    expect(html).not.toContain('Get directions');
    expect(html).not.toMatch(/<img\b/i);
  });

  it('tel:/sms: hrefs come from fixture tel', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).toContain(`href="${ECLIPSE_TEL}"`);
    expect(html).toContain(`href="${ECLIPSE_SMS}"`);
    expect(html).toContain('(304) 244-3334');
    expect(html).not.toContain('href="tel:(304)');
  });

  it('proof card is an <a> with maps_url and a <div> without; omitted when no rating', () => {
    const withMaps = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(withMaps).toMatch(/<a class="proof-card" href="https:\/\/maps\.google\.com/);

    const noMaps = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            name: { value: 'Eclipse Construction', source: 'businesses.name' },
            rating: { value: 5, source: 'businesses.rating' },
            ratings_count: { value: 83, source: 'businesses.ratings_count' },
          },
        })}
      />,
    );
    expect(noMaps).toContain('<div class="proof-card">');
    expect(noMaps).not.toContain('class="proof-card" href=');

    const noRating = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            name: { value: 'Eclipse Construction', source: 'businesses.name' },
            ratings_count: { value: 83, source: 'businesses.ratings_count' },
          },
        })}
      />,
    );
    expect(noRating).not.toMatch(/<(a|div) class="proof-card"/);
  });

  it('proof card renders at 4.0 and is absent at 3.9', () => {
    const atFour = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: { ...ECLIPSE_FACTS, rating: { value: 4.0, source: 'businesses.rating' } },
        })}
      />,
    );
    expect(atFour).toContain('class="proof-card"');
    expect(atFour).toContain('4.0');

    const below = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: { ...ECLIPSE_FACTS, rating: { value: 3.9, source: 'businesses.rating' } },
        })}
      />,
    );
    expect(below).not.toContain('class="proof-card"');
    expect(below).not.toContain('3.9');
  });

  it('spotlight (no services) skips the services grid and closer; full layout when services exist', () => {
    const spotFacts = { ...ECLIPSE_FACTS };
    delete (spotFacts as { services?: unknown }).services;
    const spot = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: spotFacts,
          slug: 'eclipse-construction',
          blurbs: null,
        })}
      />,
    );
    expect(spot).toContain('is-spotlight');
    expect(spot).toContain('class="hero left spotlight"');
    expect(spot).toContain('Eclipse Construction');
    expect(spot).not.toContain('What we do');
    expect(spot).not.toContain('class="sect"');
    expect(spot).not.toContain('class="close"');
    expect(spot).not.toContain('class="area"');
    expect(spot).toContain('class="towns"');
    expect(spot).toContain(HONEST_STRIP_LINK_TEXT);

    const full = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(full).not.toContain('is-spotlight');
    expect(full).toContain('What we do');
    expect(full).toContain('class="sect"');
    expect(full).toContain('class="close"');
    expect(full).toContain('class="area"');
  });

  it('omits the hero brand line when hero_line starts with the business name', () => {
    const dup = renderToStaticMarkup(
      <TradesV1Template
        site={minimalRow({
          hero_line: '  BARE SHOP — we show up  ',
        })}
      />,
    );
    expect(dup).toContain('is-spotlight');
    expect(dup).not.toContain('class="biz"');
    expect(dup).toContain('BARE SHOP — we show up');

    const distinct = renderToStaticMarkup(
      <TradesV1Template
        site={minimalRow({
          hero_line: 'Expert Roofing Services in West Virginia',
        })}
      />,
    );
    expect(distinct).toContain('<div class="biz">Bare Shop</div>');
  });

  it('seeded layout flags are stable and appear on the root', () => {
    const flags = layoutVariantFor('eclipse-construction');
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    const html2 = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).toBe(html2);
    expect(html).toContain(`data-hero-align="${flags.heroAlign}"`);
    expect(html).toContain(`data-watermark="${flags.watermark}"`);
    expect(html).toContain(`data-grid="${flags.gridStyle}"`);
    expect(html).toContain(`data-skin="ember"`);
  });

  it('closer says Free estimates only when a badge names it', () => {
    const withBadge = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(withBadge).toContain('Five stars across 83 reviews · Free estimates');

    const facts = { ...ECLIPSE_FACTS };
    delete (facts as { badges?: unknown }).badges;
    const noBadge = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts,
          blurbs: ['Roof repair and full replacements.'],
        })}
      />,
    );
    expect(noBadge.toLowerCase()).not.toContain('free estimate');
    expect(noBadge).toContain('Five stars across 83 reviews');
    expect(noBadge).not.toContain(' · ');
  });

  it('empty closer sub omits the paragraph and leaves no separator', () => {
    const facts = { ...ECLIPSE_FACTS };
    delete (facts as { rating?: unknown }).rating;
    delete (facts as { ratings_count?: unknown }).ratings_count;
    delete (facts as { badges?: unknown }).badges;
    expect(closerSub(facts)).toBe('');
    const html = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts,
          blurbs: ['Roof repair and full replacements.'],
        })}
      />,
    );
    expect(html).toContain('class="close"');
    expect(html).toContain('Ready when your roof is.');
    expect(html).not.toContain('<p></p>');
    expect(html).not.toMatch(/class="close"[^]*<p>\s*<\/p>/);
    expect(html).not.toContain(' · ');
    expect(html.toLowerCase()).not.toContain('free estimate');
  });

  it('emits no client JS and keeps the honest strip in both modes', () => {
    const full = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    const spotFacts = { ...ECLIPSE_FACTS };
    delete (spotFacts as { services?: unknown }).services;
    const spot = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: spotFacts, blurbs: null })} />,
    );
    expect(full).not.toMatch(/<script\b/i);
    expect(spot).not.toMatch(/<script\b/i);
    expect(full.replace(/<[^>]+>/g, '')).toContain(HONEST_STRIP);
    expect(spot.replace(/<[^>]+>/g, '')).toContain(HONEST_STRIP);
  });
});

const SPOTLIGHT_BLURBS = [
  'Roof repair and full replacements — free estimates.',
  'Storm damage, handled locally.',
  'Call the number on the listing.',
];

const VERBATIM_BODY = 'Showed up on time & fixed the <leak> "fast".';

const WEEKDAY_HOURS = [
  'Monday: 8:00 AM – 5:00 PM',
  'Tuesday: 8:00 AM – 5:00 PM',
  'Wednesday: 8:00 AM – 5:00 PM',
  'Thursday: 8:00 AM – 5:00 PM',
  'Friday: 8:00 AM – 5:00 PM',
  'Saturday: Closed',
  'Sunday: Closed',
];

function decodeEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

function spotlightFacts() {
  const facts = { ...ECLIPSE_FACTS };
  delete (facts as { services?: unknown }).services;
  return facts;
}

describe('trades_v1 spotlight blurbs + customer voice', () => {
  it('about wraps gated blurbs on full pages; the floating card is gone', () => {
    const html = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ blurbs: SPOTLIGHT_BLURBS })} />,
    );
    expect(html).not.toContain('is-spotlight');
    expect(html).not.toContain('class="spot-detail"');
    expect(html).toContain(aboutHeading('Eclipse Construction'));
    expect(html).toContain('id="about"');
    expect(html).toContain(
      `<h2>About Eclipse Construction</h2><p>${SPOTLIGHT_BLURBS[0]}</p><p>${SPOTLIGHT_BLURBS[1]}</p><p>${SPOTLIGHT_BLURBS[2]}</p>`,
    );
    for (const line of SPOTLIGHT_BLURBS) expect(html).toContain(line);
  });

  it('review bodies pass through byte-identical and escaped', () => {
    const html = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            reviews: [
              {
                value: {
                  author: 'Pat K.',
                  rating: 5,
                  body: VERBATIM_BODY,
                },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    const quoted = html.match(
      /<blockquote class="quote"><p>&quot;([\s\S]*)&quot;<\/p>/,
    );
    expect(quoted).toBeTruthy();
    expect(decodeEntities(quoted![1])).toBe(VERBATIM_BODY);
    expect(html).toContain('&amp;');
    expect(html).toContain('&lt;leak&gt;');
    expect(html).toContain('&quot;fast&quot;');
    expect(html).not.toContain('fixed the <leak>');
  });

  it('review attribution is — author · rating★ Google review', () => {
    const html = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            reviews: [
              {
                value: { author: 'Pat K.', rating: 5, body: 'Solid work.' },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    expect(reviewAttribution('Pat K.', 5)).toBe(
      '— Pat K. · 5★ Google review',
    );
    expect(html).toContain('— Pat K. · 5★ Google review');
    expect(html).toContain('What customers say');
    expect(html).toContain('Read all their reviews →');
    expect(html).toContain(`href="${ECLIPSE_MAPS}"`);
    expect(html.indexOf('What customers say')).toBeLessThan(
      html.indexOf('class="close"'),
    );
  });

  it('absent reviews and hours omit those sections entirely', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).not.toContain('What customers say');
    expect(html).not.toContain('class="voice"');
    expect(html).not.toContain('class="quote"');
    expect(html).not.toContain('Read all their reviews');
    expect(html).not.toContain('class="hours"');
    expect(html).not.toContain('Mon–Fri');
    expect(html).not.toContain('class="spot-detail"');
  });

  it('spotlight caps reviews at 2 and still omits the section when the fact is absent', () => {
    const withThree = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...spotlightFacts(),
            reviews: [
              {
                value: { author: 'A', rating: 5, body: 'First quote body.' },
                source: 'places.reviews',
              },
              {
                value: { author: 'B', rating: 4, body: 'Second quote body.' },
                source: 'places.reviews',
              },
              {
                value: { author: 'C', rating: 5, body: 'Third quote body.' },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    expect(withThree).toContain('First quote body.');
    expect(withThree).toContain('Second quote body.');
    expect(withThree).not.toContain('Third quote body.');
    expect(withThree).toContain('class="voice"');
    expect(withThree).not.toContain('is-spotlight');
    expect(withThree).toContain('id="contact"');

    const none = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: spotlightFacts() })} />,
    );
    expect(none).not.toContain('What customers say');
    expect(none).not.toContain('class="voice"');

    const noMaps = { ...spotlightFacts() };
    delete (noMaps as { maps_url?: unknown }).maps_url;
    const withoutMaps = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...noMaps,
            reviews: [
              {
                value: { author: 'A', rating: 5, body: 'First quote body.' },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    expect(withoutMaps).toContain('What customers say');
    expect(withoutMaps).not.toContain('Read all their reviews');
  });

  it('hours collapse identical weekday spans and stay out of the info band when absent', () => {
    expect(formatHoursLine(WEEKDAY_HOURS)).toBe(
      'Mon–Fri 8:00 AM – 5:00 PM · Sat–Sun Closed',
    );
    const withHours = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            hours: {
              value: WEEKDAY_HOURS,
              source: 'places.regularOpeningHours.weekdayDescriptions',
            },
          },
        })}
      />,
    );
    expect(withHours).toContain('class="hours"');
    expect(withHours).toContain('Mon–Fri 8:00 AM – 5:00 PM · Sat–Sun Closed');
    expect(withHours).toContain('id="contact"');

    const listed = [
      'Monday: 8:00 AM – 5:00 PM',
      'Tuesday: 9:00 AM – 5:00 PM',
      'Wednesday: 10:00 AM – 5:00 PM',
      'Thursday: 11:00 AM – 5:00 PM',
      'Friday: 12:00 PM – 5:00 PM',
      'Saturday: 9:00 AM – 1:00 PM',
      'Sunday: Closed',
    ];
    expect(formatHoursLine(listed)).toBe(listed.join(' · '));

    const noHours = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow()} />,
    );
    expect(noHours).not.toContain('class="hours"');
    expect(noHours).not.toContain('Mon–Fri 8:00 AM – 5:00 PM');

    const hoursOnly = renderToStaticMarkup(
      <TradesV1Template
        site={minimalRow({
          facts: {
            ...MINIMAL_FACTS,
            hours: {
              value: WEEKDAY_HOURS,
              source: 'places.regularOpeningHours.weekdayDescriptions',
            },
          },
        })}
      />,
    );
    expect(hoursOnly).toContain('class="info"');
    expect(hoursOnly).toContain('class="hours"');
    expect(hoursOnly).toContain('Mon–Fri 8:00 AM – 5:00 PM · Sat–Sun Closed');
  });

  it('malformed reviews are dropped so the section stays absent', () => {
    const html = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            reviews: [
              { value: 'not an object', source: 'places.reviews' },
              { value: { author: 'A', rating: 5 }, source: 'places.reviews' },
            ],
          },
        })}
      />,
    );
    expect(html).not.toContain('What customers say');
    expect(html).not.toContain('class="voice"');
  });
});

describe('trades_v1 full-site structure', () => {
  it('nav links render only for sections that exist; phone CTA stays', () => {
    const servicesOnly = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow()} />,
    );
    expect(servicesOnly).toContain('class="top-nav"');
    expect(servicesOnly).toContain('href="#services"');
    expect(servicesOnly).toContain('href="#contact"');
    expect(servicesOnly).not.toContain('href="#reviews"');
    expect(servicesOnly).toContain(`href="${ECLIPSE_TEL}"`);
    expect(servicesOnly).toMatch(/class="btn btn-primary"[^>]*>[\s\S]*Call/);

    const withReviews = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            reviews: [
              {
                value: { author: 'A', rating: 5, body: 'Solid work.' },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    expect(withReviews).toContain('href="#services"');
    expect(withReviews).toContain('href="#reviews"');
    expect(withReviews).toContain('href="#contact"');

    const blurbsOnlyFacts = { ...ECLIPSE_FACTS };
    delete (blurbsOnlyFacts as { services?: unknown }).services;
    const blurbsOnly = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: blurbsOnlyFacts })} />,
    );
    expect(blurbsOnly).not.toContain('is-spotlight');
    expect(blurbsOnly).not.toContain('href="#services"');
    expect(blurbsOnly).not.toContain('href="#reviews"');
    expect(blurbsOnly).toContain('href="#contact"');

    const bare = renderToStaticMarkup(<TradesV1Template site={minimalRow()} />);
    expect(bare).toContain('is-spotlight');
    expect(bare).not.toContain('class="top-nav"');
    expect(bare).not.toContain('href="#contact"');
  });

  it('area fallback line renders only when town exists and town_hits do not', () => {
    const chips = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(chips).toContain('class="town home"');
    expect(chips).not.toContain('class="area-fallback"');
    expect(chips).not.toContain(servingAreaLine('Morgantown'));

    const noHits = { ...ECLIPSE_FACTS };
    delete (noHits as { town_hits?: unknown }).town_hits;
    const fallback = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: noHits })} />,
    );
    expect(fallback).toContain('class="area-fallback"');
    expect(fallback).toContain(servingAreaLine('Morgantown'));
    expect(fallback).not.toContain('class="towns"');

    const neither = { ...noHits };
    delete (neither as { town?: unknown }).town;
    const absent = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: neither })} />,
    );
    expect(absent).not.toContain('class="area"');
    expect(absent).not.toContain('class="area-fallback"');
    expect(absent).not.toContain('Serving ');
  });

  it('contact band is the closer with an anchor target', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).toContain('id="contact"');
    expect(html).toContain('<section class="close" id="contact">');
    expect(html).toContain('Ready when your roof is.');
    expect(html).toContain('355 Brockway Ave, Morgantown, WV 26501');
    expect(html).toContain('Get directions →');
    expect(html.indexOf('id="about"')).toBeLessThan(html.indexOf('id="services"'));
    expect(html.indexOf('id="services"')).toBeLessThan(html.indexOf('id="area"'));
    expect(html.indexOf('id="area"')).toBeLessThan(html.indexOf('id="contact"'));
  });

  it('spotlight remains only when services, reviews, and blurbs are all absent', () => {
    const bare = renderToStaticMarkup(<TradesV1Template site={minimalRow()} />);
    expect(bare).toContain('is-spotlight');

    const withBlurbs = renderToStaticMarkup(
      <TradesV1Template
        site={minimalRow({ blurbs: ['We handle the small jobs.'] })}
      />,
    );
    expect(withBlurbs).not.toContain('is-spotlight');
    expect(withBlurbs).toContain(aboutHeading('Bare Shop'));

    const withReviews = renderToStaticMarkup(
      <TradesV1Template
        site={minimalRow({
          facts: {
            ...MINIMAL_FACTS,
            reviews: [
              {
                value: { author: 'A', rating: 5, body: 'Showed up.' },
                source: 'places.reviews',
              },
            ],
          },
        })}
      />,
    );
    expect(withReviews).not.toContain('is-spotlight');
    expect(withReviews).toContain('What customers say');

    const withServices = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ blurbs: null })} />,
    );
    expect(withServices).not.toContain('is-spotlight');
    expect(withServices).toContain('id="services"');
  });

  it('fallback service descriptions are unique, from the locked pool, and stable per slug', () => {
    const extracted = [
      'repair',
      'construction',
      'appointment',
      'warranty',
    ].map((value) => ({
      value,
      source: 'page_facts.service_vocab_hits',
    }));
    const site = eclipseRow({
      facts: { ...ECLIPSE_FACTS, services: extracted },
    });
    const html = renderToStaticMarkup(<TradesV1Template site={site} />);
    const html2 = renderToStaticMarkup(<TradesV1Template site={site} />);
    expect(html).toBe(html2);

    const bodies = [...html.matchAll(/<div class="card">[\s\S]*?<p>([^<]*)<\/p>/g)].map(
      (m) => m[1],
    );
    expect(bodies.length).toBe(4);
    expect(new Set(bodies).size).toBe(4);
    for (const body of bodies) {
      expect(SERVICE_FALLBACK_BODIES).toContain(body);
    }
    expect(html).not.toMatch(
      /Professional work, done right the first time\.[\s\S]*Professional work, done right the first time\./,
    );
  });

  it('services grid is full-width at 1, halves at 2, and the seeded variant at 3+', () => {
    const asServices = (labels: string[]) =>
      labels.map((value) => ({
        value,
        source: 'page_facts.service_vocab_hits',
      }));

    const one = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: { ...ECLIPSE_FACTS, services: asServices(['repair']) },
        })}
      />,
    );
    expect(one).toContain('class="cards cards-1"');
    expect(one).not.toContain('class="cards feature-first"');
    expect(one).not.toContain('class="cards uniform"');
    expect(one.match(/class="card"/g)?.length).toBe(1);
    expect(one).toContain('class="card-copy"');
    expect(one.indexOf('class="ico"')).toBeLessThan(one.indexOf('class="card-copy"'));

    const two = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            services: asServices(['repair', 'construction']),
          },
        })}
      />,
    );
    expect(two).toContain('class="cards cards-2"');
    expect(two).not.toContain('class="cards feature-first"');
    expect(two).not.toContain('class="cards uniform"');
    expect(two.match(/class="card"/g)?.length).toBe(2);

    const flags = layoutVariantFor('eclipse-construction');
    const three = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            services: asServices(['repair', 'construction', 'appointment']),
          },
        })}
      />,
    );
    expect(three).toContain(`class="cards ${flags.gridStyle}"`);
    expect(three).not.toContain('class="cards cards-1"');
    expect(three).not.toContain('class="cards cards-2"');
    expect(three.match(/class="card"/g)?.length).toBe(3);
  });

  it('area chips and the town fallback share the Service area eyebrow', () => {
    const chips = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(chips).toMatch(
      /<section class="area" id="area">[\s\S]*<div class="eyebrow">Service area<\/div>/,
    );

    const noHits = { ...ECLIPSE_FACTS };
    delete (noHits as { town_hits?: unknown }).town_hits;
    const fallback = renderToStaticMarkup(
      <TradesV1Template site={eclipseRow({ facts: noHits })} />,
    );
    expect(fallback).toMatch(
      /<section class="area" id="area">[\s\S]*<div class="eyebrow">Service area<\/div>[\s\S]*class="area-fallback"/,
    );
    expect(fallback).toContain(
      `<h2 class="area-fallback">${servingAreaLine('Morgantown')}</h2>`,
    );
  });
});

describe('trades_v1 hero motifs', () => {
  const MOTIF_CASES: [string, ReturnType<typeof motifFamilyFor>][] = [
    ['roofing', 'roofing'],
    ['general_contractor', 'gc'],
    ['excavation', 'gc'],
    ['hvac', 'hvac'],
    ['plumber', 'plumbing'],
    ['electrician', 'electric'],
    ['auto_repair', 'auto'],
    ['towing_service', 'towing'],
  ];

  it('renders the correct motif per trade key', () => {
    for (const [category, family] of MOTIF_CASES) {
      expect(motifFamilyFor(category)).toBe(family);
      const html = renderToStaticMarkup(
        <TradesV1Template
          site={eclipseRow({
            facts: { ...ECLIPSE_FACTS, category: { value: category, source: 'x' } },
          })}
        />,
      );
      expect(html).toContain(`data-motif="${family}"`);
    }
    const spotFacts = { ...ECLIPSE_FACTS };
    delete (spotFacts as { services?: unknown }).services;
    const spot = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({ facts: spotFacts, blurbs: null })}
      />,
    );
    expect(spot).toContain('is-spotlight');
    expect(spot).toContain('data-motif="roofing"');
  });

  it('renders the motif in ember, summit, and storm skins', () => {
    const ember = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(ember).toContain('data-skin="ember"');
    expect(ember).toContain('data-motif="roofing"');

    const summit = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            category: { value: 'hvac', source: 'x' },
          },
        })}
      />,
    );
    expect(summit).toContain('data-skin="summit"');
    expect(summit).toContain('data-motif="hvac"');

    const storm = renderToStaticMarkup(
      <TradesV1Template
        site={eclipseRow({
          facts: {
            ...ECLIPSE_FACTS,
            category: { value: 'electrician', source: 'x' },
          },
        })}
      />,
    );
    expect(storm).toContain('data-skin="storm"');
    expect(storm).toContain('data-motif="electric"');
  });

  it('hero motifs are inline SVGs with no images, external refs, or text', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    const block = html.match(
      /<div class="hero-motif"[^>]*>([\s\S]*?)<\/div>/,
    );
    expect(block).toBeTruthy();
    const svg = block![1];
    expect(svg).toMatch(/^<svg\b/);
    expect(svg).not.toMatch(/<img\b|<image\b|<use\b|<text\b|<title\b|<desc\b/i);
    expect(svg).not.toMatch(/href=|xlink:|url\(/i);
    expect(svg.replace(/<[^>]+>/g, '').trim()).toBe('');
    expect(html).not.toMatch(/<img\b/i);
  });
});

describe('template_key routing', () => {
  it('serves v0 rows as v0 and trades_v1 rows as trades_v1', () => {
    const v0 = renderToStaticMarkup(<DemoSiteView site={demoRow()} />);
    expect(v0).toContain('demo-v0');
    expect(v0).not.toContain('class="stickybar"');

    const trades = renderToStaticMarkup(
      <DemoSiteView site={eclipseRow({ template_key: 'trades_v1' })} />,
    );
    expect(trades).toContain('class="stickybar"');
    expect(trades).toContain('Ready when your roof is.');
    expect(trades).not.toContain('demo-v0');
  });

  it('unknown template_key falls back to v0', () => {
    const html = renderToStaticMarkup(
      <DemoSiteView site={demoRow({ template_key: 'not_a_template' })} />,
    );
    expect(html).toContain('demo-v0');
    expect(html).toContain('Acme HVAC');
    expect(html).not.toContain('class="stickybar"');
  });

  it('no <img> on either template', () => {
    const v0 = renderToStaticMarkup(<DemoSiteView site={demoRow()} />);
    const trades = renderToStaticMarkup(<DemoSiteView site={eclipseRow()} />);
    expect(v0).not.toMatch(/<img\b/i);
    expect(trades).not.toMatch(/<img\b/i);
  });
});
