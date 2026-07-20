'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  applyFill,
  type ApplyFillResult,
} from '@/lib/monti/validate';
import type { MontiRecord } from '@/lib/monti/types';

const REALTIME_URL =
  'wss://api.x.ai/v1/realtime?model=grok-voice-latest';

/** Default speech rate (xAI audio.output.speed range 0.7–1.5). Override with ?speed= */
const MONTI_SPEED = 1.0;

/**
 * Default voice id. Rich locks the American pick by ear after auditioning via
 * /monti?voice=NAME (and optional &speed=). Server token may also suggest a voice.
 */
const MONTI_VOICE = 'castor';

/** Fixed end-to-end PCM rate (mic resampled to this; output requested at this). */
const TARGET_SEND_RATE = 24000;
const OUTPUT_RATE = 24000;

function clampSpeed(n: number): number {
  return Math.min(1.5, Math.max(0.7, n));
}

/** Live audition overrides from the URL — no redeploy needed. */
function readVoiceQuery(): { voice?: string; speed?: number } {
  if (typeof window === 'undefined') return {};
  const q = new URLSearchParams(window.location.search);
  const voice = q.get('voice')?.trim() || undefined;
  const rawSpeed = q.get('speed');
  let speed: number | undefined;
  if (rawSpeed != null && rawSpeed !== '') {
    const n = Number(rawSpeed);
    if (Number.isFinite(n)) speed = clampSpeed(n);
  }
  return { voice, speed };
}

function resolveVoice(serverDefault?: string): string {
  const { voice } = readVoiceQuery();
  // URL override > client MONTI_VOICE default (token may still send an older name)
  return voice || MONTI_VOICE || serverDefault || 'castor';
}

function resolveSpeed(): number {
  const { speed } = readVoiceQuery();
  if (speed != null) return speed;
  return clampSpeed(MONTI_SPEED);
}

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

/** Linear-interpolate mono Float32 from fromRate → toRate. */
function resampleFloat32(
  input: Float32Array,
  fromRate: number,
  toRate: number,
): Float32Array {
  if (!input.length || Math.abs(fromRate - toRate) < 1) {
    return input;
  }
  const ratio = fromRate / toRate;
  const outLen = Math.max(1, Math.round(input.length / ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcPos = i * ratio;
    const i0 = Math.floor(srcPos);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const t = srcPos - i0;
    out[i] = input[i0] * (1 - t) + input[i1] * t;
  }
  return out;
}

export function useMontiVoice(opts: UseMontiVoiceOptions) {
  const optsRef = useRef(opts);
  optsRef.current = opts;

  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micMuteGainRef = useRef<GainNode | null>(null);
  const nextPlayTimeRef = useRef(0);
  const pendingSourcesRef = useRef(0);
  /** Live AudioBufferSourceNodes still scheduled/playing — flushed on barge-in. */
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const mutedRef = useRef(opts.muted);
  const pausedRef = useRef(false);
  const startedRef = useRef(false);
  const sessionReadyRef = useRef(false);
  const greetingSentRef = useRef(false);
  const assistantBufRef = useRef('');
  const pendingToolCallsRef = useRef<
    { name: string; call_id: string; arguments: string }[]
  >([]);
  const responseActiveRef = useRef(false);
  /** Only play audio deltas for this response id (drops stale/overlap). */
  const currentResponseIdRef = useRef<string | null>(null);
  /** Avoid spamming stale-drop logs for every chunk. */
  const staleDropLoggedRef = useRef(false);
  /** Last logged mic gate state (half-duplex: closed while Monti speaks). */
  const micGatedRef = useRef(false);
  /** Rate of PCM chunks we play (session audio.output.format.rate). */
  const outputRateRef = useRef(OUTPUT_RATE);
  /** Rate of PCM we append (must match session audio.input.format.rate). */
  const sendRateRef = useRef(TARGET_SEND_RATE);
  /** True capture AudioContext rate (always resample to 24k before send). */
  const captureRateRef = useRef(TARGET_SEND_RATE);
  /** Remove visibility/focus listeners on stop. */
  const audioFocusCleanupRef = useRef<(() => void) | null>(null);

  /** Half-duplex: mic closed while Monti generates or audio is still draining. */
  const isMicGated = useCallback(() => {
    return (
      pausedRef.current ||
      pendingSourcesRef.current > 0 ||
      responseActiveRef.current
    );
  }, []);

  const syncMicGateLog = useCallback(() => {
    const gated = isMicGated();
    if (gated === micGatedRef.current) return;
    micGatedRef.current = gated;
    console.log(
      gated
        ? '[monti/voice] mic gated (monti speaking)'
        : '[monti/voice] mic open',
    );
  }, [isMicGated]);

  useEffect(() => {
    mutedRef.current = opts.muted;
    if (gainRef.current) {
      gainRef.current.gain.value = opts.muted ? 0 : 1;
    }
  }, [opts.muted]);

  /** Resume suspended AudioContexts and restore speaker gain after pause/focus. */
  const ensureAudioRunning = useCallback(() => {
    const play = playCtxRef.current;
    const capture = audioCtxRef.current;
    if (play && play.state !== 'running') {
      void play.resume().catch(() => {});
    }
    if (capture && capture.state !== 'running') {
      void capture.resume().catch(() => {});
    }
    if (gainRef.current) {
      gainRef.current.gain.value = mutedRef.current ? 0 : 1;
    }
  }, []);

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

  /** Instantly silence any scheduled/playing Monti audio (client-side barge-in). */
  const flushPlayback = useCallback(() => {
    for (const s of activeSourcesRef.current) {
      try {
        s.onended = null;
        s.stop();
      } catch {
        /* already stopped or never started */
      }
    }
    activeSourcesRef.current = [];
    pendingSourcesRef.current = 0;
    const ctx = playCtxRef.current;
    nextPlayTimeRef.current = ctx ? ctx.currentTime : 0;
    setSpeaking(false);
    optsRef.current.onAmplitude(0);
    // Keep context running + gain correct so later chunks aren't silent
    ensureAudioRunning();
    syncMicGateLog();
  }, [ensureAudioRunning, syncMicGateLog]);

  /**
   * Start a model turn — never stack response.create over a live response
   * (causes two Montis / overlapping audio + wasted minutes).
   */
  const requestResponseCreate = useCallback(() => {
    if (responseActiveRef.current) {
      console.log(
        '[monti/voice] cancel before response.create (already active)',
      );
      sendJson({ type: 'response.cancel' });
      responseActiveRef.current = false;
      currentResponseIdRef.current = null;
      flushPlayback();
    }
    sendJson({ type: 'response.create' });
  }, [flushPlayback, sendJson]);

  const playPcmChunk = useCallback(
    (pcm: Int16Array) => {
      const ctx = playCtxRef.current;
      if (!ctx || !pcm.length) return;

      if (ctx.state !== 'running') {
        console.warn(
          '[monti/voice] playback context not running:',
          ctx.state,
          '— resuming',
        );
        void ctx.resume().catch(() => {});
      }
      ensureAudioRunning();

      // Decode at the rate the server is sending (from session.updated).
      const rate = outputRateRef.current;
      const float = new Float32Array(pcm.length);
      for (let i = 0; i < pcm.length; i++) float[i] = pcm[i] / 32768;

      const buffer = ctx.createBuffer(1, float.length, rate);
      buffer.copyToChannel(float, 0);

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      if (gainRef.current) {
        gainRef.current.gain.value = mutedRef.current ? 0 : 1;
      }
      const gain = gainRef.current || ctx.destination;
      src.connect(gain);

      const now = ctx.currentTime;
      const startAt = Math.max(now + 0.02, nextPlayTimeRef.current);
      const ahead = startAt - now;
      if (ahead > 1) {
        console.warn(
          '[monti/voice] playback schedule drift',
          ahead.toFixed(2),
          's ahead — resetting timeline',
        );
        nextPlayTimeRef.current = now + 0.02;
      }
      const playAt = Math.max(now + 0.02, nextPlayTimeRef.current);
      src.start(playAt);
      nextPlayTimeRef.current = playAt + buffer.duration;

      activeSourcesRef.current.push(src);
      pendingSourcesRef.current++;
      syncMicGateLog();
      setSpeaking(true);

      const amp = rmsFromInt16(pcm);
      optsRef.current.onAmplitude(amp);

      src.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(
          (s) => s !== src,
        );
        pendingSourcesRef.current = Math.max(0, pendingSourcesRef.current - 1);
        syncMicGateLog();
        if (pendingSourcesRef.current === 0) {
          setSpeaking(false);
          optsRef.current.onAmplitude(0);
        }
      };
    },
    [ensureAudioRunning, syncMicGateLog],
  );

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
      requestResponseCreate();
    },
    [requestResponseCreate, waitForPlaybackIdle],
  );

  const onServerEvent = useCallback(
    (event: Record<string, unknown>) => {
      const type = event.type as string;

      if (type === 'session.updated') {
        sessionReadyRef.current = true;
        const sess = event.session as
          | {
              audio?: {
                output?: { format?: { rate?: number; type?: string } };
                input?: { format?: { rate?: number; type?: string } };
              };
            }
          | undefined;
        const outRate = sess?.audio?.output?.format?.rate;
        if (typeof outRate === 'number' && outRate > 0) {
          outputRateRef.current = outRate;
        } else {
          outputRateRef.current = OUTPUT_RATE;
        }
        console.log('[monti/voice] session.updated', {
          negotiatedOutputRate: outputRateRef.current,
          inputFormat: sess?.audio?.input?.format,
          outputFormat: sess?.audio?.output?.format,
          playCtxSampleRate: playCtxRef.current?.sampleRate,
          playCtxState: playCtxRef.current?.state,
          captureCtxSampleRate: audioCtxRef.current?.sampleRate,
          captureCtxState: audioCtxRef.current?.state,
        });
        ensureAudioRunning();
        setStatusSafe('live');
        if (!greetingSentRef.current) {
          greetingSentRef.current = true;
          // Kick Monti's opening line
          requestResponseCreate();
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
        // Half-duplex: mic is gated while Monti speaks, so echo barge-in is retired.
        // Pause button is how the user stops him. Ignore VAD when gated/paused.
        if (pausedRef.current || isMicGated()) return;
        setListening(true);
        optsRef.current.onListening(true);
        return;
      }
      if (type === 'input_audio_buffer.speech_stopped') {
        if (pausedRef.current || isMicGated()) return;
        setListening(false);
        optsRef.current.onListening(false);
        return;
      }

      if (type === 'response.created') {
        // Safety: never let a prior turn's scheduled chunks bleed into this one.
        flushPlayback();
        const resp = event.response as { id?: string } | undefined;
        const rid =
          (typeof resp?.id === 'string' && resp.id) ||
          (typeof event.response_id === 'string'
            ? (event.response_id as string)
            : null);
        currentResponseIdRef.current = rid;
        staleDropLoggedRef.current = false;
        responseActiveRef.current = true;
        syncMicGateLog();
        assistantBufRef.current = '';
        pendingToolCallsRef.current = [];
        console.log('[monti/voice] response.created', { responseId: rid });
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
        const rid =
          typeof event.response_id === 'string'
            ? (event.response_id as string)
            : null;
        const current = currentResponseIdRef.current;
        if (current && rid && rid !== current) {
          if (!staleDropLoggedRef.current) {
            staleDropLoggedRef.current = true;
            console.log(
              '[monti/voice] dropped stale audio (response_id mismatch)',
              { got: rid, current },
            );
          }
          return;
        }
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
        const doneId =
          typeof event.response_id === 'string'
            ? (event.response_id as string)
            : (event.response as { id?: string } | undefined)?.id;
        // Only clear active if this done matches current (or we have no id)
        if (
          !doneId ||
          !currentResponseIdRef.current ||
          doneId === currentResponseIdRef.current
        ) {
          responseActiveRef.current = false;
          // Keep currentResponseId until next response.created so late
          // deltas for this id can still play while audio drains.
        }
        // Mic re-opens once generation ends AND scheduled audio has drained
        // (syncMicGateLog also runs on each source onended).
        syncMicGateLog();
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
    [
      ensureAudioRunning,
      flushPlayback,
      handleFunctionCalls,
      isMicGated,
      playPcmChunk,
      requestResponseCreate,
      sendJson,
      setStatusSafe,
      syncMicGateLog,
    ],
  );

  /** Tear down mic graph only (keep stream tracks + WS + contexts). */
  const disconnectMic = useCallback(() => {
    try {
      processorRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    processorRef.current = null;
    try {
      micSourceRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    micSourceRef.current = null;
    try {
      micMuteGainRef.current?.disconnect();
    } catch {
      /* ignore */
    }
    micMuteGainRef.current = null;
  }, []);

  /**
   * Wire mic → ScriptProcessor → silent gain → capture destination.
   * Shared by start() and resume(). Sends only when session ready and not paused.
   */
  const wireMicCapture = useCallback((): boolean => {
    const captureCtx = audioCtxRef.current;
    const stream = streamRef.current;
    if (!captureCtx || !stream) return false;

    disconnectMic();

    try {
      const source = captureCtx.createMediaStreamSource(stream);
      micSourceRef.current = source;
      const bufferSize = 4096;
      const processor = captureCtx.createScriptProcessor(bufferSize, 1, 1);
      processorRef.current = processor;
      // Always send 24 kHz PCM (resample from browser capture rate).
      const actualCaptureRate = captureRateRef.current;
      const sendRate = TARGET_SEND_RATE;
      sendRateRef.current = sendRate;

      processor.onaudioprocess = (e) => {
        if (pausedRef.current) return;
        // Half-duplex: never stream mic while Monti is generating or playing
        // (blocks speaker→mic echo from triggering server VAD).
        if (
          pendingSourcesRef.current > 0 ||
          responseActiveRef.current
        ) {
          return;
        }
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }
        if (!sessionReadyRef.current) return;
        const channel = e.inputBuffer.getChannelData(0);
        const copied = new Float32Array(channel.length);
        copied.set(channel);
        const floats =
          Math.abs(actualCaptureRate - sendRate) > 1
            ? resampleFloat32(copied, actualCaptureRate, sendRate)
            : copied;
        const pcm = floatTo16BitPCM(floats);
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
      const mute = captureCtx.createGain();
      mute.gain.value = 0;
      micMuteGainRef.current = mute;
      processor.connect(mute);
      mute.connect(captureCtx.destination);
      return true;
    } catch (e) {
      console.error('[monti/voice] mic pipeline failed', e);
      disconnectMic();
      return false;
    }
  }, [disconnectMic]);

  const pause = useCallback(() => {
    if (!startedRef.current || pausedRef.current) return;
    pausedRef.current = true;
    setPaused(true);

    // Stop mic streaming (keep tracks alive for resume; keep WS open)
    disconnectMic();
    syncMicGateLog();

    // Silence Monti mid-sentence if talking
    flushPlayback();
    if (responseActiveRef.current) {
      sendJson({ type: 'response.cancel' });
      responseActiveRef.current = false;
      currentResponseIdRef.current = null;
    }
    syncMicGateLog();
    setListening(false);
    setSpeaking(false);
    optsRef.current.onListening(false);
    optsRef.current.onAmplitude(0);
    ensureAudioRunning();
  }, [
    disconnectMic,
    ensureAudioRunning,
    flushPlayback,
    sendJson,
    syncMicGateLog,
  ]);

  const resume = useCallback(() => {
    if (!startedRef.current || !pausedRef.current) return;
    if (!streamRef.current || !audioCtxRef.current || !wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;

    ensureAudioRunning();
    const ok = wireMicCapture();
    if (!ok) {
      optsRef.current.onError?.(
        'Could not resume the mic — try typing, or refresh.',
      );
      return;
    }
    pausedRef.current = false;
    setPaused(false);
    syncMicGateLog();
  }, [ensureAudioRunning, syncMicGateLog, wireMicCapture]);

  const stop = useCallback(() => {
    startedRef.current = false;
    sessionReadyRef.current = false;
    greetingSentRef.current = false;
    responseActiveRef.current = false;
    currentResponseIdRef.current = null;
    staleDropLoggedRef.current = false;
    pausedRef.current = false;
    setPaused(false);
    micGatedRef.current = false;

    if (audioFocusCleanupRef.current) {
      audioFocusCleanupRef.current();
      audioFocusCleanupRef.current = null;
    }

    disconnectMic();

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    try {
      wsRef.current?.close();
    } catch {
      /* ignore */
    }
    wsRef.current = null;

    flushPlayback();

    void audioCtxRef.current?.close().catch(() => {});
    void playCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    playCtxRef.current = null;
    gainRef.current = null;

    setListening(false);
    setStatusSafe('idle');
    optsRef.current.onListening(false);
  }, [disconnectMic, flushPlayback, setStatusSafe]);

  const start = useCallback(async (): Promise<boolean> => {
    if (startedRef.current) return true;
    pausedRef.current = false;
    setPaused(false);
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
          autoGainControl: true,
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

    // --- Capture: browser may keep 44.1/48k; we always resample to 24k before send ---
    const captureCtx = new AudioContext({ sampleRate: TARGET_SEND_RATE });
    await captureCtx.resume().catch(() => {});
    const actualCaptureRate = captureCtx.sampleRate;
    captureRateRef.current = actualCaptureRate;
    // Fixed end-to-end send rate (never declare browser native if it differs)
    const sendRate = TARGET_SEND_RATE;
    sendRateRef.current = sendRate;

    console.log('[monti/voice] capture rates', {
      requested: TARGET_SEND_RATE,
      actual: actualCaptureRate,
      send: sendRate,
      alwaysResampleTo24k: Math.abs(actualCaptureRate - sendRate) > 1,
    });

    audioCtxRef.current = captureCtx;

    // --- Playback: request 24k; session.updated may refine outputRateRef ---
    outputRateRef.current = OUTPUT_RATE;
    const playCtx = new AudioContext({ sampleRate: OUTPUT_RATE });
    await playCtx.resume().catch(() => {});
    playCtxRef.current = playCtx;
    const pctx = playCtx;
    const gain = pctx.createGain();
    gain.gain.value = mutedRef.current ? 0 : 1;
    gain.connect(pctx.destination);
    gainRef.current = gain;
    nextPlayTimeRef.current = pctx.currentTime;

    // Keep AudioContexts alive across tab blur / focus
    if (audioFocusCleanupRef.current) {
      audioFocusCleanupRef.current();
    }
    const onVis = () => {
      if (!startedRef.current) return;
      if (document.visibilityState === 'visible') ensureAudioRunning();
    };
    const onFocus = () => {
      if (!startedRef.current) return;
      ensureAudioRunning();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    audioFocusCleanupRef.current = () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
    };

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
        // Exact schema from xAI docs:
        // audio.input|output.format = { type: "audio/pcm", rate: N }
        sendJson({
          type: 'session.update',
          session: {
            instructions: tokenPayload.instructions,
            voice: resolveVoice(tokenPayload.voice),
            turn_detection: {
              type: 'server_vad',
              threshold: 0.9,
              prefix_padding_ms: 300,
              silence_duration_ms: 600,
            },
            audio: {
              input: {
                format: {
                  type: 'audio/pcm',
                  rate: TARGET_SEND_RATE, // always 24000 after resample
                },
              },
              output: {
                format: {
                  type: 'audio/pcm',
                  rate: OUTPUT_RATE, // 24000
                },
                speed: resolveSpeed(),
              },
            },
            tools: [FILL_SITE_TOOL, SEND_TO_RICH_TOOL],
          },
        });

        // Start streaming mic — PCM rate must match sendRate declared above
        if (!wireMicCapture()) {
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
  }, [
    ensureAudioRunning,
    onServerEvent,
    sendJson,
    setStatusSafe,
    stop,
    wireMicCapture,
  ]);

  // Cleanup on unmount
  useEffect(() => () => stop(), [stop]);

  return {
    start,
    stop,
    pause,
    resume,
    status,
    speaking,
    listening,
    paused,
  };
}
