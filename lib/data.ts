import {
  Send,
  Phone,
  Zap,
  Eye,
  CreditCard,
  Globe,
} from 'lucide-react';

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
  'Rather pay once and own it today? Starter $497 · Complete $797 · Premium $997.';

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
  'Nothing down — your first payment is month one',
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

export const addOnsList: AddOn[] = [
  {
    id: 'shoppable-store',
    name: 'Shoppable Store',
    price: SHOPPABLE_STORE_PRICE,
    period: '',
    desc: 'Sell online with a secure product catalog and checkout — up to 20 products, built alongside your site. Charged once at checkout.',
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
    desc: 'We deliver your premium, high-quality website the same day (or 1-2 days with priority for Premium), ensuring exceptional craftsmanship.',
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
    desc: 'We deploy your live site. After 12 payments the site is yours.',
  },
];
