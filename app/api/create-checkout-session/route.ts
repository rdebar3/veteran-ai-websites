import Stripe from 'stripe';
import type { CheckoutPlanId } from '@/lib/data';

/** One-time package amounts in cents (matches public pricing). */
const PACKAGE_AMOUNTS: Record<string, number> = {
  Essential: 997_00,
  Standard: 1497_00,
  Advanced: 2497_00,
};

const ONLINE_STORE_CENTS = 997_00;
const BUILD_CREDIT_CENTS = 500_00;

/** Monthly plan subscription amounts in cents. Keys = 0. Pro is not sold here. */
const PLAN_MONTHLY_CENTS: Record<CheckoutPlanId, number> = {
  keys: 0,
  hosted: 49_00,
  growth: 297_00,
};

const PLAN_LABELS: Record<CheckoutPlanId, string> = {
  keys: 'Keys',
  hosted: 'Hosted',
  growth: 'Growth',
};

function isCheckoutPlanId(v: unknown): v is CheckoutPlanId {
  return v === 'keys' || v === 'hosted' || v === 'growth';
}

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
 *   package: "Essential" | "Standard" | "Advanced"
 *   plan: "keys" | "hosted" | "growth"  (Pro is consultation-only — rejected)
 *   addOns?: string[]  // e.g. ["Online Store"]
 *
 * Growth: $500 off the one-time build.
 * Hosted / Growth: recurring monthly (Checkout mode = subscription).
 * Keys: one-time payment only.
 */
export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const body = await request.json();
    const pkg: string | undefined = body.package;
    const addOnList: string[] = Array.isArray(body.addOns) ? body.addOns : [];

    if (body.plan === 'pro') {
      return Response.json(
        {
          error:
            'Pro is available by consultation only. Call (304) 591-3835.',
        },
        { status: 400 }
      );
    }

    const plan: CheckoutPlanId = isCheckoutPlanId(body.plan)
      ? body.plan
      : 'keys';

    if (!pkg || PACKAGE_AMOUNTS[pkg] == null) {
      return Response.json({ error: 'Invalid or missing package' }, { status: 400 });
    }
    const packageName = pkg;
    const packageCents = PACKAGE_AMOUNTS[packageName];

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const credit = plan === 'growth' ? BUILD_CREDIT_CENTS : 0;
    const buildCents = Math.max(0, packageCents - credit);
    const creditNote =
      credit > 0
        ? `Includes $${credit / 100} ${PLAN_LABELS[plan]} plan credit`
        : undefined;

    lineItems.push(
      oneTimeLineItem(
        `${packageName} Website — ${PLAN_LABELS[plan]} plan`,
        buildCents,
        creditNote
      )
    );

    if (
      addOnList.includes('Online Store') ||
      addOnList.includes('Shoppable Store')
    ) {
      lineItems.push(oneTimeLineItem('Online Store add-on', ONLINE_STORE_CENTS));
    }

    const monthly = PLAN_MONTHLY_CENTS[plan];
    if (monthly > 0) {
      lineItems.push(
        monthlyLineItem(`${PLAN_LABELS[plan]} plan — monthly`, monthly)
      );
    }

    const mode: Stripe.Checkout.SessionCreateParams.Mode =
      monthly > 0 ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_cancel=true`,
      metadata: {
        package: packageName,
        plan,
        build_cents: String(buildCents),
        monthly_cents: String(monthly),
        store: String(
          addOnList.includes('Online Store') ||
            addOnList.includes('Shoppable Store')
        ),
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
