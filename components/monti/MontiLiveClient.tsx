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
  pickTradeHeroMedia,
  preloadPhotoUrl,
  type PhotoVariants,
} from '@/lib/monti/photos';
import {
  resolveSessionStyle,
  type StylePick,
} from '@/lib/monti/style-fit';
import { tradeLabel } from '@/lib/monti/trade-labels';
import type { FillSection, MontiRecord } from '@/lib/monti/types';
import { applyFill } from '@/lib/monti/validate';

const TOPIC_FILL = 'monti_fill';
const TOPIC_LEAD = 'monti_lead';
/** Client → agent: visitor is composing a typed reply (silence nudge must wait). */
const TOPIC_TYPING = 'monti_typing';
const TYPING_THROTTLE_MS = 3000;
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
 * Fail-OPEN agent audio with strict mutual exclusion:
 * - Always attach a playing <audio> (WebRTC needs it; desktop hears this).
 * - Mobile: try gain(2)+compressor → speakers with element hard-muted.
 * - At any moment exactly ONE path is audible (element XOR webaudio).
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

  /** Enforce: webaudio → element always muted; element → element.muted = user mute. */
  const reassertPathExclusion = useCallback((reason?: string) => {
    const el = audioElRef.current;
    const mode = modeRef.current;
    const isMuted = mutedRef.current;
    if (mode === 'webaudio' && gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : MONTI_GAIN_MOBILE;
      if (el) {
        el.muted = true;
        el.volume = 1;
      }
    } else if (el) {
      el.muted = isMuted;
      el.volume = 1;
    }
    if (isMuted) glowRef.current?.setAmplitude(0);
    if (reason) {
      console.info(
        `[monti/live] audio path=${modeRef.current} reassert (${reason})`,
      );
    }
  }, [glowRef]);

  const applyMuteToOutputs = useCallback(() => {
    reassertPathExclusion();
  }, [reassertPathExclusion]);

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
          reassertPathExclusion('gesture-resume');
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
  }, [audioCtxRef, reassertPathExclusion]);

  // Tab resume: re-assert which path owns the speakers
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        reassertPathExclusion('visibilitychange');
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [reassertPathExclusion]);

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

    const wantBoost = isMobileAudioDevice();

    // Always-on element (desktop output + WebRTC). On mobile-boost intent, mute
    // BEFORE play so element never races with the WebAudio graph.
    const el = document.createElement('audio');
    el.autoplay = true;
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.volume = 1;
    el.muted = wantBoost ? true : mutedRef.current;
    el.style.display = 'none';
    document.body.appendChild(el);
    track.attach(el);
    audioElRef.current = el;
    modeRef.current = wantBoost ? 'webaudio' : 'element';
    gainNodeRef.current = null;

    const logPath = (path: PlaybackMode, reason: string) => {
      console.info(`[monti/live] audio path=${path} reason=${reason}`);
    };

    /** Tear down boost graph completely BEFORE unmuting the element. */
    const teardownBoostGraph = () => {
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
        if (source && gain) source.disconnect(gain);
      } catch {
        /* ignore */
      }
      gain = null;
      compressor = null;
      gainNodeRef.current = null;
    };

    const activateElementPath = (reason: string) => {
      if (boostDisconnected && modeRef.current === 'element') {
        // still re-assert mute
        el.muted = mutedRef.current;
        el.volume = 1;
        return;
      }
      boostDisconnected = true;
      // Disconnect graph FIRST — then unmute element (strict exclusion)
      teardownBoostGraph();
      modeRef.current = 'element';
      el.muted = mutedRef.current;
      el.volume = 1;
      void el.play().then(() => {
        if (cancelled) return;
        el.muted = mutedRef.current;
        logPath('element', reason);
      }).catch(() => {
        logPath('element', `${reason}+play-failed`);
      });
      console.warn(
        `[monti/live] WebAudio boost off — element path live (${reason})`,
      );
    };

    const activateWebAudioPath = (g: GainNode, reason: string) => {
      el.muted = true;
      el.volume = 1;
      modeRef.current = 'webaudio';
      gainNodeRef.current = g;
      g.gain.value = mutedRef.current ? 0 : MONTI_GAIN_MOBILE;
      void el.play().then(() => {
        if (cancelled) return;
        // iOS can unmute after play() — re-assert hard mute
        el.muted = true;
        logPath('webaudio', reason);
      }).catch(() => {
        el.muted = true;
        logPath('webaudio', `${reason}+play-failed`);
      });
    };

    void el.play().then(() => {
      if (cancelled) return;
      // After first play: re-assert exclusion for the intended path
      if (modeRef.current === 'webaudio') {
        el.muted = true;
      } else {
        el.muted = mutedRef.current;
      }
    }).catch((err) => {
      console.warn('[monti/live] audio element play() failed', err);
    });

    if (!wantBoost) {
      logPath('element', 'desktop');
    }

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
            compressor = ctx.createDynamicsCompressor();
            compressor.threshold.value = -10;
            compressor.knee.value = 6;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;

            source.connect(gain);
            gain.connect(compressor);
            compressor.connect(ctx.destination);

            activateWebAudioPath(gain, `mobile-boost gain=${MONTI_GAIN_MOBILE}`);

            watchdogTimer = window.setTimeout(() => {
              if (cancelled || boostDisconnected) return;
              if (ctx.state !== 'running') {
                activateElementPath(`watchdog-ctx.state=${ctx.state}`);
                return;
              }
              if (sawAgentSpeaking && !sawEnergy) {
                activateElementPath('watchdog-no-analyser-energy');
              }
            }, BOOST_WATCHDOG_MS);
          } else if (wantBoost && ctx.state !== 'running') {
            activateElementPath(`ctx-not-running state=${ctx.state}`);
          } else {
            // Desktop: element is the speaker; analyser is glow-only
            modeRef.current = 'element';
            el.muted = mutedRef.current;
            logPath('element', 'desktop-glow-only');
          }

          const data = new Uint8Array(analyser.fftSize);
          const tick = () => {
            if (cancelled || !analyser) return;
            if (agentStateRef.current === 'speaking') sawAgentSpeaking = true;

            // Keep exclusion hot — iOS may flip muted during playback
            if (modeRef.current === 'webaudio' && el && !el.muted) {
              el.muted = true;
            }

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
          activateElementPath('graph-setup-failed');
        }
      });
    } else {
      console.warn(
        '[monti/live] No AudioContext — element playback only (glow amplitude limited)',
      );
      if (wantBoost) {
        // Had hoped for boost; fall back cleanly
        activateElementPath('no-audiocontext');
      } else {
        el.muted = mutedRef.current;
        modeRef.current = 'element';
        logPath('element', 'no-audiocontext-desktop');
      }
    }

    applyMuteToOutputs();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (watchdogTimer) window.clearTimeout(watchdogTimer);
      teardownBoostGraph();
      gainNodeRef.current = null;
      audioElRef.current = null;
      modeRef.current = 'element';
      try {
        source?.disconnect();
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
  /** Lock layout×palette once trade is known — stable for the whole build. */
  const styleTradeLockedRef = useRef<string | null>(null);
  const sessionStyleRef = useRef<StylePick | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  /** Desktop wheel bridge: .monti-app root while building. */
  const appRef = useRef<HTMLDivElement | null>(null);

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
  /** Session-locked video hero path (null = photo-only for this build). */
  const [heroVideoSrc, setHeroVideoSrc] = useState<string | null>(null);
  /** "↓ scroll the site" chip — shown once build starts, fades after first scroll. */
  const [showScrollHint, setShowScrollHint] = useState(false);

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

  /** Stamp locked session style onto a record (layout + palette + theme). */
  const applySessionStyle = useCallback((r: MontiRecord): MontiRecord => {
    const style = sessionStyleRef.current;
    if (!style) return r;
    const mood = r.theme_mood || 'clean';
    return {
      ...r,
      layout: style.layout,
      palette: style.palette,
      theme_mood: mood,
      theme: { palette: style.palette, mood },
    };
  }, []);

  // Per-session photo + style: pick once when trade is first known.
  useEffect(() => {
    const trade = record.trade_key || record.hero?.image_id || null;
    if (!trade || !hasPhoto(trade) || trade === 'wv_hero') return;

    if (photoTradeLockedRef.current !== trade) {
      photoTradeLockedRef.current = trade;
      const media = pickTradeHeroMedia(trade);
      setPhotoVariants(media.photo);
      setHeroVideoSrc(media.videoSrc);
      preloadPhotoUrl(photoUrl(trade, 'hero', media.photo.hero));
    }

    if (styleTradeLockedRef.current !== trade) {
      styleTradeLockedRef.current = trade;
      // Honor agent layout+palette only when the combo is in the trade fit set;
      // otherwise client random (so back-to-back same-trade demos vary).
      const pick = resolveSessionStyle(trade, record.layout, record.palette);
      sessionStyleRef.current = pick;
      console.info(
        `[monti/live] session style locked trade=${trade} layout=${pick.layout} palette=${pick.palette}`,
      );
      setRecord((prev) => {
        const next = applySessionStyle({
          ...prev,
          // ensure trade_key is set for lead payload
          trade_key: prev.trade_key || (trade as MontiRecord['trade_key']),
        });
        recordRef.current = next;
        return next;
      });
    }
  }, [record.trade_key, record.hero?.image_id, record.layout, record.palette, applySessionStyle]);

  // Scroll-hint chip: show when building starts; dismiss on first preview scroll
  useEffect(() => {
    if (building) setShowScrollHint(true);
  }, [building]);

  useEffect(() => {
    if (!building || !showScrollHint) return;
    const el = previewScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 8) setShowScrollHint(false);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [building, showScrollHint]);

  // Desktop: wheel drives .monti-cv when building. Outside the scroller always;
  // inside, assist full-bleed media (hero/band) where native wheel can stall.
  useEffect(() => {
    if (!building) return;
    const root = appRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      const cv = previewScrollRef.current;
      if (!cv) return;
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return;

      const inCv = cv.contains(t);
      if (inCv) {
        const media = t.closest(
          'img, video, .img, .hero, .hero-split, .hero-split-media, .band-photo, .about-bold-photo, .scrim',
        );
        if (!media) return; // normal content — native only
      }

      cv.scrollTop += e.deltaY;
    };

    root.addEventListener('wheel', onWheel, { passive: true });
    return () => root.removeEventListener('wheel', onWheel);
  }, [building]);

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

  // ── Typing signal: tell the agent a keyboard user is mid-sentence ──
  const lastTypingPublishRef = useRef(0);
  const typingActiveRef = useRef(false);

  const publishTyping = useCallback(
    async (payload: { typing: boolean; text_sent?: boolean }) => {
      if (!connected) return;
      try {
        const data = new TextEncoder().encode(JSON.stringify(payload));
        await room.localParticipant.publishData(data, {
          reliable: true,
          topic: TOPIC_TYPING,
        });
        typingActiveRef.current = payload.typing === true;
        if (payload.typing) lastTypingPublishRef.current = Date.now();
      } catch (err) {
        console.warn('[monti/live] publishTyping failed', err);
      }
    },
    [room, connected],
  );

  // While draft is non-empty, pulse typing:true (throttled). Empty → cleared.
  useEffect(() => {
    if (!connected) return;
    const hasText = draft.trim().length > 0;
    if (hasText) {
      const now = Date.now();
      if (
        !typingActiveRef.current ||
        now - lastTypingPublishRef.current >= TYPING_THROTTLE_MS
      ) {
        void publishTyping({ typing: true });
      }
    } else if (typingActiveRef.current) {
      void publishTyping({ typing: false });
    }
  }, [draft, connected, publishTyping]);

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
      // Clear typing + mark a real text turn for typed-dominant patience on the agent
      void publishTyping({ typing: false, text_sent: true });

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
    [draft, connected, sendingText, agentReady, deliverText, publishTyping],
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
      // If trade is newly known, lock style before applying (same rules as effect).
      const trade =
        opts.record.trade_key || opts.record.hero?.image_id || null;
      if (
        trade &&
        hasPhoto(trade) &&
        trade !== 'wv_hero' &&
        styleTradeLockedRef.current !== trade
      ) {
        styleTradeLockedRef.current = trade;
        const pick = resolveSessionStyle(
          trade,
          opts.record.layout,
          opts.record.palette,
        );
        sessionStyleRef.current = pick;
        console.info(
          `[monti/live] session style locked trade=${trade} layout=${pick.layout} palette=${pick.palette}`,
        );
      }

      // Once locked, session style wins for the whole build (agent out-of-set ignored).
      const styled = applySessionStyle(opts.record);
      setRecord(styled);
      recordRef.current = styled;

      setFill((prev) => {
        const next = new Set(prev);
        for (const f of opts.fill) next.add(f);
        const arr = Array.from(next) as FillSection[];

        const name = styled.business?.name || '';
        const hasHero =
          arr.includes('hero') ||
          opts.template_id === 'trades' ||
          styled.template_id === 'trades' ||
          !!opts.hero_image_id ||
          !!styled.trade_key;

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
    [applySessionStyle],
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
      <div
        ref={appRef}
        className={`monti-app${building ? ' building' : ''}`}
      >
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
                  onFocus={() => {
                    if (draft.trim()) void publishTyping({ typing: true });
                  }}
                  onBlur={() => {
                    if (typingActiveRef.current) {
                      void publishTyping({ typing: false });
                    }
                  }}
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
            scrollContainerRef={previewScrollRef}
            showScrollHint={showScrollHint && building}
          >
            <TradesTemplate
              record={record}
              fill={fill}
              showHeroSkeleton={showHeroSkel && !fill.includes('hero')}
              showServicesSkeleton={
                showServicesSkel && !fill.includes('services')
              }
              photoVariants={photoVariants}
              heroVideoSrc={heroVideoSrc}
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
