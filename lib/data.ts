export interface PricingTier {
  name: string;
  /** Monthly price in dollars. */
  price: number;
  promoPrice?: number;
  promoActive?: boolean;
  promoLabel?: string;
  popular?: boolean;
  features: string[];
  delivery: string;
  revisions: string;
}

export type PlanName = 'Starter' | 'Complete' | 'Premium';

export const PAY_ONCE_LINE = 'Want to own it outright? Ask me on the call.';

/** Optional hosting and small fixes after month 12. Not charged at checkout. */
export const KEEP_RUNNING_MONTHLY = 39;

export const GOOGLE_LISTING_LINE = 'Google listing check and clean-up included';

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
    name: 'Starter',
    price: 49,
    popular: false,
    delivery: 'Delivered in 1 day',
    revisions: '1 round of revisions',
    features: [
      '1-page website (Hero + up to 5 sections)',
      'Basic contact form',
      'Mobile-first',
      '1 round of revisions',
      'Delivered in 1 day',
      GOOGLE_LISTING_LINE,
    ],
  },
  {
    name: 'Complete',
    price: 79,
    popular: true,
    delivery: 'Delivered in 1 day',
    revisions: '1 round of revisions',
    features: [
      'Up to 5 pages',
      'Contact + inquiry forms',
      'Google Business integration',
      'Basic SEO foundation',
      '1 round of revisions',
      'Delivered in 1 day',
      GOOGLE_LISTING_LINE,
    ],
  },
  {
    name: 'Premium',
    price: 99,
    popular: false,
    delivery: 'Priority delivery',
    revisions: '2 rounds of revisions',
    features: [
      'Up to 7 pages',
      'Advanced design & branding',
      'Stronger SEO foundation',
      'Priority delivery',
      '2 rounds of revisions',
      GOOGLE_LISTING_LINE,
    ],
  },
];

export const allPackagesInclude = [
  'Nothing down — nothing is charged until you’ve approved your site',
  'Hosting, updates and small changes included',
  'No contract — cancel anytime',
  'After 12 payments the site is yours to keep',
  '100% mobile-first',
];

export const SOFTWARE_REVIEW_TOPIC = 'software-review';
