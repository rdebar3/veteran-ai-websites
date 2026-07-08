import { showcaseDemos } from '@/lib/cinematic';
import { pricingTiers, getDisplayPrice } from '@/lib/data';
import { testimonials } from '@/lib/testimonials';

export type BriefingOverlay = 'patriotic' | 'neural' | 'circuit' | 'none';
export type BriefingLayout =
  | 'intro'
  | 'command'
  | 'arsenal'
  | 'demos'
  | 'testimonials'
  | 'pricing'
  | 'enlist';

export interface BriefingChapter {
  index: string;
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  landmark: string;
  outpost: string;
  roomAccent?: string;
  overlay: BriefingOverlay;
  layout: BriefingLayout;
  ctaLabel?: string;
  /** Internal chapter jump target (0-based) or external href */
  ctaChapter?: number;
  ctaHref?: string;
}

/** Mission Briefing Deck — 7 fully populated chapters. */
export const briefingChapters: BriefingChapter[] = [
  {
    index: '01',
    id: 'dawn',
    eyebrow: 'Sector Alpha · Appalachian Dawn',
    title: 'West Virginia. Mission start.',
    body: 'Dawn breaks over the Alleghenies. The flag holds the ridge. From this overlook, every website launch is planned with veteran discipline — clear scope, same-day craft, full ownership.',
    image: '/briefing/dawn-flag.jpg',
    imageAlt: 'West Virginia mountains at dawn with American flag on the overlook',
    landmark: 'Appalachian Dawn',
    outpost: 'Ridge Flag Station',
    roomAccent: '/rooms/observation-deck.jpg',
    overlay: 'patriotic',
    layout: 'intro',
    ctaLabel: 'Enter the base',
    ctaChapter: 1,
  },
  {
    index: '02',
    id: 'command',
    eyebrow: 'Command Base · One veteran',
    title: 'You work with the person doing the work.',
    body: 'No offshore ticket queue. No account managers. Starlink overhead, AI on the desk, the flag on the wall — direct communication with a U.S. veteran who treats your site like a deployment: planned, executed, delivered on time.',
    image: '/briefing/command-base.jpg',
    imageAlt: 'Command base interior with AI workstation, flag, and forest view',
    landmark: 'Command Base',
    outpost: 'Ops Chamber · Live Feed',
    roomAccent: '/rooms/command-center.jpg',
    overlay: 'circuit',
    layout: 'command',
    ctaLabel: 'See the AI arsenal',
    ctaChapter: 2,
  },
  {
    index: '03',
    id: 'arsenal',
    eyebrow: 'AI Arsenal · One-day delivery',
    title: 'Speed without cutting corners.',
    body: 'AI-assisted craft + veteran process = same-day Starter & Complete sites (Premium 1–2 days priority). Mobile-first layouts, forms, SEO foundations, and clear scopes — more calls, more orders, more trust.',
    image: '/briefing/ai-circuits.jpg',
    imageAlt: 'AI neural circuits fused with business growth charts',
    landmark: 'Neural Ops Grid',
    outpost: 'AI Fusion Deck',
    roomAccent: '/rooms/mission-planning.jpg',
    overlay: 'neural',
    layout: 'arsenal',
    ctaLabel: 'Inspect live demos',
    ctaChapter: 3,
  },
  {
    index: '04',
    id: 'demos',
    eyebrow: 'Observation Deck · Live intel',
    title: 'Three packages. Three live sites.',
    body: 'Click through real demos before you order — Starter plumbing, Complete HVAC, Premium fine dining.',
    image: '/mountains/golden-overlook.jpg',
    imageAlt: 'Golden hour overlook across West Virginia mountains',
    landmark: 'Observation Deck',
    outpost: 'Demo Array',
    roomAccent: '/rooms/observation-deck.jpg',
    overlay: 'circuit',
    layout: 'demos',
    ctaLabel: 'Victory reports',
    ctaChapter: 4,
  },
  {
    index: '05',
    id: 'victory',
    eyebrow: 'Victory Reports · Field proof',
    title: 'Trusted by local businesses.',
    body: 'Real West Virginia owners. Same-day delivery, fair scopes, full ownership — no runaround.',
    image: '/briefing/victory-montage.jpg',
    imageAlt: 'Celebratory small-business storefront with website launch glow',
    landmark: 'Victory Sector',
    outpost: 'After Action Lounge',
    roomAccent: '/rooms/after-action-lounge.jpg',
    overlay: 'patriotic',
    layout: 'testimonials',
    ctaLabel: 'Open the armoury',
    ctaChapter: 5,
  },
  {
    index: '06',
    id: 'pricing',
    eyebrow: 'The Armoury · Clear prices',
    title: 'Equip your package.',
    body: 'Limited-time $397 Starter · Complete $697 · Premium $997. Optional upgrades. You own everything.',
    image: '/landmarks/spruce-knob.jpg',
    imageAlt: 'Spruce Knob summit overlooking the Allegheny Mountains',
    landmark: 'The Armoury',
    outpost: 'Supply Bay',
    roomAccent: '/rooms/armoury.jpg',
    overlay: 'circuit',
    layout: 'pricing',
    ctaLabel: 'Enlist now',
    ctaChapter: 6,
  },
  {
    index: '07',
    id: 'build',
    eyebrow: 'Enlist Now · Extraction',
    title: 'Build mine now.',
    body: 'Submit your order request — no payment today. Pay only after you approve the final design. Stripe checkout available after submit.',
    image: '/briefing/launch-summit.jpg',
    imageAlt: 'Mountain summit night launch with glowing mission dashboard',
    landmark: 'Summit Launch',
    outpost: 'Extraction Point',
    roomAccent: '/rooms/debrief.jpg',
    overlay: 'patriotic',
    layout: 'enlist',
  },
];

export const briefingDemos = showcaseDemos;
export const briefingTestimonials = testimonials;

export const briefingPricingSummary = pricingTiers.map((tier) => ({
  name: tier.name,
  price: getDisplayPrice(tier),
  listPrice: tier.price,
  promo: Boolean(tier.promoActive && tier.promoPrice != null),
  delivery: tier.delivery,
  popular: Boolean(tier.popular),
  features: tier.features,
  promoPrice: tier.promoPrice,
  promoActive: tier.promoActive,
  revisions: tier.revisions,
}));
