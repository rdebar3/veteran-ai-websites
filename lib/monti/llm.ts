/**
 * Monti brain provider layer: Claude (Anthropic) primary, xAI Grok failover.
 * Keys stay server-side only.
 */

export type LlmMessage = { role: 'user' | 'assistant'; content: string };

const ANTHROPIC_MODEL = process.env.MONTI_ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
const XAI_MODEL = process.env.MONTI_XAI_MODEL || 'grok-3-mini';

export async function completeMontiTurn(args: {
  system: string;
  messages: LlmMessage[];
}): Promise<{ text: string; provider: 'anthropic' | 'xai' }> {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasXai = !!process.env.XAI_API_KEY;

  if (!hasAnthropic && !hasXai) {
    throw new Error('No LLM keys configured (ANTHROPIC_API_KEY or XAI_API_KEY)');
  }

  if (hasAnthropic) {
    try {
      const text = await callAnthropic(args);
      if (text?.trim()) return { text, provider: 'anthropic' };
      throw new Error('Empty Anthropic response');
    } catch (err) {
      console.error('[monti/llm] Claude failed, trying Grok failover:', err);
      if (!hasXai) throw err;
    }
  }

  const text = await callXai(args);
  if (!text?.trim()) throw new Error('Empty Grok response');
  return { text, provider: 'xai' };
}

async function callAnthropic(args: {
  system: string;
  messages: LlmMessage[];
}): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');

  // Dynamic import keeps cold-start lighter if only Grok is used
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: key });

  const res = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1024,
    temperature: 0.5,
    system: args.system,
    messages: args.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const text = res.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .filter(Boolean)
    .join('\n')
    .trim();

  return text;
}

async function callXai(args: {
  system: string;
  messages: LlmMessage[];
}): Promise<string> {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new Error('XAI_API_KEY missing');

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: XAI_MODEL,
      temperature: 0.5,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: args.system },
        ...args.messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`xAI ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return (data.choices?.[0]?.message?.content || '').trim();
}
