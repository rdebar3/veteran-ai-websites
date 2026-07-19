import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/monti', '/monti/'],
    },
    sitemap: 'https://veteranaiwebsites.com/sitemap.xml',
    host: 'https://veteranaiwebsites.com',
  };
}
