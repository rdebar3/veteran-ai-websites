'use client';

import { Check } from 'lucide-react';
import { getDisplayPrice } from '@/lib/data';
import type { PricingTier } from '@/lib/data';
import OfferCountdown from '@/components/OfferCountdown';
import MagneticButton from '@/components/MagneticButton';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (packageName: string) => void;
}

export default function PricingCard({ tier, onSelect }: PricingCardProps) {
  const isPopular = tier.popular;
  const hasPromo = tier.promoActive && tier.promoPrice != null;
  const displayPrice = getDisplayPrice(tier);

  return (
      <div className={`card pricing-card-wrap h-full${isPopular ? ' card--featured' : ''}`}>
        {isPopular && (
          <span className="pricing-card__badge pricing-card__badge--popular">MOST POPULAR</span>
        )}
        {hasPromo && !isPopular && (
          <span className="pricing-card__badge pricing-card__badge--promo">Limited Offer</span>
        )}

        <div className="pricing-card">
          <div className="pricing-card__name">{tier.name}</div>
          <p className="pricing-card__down">Nothing down</p>
          <div className="pricing-card__price">
            {hasPromo && <span className="pricing-card__strike">${tier.price}</span>}
            <span className="pricing-card__amount">${displayPrice}</span>
            <span className="pricing-card__period">/month</span>
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

          {isPopular || hasPromo ? (
            <MagneticButton
              type="button"
              block
              onClick={() => onSelect(tier.name)}
              className="btn btn--lg btn--primary btn--glow w-full"
            >
              {`Start ${tier.name} — $${displayPrice}/mo`}
            </MagneticButton>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(tier.name)}
              className="btn btn--lg btn--ghost w-full"
            >
              Start {tier.name} — ${displayPrice}/mo
            </button>
          )}
          <p className="text-center text-xs text-[var(--text-dim)] mt-4">{tier.revisions}</p>
        </div>
      </div>
  );
}