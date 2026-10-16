import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteChrome from '@/components/SiteChrome';
import SmoothScroll from '@/components/SmoothScroll';
import {
  CONTACT_PHONE,
  GOOGLE_LISTING_URL,
  MAILING_ADDRESS,
  mailingAddressFields,
} from '@/lib/contact';
import { SITE } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const META_TITLE =
  'Veteran AI Websites | Websites for West Virginia Small Businesses';

const META_DESCRIPTION =
  'Veteran-owned web design in West Virginia. Professional websites built in a day for small businesses. Nothing down, nothing until you’ve seen it. No contract. After 12 payments the site is yours.';

/**
 * LocalBusiness + ProfessionalService JSON-LD.
 * Rendered in <head> of the root Server Component layout so it is present in
 * the initial HTML — not deferred via a client component.
 */
const mailing = mailingAddressFields(MAILING_ADDRESS);

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE}/#business`,
  name: 'Veteran AI Websites',
  url: SITE,
  // Prefer owner photo when present; OG poster is the reliable public image today.
  image: [
    `${SITE}/hero/hero-gorge-poster.jpg`,
    `${SITE}/logo-mark.svg`,
  ],
  logo: `${SITE}/logo-mark.svg`,
  description: META_DESCRIPTION,
  priceRange: '$$',
  sameAs: [GOOGLE_LISTING_URL],
  ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'WV',
    addressCountry: 'US',
    ...(mailing?.streetAddress ? { streetAddress: mailing.streetAddress } : {}),
    ...(mailing?.postalCode ? { postalCode: mailing.postalCode } : {}),
  },
  areaServed: {
    '@type': 'State',
    name: 'West Virginia',
  },
  knowsAbout: [
    'Web design',
    'Small business websites',
    'Local SEO',
    'Google Business Profile',
    'One-day websites',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: META_TITLE,
  description: META_DESCRIPTION,
  keywords: [
    'West Virginia web design',
    'veteran owned web designer',
    'West Virginia small business web design',
    'small business website West Virginia',
    'one day website',
    'Google listing management WV',
  ],
  applicationName: 'Veteran AI Websites',
  authors: [{ name: 'Veteran AI Websites' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE,
    siteName: 'Veteran AI Websites',
    title: META_TITLE,
    description: META_DESCRIPTION,
    locale: 'en_US',
    images: [
      {
        url: '/hero/hero-gorge-poster.jpg',
        width: 1440,
        height: 942,
        alt: 'Veteran AI Websites — West Virginia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: META_TITLE,
    description: META_DESCRIPTION,
    images: ['/hero/hero-gorge-poster.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        {/* Phase 8b — LocalBusiness JSON-LD in <head>, server-rendered */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Phase 10 — first focusable element */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <SiteChrome>
            <Navbar />
          </SiteChrome>
          {children}
          <SiteChrome>
            <Footer />
          </SiteChrome>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
