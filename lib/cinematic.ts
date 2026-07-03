import { landmarks } from '@/lib/landmarks';

export interface CinematicChapter {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  landmark: string;
  outpost: string;
  roomAccent?: string;
}

export const storyChapters: CinematicChapter[] = [
  {
    index: '01',
    eyebrow: landmarks.newRiverGorge.outpost,
    title: 'New River Gorge',
    body: 'From our secure gorge overlook, the longest steel-arch bridge in the Americas frames every build — veteran discipline rooted in West Virginia stone and sky.',
    image: landmarks.newRiverGorge.image,
    imageAlt: landmarks.newRiverGorge.imageAlt,
    landmark: landmarks.newRiverGorge.name,
    outpost: landmarks.newRiverGorge.outpost,
    roomAccent: landmarks.newRiverGorge.roomAccent,
  },
  {
    index: '02',
    eyebrow: landmarks.senecaRocks.outpost,
    title: 'Seneca Rocks',
    body: 'Inside the ridge command outpost, curved windows reveal Seneca’s iconic fins — where U.S. veteran precision meets modern AI web craft.',
    image: landmarks.senecaRocks.image,
    imageAlt: landmarks.senecaRocks.imageAlt,
    landmark: landmarks.senecaRocks.name,
    outpost: landmarks.senecaRocks.outpost,
    roomAccent: landmarks.senecaRocks.roomAccent,
  },
  {
    index: '03',
    eyebrow: landmarks.spruceKnob.outpost,
    title: 'Spruce Knob Summit',
    body: 'At West Virginia’s highest point, our summit watch tower oversees every deployment — one-day delivery from the top of the Alleghenies.',
    image: landmarks.spruceKnob.image,
    imageAlt: landmarks.spruceKnob.imageAlt,
    landmark: landmarks.spruceKnob.name,
    outpost: landmarks.spruceKnob.outpost,
    roomAccent: landmarks.spruceKnob.roomAccent,
  },
  {
    index: '04',
    eyebrow: landmarks.wvCapitol.outpost,
    title: 'Charleston Capitol',
    body: 'The gold-domed Capitol on the Kanawha River anchors our state-sector HQ — serving WV businesses with clear scopes and full ownership.',
    image: landmarks.wvCapitol.image,
    imageAlt: landmarks.wvCapitol.imageAlt,
    landmark: landmarks.wvCapitol.name,
    outpost: landmarks.wvCapitol.outpost,
    roomAccent: landmarks.wvCapitol.roomAccent,
  },
  {
    index: '05',
    eyebrow: landmarks.appalachianRidges.outpost,
    title: 'Appalachian Ridges',
    body: 'Miles of Allegheny ridgelines stretch beyond the perimeter base — the same mountain grit we bring to every website we launch.',
    image: landmarks.appalachianRidges.image,
    imageAlt: landmarks.appalachianRidges.imageAlt,
    landmark: landmarks.appalachianRidges.name,
    outpost: landmarks.appalachianRidges.outpost,
    roomAccent: landmarks.appalachianRidges.roomAccent,
  },
];

export const processChapters: CinematicChapter[] = [
  {
    index: '01',
    eyebrow: 'Mission Planning · Misty Ridges',
    title: 'Submit Your Order',
    body: 'From the ridge planning deck, choose your package and send your details. We respond within 24 hours with a clear scope.',
    image: '/mountains/misty-ridges.jpg',
    imageAlt: 'Misty Appalachian ridges of West Virginia',
    landmark: 'Misty Appalachian Ridges',
    outpost: 'Mission Planning Center',
    roomAccent: '/rooms/mission-planning.jpg',
  },
  {
    index: '02',
    eyebrow: 'Command Center · Golden Overlook',
    title: 'Crafted Same Day',
    body: 'Through panoramic command windows at golden hour, we build your premium site with mobile-first precision — delivered same day.',
    image: '/mountains/golden-overlook.jpg',
    imageAlt: 'Golden hour overlook across West Virginia mountains',
    landmark: 'Golden Hour Overlook',
    outpost: 'Command Center',
    roomAccent: '/rooms/command-center.jpg',
  },
  {
    index: '03',
    eyebrow: 'Summit Launch · Monongahela Forest',
    title: 'Approve & Own',
    body: 'From the forest perimeter launch bay, review your site, approve the design, pay securely, and launch with 100% ownership.',
    image: '/landmarks/monongahela-forest.jpg',
    imageAlt: 'Monongahela National Forest in West Virginia',
    landmark: 'Monongahela National Forest',
    outpost: 'Launch Control',
    roomAccent: '/rooms/observation-deck.jpg',
  },
];

export interface ShowcaseDemo {
  tier: string;
  pages: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  imageAlt: string;
  imageFocus: string;
  landmark: string;
  features: string[];
}

export const showcaseDemos: ShowcaseDemo[] = [
  {
    tier: 'Starter',
    pages: '1 Page',
    title: 'Starter Demo',
    desc: 'Clean single-page site with hero, services, testimonials, and contact form.',
    href: '/examples/starter-plumbing',
    image: '/demos/starter-plumbing-hero.jpg',
    imageAlt: 'Ridgeview Plumbing demo — professional plumber at work',
    imageFocus: 'center 42%',
    landmark: 'Ridgeview Plumbing',
    features: ['Professional hero', 'Services + about', 'Contact form', 'Mobile-optimized'],
  },
  {
    tier: 'Complete',
    pages: '5 Pages',
    title: 'Complete Demo',
    desc: 'Multi-page website with home, about, services, gallery, and contact.',
    href: '/examples/complete-hvac',
    image: '/demos/complete-hvac-hero.jpg',
    imageAlt: 'Appalachian HVAC demo — technician servicing an outdoor unit',
    imageFocus: 'center 36%',
    landmark: 'Appalachian HVAC',
    features: ['5 designed pages', 'Inquiry forms', 'Google Business', 'SEO-ready'],
  },
  {
    tier: 'Premium',
    pages: '7 Pages',
    title: 'Premium Demo',
    desc: 'Advanced 7-page site with portfolio, location details, FAQ, and premium design.',
    href: '/examples/premium-restaurant',
    image: '/demos/premium-restaurant-hero.jpg',
    imageAlt: 'Mountain View Grill demo — warm restaurant dining room',
    imageFocus: 'center 48%',
    landmark: 'Mountain View Grill',
    features: ['7 custom pages', 'Advanced branding', 'Portfolio sections', 'Priority polish'],
  },
];

export const marqueeItems = [
  'New River Gorge Bridge',
  'Seneca Rocks',
  'Spruce Knob',
  'WV Capitol · Charleston',
  'U.S. Veteran Owned',
  'One-Day Delivery',
  '$397 Starter Offer',
  '100% Ownership',
];