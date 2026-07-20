import { randomBytes } from 'crypto';
import { AccessToken, type VideoGrant } from 'livekit-server-sdk';
import { RoomAgentDispatch, RoomConfiguration } from '@livekit/protocol';

export const runtime = 'nodejs';

/** Must match monti-agent WorkerOptions.agent_name */
const AGENT_NAME = 'monti';

function uniqueId(prefix: string): string {
  return `${prefix}-${randomBytes(6).toString('hex')}`;
}

/**
 * Mint a LiveKit access token for /monti/live.
 * Unique room + identity per visitor; dispatches the "monti" agent.
 * Server-side only — never exposes LIVEKIT_API_SECRET or XAI_API_KEY.
 */
export async function POST() {
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

    at.roomConfig = new RoomConfiguration({
      agents: [
        new RoomAgentDispatch({
          agentName: AGENT_NAME,
        }),
      ],
    });

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
