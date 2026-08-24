import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HONEST_STRIP, HONEST_STRIP_LINK_TEXT } from './copy';
import { ExpiredDemo } from './expired';
import { demoRow } from './fixtures';
import { V0Template } from './v0-template';

describe('v0 template (plumbing)', () => {
  it('renders name, town, tel, rating, copy, hours, honest strip; no photos', () => {
    const html = renderToStaticMarkup(<V0Template site={demoRow()} />);
    expect(html).toContain('Acme HVAC');
    expect(html).toContain('Weston');
    expect(html).toContain('href="tel:+13042691234"');
    expect(html).toContain('(304) 269-1234');
    expect(html).toContain('4.8');
    expect(html).toContain('42 reviews');
    expect(html).toContain('Acme HVAC in Weston');
    expect(html).toContain('Furnace work in Weston');
    expect(html).toContain('Mon–Fri 8am–5pm');
    expect(html).toContain(HONEST_STRIP_LINK_TEXT);
    expect(html.replace(/<[^>]+>/g, '')).toContain(HONEST_STRIP);
    expect(html).toContain('href="/"');
    expect(html).not.toMatch(/<img\b/i);
  });

  it('omits rating, hours, and call when facts are absent', () => {
    const html = renderToStaticMarkup(
      <V0Template
        site={demoRow({
          facts: { name: { value: 'Bare Shop', source: 'businesses.name' } },
          hero_line: null,
          blurbs: null,
        })}
      />,
    );
    expect(html).toContain('Bare Shop');
    expect(html).not.toContain('tel:');
    expect(html).not.toContain('reviews');
    expect(html).not.toContain('Mon–Fri');
    expect(html).toContain(HONEST_STRIP_LINK_TEXT);
  });

  it('expired page has the heading and a contact CTA', () => {
    const html = renderToStaticMarkup(<ExpiredDemo />);
    expect(html).toContain('This sample has expired');
    expect(html).toContain('href="/#contact"');
    expect(html).toContain('Get in touch');
    expect(html).toContain('tel:');
  });
});
