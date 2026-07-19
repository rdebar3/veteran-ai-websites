import type { MontiRecord } from '@/lib/monti/types';
import { tradeLabel } from '@/lib/monti/trade-labels';

export const runtime = 'nodejs';

interface LeadBody {
  record?: MontiRecord;
  email?: string | null;
}

function supabaseBaseUrl(): string | null {
  const raw =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!raw) return null;
  // Base only — strip accidental /rest/v1
  return raw.replace(/\/$/, '').replace(/\/rest\/v1\/?$/, '');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;
    const record = body.record;

    if (!record || typeof record !== 'object') {
      return Response.json({ error: 'record is required' }, { status: 400 });
    }

    const name = (record.business?.name || '').trim();
    if (!name) {
      return Response.json(
        { error: 'business.name is required' },
        { status: 400 },
      );
    }

    const base = supabaseBaseUrl();
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!base || !serviceKey) {
      console.error(
        '[monti/lead] Missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY',
      );
      return Response.json(
        { error: 'Lead service is not configured' },
        { status: 503 },
      );
    }

    const tradeKey = record.trade_key || record.hero?.image_id || null;
    const category = tradeLabel(tradeKey);
    const phone = (record.business?.phone || '').trim() || null;
    const email =
      typeof body.email === 'string' && body.email.trim()
        ? body.email.trim()
        : null;
    const serviceArea =
      (record.business?.service_area || '').trim() || null;

    const placeId = `monti-${crypto.randomUUID()}`;

    // Packet §6 — exact column set
    const row = {
      place_id: placeId,
      name,
      category,
      phone,
      email,
      formatted_address: serviceArea,
      has_website: false,
      status: 'new',
      lead_score: 100,
      contact_bucket: 'monti_inbound',
      source: 'monti',
      monti_draft: record,
    };

    const res = await fetch(`${base}/rest/v1/businesses`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[monti/lead] Supabase insert failed:', res.status, errText);
      return Response.json(
        { error: 'Failed to save lead' },
        { status: 502 },
      );
    }

    const rows = (await res.json()) as Array<{ id?: string; place_id?: string }>;
    const saved = Array.isArray(rows) ? rows[0] : null;

    return Response.json({
      ok: true,
      place_id: saved?.place_id || placeId,
      id: saved?.id ?? null,
    });
  } catch (err) {
    console.error('[monti/lead] unexpected:', err);
    return Response.json({ error: 'Lead write failed' }, { status: 500 });
  }
}
