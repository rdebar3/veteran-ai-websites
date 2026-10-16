import { createElement } from 'react';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Footer from '../components/Footer';
import LetsTalk from '../components/LetsTalk';
import Software from '../components/Software';
import VideoHero, { heroShowsVideo } from '../components/VideoHero';
import robots from '../app/robots';
import sitemap from '../app/sitemap';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  GOOGLE_LISTING_URL,
  MAILING_ADDRESS,
  contactPhoneHref,
  mailingAddressFields,
  publicContactLines,
} from './contact';
import { GOOGLE_LISTING_LINE, KEEP_RUNNING_MONTHLY, PAY_ONCE_LINE, pricingTiers } from './data';
import { SITE } from './site';

const SOFTWARE_PARAGRAPH =
  "Free 20-minute business software review on every call. I look at how you schedule jobs, track customers and send invoices, and tell you whether a simple tool is worth building. If it isn't, I'll say so.";

const BANNED = ['$497', '$797', '$997', '20 products', '$29'] as const;

function read(rel: string): string {
  return readFileSync(path.join(process.cwd(), rel), 'utf8');
}

describe('public site copy', () => {
  it('uses the software paragraph, the plan-card line, $39, and the call line', () => {
    expect(read('components/Software.tsx')).toContain(SOFTWARE_PARAGRAPH);
    expect(read('components/Software.tsx')).toContain('Small software for your shop.');
    expect(read('components/Software.tsx')).toContain('Book a software review');
    expect(read('components/Software.tsx')).toContain('topic=${SOFTWARE_REVIEW_TOPIC}');
    expect(PAY_ONCE_LINE).toBe('Want to own it outright? Ask me on the call.');
    expect(GOOGLE_LISTING_LINE).toBe('Google listing check and clean-up included');
    for (const tier of pricingTiers) {
      expect(tier.features.at(-1)).toBe(GOOGLE_LISTING_LINE);
    }
    expect(pricingTiers.find((tier) => tier.name === 'Complete')?.features).toContain(
      'Google Business integration',
    );
    expect(KEEP_RUNNING_MONTHLY).toBe(39);
    expect(read('lib/content-sections.ts')).toContain('$39 a month');
    expect(read('app/terms/page.tsx')).toContain('$39 a month');
    expect(read('app/terms/page.tsx')).toContain(
      'A pay-once option is available on request; the price is quoted on the call and stated in your approval.',
    );
  });

  it('drops the old pay-once prices, the store line, and $29', () => {
    const componentDir = path.join(process.cwd(), 'components');
    const files = [
      'lib/data.ts',
      'lib/content-sections.ts',
      'app/terms/page.tsx',
      ...readdirSync(componentDir)
        .filter((name) => name.endsWith('.tsx'))
        .map((name) => path.join('components', name)),
    ];
    for (const rel of files) {
      const text = read(rel);
      for (const needle of BANNED) {
        expect(text.includes(needle), `${rel} still contains ${needle}`).toBe(false);
      }
    }
  });

  it('serves canonical, robots, and sitemap on www', () => {
    expect(SITE).toBe('https://www.veteranaiwebsites.com');
    expect(robots().sitemap).toBe(`${SITE}/sitemap.xml`);
    expect(robots().host).toBe(SITE);
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE}`);
    expect(urls.every((url) => url === SITE || url.startsWith(`${SITE}/`))).toBe(true);
    for (const rel of ['app/layout.tsx', 'app/robots.ts', 'app/sitemap.ts']) {
      expect(read(rel)).not.toContain('https://veteranaiwebsites.com');
    }
    const layout = read('app/layout.tsx');
    expect(layout).toContain('metadataBase: new URL(SITE)');
    expect(layout).toContain('sameAs: [GOOGLE_LISTING_URL]');
    expect(layout).toContain('CONTACT_PHONE ? { telephone: CONTACT_PHONE }');
    expect(layout).toContain('mailing?.streetAddress');
    expect(layout).toContain('mailing?.postalCode');
  });
});

describe('contact lines', () => {
  it('renders nothing while the constants are empty', () => {
    expect(CONTACT_EMAIL).toBe('');
    expect(CONTACT_PHONE).toBe('');
    expect(CONTACT_PHONE_HREF).toBe('');
    expect(MAILING_ADDRESS).toBe('');
    expect(
      publicContactLines({
        phone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        address: MAILING_ADDRESS,
      }),
    ).toEqual([]);
    expect(mailingAddressFields(MAILING_ADDRESS)).toBeNull();

    const footer = renderToStaticMarkup(createElement(Footer));
    expect(footer).toContain('Serving Weston and 34 towns in north-central West Virginia.');
    expect(footer).toContain('Find us on Google');
    expect(footer).toContain(GOOGLE_LISTING_URL);
    expect(footer).toContain('rel="noopener"');
    expect(footer).toContain('target="_blank"');
    expect(footer).not.toContain('tel:');
    expect(footer).not.toContain('mailto:');

    const talk = renderToStaticMarkup(createElement(LetsTalk));
    expect(talk).not.toContain('Or email me:');
    expect(talk).not.toContain('Or call:');
    expect(talk).not.toContain('mailto:');
    expect(talk).not.toContain('tel:');

    const software = renderToStaticMarkup(createElement(Software)).replace(/&#x27;/g, "'");
    expect(software).toContain(SOFTWARE_PARAGRAPH);
    expect(software).toContain('href="https://app.veteranaiwebsites.com/book?topic=software-review"');
  });

  it('renders a tel href with digits only when a phone is set', () => {
    const display = '(304) 555-0100';
    expect(contactPhoneHref(display)).toBe('tel:+13045550100');
    expect(contactPhoneHref('')).toBe('');
    expect(contactPhoneHref('   ')).toBe('');

    const lines = publicContactLines({
      phone: display,
      email: 'hello@veteranaiwebsites.com',
      address: 'PO Box 123, Weston, WV 26452',
    });
    expect(lines.map((line) => line.kind)).toEqual(['phone', 'email', 'address']);
    const phone = lines[0];
    if (!phone || phone.kind !== 'phone') {
      throw new Error('expected a phone line');
    }
    expect(phone.href).toMatch(/^tel:\+1\d+$/);
    const html = renderToStaticMarkup(
      createElement('a', { href: phone.href }, `Call me: ${phone.text}`),
    );
    expect(html).toBe('<a href="tel:+13045550100">Call me: (304) 555-0100</a>');

    const address = mailingAddressFields('PO Box 123, Weston, WV 26452');
    expect(address).toEqual({ streetAddress: 'PO Box 123', postalCode: '26452' });
  });

  it('keeps the phone hero on the poster and off the mobile video', () => {
    const hero = renderToStaticMarkup(createElement(VideoHero));
    expect(hero).toContain('alt="West Virginia mill in autumn"');
    expect(hero).not.toContain('hero-gorge-mobile');
    expect(hero).not.toContain('<video');
    expect(heroShowsVideo(true, false)).toBe(false);
    expect(heroShowsVideo(false, true)).toBe(false);
    expect(heroShowsVideo(false, false)).toBe(true);
    const source = read('components/VideoHero.tsx');
    expect(source).not.toContain('hero-gorge-mobile');
    expect(source).toContain('showVideo ? (');
    expect(source).toContain('src={VIDEO}');
    expect(source).toContain('min-height:100svh');
    expect(source).toContain('object-fit:cover');
    expect(source).toContain('West Virginia mill in autumn');
    expect(source).toContain('aria-hidden="true"');
    expect(source).not.toContain('<h1');
  });
});
