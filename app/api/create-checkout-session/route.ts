import Stripe from 'stripe';

const PRICE_MAP: { [key: string]: string } = {
  Starter: 'price_1TgASjCTbp3NSdllDBUWanvj',
  Complete: 'price_1TgATHCTbp3NSdllVTUlZC5E',
  Premium: 'price_1TgATdCTbp3NSdll0omW9UOC',
  'Google Business Boost': 'price_1TgAU4CTbp3NSdlliSbKE3Jf',
  'Shoppable Store': 'price_1TgAUaCTbp3NSdllHPiOlYft',
  'Launch Content Pack': 'price_1TgAV0CTbp3NSdllxKIWfg9Q',
  'Monthly Website Care': 'price_1TgAVICTbp3NSdllsVMoy5ys',
};

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const { package: pkg, addOns } = await request.json();

    const lineItems = [];

    if (PRICE_MAP[pkg]) {
      lineItems.push({
        price: PRICE_MAP[pkg],
        quantity: 1,
      });
    }

    addOns.forEach((addon: string) => {
      if (PRICE_MAP[addon]) {
        lineItems.push({
          price: PRICE_MAP[addon],
          quantity: 1,
        });
      }
    });

    if (lineItems.length === 0) {
      return Response.json({ error: 'No items selected' }, { status: 400 });
    }

    const hasRecurring = addOns.includes('Monthly Website Care');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: hasRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}?payment_cancel=true`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
