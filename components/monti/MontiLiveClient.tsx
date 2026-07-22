'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LiveKitRoom,
  useConnectionState,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import type { TrackReference } from '@livekit/components-react';
import {
  ConnectionState,
  RoomEvent,
  type Participant,
  type DataPacket_Kind,
} from 'livekit-client';
import BrowserFrame from '@/components/monti/BrowserFrame';
import GlowCanvas, { type GlowCanvasHandle } from '@/components/monti/GlowCanvas';
import LeadCard from '@/components/monti/LeadCard';
import TradesTemplate from '@/components/monti/TradesTemplate';
import { emptyRecord, recordForLead } from '@/lib/monti/contract';
import {
  hasPhoto,
  photoUrl,
  pickTradePhotoVariants,
  preloadPhotoUrl,
  type PhotoVariants,
} from '@/lib/monti/photos';
import { tradeLabel } from '@/lib/monti/trade-labels';
import type { FillSection, MontiRecord } from '@/lib/monti/types';
import { applyFill } from '@/lib/monti/validate';

const TOPIC_FILL = 'monti_fill';
const TOPIC_LEAD = 'monti_lead';
const CORE_FILLS: FillSection[] = ['hero', 'services', 'contact', 'about'];

/** Mobile boost only — desktop stays plain <audio> (pre-regression behavior). */
const MONTI_GAIN_MOBILE = 2.0;
const BOOST_WATCHDOG_MS = 1500;
/** Analyser RMS while agent speaking below this → treat graph as dead. */
const BOOST_SILENCE_RMS = 0.004;

type SessionPhase = 'idle' | 'connecting' | 'live' | 'error';
type BuildPhase = 'chat' | 'handoff' | 'done';
/** element = hear via <audio>; webaudio = mobile boost path */
type PlaybackMode = 'element' | 'webaudio';

type TokenPayload = {
  token: string;
  url: string;
  roomName: string;
};

function slug(s: string): string {
  return (
    (s || 'yoursite')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 22) || 'yoursite'
  );
}

function voiceStatusLabel(agentState: string | undefined): string {
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

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === 'undefined') return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext ||
    null
  );
}

function isMobileAudioDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

/**
 * Fail-OPEN agent audio:
 * - Always attach a playing <audio> (WebRTC needs it; desktop hears this).
 * - Mobile: try gain(2)+compressor → speakers with element muted; watchdog falls back to element.
 * - Never call track.setVolume(0) — that can silence LiveKit webAudioMix entirely.
 */
function useAgentPlayback(
  audioTrack: TrackReference | undefined,
  glowRef: React.RefObject<GlowCanvasHandle | null>,
  agentState: string | undefined,
  muted: boolean,
  audioCtxRef: React.RefObject<AudioContext | null>,
) {
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const modeRef = useRef<PlaybackMode>('element');
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const agentStateRef = useRef(agentState);
  agentStateRef.current = agentState;

  const applyMuteToOutputs = useCallback(() => {
    const el = audioElRef.current;
    const mode = modeRef.current;
    const isMuted = mutedRef.current;
    if (mode === 'webaudio' && gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : MONTI_GAIN_MOBILE;
      if (el) {
        el.muted = true; // element stays muted while boost owns speakers
        el.volume = 1;
      }
    } else if (el) {
      el.muted = isMuted;
      el.volume = 1;
    }
    if (isMuted) glowRef.current?.setAmplitude(0);
  }, [glowRef]);

  useEffect(() => {
    applyMuteToOutputs();
  }, [muted, applyMuteToOutputs]);

  useEffect(() => {
    glowRef.current?.setListening(!muted && agentState === 'listening');
  }, [agentState, glowRef, muted]);

  // Resume suspended context on gesture (iOS recovery)
  useEffect(() => {
    const resume = () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        void ctx.resume().then(() => {
          console.info('[monti/live] AudioContext resumed →', ctx.state);
        });
      }
    };
    window.addEventListener('pointerdown', resume, { passive: true });
    window.addEventListener('touchstart', resume, { passive: true });
    window.addEventListener('keydown', resume);
    return () => {
      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('touchstart', resume);
      window.removeEventListener('keydown', resume);
    };
  }, [audioCtxRef]);

  useEffect(() => {
    const publication = audioTrack?.publication;
    const track = publication?.track;
    if (!track || !('attach' in track) || typeof track.attach !== 'function') {
      glowRef.current?.setAmplitude(0);
      return;
    }

    const mediaStreamTrack = track.mediaStreamTrack;
    if (!mediaStreamTrack) {
      glowRef.current?.setAmplitude(0);
      return;
    }

    let cancelled = false;
    let raf = 0;
    let watchdogTimer = 0;
    let source: MediaStreamAudioSourceNode | null = null;
    let analyser: AnalyserNode | null = null;
    let gain: GainNode | null = null;
    let compressor: DynamicsCompressorNode | null = null;
    let sawEnergy = false;
    let sawAgentSpeaking = false;
    let boostDisconnected = false;

    // Always-on element path (desktop output + WebRTC requirement)
    const el = document.createElement('audio');
    el.autoplay = true;
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.volume = 1;
    el.muted = mutedRef.current;
    // Keep in DOM for autoplay policies on some browsers
    el.style.display = 'none';
    document.body.appendChild(el);
    track.attach(el);
    audioElRef.current = el;
    void el.play().catch((err) => {
      console.warn('[monti/live] audio element play() failed', err);
    });

    modeRef.current = 'element';
    gainNodeRef.current = null;

    const disconnectBoost = (reason: string) => {
      if (boostDisconnected) return;
      boostDisconnected = true;
      modeRef.current = 'element';
      gainNodeRef.current = null;
      try {
        gain?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        compressor?.disconnect();
      } catch {
        /* ignore */
      }
      // Keep source→analyser for glow if present
      try {
        if (source && gain) source.disconnect(gain);
      } catch {
        /* ignore */
      }
      el.muted = mutedRef.current;
      el.volume = 1;
      void el.play().catch(() => {});
      console.warn(
        `[monti/live] WebAudio boost failed — fell back to element playback (${reason})`,
      );
    };

    const wantBoost = isMobileAudioDevice();
    const ctx = audioCtxRef.current;

    // Glow analyser (and optional mobile boost) need a running AudioContext
    if (ctx && ctx.state !== 'closed') {
      void ctx.resume().then(() => {
        if (cancelled) return;
        console.info('[monti/live] AudioContext state →', ctx.state);

        try {
          const stream = new MediaStream([mediaStreamTrack]);
          source = ctx.createMediaStreamSource(stream);
          analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.75;
          source.connect(analyser);

          if (wantBoost && ctx.state === 'running') {
            gain = ctx.createGain();
            gain.gain.value = mutedRef.current ? 0 : MONTI_GAIN_MOBILE;
            gainNodeRef.current = gain;

            compressor = ctx.createDynamicsCompressor();
            compressor.threshold.value = -10;
            compressor.knee.value = 6;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;

            source.connect(gain);
            gain.connect(compressor);
            compressor.connect(ctx.destination);

            // Element silent while boost owns speakers (no setVolume on track)
            el.muted = true;
            modeRef.current = 'webaudio';
            console.info('[monti/live] mobile boost path active (gain=', MONTI_GAIN_MOBILE, ')');

            watchdogTimer = window.setTimeout(() => {
              if (cancelled || boostDisconnected) return;
              if (ctx.state !== 'running') {
                disconnectBoost(`ctx.state=${ctx.state}`);
                return;
              }
              // If agent spoke but analyser stayed dead, boost graph is not hearing
              if (sawAgentSpeaking && !sawEnergy) {
                disconnectBoost('no analyser energy while agent speaking');
              }
            }, BOOST_WATCHDOG_MS);
          } else if (wantBoost && ctx.state !== 'running') {
            console.warn(
              '[monti/live] AudioContext not running on mobile — element playback only, state=',
              ctx.state,
            );
            el.muted = mutedRef.current;
          } else {
            // Desktop: element is the speaker; analyser is glow-only
            el.muted = mutedRef.current;
            modeRef.current = 'element';
          }

          const data = new Uint8Array(analyser.fftSize);
          const tick = () => {
            if (cancelled || !analyser) return;
            if (agentStateRef.current === 'speaking') sawAgentSpeaking = true;

            if (mutedRef.current) {
              glowRef.current?.setAmplitude(0);
            } else {
              analyser.getByteTimeDomainData(data);
              let sum = 0;
              for (let i = 0; i < data.length; i++) {
                const v = (data[i]! - 128) / 128;
                sum += v * v;
              }
              const rms = Math.sqrt(sum / data.length);
              if (rms > BOOST_SILENCE_RMS) sawEnergy = true;
              glowRef.current?.setAmplitude(Math.min(1, rms * 3.2));
            }
            raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        } catch (err) {
          console.warn('[monti/live] Web Audio graph setup failed', err);
          el.muted = mutedRef.current;
          modeRef.current = 'element';
        }
      });
    } else {
      console.warn(
        '[monti/live] No AudioContext — element playback only (glow amplitude limited)',
      );
      el.muted = mutedRef.current;
    }

    applyMuteToOutputs();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (watchdogTimer) window.clearTimeout(watchdogTimer);
      gainNodeRef.current = null;
      audioElRef.current = null;
      modeRef.current = 'element';
      try {
        source?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        gain?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        compressor?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        analyser?.disconnect();
      } catch {
        /* ignore */
      }
      try {
        track.detach(el);
      } catch {
        /* ignore */
      }
      try {
        el.pause();
        el.removeAttribute('src');
        el.load();
        el.remove();
      } catch {
        /* ignore */
      }
      glowRef.current?.setAmplitude(0);
    };
  }, [audioTrack, glowRef, audioCtxRef, applyMuteToOutputs]);
}

function LiveSessionShell({
  glowRef,
  onEnd,
  micEnabled,
  noMicNote,
  audioCtxRef,
}: {
  glowRef: React.RefObject<GlowCanvasHandle | null>;
  onEnd: () => void;
  micEnabled: boolean;
  noMicNote: boolean;
  audioCtxRef: React.RefObject<AudioContext | null>;
}) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const connected = connectionState === ConnectionState.Connected;
  const agentReady =
    connected &&
    !!agentState &&
    agentState !== 'connecting' &&
    agentState !== 'initializing' &&
    agentState !== 'disconnected';

  const recordRef = useRef<MontiRecord>(emptyRecord());
  const leadSentRef = useRef(false);
  const pendingTextsRef = useRef<string[]>([]);
  /** Lock photo variants once trade is known — stable for the whole build. */
  const photoTradeLockedRef = useRef<string | null>(null);

  const [record, setRecord] = useState<MontiRecord>(() => emptyRecord());
  const [fill, setFill] = useState<FillSection[]>([]);
  const [building, setBuilding] = useState(false);
  const [statusText, setStatusText] = useState('building…');
  const [statusDone, setStatusDone] = useState(false);
  const [showHeroSkel, setShowHeroSkel] = useState(false);
  const [showServicesSkel, setShowServicesSkel] = useState(false);
  const [buildPhase, setBuildPhase] = useState<BuildPhase>('chat');
  const [showLead, setShowLead] = useState(false);
  const [caption, setCaption] = useState('');
  /** Output mute — silences Monti's voice on visitor speakers only. */
  const [muted, setMuted] = useState(false);
  /**
   * Input mic publish. Starts on when the session joined with a mic.
   * Typed-only sessions (micEnabled=false) never show a mic control.
   */
  const [micOn, setMicOn] = useState(micEnabled);
  const [leadFailed, setLeadFailed] = useState(false);
  const [leadBusy, setLeadBusy] = useState(false);
  const [draft, setDraft] = useState('');
  const [sendingText, setSendingText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [photoVariants, setPhotoVariants] = useState<PhotoVariants>({
    hero: 0,
    support: 0,
  });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useAgentPlayback(audioTrack, glowRef, agentState, muted, audioCtxRef);

  useEffect(() => {
    recordRef.current = record;
  }, [record]);

  // Per-session photo rotation: pick once when trade is first known, preload hero.
  useEffect(() => {
    const trade = record.trade_key || record.hero?.image_id || null;
    if (!trade || !hasPhoto(trade) || trade === 'wv_hero') return;
    if (photoTradeLockedRef.current === trade) return;
    photoTradeLockedRef.current = trade;
    const variants = pickTradePhotoVariants(trade);
    setPhotoVariants(variants);
    preloadPhotoUrl(photoUrl(trade, 'hero', variants.hero));
  }, [record.trade_key, record.hero?.image_id]);

  useEffect(() => {
    void room.startAudio().catch(() => {});
    const ctx = audioCtxRef.current;
    if (ctx?.state === 'suspended') {
      void ctx.resume().then(() => {
        console.info('[monti/live] AudioContext after startAudio →', ctx.state);
      });
    }
  }, [room, audioCtxRef]);

  // Mic denied after connect: do not dead-end; typing path stays open
  useEffect(() => {
    const onMediaError = (err: Error) => {
      const msg = err?.message?.toLowerCase() ?? '';
      if (
        msg.includes('permission') ||
        msg.includes('not allowed') ||
        msg.includes('denied') ||
        err?.name === 'NotAllowedError'
      ) {
        console.warn('[monti/live] mic unavailable — type to Monti', err);
      }
    };
    room.on(RoomEvent.MediaDevicesError, onMediaError);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onMediaError);
    };
  }, [room]);

  // Captions from agent transcription when available
  useEffect(() => {
    const onTx = (
      segments: Array<{ text?: string; final?: boolean }>,
      participant?: Participant,
    ) => {
      if (!participant?.isAgent) return;
      const text = segments
        .map((s) => s.text || '')
        .join(' ')
        .trim();
      if (text) setCaption(text);
    };
    room.on(RoomEvent.TranscriptionReceived, onTx);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, onTx);
    };
  }, [room]);

  const deliverText = useCallback(
    async (text: string) => {
      // LiveKit Agents text input: lk.chat topic → user turn
      // https://docs.livekit.io/agents/build/text/
      await room.localParticipant.sendText(text, { topic: 'lk.chat' });
    },
    [room],
  );

  // Flush messages typed before the agent finished joining
  useEffect(() => {
    if (!agentReady || pendingTextsRef.current.length === 0) return;
    const queued = pendingTextsRef.current.splice(0);
    void (async () => {
      for (const text of queued) {
        try {
          await deliverText(text);
        } catch (err) {
          console.warn('[monti/live] flush sendText failed', err);
          setCaption("Couldn't send — try again");
          // Re-queue remaining on hard failure
          pendingTextsRef.current.unshift(
            ...queued.slice(queued.indexOf(text) + 1),
          );
          break;
        }
      }
    })();
  }, [agentReady, deliverText]);

  const sendTypedMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = draft.trim();
      if (!text || !connected || sendingText) return;

      setCaption(`You: ${text}`);
      setDraft('');

      if (!agentReady) {
        pendingTextsRef.current.push(text);
        return;
      }

      setSendingText(true);
      try {
        await deliverText(text);
      } catch (err) {
        console.warn('[monti/live] sendText failed', err);
        setCaption("Couldn't send — try again");
      } finally {
        setSendingText(false);
      }
    },
    [draft, connected, sendingText, agentReady, deliverText],
  );

  /** Cut local mic publish so room noise stops reaching the agent. */
  const toggleMic = useCallback(async () => {
    if (!micEnabled || !connected) return;
    const next = !micOn;
    try {
      await room.localParticipant.setMicrophoneEnabled(next);
      setMicOn(next);
    } catch (err) {
      console.warn('[monti/live] setMicrophoneEnabled failed', err);
    }
  }, [micEnabled, connected, micOn, room]);

  const applySiteUpdate = useCallback(
    (opts: {
      record: MontiRecord;
      fill: FillSection[];
      template_id?: 'trades' | null;
      hero_image_id?: string | null;
      forceHandoff?: boolean;
    }) => {
      setRecord(opts.record);
      recordRef.current = opts.record;

      setFill((prev) => {
        const next = new Set(prev);
        for (const f of opts.fill) next.add(f);
        const arr = Array.from(next) as FillSection[];

        const name = opts.record.business?.name || '';
        const hasHero =
          arr.includes('hero') ||
          opts.template_id === 'trades' ||
          opts.record.template_id === 'trades' ||
          !!opts.hero_image_id ||
          !!opts.record.trade_key;

        if (name) {
          setBuilding(true);
          setShowHeroSkel(!arr.includes('hero'));
          setStatusText(
            arr.includes('hero') ? 'building the hero…' : 'framing your homepage…',
          );
        } else if (hasHero) {
          setBuilding(true);
          setShowHeroSkel(false);
          setStatusText('framing your homepage…');
        }

        if (arr.includes('hero') && !arr.includes('services')) {
          setShowServicesSkel(true);
        }
        if (arr.includes('services')) {
          setShowServicesSkel(false);
          setStatusText('adding your services…');
        }
        if (arr.includes('about')) {
          setStatusText('finishing your site…');
        }
        if (arr.includes('contact')) {
          setStatusText('adding contact…');
        }

        const allCore = CORE_FILLS.every((s) => arr.includes(s));
        if (opts.forceHandoff || allCore) {
          setStatusText('site ready');
          setStatusDone(true);
          setBuildPhase((p) => (p === 'done' ? p : 'handoff'));
        }

        return arr;
      });
    },
    [],
  );

  const sendLeadOnce = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
  }> => {
    if (leadSentRef.current) return { ok: true };
    if (leadBusy) return { ok: false, error: 'busy' };

    const current = recordRef.current;
    if (!current.business?.name?.trim()) {
      setLeadFailed(true);
      setCaption("Need a business name before we can send this to Rich.");
      return { ok: false, error: 'Need a business name first' };
    }

    setLeadBusy(true);
    try {
      const res = await fetch('/api/monti/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: recordForLead(current) }),
      });
      if (!res.ok) {
        setLeadFailed(true);
        setCaption("Hmm — couldn't reach Rich's inbox just now.");
        return { ok: false, error: 'Failed to save lead' };
      }
      leadSentRef.current = true;
      setLeadFailed(false);
      setShowLead(true);
      setBuildPhase('done');
      setStatusText('site ready');
      setStatusDone(true);
      const phone = current.business.phone || 'your number';
      setCaption(
        `Done — Rich has it. Expect a friendly call or text at ${phone}.`,
      );
      return { ok: true };
    } catch {
      setLeadFailed(true);
      setCaption("Hmm — couldn't reach Rich's inbox just now.");
      return { ok: false, error: 'Network error' };
    } finally {
      setLeadBusy(false);
    }
  }, [leadBusy]);

  // LiveKit data messages from agent tools
  useEffect(() => {
    const decoder = new TextDecoder();
    const onData = (
      payload: Uint8Array,
      _participant?: Participant,
      _kind?: DataPacket_Kind,
      topic?: string,
    ) => {
      const text = decoder.decode(payload);
      if (topic === TOPIC_FILL || (!topic && text.includes('"business"'))) {
        try {
          const parsed = JSON.parse(text) as unknown;
          // Prefer explicit topic; ignore lead-shaped payloads on fill path
          if (
            parsed &&
            typeof parsed === 'object' &&
            (parsed as { type?: string }).type === 'send_to_rich'
          ) {
            void sendLeadOnce();
            return;
          }
          const result = applyFill(recordRef.current, parsed);
          applySiteUpdate({
            record: result.record,
            fill: result.fill,
            template_id: result.template_id,
            hero_image_id: result.hero_image_id,
          });
        } catch (err) {
          console.warn('[monti/live] bad monti_fill payload', err);
        }
        return;
      }
      if (topic === TOPIC_LEAD) {
        void sendLeadOnce();
      }
    };

    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, applySiteUpdate, sendLeadOnce]);

  const url = `${slug(record.business.name)}.com`;
  const promptText =
    caption ||
    (buildPhase === 'done'
      ? 'All set.'
      : agentState === 'speaking'
        ? 'Monti speaking…'
        : voiceStatusLabel(agentState));

  const showHandoffChip =
    buildPhase === 'handoff' && !showLead && !leadFailed;
  const showRetryChip = leadFailed && !showLead;

  return (
    <>
      {/* Agent audio: dedicated <audio> in useAgentPlayback (not RoomAudioRenderer) */}
      {/* Fixed controls — always on top of glow, dock, and site pane */}
      <div className="monti-live-fixed-bar" role="toolbar" aria-label="Session controls">
        {micEnabled ? (
          <button
            type="button"
            className={`monti-live-fixed-btn monti-live-fixed-btn--quiet${
              !micOn ? ' is-quiet' : ''
            }`}
            onClick={() => void toggleMic()}
            aria-pressed={!micOn}
            aria-label={micOn ? 'Turn microphone off' : 'Turn microphone on'}
            title={
              micOn
                ? 'Stop sending your mic to Monti'
                : 'Send your mic to Monti again'
            }
          >
            {micOn ? 'Mic off' : 'Mic on'}
          </button>
        ) : null}
        <button
          type="button"
          className={`monti-live-fixed-btn monti-live-fixed-btn--quiet${
            muted ? ' is-quiet' : ''
          }`}
          onClick={() => setMuted((m) => !m)}
          aria-pressed={muted}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          title={
            muted
              ? "Hear Monti's voice again"
              : "Silence Monti's voice (captions stay on)"
          }
        >
          {muted ? 'Sound on' : 'Sound off'}
        </button>
        <button
          type="button"
          className="monti-live-fixed-btn monti-live-fixed-btn--end"
          onClick={onEnd}
        >
          End
        </button>
      </div>
      <div className={`monti-app${building ? ' building' : ''}`}>
        <div className="monti-pane">
          <GlowCanvas
            ref={glowRef}
            muted={muted}
            paused={building && isMobile}
            className="monti-glow"
          />
          <div className="monti-top">
            <div className="monti-logo">
              <b>▲</b> M O N T I
            </div>
          </div>
          <div className="monti-glow-spacer" aria-hidden="true" />
          <div className="monti-dock">
            <div className="monti-dock-panel">
              <div
                className={`monti-prompt${agentState === 'thinking' ? ' busy' : ''}`}
                role="status"
                aria-live="polite"
              >
                {promptText}
              </div>
              {(showHandoffChip || showRetryChip) && (
                <div className="monti-chips">
                  {showRetryChip ? (
                    <button
                      type="button"
                      className="monti-chip"
                      disabled={leadBusy}
                      onClick={() => void sendLeadOnce()}
                    >
                      {leadBusy ? 'Sending…' : 'Try again — send it to Rich'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="monti-chip"
                      disabled={leadBusy}
                      onClick={() => void sendLeadOnce()}
                    >
                      {leadBusy ? 'Sending…' : 'Send it to Rich'}
                    </button>
                  )}
                </div>
              )}
              {noMicNote ? (
                <p
                  style={{
                    margin: '10px 0 0',
                    fontSize: 13,
                    color: 'rgba(243, 230, 212, 0.55)',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  No mic? No problem — type to Monti below.
                </p>
              ) : null}
              <form
                className="monti-ask"
                style={{ marginTop: 12 }}
                onSubmit={(e) => void sendTypedMessage(e)}
              >
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    !connected
                      ? 'Connecting…'
                      : !agentReady
                        ? 'Almost ready…'
                        : 'Type to Monti…'
                  }
                  disabled={!connected || sendingText}
                  autoComplete="off"
                  aria-label="Message Monti"
                />
                <button
                  type="submit"
                  className="monti-go"
                  disabled={!connected || sendingText || !draft.trim()}
                  aria-label="Send"
                >
                  →
                </button>
              </form>
              <p
                className={
                  micEnabled && !micOn
                    ? 'monti-live-status monti-live-status--mic-off'
                    : 'monti-live-status'
                }
                role="status"
              >
                {micEnabled && !micOn
                  ? 'Mic off — type to Monti'
                  : `${voiceStatusLabel(agentState)}${
                      micEnabled ? '' : ' · text'
                    } · LiveKit`}
              </p>
            </div>
          </div>
        </div>

        <div className="monti-site">
          <BrowserFrame
            url={url}
            statusText={statusText}
            statusDone={statusDone}
          >
            <TradesTemplate
              record={record}
              fill={fill}
              showHeroSkeleton={showHeroSkel && !fill.includes('hero')}
              showServicesSkeleton={
                showServicesSkel && !fill.includes('services')
              }
              photoVariants={photoVariants}
            />
          </BrowserFrame>
        </div>
      </div>

      {showLead ? (
        <LeadCard
          name={record.business.name}
          category={tradeLabel(record.trade_key || record.hero.image_id)}
          area={record.business.service_area}
          phone={record.business.phone}
        />
      ) : null}
    </>
  );
}

/** Probe mic once; release tracks immediately. Failure → text-only path. */
async function probeMicrophone(): Promise<boolean> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

export default function MontiLiveClient() {
  const glowRef = useRef<GlowCanvasHandle>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<TokenPayload | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [noMicNote, setNoMicNote] = useState(false);

  // Hide marketing chrome while on live Monti
  useEffect(() => {
    const mainNav = document.querySelector('nav');
    const mainFooter = document.querySelector('footer');
    const navEl =
      mainNav?.textContent?.includes('Veteran AI') ||
      mainNav?.textContent?.includes('Demos')
        ? (mainNav as HTMLElement)
        : null;
    const footEl = mainFooter?.textContent?.includes('Veteran AI')
      ? (mainFooter as HTMLElement)
      : null;

    if (navEl) navEl.style.display = 'none';
    if (footEl) footEl.style.display = 'none';
    document.body.classList.add('monti-active');
    document.documentElement.style.overflow = 'hidden';

    return () => {
      if (navEl) navEl.style.display = '';
      if (footEl) footEl.style.display = '';
      document.body.classList.remove('monti-active');
      document.documentElement.style.overflow = '';
    };
  }, []);

  const handleFatal = useCallback((message: string) => {
    setError(message);
    setPhase('error');
    setConnection(null);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setPhase('connecting');
    setNoMicNote(false);
    try {
      // User gesture: create AudioContext SYNCHRONOUSLY (before any await) so iOS unlocks it
      const Ctor = getAudioContextCtor();
      if (Ctor) {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new Ctor();
        }
        const ctx = audioCtxRef.current;
        console.info('[monti/live] AudioContext created on Start, state=', ctx.state);
        void ctx.resume().then(() => {
          console.info('[monti/live] AudioContext after Start resume →', ctx.state);
        });
      }

      // Prefer voice; if mic denied/unavailable, still join without publishing audio
      const hasMic = await probeMicrophone();
      setMicEnabled(hasMic);
      setNoMicNote(!hasMic);

      const res = await fetch('/api/monti/livekit-token', { method: 'POST' });
      const data = (await res.json().catch(() => ({}))) as TokenPayload & {
        error?: string;
      };
      if (!res.ok || !data.token || !data.url) {
        throw new Error(data.error || 'Could not start a session');
      }
      setConnection({
        token: data.token,
        url: data.url,
        roomName: data.roomName,
      });
      setPhase('live');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not start a session';
      setError(message);
      setPhase('error');
      setConnection(null);
    }
  }, []);

  const end = useCallback(() => {
    setConnection(null);
    setPhase('idle');
    setError(null);
    setNoMicNote(false);
    setMicEnabled(true);
    glowRef.current?.setAmplitude(0);
    glowRef.current?.setListening(false);
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state !== 'closed') {
      void ctx.close().catch(() => {});
    }
    audioCtxRef.current = null;
  }, []);

  return (
    <div className="monti-app-root">
      {/* Connecting: End available before room mounts; live bar is inside shell */}
      {phase === 'connecting' ? (
        <div className="monti-live-fixed-bar" role="toolbar" aria-label="Session controls">
          <button
            type="button"
            className="monti-live-fixed-btn monti-live-fixed-btn--end"
            onClick={end}
          >
            End
          </button>
        </div>
      ) : null}

      {phase === 'live' && connection ? (
        <LiveKitRoom
          serverUrl={connection.url}
          token={connection.token}
          connect
          audio={micEnabled}
          video={false}
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
          onError={(err) => {
            console.error('[monti/live] room error', err);
            const msg = err?.message?.toLowerCase() ?? '';
            // Mic permission errors are non-fatal — we probe first; leftover
            // device errors should not kill a text-capable session.
            if (
              msg.includes('permission') ||
              msg.includes('not allowed') ||
              msg.includes('denied') ||
              err?.name === 'NotAllowedError'
            ) {
              console.warn('[monti/live] mic error after connect — keep session');
              return;
            }
            handleFatal(err?.message || 'Connection failed');
          }}
          onDisconnected={() => {
            setPhase((p) => (p === 'live' ? 'idle' : p));
            setConnection(null);
          }}
        >
          <LiveSessionShell
            glowRef={glowRef}
            onEnd={end}
            micEnabled={micEnabled}
            noMicNote={noMicNote}
            audioCtxRef={audioCtxRef}
          />
        </LiveKitRoom>
      ) : (
        <div className="monti-app">
          <div className="monti-pane" style={{ width: '100%' }}>
            <GlowCanvas ref={glowRef} className="monti-glow" />
            <div className="monti-top">
              <div className="monti-logo">
                <b>▲</b> M O N T I
              </div>
            </div>
            <div className="monti-glow-spacer" aria-hidden="true" />
            <div className="monti-dock">
              <div className="monti-dock-panel">
                <div className="monti-prompt" role="status">
                  {phase === 'connecting'
                    ? 'Connecting…'
                    : phase === 'error'
                      ? error || 'Something went wrong'
                      : 'Ready when you are'}
                </div>
                {phase === 'error' && error ? (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 14,
                      color: '#e8b4a0',
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </p>
                ) : null}
                <div className="monti-controls" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="monti-chip"
                    onClick={() => void start()}
                    disabled={phase === 'connecting'}
                  >
                    {phase === 'connecting' ? 'Connecting…' : 'Start talking'}
                  </button>
                </div>
                <p
                  style={{
                    margin: '12px 0 0',
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'rgba(243, 230, 212, 0.35)',
                    textAlign: 'center',
                  }}
                >
                  Talk or type · LiveKit
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
