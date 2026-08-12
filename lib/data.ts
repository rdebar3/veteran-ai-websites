import {
  Send,
  Phone,
  Zap,
  Eye,
  CreditCard,
  Globe,
} from 'lucide-react';

export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61590561850536';

export interface PricingTier {
  name: string;
  price: number;
  promoPrice?: number;
  promoActive?: boolean;
  promoLabel?: string;
  /** Short line under the price, e.g. "For a single-service business" */
  tagline?: string;
  popular?: boolean;
  features: string[];
  delivery: string;
  revisions: string;
}

export function getDisplayPrice(tier: PricingTier): number {
  if (tier.promoActive && tier.promoPrice != null) {
    return tier.promoPrice;
  }
  return tier.price;
}

/** Format a dollar amount for display (e.g. 1497 → "$1,497"). */
export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Essential',
    price: 997,
    popular: false,
    tagline: 'For a single-service business',
    delivery: 'Delivered in 1 day',
    revisions: '1 round of revisions',
    features: [
      'Up to 5 pages',
      'Contact form, tested and confirmed delivering',
      'Google Business Profile connected',
      'Mobile-first and accessibility-checked',
      '1 round of revisions',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Standard',
    price: 1497,
    popular: true,
    tagline: 'For a business with multiple services',
    delivery: 'Delivered in 1 day',
    revisions: '2 rounds of revisions',
    features: [
      'Up to 10 pages',
      'Service-area pages so you show up in nearby towns',
      'Photo gallery and review display',
      'Local business schema markup',
      'Contact and quote forms',
      '2 rounds of revisions',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Advanced',
    price: 2497,
    popular: false,
    tagline: 'For booking, multiple locations, or larger sites',
    delivery: 'Delivered in 1–2 days',
    revisions: '2 rounds of revisions',
    features: [
      'Online booking or quote request system',
      'Multi-location support',
      '15+ pages',
      'Custom forms and integrations',
      '2 rounds of revisions',
      'Delivered in 1–2 days',
    ],
  },
];

export const allPackagesInclude = [
  'Fully mobile responsive design',
  'Fast, secure hosting setup',
  '100% ownership of your website and files',
  'You own your site — always',
];

export interface AddOn {
  id: string;
  name: string;
  price: number;
  period: string;
  desc: string;
  features?: string[];
}

export const ONLINE_STORE_PRICE = 997;

/** Growth credit this amount off the one-time build at checkout. */
export const GROWTH_PRO_BUILD_CREDIT = 500;

export type CarePlanId = 'keys' | 'hosted' | 'growth' | 'pro';
/** Plans that can go through Stripe Checkout (Pro is consultation-only). */
export type CheckoutPlanId = 'keys' | 'hosted' | 'growth';

export interface CarePlan {
  id: CarePlanId;
  name: string;
  /** Monthly subscription in dollars (0 for Keys). Display only for Pro. */
  monthly: number;
  blurb: string;
  features: string[];
  /** Short price note under the card. */
  priceNote: string;
  /** When true, show cancel-anytime only as small print under the price note. */
  cancelAnytimeFinePrint?: boolean;
  popular?: boolean;
  /** Apply GROWTH_PRO_BUILD_CREDIT to the package build price at checkout. */
  buildCredit?: number;
  /** Not sold via Stripe — phone consultation only. */
  consultationOnly?: boolean;
}

export const carePlans: CarePlan[] = [
  {
    id: 'keys',
    name: 'Keys',
    monthly: 0,
    blurb: 'For businesses that just need a site and will handle the rest.',
    features: [
      'You own the site, the files, and your domain — permanently',
      'Hosting, backups, and renewals become yours to manage',
      '30 days of support after launch',
      'Changes after that billed at $95/hour',
    ],
    priceNote: 'Package price, one time',
  },
  {
    id: 'hosted',
    name: 'Hosted',
    monthly: 49,
    blurb: "For businesses that want it handled but don't need marketing.",
    features: [
      'Everything in Keys — you still own it all',
      'Hosting, SSL, daily backups, security patching',
      'Uptime monitoring',
      'Monthly test that your contact form is actually delivering',
      '1 content change per month included',
    ],
    priceNote: 'Package price + $49/mo, cancel anytime',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 297,
    popular: true,
    buildCredit: GROWTH_PRO_BUILD_CREDIT,
    blurb: 'For businesses that want the phone to ring.',
    features: [
      'You still own everything — cancel anytime and keep your site',
      'Your Google listing managed: posts, photos, hours, categories',
      'New reviews requested every month, and every review answered',
      'Missed calls get texted back automatically so you stop losing jobs',
      'Hosting, security, backups, and the monthly form-delivery test',
      '2 content changes per month included',
      'Monthly report: calls, reviews, and star rating',
    ],
    priceNote: 'Package price less $500, + $297/mo, no contract',
    cancelAnytimeFinePrint: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 497,
    consultationOnly: true,
    blurb: 'For businesses ready to stop missing calls entirely.',
    features: [
      'Everything in Growth',
      'AI phone answering and booking, 24 hours a day',
      '8 Google posts per month',
      '4 content changes per month included',
      'A new local service-area page every month',
      'Geo-grid ranking report',
    ],
    priceNote: 'By consultation — call (304) 591-3835',
  },
];

export function getCarePlan(id: CarePlanId): CarePlan {
  return carePlans.find((p) => p.id === id) ?? carePlans[0];
}

export function isCheckoutPlanId(v: unknown): v is CheckoutPlanId {
  return v === 'keys' || v === 'hosted' || v === 'growth';
}

/** One-time build total for a package + plan (+ optional store), in dollars. */
export function getBuildTotal(
  packagePrice: number,
  plan: CarePlan,
  storeSelected: boolean
): number {
  const credit = plan.buildCredit ?? 0;
  const build = Math.max(0, packagePrice - credit);
  return build + (storeSelected ? ONLINE_STORE_PRICE : 0);
}

export const addOnsList: AddOn[] = [
  {
    id: 'online-store',
    name: 'Online Store',
    price: ONLINE_STORE_PRICE,
    period: ' add-on',
    desc: 'Add a product store to any package.',
    features: [
      'Up to 25 products',
      'Secure checkout',
      'Tax and shipping configured',
    ],
  },
];

export const howItWorksSteps = [
  {
    number: '1',
    icon: Send,
    title: 'Submit Your Order',
    desc: 'Choose your package and add-ons on this website and submit your request with basic business info.',
  },
  {
    number: '2',
    icon: Phone,
    title: 'Consultation Call',
    desc: 'We’ll schedule a quick 15-minute call to discuss your goals and details.',
  },
  {
    number: '3',
    icon: Zap,
    title: 'We Build Your Site',
    desc: 'We deliver your professional website the same day when the scope allows, or within 1–2 days for larger Advanced builds.',
  },
  {
    number: '4',
    icon: Eye,
    title: 'Review & Feedback',
    desc: 'You review the preview and request any included revisions.',
  },
  {
    number: '5',
    icon: CreditCard,
    title: 'Approve & Pay',
    desc: 'Once you’re happy, complete payment securely on our site.',
  },
  {
    number: '6',
    icon: Globe,
    title: 'Launch & Handoff',
    desc: 'We deploy your live site, do a final check, and hand over full ownership.',
  },
];
