export interface CinematicChapter {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
}

export const storyChapters: CinematicChapter[] = [
  {
    index: '01',
    eyebrow: 'West Virginia',
    title: 'Rooted in the Mountains',
    body: 'Proudly veteran-owned and based in West Virginia — where discipline, honesty, and craftsmanship still mean something.',
    image: '/mountains/hero-vista.webp',
    imageAlt: 'West Virginia mountain vista at dawn',
  },
  {
    index: '02',
    eyebrow: 'Veteran Owned',
    title: 'Built on Service',
    body: 'U.S. military precision meets modern web craft. Clear scopes, no upselling, and work you can trust.',
    image: '/natural-beauty-in-west-virginia.webp',
    imageAlt: 'Natural beauty of West Virginia landscape',
  },
  {
    index: '03',
    eyebrow: 'AI-Powered',
    title: 'Future-Ready Craft',
    body: 'AI-accelerated design systems deliver agency-level polish at small-business speed — without the agency price tag.',
    image: '/grok-image-57016dc4-4380-4115-b409-da347c40d452.jpg',
    imageAlt: 'Futuristic technology visual',
  },
  {
    index: '04',
    eyebrow: 'One Day',
    title: 'Live Tomorrow',
    body: 'Professional websites delivered in one day. You review, approve, and own everything — 100%.',
    image: '/mountains/golden-overlook.jpg',
    imageAlt: 'Golden light over mountain overlook',
  },
];

export const processChapters: CinematicChapter[] = [
  {
    index: '01',
    eyebrow: 'Order',
    title: 'Submit in Minutes',
    body: 'Choose your package, add upgrades, and send your business details. We respond within 24 hours.',
    image: '/rooms/mission-planning.jpg',
    imageAlt: 'Mission planning workspace',
  },
  {
    index: '02',
    eyebrow: 'Build',
    title: 'Crafted Same Day',
    body: 'We design and build your premium site with mobile-first precision — most projects delivered the same day.',
    image: '/rooms/command-center.jpg',
    imageAlt: 'Command center workspace',
  },
  {
    index: '03',
    eyebrow: 'Launch',
    title: 'Approve & Own',
    body: 'Review your site, request included revisions, pay only after approval, then launch with full ownership.',
    image: '/mountains/summit.jpg',
    imageAlt: 'Mountain summit at sunrise',
  },
];

export interface ShowcaseDemo {
  tier: string;
  pages: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  features: string[];
}

export const showcaseDemos: ShowcaseDemo[] = [
  {
    tier: 'Starter',
    pages: '1 Page',
    title: 'Starter Demo',
    desc: 'Clean single-page site with hero, services, testimonials, and contact form.',
    href: '/examples/starter-plumbing',
    image: '/mountains/foothills.jpg',
    features: ['Professional hero', 'Services + about', 'Contact form', 'Mobile-optimized'],
  },
  {
    tier: 'Complete',
    pages: '5 Pages',
    title: 'Complete Demo',
    desc: 'Multi-page website with home, about, services, gallery, and contact.',
    href: '/examples/complete-hvac',
    image: '/mountains/misty-ridges.jpg',
    features: ['5 designed pages', 'Inquiry forms', 'Google Business', 'SEO-ready'],
  },
  {
    tier: 'Premium',
    pages: '7 Pages',
    title: 'Premium Demo',
    desc: 'Advanced 7-page site with portfolio, location details, FAQ, and premium design.',
    href: '/examples/premium-restaurant',
    image: '/grok-image-36c452ca-b5ac-4917-aa9d-98dbbe558a6d.jpg',
    features: ['7 custom pages', 'Advanced branding', 'Portfolio sections', 'Priority polish'],
  },
];

export const marqueeItems = [
  'U.S. Veteran Owned',
  'West Virginia',
  'One-Day Delivery',
  '$397 Starter Offer',
  '100% Ownership',
  'AI-Powered Craft',
  'No Hidden Fees',
  'Pay After Approval',
];