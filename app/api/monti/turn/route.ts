import { MONTI_SYSTEM_PROMPT } from '@/lib/monti/brain-prompt';
import { emptyRecord } from '@/lib/monti/contract';
import { completeMontiTurn } from '@/lib/monti/llm';
import type { ChatMessage, MontiRecord } from '@/lib/monti/types';
import {
  fallbackTurn,
  parseModelJson,
  validateTurn,
} from '@/lib/monti/validate';

export const maxDuration = 60;
export const runtime = 'nodejs';

interface TurnBody {
  messages?: ChatMessage[];
  message?: string | null;
  record?: MontiRecord | null;
  start?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TurnBody;
    const history = Array.isArray(body.messages) ? body.messages : [];
    const record = body.record && typeof body.record === 'object'
      ? body.record
      : emptyRecord();
    const isStart = body.start === true;
    const latest =
      typeof body.message === 'string' ? body.message.trim() : '';

    if (!isStart && !latest) {
      return Response.json(
        { error: 'message is required unless start:true' },
        { status: 400 },
      );
    }

    if (!process.env.ANTHROPIC_API_KEY && !process.env.XAI_API_KEY) {
      return Response.json(
        { error: 'Brain is not configured (missing API keys)' },
        { status: 503 },
      );
    }

    // Build LLM messages: history + optional new user message + record context
    const llmMessages: { role: 'user' | 'assistant'; content: string }[] = [];

    for (const m of history) {
      if (
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim()
      ) {
        llmMessages.push({ role: m.role, content: m.content.trim() });
      }
    }

    if (isStart && llmMessages.length === 0) {
      llmMessages.push({
        role: 'user',
        content:
          '[Session start. Greet me and ask for my business name. Output the turn JSON only.]',
      });
    } else if (latest) {
      llmMessages.push({ role: 'user', content: latest });
    }

    // Append working record so the model can patch accurately
    const last = llmMessages[llmMessages.length - 1];
    if (last && last.role === 'user') {
      last.content += `\n\n---\nCurrent site record (JSON — merge via patch, do not repeat whole object unless changing):\n${JSON.stringify(record)}`;
    }

    let rawText: string;
    try {
      const result = await completeMontiTurn({
        system: MONTI_SYSTEM_PROMPT,
        messages: llmMessages,
      });
      rawText = result.text;
    } catch (err) {
      console.error('[monti/turn] LLM error:', err);
      const turn = fallbackTurn(
        record,
        "Sorry — I hit a snag. Mind saying that again?",
      );
      return Response.json(turn);
    }

    let parsed: unknown;
    try {
      parsed = parseModelJson(rawText);
    } catch (err) {
      console.error('[monti/turn] JSON parse failed:', err, rawText?.slice(0, 300));
      const turn = fallbackTurn(
        record,
        "Sorry — hiccup on my end. Mind saying that again?",
      );
      return Response.json(turn);
    }

    const turn = validateTurn(parsed, record);
    return Response.json(turn);
  } catch (err) {
    console.error('[monti/turn] unexpected:', err);
    return Response.json(
      { error: 'Turn failed' },
      { status: 500 },
    );
  }
}
