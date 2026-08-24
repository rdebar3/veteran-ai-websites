import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import nextConfig from '@/next.config';
import { DEMO_ROBOTS_DISALLOW, DEMO_X_ROBOTS_TAG } from './copy';
import { DEMO_NOINDEX_HEADERS } from './headers';

describe('demo noindex ×3', () => {
  it('robots.txt Disallow: /d/', () => {
    const rules = robots().rules;
    const list = Array.isArray(rules) ? rules : [rules];
    const disallows = list.flatMap((rule) => {
      const value = rule.disallow;
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    });
    expect(disallows).toContain(DEMO_ROBOTS_DISALLOW);
  });

  it('X-Robots-Tag header on /d/*', async () => {
    const headersFn = nextConfig.headers;
    expect(headersFn).toBeTypeOf('function');
    const headers = headersFn ? await headersFn() : [];
    const match = headers.find((entry) => entry.source === '/d/:path*');
    expect(match).toBeTruthy();
    expect(match?.headers).toEqual(
      expect.arrayContaining([
        { key: 'X-Robots-Tag', value: DEMO_X_ROBOTS_TAG },
      ]),
    );
    expect(DEMO_NOINDEX_HEADERS[0]?.source).toBe('/d/:path*');
  });

  it('sitemap does not list /d/', () => {
    const entries = sitemap();
    expect(entries.some((entry) => entry.url.includes('/d/'))).toBe(false);
  });
});
