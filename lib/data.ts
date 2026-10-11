export interface PricingTier {
  name: string;
  /** Monthly price in dollars. Pay-once amounts live on `payOnce`. */
  price: number;
  promoPrice?: number;
  promoActive?: boolean;
  promoLabel?: string;
  popular?: boolean;
  features: string[];
  delivery: string;
  revisions: string;
}

export const payOnce = {
  Starter: 497,
  Complete: 797,
  Premium: 997,
} as const;

export type PlanName = keyof typeof payOnce;

export const PAY_ONCE_LINE =
  'Rather pay once and own it outright? Starter $497 · Complete $797 · Premium $997. Your call when you approve the site.';

/** Optional hosting and small fixes after month 12. Not charged at checkout. */
export const KEEP_RUNNING_MONTHLY = 29;

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

export interface AddOn {
  id: string;
  name: string;
  price: number;
  period: string;
  desc: string;
  features?: string[];
}

export const SHOPPABLE_STORE_PRICE = 497;

export const SOFTWARE_REVIEW_TOPIC = 'software-review';

export const STORE_LINE =
  'Want to sell online? Add a store, up to 20 products, $497 one-time, billed with your first payment. Just mention it on the call.';

export const addOnsList: AddOn[] = [
  {
    id: 'shoppable-store',
    name: 'Shoppable Store',
    price: SHOPPABLE_STORE_PRICE,
    period: '',
    desc: 'Sell online with a secure product catalog and checkout — up to 20 products, built alongside your site. Charged once at checkout.',
  },
];
