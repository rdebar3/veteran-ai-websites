import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HONEST_STRIP, HONEST_STRIP_LINK_TEXT } from './copy';
import { eclipseRow, minimalRow, demoRow } from './fixtures';
import { DemoSiteView } from './render';
import { TradesV1Template } from './trades-v1-template';

const ECLIPSE_TEL = 'tel:+13042443334';
const ECLIPSE_SMS = 'sms:+13042443334';
const ECLIPSE_MAPS = 'https://maps.google.com/?cid=8348910066556641243';

describe('trades_v1 template', () => {
  it('Eclipse-shaped full fixture renders every section', () => {
    const html = renderToStaticMarkup(<TradesV1Template site={eclipseRow()} />);
    expect(html).toContain('Eclipse Construction');
    expect(html).toContain('Morgantown, West Virginia');
    expect(html).toContain('Your roof, handled right');
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
    expect(html).toContain('class="hero"');
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
