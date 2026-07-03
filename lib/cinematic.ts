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
    eyebrow: 'Mission Planning · ' + landmarks.newRiverGorge.name,
    title: 'Submit Your Order',
    body: 'From the gorge planning deck, choose your package and send your details. We respond within 24 hours with a clear scope.',
    image: landmarks.newRiverGorge.image,
    imageAlt: landmarks.newRiverGorge.imageAlt,
    landmark: landmarks.newRiverGorge.name,
    outpost: 'Mission Planning Center',
    roomAccent: '/rooms/mission-planning.jpg',
  },
  {
    index: '02',
    eyebrow: 'Command Center · ' + landmarks.senecaRocks.name,
    title: 'Crafted Same Day',
    body: 'Through panoramic command windows facing Seneca Rocks, we build your premium site with mobile-first precision — delivered same day.',
    image: landmarks.senecaRocks.image,
    imageAlt: landmarks.senecaRocks.imageAlt,
    landmark: landmarks.senecaRocks.name,
    outpost: 'Command Center',
    roomAccent: '/rooms/command-center.jpg',
  },
  {
    index: '03',
    eyebrow: 'Summit Launch · ' + landmarks.spruceKnob.name,
    title: 'Approve & Own',
    body: 'From Spruce Knob summit control, review your site, approve the design, pay securely, and launch with 100% ownership.',
    image: landmarks.spruceKnob.image,
    imageAlt: landmarks.spruceKnob.imageAlt,
    landmark: landmarks.spruceKnob.name,
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
    image: landmarks.newRiverGorge.image,
    landmark: landmarks.newRiverGorge.name,
    features: ['Professional hero', 'Services + about', 'Contact form', 'Mobile-optimized'],
  },
  {
    tier: 'Complete',
    pages: '5 Pages',
    title: 'Complete Demo',
    desc: 'Multi-page website with home, about, services, gallery, and contact.',
    href: '/examples/complete-hvac',
    image: landmarks.senecaRocks.image,
    landmark: landmarks.senecaRocks.name,
    features: ['5 designed pages', 'Inquiry forms', 'Google Business', 'SEO-ready'],
  },
  {
    tier: 'Premium',
    pages: '7 Pages',
    title: 'Premium Demo',
    desc: 'Advanced 7-page site with portfolio, location details, FAQ, and premium design.',
    href: '/examples/premium-restaurant',
    image: landmarks.wvCapitol.image,
    landmark: landmarks.wvCapitol.name,
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