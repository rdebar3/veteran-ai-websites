'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import type { TrackReference } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import GlowCanvas, { type GlowCanvasHandle } from '@/components/monti/GlowCanvas';
import styles from './monti-live.module.css';

type SessionPhase = 'idle' | 'connecting' | 'live' | 'error';

type TokenPayload = {
  token: string;
  url: string;
  roomName: string;
};

function statusLabel(
  phase: SessionPhase,
  agentState: string | undefined,
  error: string | null,
): string {
  if (phase === 'idle') return 'Ready when you are';
  if (phase === 'connecting') return 'Connecting…';
  if (phase === 'error') return error ?? 'Something went wrong';
  switch (agentState) {
    case 'speaking':
      return 'Monti speaking';
    case 'thinking':
      return 'Thinking…';
    case 'listening':
      return 'Listening…';
    case 'connecting':
    case 'initializing':
      return 'Connecting…';
    default:
      return 'Listening…';
  }
}

/** Drive GlowCanvas from the agent's remote audio track via AnalyserNode. */
function useAgentAmplitude(
  audioTrack: TrackReference | undefined,
  glowRef: React.RefObject<GlowCanvasHandle | null>,
  agentState: string | undefined,
) {
  useEffect(() => {
    const publication = audioTrack?.publication;
    const track = publication?.track;
    const mediaStreamTrack = track?.mediaStreamTrack;
    if (!mediaStreamTrack) {
      glowRef.current?.setAmplitude(0);
      return;
    }

    let cancelled = false;
    let raf = 0;
    let ctx: AudioContext | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AudioCtx();
      const stream = new MediaStream([mediaStreamTrack]);
      source = ctx.createMediaStreamSource(stream);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      // Do NOT connect to destination — LiveKit RoomAudioRenderer plays the track.
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);

      const tick = () => {
        if (cancelled || !analyser) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i]! - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const level = Math.min(1, rms * 3.2);
        glowRef.current?.setAmplitude(level);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } catch (err) {
      console.warn('[monti/live] amplitude analyser failed', err);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      try {
        source?.disconnect();
      } catch {
        /* ignore */
      }
      void ctx?.close();
      glowRef.current?.setAmplitude(0);
    };
  }, [audioTrack, glowRef]);

  useEffect(() => {
    glowRef.current?.setListening(agentState === 'listening');
  }, [agentState, glowRef]);
}

function LiveSessionInner({
  glowRef,
  onFatal,
}: {
  glowRef: React.RefObject<GlowCanvasHandle | null>;
  onFatal: (message: string) => void;
}) {
  const room = useRoomContext();
  const { state: agentState, audioTrack } = useVoiceAssistant();

  useAgentAmplitude(audioTrack, glowRef, agentState);

  useEffect(() => {
    void room.startAudio().catch(() => {
      /* autoplay unlock — Start button already provided a gesture */
    });
  }, [room]);

  useEffect(() => {
    const onDisconnected = () => {
      glowRef.current?.setAmplitude(0);
      glowRef.current?.setListening(false);
    };
    room.on(RoomEvent.Disconnected, onDisconnected);
    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
    };
  }, [room, glowRef]);

  useEffect(() => {
    const onMediaError = (err: Error) => {
      const msg = err?.message?.toLowerCase() ?? '';
      if (
        msg.includes('permission') ||
        msg.includes('not allowed') ||
        msg.includes('denied') ||
        err?.name === 'NotAllowedError'
      ) {
        onFatal(
          'Microphone access is required for this test. Allow the mic and try again.',
        );
      }
    };
    room.on(RoomEvent.MediaDevicesError, onMediaError);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onMediaError);
    };
  }, [room, onFatal]);

  return (
    <>
      <RoomAudioRenderer />
      <p className={styles.status} role="status" aria-live="polite">
        {statusLabel('live', agentState, null)}
      </p>
    </>
  );
}

export default function MontiLiveClient() {
  const glowRef = useRef<GlowCanvasHandle>(null);
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<TokenPayload | null>(null);

  const handleFatal = useCallback((message: string) => {
    setError(message);
    setPhase('error');
    setConnection(null);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setPhase('connecting');
    try {
      const res = await fetch('/api/monti/livekit-token', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as TokenPayload & {
        error?: string;
      };
      if (!res.ok || !data.token || !data.url) {
        throw new Error(data.error || 'Could not start a voice session');
      }
      setConnection({
        token: data.token,
        url: data.url,
        roomName: data.roomName,
      });
      setPhase('live');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not start a voice session';
      setError(message);
      setPhase('error');
      setConnection(null);
    }
  }, []);

  const end = useCallback(() => {
    setConnection(null);
    setPhase('idle');
    setError(null);
    glowRef.current?.setAmplitude(0);
    glowRef.current?.setListening(false);
  }, []);

  const label = statusLabel(phase, undefined, error);

  return (
    <div className={styles.root}>
      <GlowCanvas ref={glowRef} className={styles.glow} />

      <div className={styles.dock}>
        {phase === 'live' && connection ? (
          <LiveKitRoom
            serverUrl={connection.url}
            token={connection.token}
            connect
            audio
            video={false}
            onError={(err) => {
              console.error('[monti/live] room error', err);
              const msg = err?.message?.toLowerCase() ?? '';
              if (
                msg.includes('permission') ||
                msg.includes('not allowed') ||
                msg.includes('denied') ||
                err?.name === 'NotAllowedError'
              ) {
                handleFatal(
                  'Microphone access is required for this test. Allow the mic and try again.',
                );
              } else {
                handleFatal(err?.message || 'Connection failed');
              }
            }}
            onDisconnected={() => {
              setPhase((p) => (p === 'live' ? 'idle' : p));
              setConnection(null);
            }}
            className={styles.room}
          >
            <LiveSessionInner glowRef={glowRef} onFatal={handleFatal} />
          </LiveKitRoom>
        ) : (
          <p className={styles.status} role="status" aria-live="polite">
            {label}
          </p>
        )}

        <div className={styles.actions}>
          {phase === 'idle' || phase === 'error' ? (
            <button
              type="button"
              className={styles.btn}
              onClick={() => void start()}
            >
              Start talking
            </button>
          ) : phase === 'connecting' ? (
            <button type="button" className={styles.btn} disabled>
              Connecting…
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              onClick={end}
            >
              End
            </button>
          )}
        </div>

        {phase === 'error' && error ? (
          <p className={styles.error}>{error}</p>
        ) : null}

        <p className={styles.hint}>
          LiveKit voice test · agent must be running locally
        </p>
      </div>
    </div>
  );
}
