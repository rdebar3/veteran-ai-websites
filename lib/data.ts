import { 
  Send, 
  Phone, 
  Zap, 
  Eye, 
  CreditCard, 
  Globe 
} from 'lucide-react';

export interface PricingTier {
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
  delivery: string;
  revisions: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 297,
    popular: false,
    delivery: 'Delivered in 1 day',
    revisions: '1 revision included',
    features: [
      '1-page website',
      'Up to 5 sections',
      'Basic contact form',
      'Google Business embed',
      '1 revision',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Complete',
    price: 497,
    popular: true,
    delivery: 'Delivered in 1 day',
    revisions: '1 revision included',
    features: [
      'Up to 5 pages',
      'Professional multi-section design',
      'Contact + inquiry forms',
      'Google Business integration',
      'Basic SEO',
      'Social links',
      'Delivered in 1 day',
    ],
  },
  {
    name: 'Premium',
    price: 797,
    popular: false,
    delivery: 'Delivered in 1-2 days (priority)',
    revisions: '1 revision round',
    features: [
      'Up to 8 pages',
      'Advanced design & branding',
      'Blog or news section ready',
      'Stronger SEO foundation',
      '1 revision round',
      '30 days of support',
      'Delivered in 1-2 days (priority)',
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
}

export const addOnsList: AddOn[] = [
  {
    id: 'google-business-boost',
    name: 'Google Business Boost',
    price: 97,
    period: 'one-time',
    desc: 'Professional Google Business Profile optimization including photos, posts, categories, and review generation prompts.',
  },
  {
    id: 'shoppable-store',
    name: 'Shoppable Store (Clerk + Stripe)',
    price: 350,
    period: 'one-time',
    desc: 'Add a simple product catalog with secure checkout. Includes Clerk authentication and Stripe payments integration.',
  },
  {
    id: 'monthly-website-care',
    name: 'Monthly Website Care',
    price: 97,
    period: '/month',
    desc: 'Monthly updates, security checks, backups, minor content changes, and priority support.',
  },
  {
    id: 'launch-content-pack',
    name: 'Launch Content Pack',
    price: 147,
    period: 'one-time',
    desc: 'Ready-to-post social media announcements and captions to promote your new website on launch day.',
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
    desc: 'I build your professional website the same day (or 1-2 days with priority for Premium).',
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
