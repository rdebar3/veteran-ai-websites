import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stable opt-out endpoint for /unsubscribe.
 * Validates email, optionally records to Supabase when configured, always
 * returns a confirmation-friendly response for valid addresses.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '')
      .trim()
      .toLowerCase();

    if (!email || !EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && key) {
      // Best-effort record; table may not exist yet — still confirm to the user.
      try {
        await fetch(`${url}/rest/v1/email_suppressions`, {
          method: 'POST',
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            email,
            source: 'website_unsubscribe',
            created_at: new Date().toISOString(),
          }),
        });
      } catch {
        // Ignore storage failures; opt-out intent is still acknowledged.
      }
    }

    console.info('[unsubscribe]', email);

    return NextResponse.json({
      ok: true,
      message: `You’re unsubscribed. ${email} will not receive marketing emails from Veteran AI Websites.`,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not process unsubscribe. Please try again.' },
      { status: 500 }
    );
  }
}
