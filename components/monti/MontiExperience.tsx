'use client';

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import BrowserFrame from './BrowserFrame';
import GlowCanvas, { type GlowCanvasHandle } from './GlowCanvas';
import LeadCard from './LeadCard';
import TradesTemplate from './TradesTemplate';
import { useMontiVoice } from './useMontiVoice';
import { emptyRecord, recordForLead } from '@/lib/monti/contract';
import {
  hasPhoto,
  photoUrl,
  pickTradePhotoVariants,
  preloadPhotoUrl,
  type PhotoVariants,
} from '@/lib/monti/photos';
import { tradeLabel } from '@/lib/monti/trade-labels';
import type { ApplyFillResult } from '@/lib/monti/validate';
import type {
  ChatMessage,
  FillSection,
  MontiRecord,
  TurnResponse,
} from '@/lib/monti/types';

function slug(s: string): string {
  return (
    (s || 'yoursite')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 22) || 'yoursite'
  );
}

type Phase = 'start' | 'chat' | 'handoff' | 'done';
type Mode = 'voice' | 'typed';

const CORE_FILLS: FillSection[] = ['hero', 'services', 'contact', 'about'];

export default function MontiExperience() {
  const glowRef = useRef<GlowCanvasHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordRef = useRef<MontiRecord>(emptyRecord());
  const leadSentRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  /** Lock photo variants once trade is known — stable for the whole build. */
  const photoTradeLockedRef = useRef<string | null>(null);
  const appRef = useRef<HTMLDivElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);

  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>('typed');
  const [building, setBuilding] = useState(false);
  const [muted, setMuted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [expect, setExpect] = useState<'text' | 'choice' | 'done'>('text');
  const [choices, setChoices] = useState<string[]>([]);
  const [inputHint, setInputHint] = useState('Type your answer…');
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [record, setRecord] = useState<MontiRecord>(() => emptyRecord());
  const [fill, setFill] = useState<FillSection[]>([]);
  const [statusText, setStatusText] = useState('building…');
  const [statusDone, setStatusDone] = useState(false);
  const [showHeroSkel, setShowHeroSkel] = useState(false);
  const [showServicesSkel, setShowServicesSkel] = useState(false);
  const [phase, setPhase] = useState<Phase>('start');
  const [showLead, setShowLead] = useState(false);
  const [allowEmpty, setAllowEmpty] = useState(false);
  const [photoVariants, setPhotoVariants] = useState<PhotoVariants>({
    hero: 0,
    support: 0,
  });

  useEffect(() => {
    recordRef.current = record;
  }, [record]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

  // Desktop wheel → site preview (same assist as /monti/live)
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
        if (!media) return;
      }
      cv.scrollTop += e.deltaY;
    };
    root.addEventListener('wheel', onWheel, { passive: true });
    return () => root.removeEventListener('wheel', onWheel);
  }, [building]);

  // Hide root marketing chrome while Monti is mounted
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

  const speakLine = useCallback((line: string) => {
    setPrompt(line);
    glowRef.current?.speak(line.split(/\s+/).filter(Boolean).length);
  }, []);

  /** Shared site state from fill sections (typed or voice). */
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

        if (name && hasHero) {
          setBuilding(true);
          setShowHeroSkel(false);
          setStatusText('building the hero…');
        } else if (hasHero) {
          setBuilding(true);
          setShowHeroSkel(false);
          setStatusText('framing your homepage…');
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
          setPhase((p) => (p === 'done' ? p : 'handoff'));
          setExpect('choice');
          setChoices([
            'Yes — send it to Rich',
            "Just looking for now",
          ]);
          setAllowEmpty(false);
        }

        return arr;
      });
    },
    [],
  );

  const applyTurn = useCallback(
    (turn: TurnResponse, priorMessages: ChatMessage[]) => {
      applySiteUpdate({
        record: turn.record,
        fill: turn.fill,
        template_id: turn.template_id,
        hero_image_id: turn.hero_image_id,
        forceHandoff: turn.done || turn.expect === 'done',
      });

      if (!(turn.done || turn.expect === 'done')) {
        setExpect(turn.expect);
        setChoices(turn.expect === 'choice' ? turn.choices : []);
        setInputHint(turn.input_hint || 'Type your answer…');
        const aboutStep =
          turn.say.toLowerCase().includes('different') ||
          turn.say.toLowerCase().includes('skip') ||
          turn.input_hint.toLowerCase().includes('skip') ||
          turn.input_hint.toLowerCase().includes("i'll write");
        setAllowEmpty(aboutStep);
      }

      speakLine(turn.say);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: turn.say,
      };
      const next = [...priorMessages, assistantMsg];
      setMessages(next);
      messagesRef.current = next;
    },
    [applySiteUpdate, speakLine],
  );

  const sendLeadOnce = useCallback(async (): Promise<{
    ok: boolean;
    error?: string;
  }> => {
    if (leadSentRef.current) return { ok: true };
    const current = recordRef.current;
    if (!current.business?.name?.trim()) {
      return { ok: false, error: 'Need a business name first' };
    }
    try {
      const res = await fetch('/api/monti/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ record: recordForLead(current) }),
      });
      if (!res.ok) {
        return { ok: false, error: 'Failed to save lead' };
      }
      leadSentRef.current = true;
      setShowLead(true);
      setPhase('done');
      setChoices([]);
      setExpect('text');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error' };
    }
  }, []);

  const voice = useMontiVoice({
    getRecord: () => recordRef.current,
    muted,
    onFill: (result: ApplyFillResult) => {
      applySiteUpdate({
        record: result.record,
        fill: result.fill,
        template_id: result.template_id,
        hero_image_id: result.hero_image_id,
      });
    },
    onSendToRich: async () => {
      const r = await sendLeadOnce();
      if (r.ok) {
        const phone = recordRef.current.business.phone || 'your number';
        setPrompt(
          `Done — Rich has it. Expect a friendly call or text at ${phone}.`,
        );
      }
      return r;
    },
    onTranscript: (text, role) => {
      if (role === 'assistant' && text) {
        setPrompt(text);
      }
    },
    onAmplitude: (level) => {
      glowRef.current?.setAmplitude(level);
    },
    onListening: (on) => {
      glowRef.current?.setListening(on);
    },
    onError: (msg) => {
      // Soft: keep captions, offer typing
      if (msg) setPrompt((p) => p || msg);
    },
  });

  const callTurn = useCallback(
    async (opts: {
      message?: string;
      start?: boolean;
      history: ChatMessage[];
      current: MontiRecord;
    }) => {
      setBusy(true);
      try {
        const res = await fetch('/api/monti/turn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: opts.history,
            message: opts.message ?? null,
            record: opts.current,
            start: opts.start === true,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          speakLine(
            (err as { error?: string }).error ||
              "Sorry — I hit a snag. Mind trying again?",
          );
          setExpect('text');
          setChoices([]);
          return;
        }

        const turn = (await res.json()) as TurnResponse;
        const nextHistory = opts.message
          ? [...opts.history, { role: 'user' as const, content: opts.message }]
          : opts.history;
        applyTurn(turn, nextHistory);
      } catch {
        speakLine("Sorry — connection hiccup. Mind saying that again?");
        setExpect('text');
      } finally {
        setBusy(false);
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    },
    [applyTurn, speakLine],
  );

  const beginTyped = useCallback(async () => {
    setMode('typed');
    setShowHeroSkel(true);
    setStatusText('framing your homepage…');
    await callTurn({
      start: true,
      history: messagesRef.current,
      current: recordRef.current,
    });
  }, [callTurn]);

  const begin = async () => {
    if (busy) return;
    setStarted(true);
    setPhase('chat');
    setShowHeroSkel(true);
    setStatusText('framing your homepage…');
    setPrompt('Connecting…');

    // Voice-first; typed fallback if mic / token / socket fails
    const ok = await voice.start();
    if (ok) {
      setMode('voice');
      setPrompt('Listening…');
      setInputHint('Or type your answer…');
      setExpect('text');
      return;
    }

    setPrompt('');
    await beginTyped();
  };

  const switchToTyped = async () => {
    voice.stop();
    setMode('typed');
    glowRef.current?.setListening(false);
    glowRef.current?.setAmplitude(0);
    setInputHint('Type your answer…');
    // If nothing started yet via typed, kick a turn with current record
    if (messagesRef.current.length === 0 && !recordRef.current.business.name) {
      await beginTyped();
    } else if (messagesRef.current.length === 0) {
      // Voice had fills but no typed history — seed a continuation
      setBusy(true);
      try {
        await callTurn({
          message:
            '[Visitor switched to typing. Continue the build from the current site record — ask the next needed question.]',
          history: [],
          current: recordRef.current,
        });
      } finally {
        setBusy(false);
      }
    } else {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const submitAnswer = async (raw: string) => {
    if (busy) return;
    const text = raw.trim();

    // Handoff chips
    if (phase === 'handoff') {
      const yes =
        /yes|send|rich|🤝/i.test(text) && !/just looking|no|not now/i.test(text);
      const no = /looking|no|not now|later/i.test(text) && !yes;

      if (yes || text === 'Yes — send it to Rich') {
        setBusy(true);
        const r = await sendLeadOnce();
        if (!r.ok) {
          speakLine(
            "Couldn't reach Rich's inbox just now — try again in a minute, or call him direct.",
          );
          leadSentRef.current = false;
          setBusy(false);
          return;
        }
        const phone = recordRef.current.business.phone || 'your number';
        speakLine(
          `Done — Rich has it. Expect a friendly call or text at ${phone}.`,
        );
        setBusy(false);
        return;
      }

      if (no || text === "Just looking for now") {
        setPhase('done');
        setChoices([]);
        speakLine("No worries at all — the door's always open.");
        return;
      }
    }

    if (!text && !allowEmpty) return;

    // In pure voice mode, typing still works as a user message path via typed API
    if (mode === 'voice') {
      // Stop voice mic path for this answer and use typed turn so text is reliable
      voice.stop();
      setMode('typed');
    }

    glowRef.current?.impulse();

    if (!building && record.business.name) {
      setShowHeroSkel(true);
    }
    if (building && fill.includes('hero') && !fill.includes('services')) {
      if (/yep|perfect|close|tweak|services/i.test(text) || expect === 'choice') {
        setShowServicesSkel(true);
        setStatusText('laying out your services…');
      }
    }

    const userText = text || '(skip — write it for me)';
    await callTurn({
      message: userText,
      history: messagesRef.current,
      current: recordRef.current,
    });
    setInputValue('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitAnswer(inputValue);
  };

  const url =
    (record.business.name
      ? slug(record.business.name)
      : 'yoursite') + '.com';

  const showInput =
    phase !== 'start' &&
    phase !== 'done' &&
    !busy &&
    (expect === 'text' ||
      mode === 'voice' ||
      (phase === 'handoff' && choices.length === 0));

  const showChips =
    phase !== 'start' &&
    !busy &&
    expect === 'choice' &&
    choices.length > 0;

  return (
    <div className="monti-app-root">
      <div
        ref={appRef}
        className={`monti-app${building ? ' building' : ''}`}
      >
        <div className="monti-pane">
          <GlowCanvas ref={glowRef} muted={muted} className="monti-glow" />
          <div className="monti-top">
            <div className="monti-logo">
              <b>▲</b> M O N T I
            </div>
          </div>
          <div className="monti-glow-spacer" aria-hidden="true" />
          <div className="monti-dock">
            {started ? (
              <div className="monti-dock-panel">
                <div
                  className={`monti-prompt${busy ? ' busy' : ''}${
                    mode === 'voice' && voice.paused ? ' paused' : ''
                  }`}
                >
                  {mode === 'voice' && voice.paused
                    ? 'Paused'
                    : busy && !prompt
                      ? 'Monti is thinking…'
                      : prompt ||
                        (mode === 'voice' ? 'Listening…' : '')}
                </div>

                {showChips ? (
                  <div className="monti-chips">
                    {choices.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="monti-chip"
                        disabled={busy || (mode === 'voice' && voice.paused)}
                        onClick={() => void submitAnswer(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                ) : null}

                {showInput ||
                (expect === 'text' && started && phase === 'chat') ? (
                  <form className="monti-ask" onSubmit={onSubmit}>
                    <input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        mode === 'voice' && voice.paused
                          ? 'Paused — Resume to continue…'
                          : busy
                            ? 'Monti is thinking…'
                            : mode === 'voice'
                              ? 'Speak — or type here…'
                              : inputHint
                      }
                      disabled={
                        busy || (mode === 'voice' && voice.paused)
                      }
                      autoComplete="off"
                      aria-label="Answer Monti"
                    />
                    <button
                      className="monti-go"
                      type="submit"
                      aria-label="send"
                      disabled={
                        busy ||
                        (mode === 'voice' && voice.paused) ||
                        (!inputValue.trim() && !allowEmpty)
                      }
                    >
                      ↑
                    </button>
                  </form>
                ) : null}

                {started && phase !== 'done' && mode === 'voice' ? (
                  <button
                    type="button"
                    className="monti-chip"
                    onClick={() => void switchToTyped()}
                  >
                    Prefer to type?
                  </button>
                ) : null}

                {busy && started && mode === 'typed' ? (
                  <div className="monti-prompt busy" style={{ fontSize: 13 }}>
                    …
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="monti-controls">
              <button
                type="button"
                className={`monti-mute${muted ? ' off' : ''}`}
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? '🔇 glow calm' : '🔊 glow live'}
              </button>
              {started && phase !== 'done' && mode === 'voice' ? (
                <button
                  type="button"
                  className={`monti-pause${voice.paused ? ' is-paused' : ''}`}
                  onClick={() => {
                    if (voice.paused) {
                      voice.resume();
                    } else {
                      voice.pause();
                      glowRef.current?.setListening(false);
                      glowRef.current?.setAmplitude(0);
                    }
                  }}
                >
                  {voice.paused ? '▶ Resume' : '⏸ Pause'}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="monti-site">
          <BrowserFrame
            url={url}
            statusText={statusText}
            statusDone={statusDone}
            scrollContainerRef={previewScrollRef}
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

      <div className={`monti-start${started ? ' gone' : ''}`}>
        <div className="monti-start-box">
          <h1>Hey — I&apos;m Monti.</h1>
          <p>
            Tell me about your business and I&apos;ll build you a real website
            right here, while we talk. About a minute. No sign-up.
          </p>
          <button type="button" onClick={() => void begin()} disabled={busy}>
            Let&apos;s build it →
          </button>
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
    </div>
  );
}
