'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  LiveKitRoom,
  RoomAudioRenderer,
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
import { emptyRecord } from '@/lib/monti/contract';
import { tradeLabel } from '@/lib/monti/trade-labels';
import type { FillSection, MontiRecord } from '@/lib/monti/types';
import { applyFill } from '@/lib/monti/validate';

const TOPIC_FILL = 'monti_fill';
const TOPIC_LEAD = 'monti_lead';
const CORE_FILLS: FillSection[] = ['hero', 'services', 'contact', 'about'];

type SessionPhase = 'idle' | 'connecting' | 'live' | 'error';
type BuildPhase = 'chat' | 'handoff' | 'done';

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

/** Drive GlowCanvas from the agent's remote audio track via AnalyserNode. */
function useAgentAmplitude(
  audioTrack: TrackReference | undefined,
  glowRef: React.RefObject<GlowCanvasHandle | null>,
  agentState: string | undefined,
  muted: boolean,
) {
  useEffect(() => {
    const publication = audioTrack?.publication;
    const track = publication?.track;
    const mediaStreamTrack = track?.mediaStreamTrack;
    if (!mediaStreamTrack || muted) {
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
        glowRef.current?.setAmplitude(Math.min(1, rms * 3.2));
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
  }, [audioTrack, glowRef, muted]);

  useEffect(() => {
    glowRef.current?.setListening(!muted && agentState === 'listening');
  }, [agentState, glowRef, muted]);
}

function LiveSessionShell({
  glowRef,
  onEnd,
  micEnabled,
  noMicNote,
}: {
  glowRef: React.RefObject<GlowCanvasHandle | null>;
  onEnd: () => void;
  micEnabled: boolean;
  noMicNote: boolean;
}) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);
  const { state: agentState, audioTrack } = useVoiceAssistant();
  const connected = connectionState === ConnectionState.Connected;

  const recordRef = useRef<MontiRecord>(emptyRecord());
  const leadSentRef = useRef(false);

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
  const [muted, setMuted] = useState(false);
  const [leadFailed, setLeadFailed] = useState(false);
  const [leadBusy, setLeadBusy] = useState(false);
  const [draft, setDraft] = useState('');
  const [sendingText, setSendingText] = useState(false);

  useAgentAmplitude(audioTrack, glowRef, agentState, muted);

  // Silence agent audio without ending the session
  useEffect(() => {
    const level = muted ? 0 : 1;
    room.remoteParticipants.forEach((p) => {
      p.audioTrackPublications.forEach((pub) => {
        const t = pub.track;
        if (t && 'setVolume' in t && typeof t.setVolume === 'function') {
          t.setVolume(level);
        }
      });
    });
  }, [room, muted, audioTrack]);

  useEffect(() => {
    recordRef.current = record;
  }, [record]);

  useEffect(() => {
    void room.startAudio().catch(() => {});
  }, [room]);

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

  const sendTypedMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const text = draft.trim();
      if (!text || !connected || sendingText) return;

      setSendingText(true);
      try {
        // LiveKit Agents text input: lk.chat topic → user turn
        // https://docs.livekit.io/agents/build/text/
        await room.localParticipant.sendText(text, { topic: 'lk.chat' });
        setCaption(`You: ${text}`);
        setDraft('');
      } catch (err) {
        console.warn('[monti/live] sendText failed', err);
        setCaption("Couldn't send — try again");
      } finally {
        setSendingText(false);
      }
    },
    [draft, connected, sendingText, room],
  );

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
        body: JSON.stringify({ record: current }),
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
      <RoomAudioRenderer muted={muted} volume={muted ? 0 : 1} />
      {/* Fixed controls — always on top of glow, dock, and site pane */}
      <div className="monti-live-fixed-bar" role="toolbar" aria-label="Session controls">
        <button
          type="button"
          className={`monti-live-fixed-btn monti-live-fixed-btn--quiet${
            muted ? ' is-quiet' : ''
          }`}
          onClick={() => setMuted((m) => !m)}
          aria-pressed={muted}
        >
          {muted ? 'Unmute' : 'Mute'}
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
          <GlowCanvas ref={glowRef} muted={muted} className="monti-glow" />
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
                  placeholder={connected ? 'Type to Monti…' : 'Connecting…'}
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
                style={{
                  margin: '10px 0 0',
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'rgba(243, 230, 212, 0.35)',
                  textAlign: 'center',
                }}
              >
                {voiceStatusLabel(agentState)}
                {micEnabled ? '' : ' · text'} · LiveKit
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
