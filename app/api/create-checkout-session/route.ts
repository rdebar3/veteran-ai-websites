import Stripe from 'stripe';
import { SHOPPABLE_STORE_PRICE, MANAGED_MONTHLY } from '@/lib/data';

/** One-time package amounts in cents (matches public pricing). */
const PACKAGE_AMOUNTS: Record<string, number> = {
  Starter: 497_00,
  Complete: 797_00,
  Premium: 997_00,
};

const SHOPPABLE_STORE_CENTS = SHOPPABLE_STORE_PRICE * 100;
const MANAGED_MONTHLY_CENTS = MANAGED_MONTHLY * 100;

function oneTimeLineItem(
  name: string,
  amount: number,
  description?: string
): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: amount,
      product_data: {
        name,
        ...(description ? { description } : {}),
      },
    },
  };
}

function monthlyLineItem(
  name: string,
  amount: number
): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: 'usd',
      unit_amount: amount,
      recurring: { interval: 'month' },
      product_data: { name },
    },
  };
}

/**
 * Body:
 *   package: "Starter" | "Complete" | "Premium"  (required — always charged)
 *   aftercare?: "own" | "managed"  (default "own")
 *   addOns?: string[]  // e.g. ["Shoppable Store"] and/or ["Monthly Website Care"]
 *
 * Own it: payment mode — one-time build (+ optional store).
 * Managed: subscription mode — one-time build (+ optional store) + $97/mo recurring.
 */
export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const body = await request.json();
    const pkg: string | undefined = body.package;
    const addOnList: string[] = Array.isArray(body.addOns) ? body.addOns : [];

    if (!pkg || PACKAGE_AMOUNTS[pkg] == null) {
      return Response.json(
        { error: 'Invalid or missing package. Choose Starter, Complete, or Premium.' },
        { status: 400 }
      );
    }

    const aftercare: 'own' | 'managed' =
      body.aftercare === 'managed' || addOnList.includes('Monthly Website Care')
        ? 'managed'
        : 'own';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    lineItems.push(oneTimeLineItem(`${pkg} Website`, PACKAGE_AMOUNTS[pkg]));

    if (
      addOnList.includes('Shoppable Store') ||
      addOnList.includes('Online Store')
    ) {
      lineItems.push(
        oneTimeLineItem('Shoppable Store add-on', SHOPPABLE_STORE_CENTS)
      );
    }

    if (aftercare === 'managed') {
      lineItems.push(
        monthlyLineItem('Managed plan — monthly', MANAGED_MONTHLY_CENTS)
      );
    }

    const mode: Stripe.Checkout.SessionCreateParams.Mode =
      aftercare === 'managed' ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_cancel=true`,
      metadata: {
        package: pkg,
        aftercare,
        store: String(
          addOnList.includes('Shoppable Store') ||
            addOnList.includes('Online Store')
        ),
        managed: String(aftercare === 'managed'),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
