import {
  MONTI_VOICE,
  MONTI_VOICE_INSTRUCTIONS,
} from '@/lib/monti/voice-instructions';

export const runtime = 'nodejs';

/**
 * Mint a short-lived xAI Realtime ephemeral token for the browser Voice Agent.
 * Never returns XAI_API_KEY — only the client secret.
 */
export async function POST() {
  try {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Voice is not configured (missing XAI_API_KEY)' },
        { status: 503 },
      );
    }

    const res = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expires_after: { seconds: 300 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[monti/voice-token] xAI error:', res.status, errText);
      return Response.json(
        { error: 'Could not mint a voice session token' },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      value?: string;
      expires_at?: number;
    };

    if (!data.value) {
      console.error('[monti/voice-token] missing value in response', data);
      return Response.json(
        { error: 'Invalid token response from voice provider' },
        { status: 502 },
      );
    }

    return Response.json({
      token: data.value,
      expires_at: data.expires_at ?? null,
      instructions: MONTI_VOICE_INSTRUCTIONS,
      voice: MONTI_VOICE,
    });
  } catch (err) {
    console.error('[monti/voice-token] unexpected:', err);
    return Response.json({ error: 'Voice token failed' }, { status: 500 });
  }
}
