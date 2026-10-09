import { describe, expect, it } from 'vitest';
import { buildCheckoutLineItems } from './checkout';

function built(input: Parameters<typeof buildCheckoutLineItems>[0]) {
  const result = buildCheckoutLineItems(input);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe('buildCheckoutLineItems', () => {
  it('monthly is subscription mode at the plan unit_amount', () => {
    const complete = built({ package: 'Complete', billing: 'monthly' });
    expect(complete.mode).toBe('subscription');
    expect(complete.metadata).toEqual({ plan: 'Complete', billing: 'monthly' });
    expect(complete.lineItems).toHaveLength(1);
    expect(complete.lineItems[0].price_data?.unit_amount).toBe(7900);
    expect(complete.lineItems[0].price_data?.recurring).toEqual({ interval: 'month' });

    const starter = built({ package: 'Starter' });
    expect(starter.mode).toBe('subscription');
    expect(starter.metadata.billing).toBe('monthly');
    expect(starter.lineItems[0].price_data?.unit_amount).toBe(4900);

    const premium = built({ package: 'Premium', billing: 'monthly' });
    expect(premium.lineItems[0].price_data?.unit_amount).toBe(9900);
  });

  it('once is payment mode at payOnce', () => {
    const premium = built({ package: 'Premium', billing: 'once' });
    expect(premium.mode).toBe('payment');
    expect(premium.metadata).toEqual({ plan: 'Premium', billing: 'once' });
    expect(premium.lineItems).toHaveLength(1);
    expect(premium.lineItems[0].price_data?.unit_amount).toBe(99700);
    expect(premium.lineItems[0].price_data?.recurring).toBeUndefined();

    expect(built({ package: 'Starter', billing: 'once' }).lineItems[0].price_data?.unit_amount).toBe(
      49700
    );
    expect(built({ package: 'Complete', billing: 'once' }).lineItems[0].price_data?.unit_amount).toBe(
      79700
    );
  });

  it('adds the store line when requested', () => {
    const monthly = built({
      package: 'Complete',
      billing: 'monthly',
      addOns: ['Shoppable Store'],
    });
    expect(monthly.mode).toBe('subscription');
    expect(monthly.lineItems).toHaveLength(2);
    expect(monthly.lineItems[0].price_data?.recurring).toEqual({ interval: 'month' });
    expect(monthly.lineItems[1].price_data?.unit_amount).toBe(49700);
    expect(monthly.lineItems[1].price_data?.recurring).toBeUndefined();
    expect(monthly.lineItems[1].price_data?.product_data?.name).toBe('Shoppable Store');

    const once = built({
      package: 'Starter',
      billing: 'once',
      addOns: ['Shoppable Store'],
    });
    expect(once.mode).toBe('payment');
    expect(once.lineItems).toHaveLength(2);
    expect(once.lineItems[1].price_data?.unit_amount).toBe(49700);
    expect(once.lineItems[1].price_data?.recurring).toBeUndefined();
  });

  it('rejects a missing package and an unknown billing mode', () => {
    expect(buildCheckoutLineItems({}).ok).toBe(false);
    expect(buildCheckoutLineItems({ package: 'Managed', billing: 'monthly' }).ok).toBe(false);
    expect(buildCheckoutLineItems({ package: 'Starter', billing: 'managed' }).ok).toBe(false);
  });
});
