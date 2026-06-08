'use client';

import { Check } from 'lucide-react';

export interface PricingTier {
  name: string;
  price: number;
  popular?: boolean;
  features: string[];
  delivery: string;
  revisions: string;
}

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (packageName: string) => void;
}

export default function PricingCard({ tier, onSelect }: PricingCardProps) {
  const isPopular = tier.popular;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-[#1E2937]/30 backdrop-blur-md p-6 md:p-8 transition-all ${
        isPopular
          ? 'border-[#B91C1C] shadow-xl scale-[1.01] md:scale-105 z-10'
          : 'border-[#475569]/40 shadow-sm hover:shadow-md'
      }`}
    >
      {isPopular && (
        <div className="md:absolute md:-top-3 md:left-1/2 md:-translate-x-1/2 mb-3 md:mb-0">
          <div className="inline-block bg-[#B91C1C] text-white text-xs font-semibold tracking-[1px] px-4 py-0.5 md:px-5 md:py-1 rounded-full shadow">
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="text-xl font-semibold tracking-tight text-[#E2E8F0]">{tier.name}</div>
        <div className="mt-4 flex items-baseline">
          <span className="text-5xl font-semibold tracking-tighter text-[#E2E8F0]">
            ${tier.price}
          </span>
          <span className="ml-1.5 text-[#94A3B8]">one-time</span>
        </div>
        <div className="mt-1 text-sm text-[#B91C1C] font-medium">{tier.delivery}</div>
      </div>

      <ul className="mb-8 space-y-3.5 text-[15px] flex-1">
        {tier.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-[#CBD5E1]">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(tier.name)}
        className={`w-full rounded-lg py-3.5 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isPopular
            ? 'bg-[#B91C1C] text-white hover:bg-[#991B1B] focus:ring-[#B91C1C]'
            : 'border border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white focus:ring-[#B91C1C]'
        }`}
      >
        Start with {tier.name}
      </button>

      <p className="mt-4 text-center text-xs text-[#CBD5E1]">{tier.revisions}</p>
    </div>
  );
}
