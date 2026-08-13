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
    name: 'Starter',
    price: 497,
    popular: false,
    delivery: 'Delivered in 1 day',
    revisions: '1 round of revisions',
    features: [
      '1-page website (Hero + up to 5 sections)',
      'Basic contact form',
      'Fully mobile responsive',
      '1 round of revisions',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Complete',
    price: 797,
    popular: true,
    delivery: 'Delivered in 1 day',
    revisions: '1 round of revisions',
    features: [
      'Up to 5 pages',
      'Professional multi-section design',
      'Contact + inquiry forms',
      'Google Business integration',
      'Basic SEO foundation',
      '1 round of revisions',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Premium',
    price: 997,
    popular: false,
    delivery: 'Delivered in 1-2 days (priority)',
    revisions: '2 rounds of revisions',
    features: [
      'Up to 7 pages',
      'Advanced design & branding',
      'Stronger SEO foundation',
      'Priority delivery (same day or next business day)',
      '2 rounds of revisions',
      '30 days of support after launch',
      'Delivered in 1-2 days',
    ],
  },
];

export const allPackagesInclude = [
  'Fully mobile responsive design',
  'Fast, secure hosting setup',
  '100% ownership of your website and files',
  'No long-term contracts or hidden fees',
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
export const MANAGED_MONTHLY = 97;

export const addOnsList: AddOn[] = [
  {
    id: 'shoppable-store',
    name: 'Shoppable Store',
    price: SHOPPABLE_STORE_PRICE,
    period: ' one-time',
    desc: 'Sell online with a secure product catalog and checkout — up to 20 products, built alongside your site.',
  },
  {
    id: 'monthly-website-care',
    name: 'Monthly Website Care',
    price: MANAGED_MONTHLY,
    period: '/month',
    desc: 'Up to 2 hours of updates monthly, plus security checks, backups, and priority support.',
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
    desc: 'We deploy your live site, do a final check, and hand over full ownership.',
  },
];
