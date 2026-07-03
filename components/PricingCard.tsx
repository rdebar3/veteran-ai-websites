'use client';

import { Check } from 'lucide-react';
import { getDisplayPrice } from '@/lib/data';
import type { PricingTier } from '@/lib/data';
import ScrollReveal from '@/components/ScrollReveal';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (packageName: string) => void;
  index?: number;
}

export default function PricingCard({ tier, onSelect, index = 0 }: PricingCardProps) {
  const isPopular = tier.popular;
  const hasPromo = tier.promoActive && tier.promoPrice != null;
  const displayPrice = getDisplayPrice(tier);

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        className={`glass-card relative h-full ${
          isPopular ? 'glass-card--popular' : hasPromo ? 'glass-card--selected' : ''
        }`}
      >
        {isPopular && (
          <span className="pricing-card-premium__badge pricing-card-premium__badge--popular">
            Most Popular
          </span>
        )}
        {hasPromo && !isPopular && (
          <span className="pricing-card-premium__badge pricing-card-premium__badge--promo">
            Limited Offer
          </span>
        )}

        <div className="pricing-card-premium">
          <div className="pricing-card-premium__name">{tier.name}</div>
          <div className="pricing-card-premium__price">
            {hasPromo && (
              <span className="pricing-card-premium__strike">${tier.price}</span>
            )}
            ${displayPrice}
            <span className="pricing-card-premium__period">one-time</span>
          </div>
          {hasPromo && (
            <p className="pricing-card-premium__promo">
              ${tier.promoPrice} until {tier.promoEnds}
            </p>
          )}
          <p className="pricing-card-premium__delivery">{tier.delivery}</p>

          <ul className="pricing-card-premium__features">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="pricing-card-premium__feature">
                <Check className="pricing-card-premium__check h-4 w-4" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => onSelect(tier.name)}
            className={`btn-premium w-full ${!isPopular && !hasPromo ? 'btn-premium--outline' : ''}`}
          >
            {hasPromo ? `Claim $${tier.promoPrice}` : `Choose ${tier.name}`}
          </button>
          <p className="text-center text-xs text-[var(--text-dim)] mt-4">{tier.revisions}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}