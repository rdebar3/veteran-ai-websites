import Stripe from 'stripe';
import { buildCheckoutLineItems } from '@/lib/checkout';

/**
 * Body:
 *   package: "Starter" | "Complete" | "Premium"
 *   billing?: "monthly" | "once"   (default "monthly")
 *   addOns?: string[]              // "Shoppable Store" adds the one-time store line
 *
 * monthly → Stripe Checkout subscription, one recurring line at the plan price.
 * once → payment mode at payOnce[plan].
 * The store add-on, when requested, is an extra one-time line in either mode.
 */
export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const body = await request.json();
    const input =
      body && typeof body === 'object'
        ? (body as { package?: unknown; billing?: unknown; addOns?: unknown })
        : {};
    const built = buildCheckoutLineItems(input);

    if (!built.ok) {
      return Response.json({ error: built.error }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: built.lineItems,
      mode: built.mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_cancel=true`,
      metadata: built.metadata,
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
