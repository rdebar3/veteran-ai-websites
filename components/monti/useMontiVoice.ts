'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyFill,
  type ApplyFillResult,
} from '@/lib/monti/validate';
import type { MontiRecord } from '@/lib/monti/types';

const REALTIME_URL =
  'wss://api.x.ai/v1/realtime?model=grok-voice-latest';

const SUPPORTED_RATES = new Set([
  8000, 16000, 22050, 24000, 32000, 44100, 48000,
]);

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'error';

export interface UseMontiVoiceOptions {
  /** Latest working record — read on each fill_site call */
  getRecord: () => MontiRecord;
  onFill: (result: ApplyFillResult) => void;
  onSendToRich: () => Promise<{ ok: boolean; error?: string }>;
  onTranscript: (text: string, role: 'assistant' | 'user') => void;
  onAmplitude: (level: number) => void;
  onListening: (on: boolean) => void;
  onStatus?: (s: VoiceStatus) => void;
  /** When true, mute speaker output (captions still flow) */
  muted: boolean;
  onError?: (message: string) => void;
}

const FILL_SITE_TOOL = {
  type: 'function' as const,
  name: 'fill_site',
  description:
    'Push homepage section fields so the live site fills in. Call once per step when content is ready. Structured fields only — never HTML.',
  parameters: {
    type: 'object',
    properties: {
      template_id: { type: 'string', enum: ['trades'] },
      hero_image_id: {
        type: 'string',
        description: 'Trade key for hero photo',
      },
      business: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          service_area: { type: 'string' },
          established: { type: ['number', 'null'] },
        },
      },
      hero: {
        type: 'object',
        properties: {
          headline: { type: 'string' },
          subhead: { type: 'string' },
          cta_text: { type: 'string' },
          image_id: { type: 'string' },
        },
      },
      about: {
        type: 'object',
        properties: { body: { type: 'string' } },
      },
      services: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
      trust: {
        type: 'object',
        properties: {
          badges: { type: 'array', items: { type: 'string' } },
          reviews: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                quote: { type: 'string' },
                name: { type: 'string' },
                detail: { type: 'string' },
              },
            },
          },
        },
      },
      contact: {
        type: 'object',
        properties: {
          cta_text: { type: 'string' },
          phone_prompt: { type: 'string' },
          emergency: { type: 'boolean' },
        },
      },
      sections: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['hero', 'trust', 'services', 'about', 'contact'],
        },
        description: 'Sections now ready to show',
      },
    },
  },
};

const SEND_TO_RICH_TOOL = {
  type: 'function' as const,
  name: 'send_to_rich',
  description:
    'Visitor agreed to hand off to Rich. Call only when they clearly say yes.',
  parameters: {
    type: 'object',
    properties: {
      confirm: { type: 'boolean' },
    },
  },
};

function floatTo16BitPCM(float32: Float32Array): Int16Array {
  const out = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

function int16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToInt16(b64: string): Int16Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Int16Array(bytes.buffer);
}

function rmsFromInt16(pcm: Int16Array): number {
  if (!pcm.length) return 0;
  let sum = 0;
  for (let i = 0; i < pcm.length; i++) {
    const v = pcm[i] / 32768;
    sum += v * v;
  }
  return Math.min(1, Math.sqrt(sum / pcm.length) * 4);
}

function pickSampleRate(native: number): number {
  if (SUPPORTED_RATES.has(native)) return native;
  // Prefer nearest common rate
  if (native >= 44000) return 48000;
  if (native >= 30000) return 32000;
  if (native >= 22000) return 24000;
  return 16000;
}

export function useMontiVoice(opts: UseMontiVoiceOptions) {
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef(0);
  const pendingSourcesRef = useRef(0);
  const mutedRef = useRef(opts.muted);
  const startedRef = useRef(false);
  const sessionReadyRef = useRef(false);
  const greetingSentRef = useRef(false);
  const assistantBufRef = useRef('');
  const pendingToolCallsRef = useRef<
    { name: string; call_id: string; arguments: string }[]
  >([]);
  const responseActiveRef = useRef(false);
  const sampleRateRef = useRef(24000);

  useEffect(() => {
    mutedRef.current = opts.muted;
    if (gainRef.current) {
      gainRef.current.gain.value = opts.muted ? 0 : 1;
    }
  }, [opts.muted]);

  const setStatusSafe = useCallback((s: VoiceStatus) => {
    setStatus(s);
    optsRef.current.onStatus?.(s);
  }, []);

  const waitForPlaybackIdle = useCallback(async () => {
    const maxWait = 8000;
    const start = Date.now();
    while (pendingSourcesRef.current > 0 && Date.now() - start < maxWait) {
      await new Promise((r) => setTimeout(r, 40));
    }
    // small pad so the last syllable finishes
    await new Promise((r) => setTimeout(r, 120));
  }, []);

  const sendJson = useCallback((obj: unknown) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    }
  }, []);

  const playPcmChunk = useCallback((pcm: Int16Array) => {
    const ctx = playCtxRef.current;
    if (!ctx || !pcm.length) return;

    const rate = sampleRateRef.current;
    const float = new Float32Array(pcm.length);
    for (let i = 0; i < pcm.length; i++) float[i] = pcm[i] / 32768;

    const buffer = ctx.createBuffer(1, float.length, rate);
    buffer.copyToChannel(float, 0);

    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = gainRef.current || ctx.destination;
    src.connect(gain);

    const now = ctx.currentTime;
    const startAt = Math.max(now + 0.02, nextPlayTimeRef.current);
    src.start(startAt);
    nextPlayTimeRef.current = startAt + buffer.duration;

    pendingSourcesRef.current++;
    setSpeaking(true);

    const amp = rmsFromInt16(pcm);
    optsRef.current.onAmplitude(amp);

    src.onended = () => {
      pendingSourcesRef.current = Math.max(0, pendingSourcesRef.current - 1);
      if (pendingSourcesRef.current === 0) {
        setSpeaking(false);
        optsRef.current.onAmplitude(0);
      }
    };
  }, []);

  const handleFunctionCalls = useCallback(
    async (
      calls: { name: string; call_id: string; arguments: string }[],
    ) => {
      for (const call of calls) {
        let result: unknown = { ok: true };
        try {
          if (call.name === 'fill_site') {
            let args: unknown = {};
            try {
              args = call.arguments ? JSON.parse(call.arguments) : {};
            } catch {
              args = {};
            }
            const filled = applyFill(
              optsRef.current.getRecord(),
              args,
              (args as { sections?: unknown })?.sections,
            );
            optsRef.current.onFill(filled);
            result = { ok: true };
          } else if (call.name === 'send_to_rich') {
            const r = await optsRef.current.onSendToRich();
            result = r;
          } else {
            result = { ok: false, error: `Unknown tool: ${call.name}` };
          }
        } catch (e) {
          result = {
            ok: false,
            error: e instanceof Error ? e.message : 'tool failed',
          };
        }

        sendJson({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: call.call_id,
            output: JSON.stringify(result),
          },
        });
      }

      await waitForPlaybackIdle();
      sendJson({ type: 'response.create' });
    },
    [sendJson, waitForPlaybackIdle],
  );

  const onServerEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type as string;

      if (type === 'session.updated') {
        sessionReadyRef.current = true;
        setStatusSafe('live');
        if (!greetingSentRef.current) {
          greetingSentRef.current = true;
          // Kick Monti's opening line
          sendJson({ type: 'response.create' });
        }
        return;
      }

      if (type === 'error') {
        const err = event.error as { message?: string } | undefined;
        console.error('[monti/voice] server error', event);
        optsRef.current.onError?.(
          err?.message || 'Voice session error',
        );
        return;
      }

      if (type === 'input_audio_buffer.speech_started') {
        setListening(true);
        optsRef.current.onListening(true);
        return;
      }
      if (type === 'input_audio_buffer.speech_stopped') {
        setListening(false);
        optsRef.current.onListening(false);
        return;
      }

      if (type === 'response.created') {
        responseActiveRef.current = true;
        assistantBufRef.current = '';
        pendingToolCallsRef.current = [];
        return;
      }

      if (
        type === 'response.output_audio_transcript.delta' ||
        type === 'response.audio_transcript.delta'
      ) {
        const delta = (event.delta as string) || '';
        assistantBufRef.current += delta;
        optsRef.current.onTranscript(assistantBufRef.current, 'assistant');
        return;
      }

      if (
        type === 'response.output_audio_transcript.done' ||
        type === 'response.audio_transcript.done'
      ) {
        const full =
          (event.transcript as string) || assistantBufRef.current;
        if (full) {
          assistantBufRef.current = full;
          optsRef.current.onTranscript(full, 'assistant');
        }
        return;
      }

      if (
        type === 'response.output_audio.delta' ||
        type === 'response.audio.delta'
      ) {
        const b64 = event.delta as string;
        if (b64) {
          try {
            playPcmChunk(base64ToInt16(b64));
          } catch (e) {
            console.error('[monti/voice] audio decode failed', e);
          }
        }
        return;
      }

      if (type === 'response.function_call_arguments.done') {
        pendingToolCallsRef.current.push({
          name: event.name as string,
          call_id: event.call_id as string,
          arguments: (event.arguments as string) || '{}',
        });
        return;
      }

      if (type === 'response.done') {
        responseActiveRef.current = false;
        const calls = pendingToolCallsRef.current.splice(0);
        if (calls.length > 0) {
          void handleFunctionCalls(calls);
        }
        return;
      }

      if (type === 'conversation.item.input_audio_transcription.completed') {
        const transcript = event.transcript as string | undefined;
        if (transcript?.trim()) {
          optsRef.current.onTranscript(transcript.trim(), 'user');
        }
      }
    },
    [handleFunctionCalls, playPcmChunk, sendJson, setStatusSafe],
  );

  const stop = useCallback(() => {
    startedRef.current = false;
    sessionReadyRef.current = false;
    greetingSentRef.current = false;

    try {
      processorRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    processorRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    try {
      wsRef.current?.close();
    } catch {
      /* ignore */
    }
    wsRef.current = null;

    void audioCtxRef.current?.close().catch(() => {});
    void playCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    playCtxRef.current = null;
    gainRef.current = null;
    nextPlayTimeRef.current = 0;
    pendingSourcesRef.current = 0;

    setSpeaking(false);
    setListening(false);
    setStatusSafe('idle');
    optsRef.current.onAmplitude(0);
    optsRef.current.onListening(false);
  }, [setStatusSafe]);

  const start = useCallback(async (): Promise<boolean> => {
    if (startedRef.current) return true;
    setStatusSafe('connecting');

    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof WebSocket === 'undefined' ||
      typeof AudioContext === 'undefined'
    ) {
      setStatusSafe('idle');
      return false;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });
    } catch {
      setStatusSafe('idle');
      return false;
    }
    streamRef.current = stream;

    let tokenPayload: {
      token: string;
      instructions: string;
      voice: string;
    };
    try {
      const res = await fetch('/api/monti/voice-token', { method: 'POST' });
      if (!res.ok) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStatusSafe('idle');
        return false;
      }
      tokenPayload = (await res.json()) as typeof tokenPayload;
      if (!tokenPayload.token) {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setStatusSafe('idle');
        return false;
      }
    } catch {
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStatusSafe('idle');
      return false;
    }

    // Playback context
    const playCtx = new AudioContext();
    const sampleRate = pickSampleRate(playCtx.sampleRate);
    sampleRateRef.current = sampleRate;
    // Recreate at chosen rate if mismatch (some browsers ignore constructor rate)
    if (Math.abs(playCtx.sampleRate - sampleRate) > 1) {
      await playCtx.close().catch(() => {});
      playCtxRef.current = new AudioContext({ sampleRate });
    } else {
      playCtxRef.current = playCtx;
    }
    const pctx = playCtxRef.current;
    await pctx.resume().catch(() => {});
    const gain = pctx.createGain();
    gain.gain.value = mutedRef.current ? 0 : 1;
    gain.connect(pctx.destination);
    gainRef.current = gain;
    nextPlayTimeRef.current = pctx.currentTime;

    // Mic capture context — use same rate when possible
    const captureCtx = new AudioContext({ sampleRate });
    audioCtxRef.current = captureCtx;
    await captureCtx.resume().catch(() => {});

    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (ok: boolean) => {
        if (settled) return;
        settled = true;
        if (!ok) {
          stop();
          resolve(false);
        } else {
          startedRef.current = true;
          resolve(true);
        }
      };

      const ws = new WebSocket(REALTIME_URL, [
        `xai-client-secret.${tokenPayload.token}`,
      ]);
      wsRef.current = ws;

      const connectTimeout = window.setTimeout(() => {
        if (!sessionReadyRef.current) finish(false);
      }, 12000);

      ws.onopen = () => {
        sendJson({
          type: 'session.update',
          session: {
            instructions: tokenPayload.instructions,
            voice: tokenPayload.voice || 'leo',
            turn_detection: { type: 'server_vad' },
            audio: {
              input: {
                format: { type: 'audio/pcm', rate: sampleRate },
              },
              output: {
                format: { type: 'audio/pcm', rate: sampleRate },
              },
            },
            tools: [FILL_SITE_TOOL, SEND_TO_RICH_TOOL],
          },
        });

        // Start streaming mic
        try {
          const source = captureCtx.createMediaStreamSource(stream);
          // ScriptProcessor: simple Phase 2 path; AudioWorklet later
          const bufferSize = 4096;
          const processor = captureCtx.createScriptProcessor(bufferSize, 1, 1);
          processorRef.current = processor;
          processor.onaudioprocess = (e) => {
            if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
              return;
            }
            if (!sessionReadyRef.current) return;
            const input = e.inputBuffer.getChannelData(0);
            const pcm = floatTo16BitPCM(input);
            const audio = int16ToBase64(pcm);
            try {
              wsRef.current.send(
                JSON.stringify({
                  type: 'input_audio_buffer.append',
                  audio,
                }),
              );
            } catch {
              /* ignore send errors mid-teardown */
            }
          };
          source.connect(processor);
          // Keep processor alive without audible loopback
          const mute = captureCtx.createGain();
          mute.gain.value = 0;
          processor.connect(mute);
          mute.connect(captureCtx.destination);
        } catch (e) {
          console.error('[monti/voice] mic pipeline failed', e);
          window.clearTimeout(connectTimeout);
          finish(false);
        }
      };

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(
            typeof msg.data === 'string' ? msg.data : '',
          ) as Record<string, unknown>;
          if (event.type === 'session.updated' && !settled) {
            window.clearTimeout(connectTimeout);
            finish(true);
          }
          onServerEvent(event);
        } catch (e) {
          console.error('[monti/voice] bad message', e);
        }
      };

      ws.onerror = () => {
        window.clearTimeout(connectTimeout);
        optsRef.current.onError?.('Voice connection failed');
        if (!settled) finish(false);
        else setStatusSafe('error');
      };

      ws.onclose = () => {
        window.clearTimeout(connectTimeout);
        if (!settled) finish(false);
        else if (startedRef.current) {
          setStatusSafe('error');
          optsRef.current.onError?.(
            'Voice connection closed — you can keep typing.',
          );
        }
      };
    });
  }, [onServerEvent, sendJson, setStatusSafe, stop]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    start,
    stop,
    status,
    speaking,
    listening,
  };
}
