import type Stripe from 'stripe';
import { payOnce, pricingTiers, SHOPPABLE_STORE_PRICE, type PlanName } from '@/lib/data';

export type BillingMode = 'monthly' | 'once';

export type CheckoutInput = {
  package?: unknown;
  billing?: unknown;
  addOns?: unknown;
};

export type CheckoutLineItem = Stripe.Checkout.SessionCreateParams.LineItem;

export type CheckoutBuild =
  | {
      ok: true;
      mode: 'subscription' | 'payment';
      lineItems: CheckoutLineItem[];
      metadata: { plan: PlanName; billing: BillingMode };
    }
  | { ok: false; error: string };

const PLANS: PlanName[] = ['Starter', 'Complete', 'Premium'];

function isPlanName(value: unknown): value is PlanName {
  return typeof value === 'string' && (PLANS as string[]).includes(value);
}

function resolveBilling(value: unknown): BillingMode | null {
  if (value == null || value === '') return 'monthly';
  if (value === 'monthly' || value === 'once') return value;
  return null;
}

function wantsStore(addOns: unknown): boolean {
  if (!Array.isArray(addOns)) return false;
  return addOns.some(
    (item) =>
      item === 'Shoppable Store' || item === 'Online Store' || item === 'shoppable-store'
  );
}

function monthlyCents(plan: PlanName): number {
  const tier = pricingTiers.find((item) => item.name === plan);
  if (!tier) throw new Error(`Unknown plan ${plan}`);
  return tier.price * 100;
}

function recurringItem(name: string, unitAmount: number): CheckoutLineItem {
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: unitAmount,
      recurring: { interval: 'month' },
      product_data: { name },
    },
  };
}

function oneTimeItem(name: string, unitAmount: number): CheckoutLineItem {
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: unitAmount,
      product_data: { name },
    },
  };
}

/**
 * Pure Checkout line-item builder.
 * monthly → subscription mode, one recurring line at the plan’s monthly price.
 * once → payment mode at payOnce[plan].
 * Shoppable Store, when requested, is an extra one-time line in either mode.
 */
export function buildCheckoutLineItems(input: CheckoutInput): CheckoutBuild {
  if (!isPlanName(input.package)) {
    return {
      ok: false,
      error: 'Invalid or missing package. Choose Starter, Complete, or Premium.',
    };
  }

  const billing = resolveBilling(input.billing);
  if (!billing) {
    return { ok: false, error: 'billing must be monthly or once.' };
  }

  const plan = input.package;
  const lineItems: CheckoutLineItem[] = [];

  if (billing === 'monthly') {
    lineItems.push(recurringItem(`${plan} monthly`, monthlyCents(plan)));
  } else {
    lineItems.push(oneTimeItem(`${plan} — pay once`, payOnce[plan] * 100));
  }

  if (wantsStore(input.addOns)) {
    lineItems.push(oneTimeItem('Shoppable Store', SHOPPABLE_STORE_PRICE * 100));
  }

  return {
    ok: true,
    mode: billing === 'monthly' ? 'subscription' : 'payment',
    lineItems,
    metadata: { plan, billing },
  };
}
