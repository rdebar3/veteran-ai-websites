'use client';

import { Check } from 'lucide-react';
import { getDisplayPrice } from '@/lib/data';
import type { PricingTier } from '@/lib/data';
import Reveal from '@/components/Reveal';
import OfferCountdown from '@/components/OfferCountdown';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (packageName: string) => void;
  index?: number;
}

export default function PricingCard({ tier, onSelect, index = 0 }: PricingCardProps) {
  const isPopular = tier.popular;
  const hasPromo = tier.promoActive && tier.promoPrice != null;
  const displayPrice = getDisplayPrice(tier);
  const delays = ['none', '1', '2', '3', '4', '5'] as const;
  const delay = delays[Math.min(index, delays.length - 1)];

  return (
    <Reveal variant="scale" delay={delay}>
      <div className="card pricing-card-wrap h-full">
        {isPopular && (
          <span className="pricing-card__badge pricing-card__badge--popular">Most Popular</span>
        )}
        {hasPromo && !isPopular && (
          <span className="pricing-card__badge pricing-card__badge--promo">Limited Offer</span>
        )}

        <div className="pricing-card">
          <div className="pricing-card__name">{tier.name}</div>
          <div className="pricing-card__price">
            {hasPromo && <span className="pricing-card__strike">${tier.price}</span>}
            ${displayPrice}
            <span className="pricing-card__period">one-time</span>
          </div>
          {hasPromo && (
            <div className="pricing-card__promo">
              <OfferCountdown compact />
            </div>
          )}
          <p className="pricing-card__delivery">{tier.delivery}</p>

          <ul className="pricing-card__features">
            {tier.features.map((feature, idx) => (
              <li key={idx} className="pricing-card__feature">
                <Check className="pricing-card__check h-4 w-4" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => onSelect(tier.name)}
            className={`btn btn--lg w-full ${
              isPopular || hasPromo ? 'btn--primary btn--glow' : 'btn--ghost'
            }`}
          >
            {hasPromo ? `Claim $${tier.promoPrice}` : `Choose ${tier.name}`}
          </button>
          <p className="text-center text-xs text-[var(--text-dim)] mt-4">{tier.revisions}</p>
        </div>
      </div>
    </Reveal>
  );
}