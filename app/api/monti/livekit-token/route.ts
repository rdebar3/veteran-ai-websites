import { randomBytes } from 'crypto';
import { AccessToken, type VideoGrant } from 'livekit-server-sdk';
import { clientIp, rateLimit, sameOriginOk } from '@/lib/monti/guard';

export const runtime = 'nodejs';

const RATE = { limit: 5, windowMs: 10 * 60 * 1000 } as const;

function uniqueId(prefix: string): string {
  return `${prefix}-${randomBytes(6).toString('hex')}`;
}

/**
 * Mint a LiveKit access token for /monti/live.
 * Unique room + identity per visitor. Automatic agent dispatch
 * (worker has no agent_name) joins every room in the project.
 * Server-side only — never exposes LIVEKIT_API_SECRET or XAI_API_KEY.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!sameOriginOk(request)) {
    console.warn('[monti] origin reject', 'livekit-token', ip);
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!rateLimit('livekit-token', ip, RATE)) {
    console.warn('[monti] rate limit', 'livekit-token', ip);
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      console.error('[monti/livekit-token] missing LIVEKIT_URL / API_KEY / API_SECRET');
      return Response.json(
        { error: 'LiveKit is not configured' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const roomName = uniqueId('monti-live');
    const identity = uniqueId('visitor');

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: '15m',
    });

    const grant: VideoGrant = {
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    };
    at.addGrant(grant);

    const token = await at.toJwt();

    return Response.json(
      {
        token,
        url: livekitUrl,
        roomName,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[monti/livekit-token] unexpected:', err);
    return Response.json(
      { error: 'Could not mint LiveKit token' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
