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
import { emptyRecord } from '@/lib/monti/contract';
import { tradeLabel } from '@/lib/monti/trade-labels';
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

export default function MontiExperience() {
  const glowRef = useRef<GlowCanvasHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [started, setStarted] = useState(false);
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

  const speakLine = useCallback(
    (line: string) => {
      setPrompt(line);
      glowRef.current?.speak(line.split(/\s+/).filter(Boolean).length);
    },
    [],
  );

  const applyTurn = useCallback(
    (turn: TurnResponse, priorMessages: ChatMessage[]) => {
      setRecord(turn.record);
      setFill((prev) => {
        const next = new Set(prev);
        for (const f of turn.fill) next.add(f);
        return Array.from(next) as FillSection[];
      });

      const name = turn.record.business?.name || '';
      const hasHero =
        turn.fill.includes('hero') ||
        !!turn.template_id ||
        turn.record.template_id === 'trades' ||
        !!turn.hero_image_id;

      if (name && hasHero) {
        setBuilding(true);
        setShowHeroSkel(false);
        setStatusText('building the hero…');
      } else if (hasHero) {
        // Trade known — slide layout even if name edge-case missing
        setBuilding(true);
        setShowHeroSkel(false);
        setStatusText('framing your homepage…');
      }

      if (turn.fill.includes('services')) {
        setShowServicesSkel(false);
        setStatusText('adding your services…');
      }
      if (turn.fill.includes('about')) {
        setStatusText('finishing your site…');
      }
      if (turn.fill.includes('contact')) {
        setStatusText('adding contact…');
      }

      if (turn.done || turn.expect === 'done') {
        setStatusText('site ready');
        setStatusDone(true);
        setPhase('handoff');
        setExpect('choice');
        setChoices([
          'Yes — send it to Rich',
          "Just looking for now",
        ]);
        setAllowEmpty(false);
      } else {
        setExpect(turn.expect);
        setChoices(turn.expect === 'choice' ? turn.choices : []);
        setInputHint(turn.input_hint || 'Type your answer…');
        // About step often allows empty ("write it for me")
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
      setMessages([...priorMessages, assistantMsg]);
    },
    [speakLine],
  );

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

  const begin = async () => {
    if (busy) return;
    setStarted(true);
    setPhase('chat');
    setShowHeroSkel(true);
    setStatusText('framing your homepage…');
    await callTurn({
      start: true,
      history: [],
      current: emptyRecord(),
    });
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
        try {
          const res = await fetch('/api/monti/lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record }),
          });
          if (!res.ok) {
            speakLine(
              "Couldn't reach Rich's inbox just now — try again in a minute, or call him direct.",
            );
            setBusy(false);
            return;
          }
          setShowLead(true);
          setPhase('done');
          setChoices([]);
          setExpect('text');
          const phone = record.business.phone || 'your number';
          speakLine(
            `Done — Rich has it. Expect a friendly call or text at ${phone}.`,
          );
        } catch {
          speakLine("Couldn't send that just now. Give it another go?");
        } finally {
          setBusy(false);
        }
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

    glowRef.current?.impulse();

    // Skeletons for upcoming sections
    if (!building && record.business.name) {
      setShowHeroSkel(true);
    }
    if (building && fill.includes('hero') && !fill.includes('services')) {
      // might be heading to services
      if (/yep|perfect|close|tweak|services/i.test(text) || expect === 'choice') {
        setShowServicesSkel(true);
        setStatusText('laying out your services…');
      }
    }

    const userText = text || '(skip — write it for me)';
    await callTurn({
      message: userText,
      history: messages,
      current: record,
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
    (expect === 'text' || (phase === 'handoff' && choices.length === 0));

  const showChips =
    phase !== 'start' &&
    !busy &&
    expect === 'choice' &&
    choices.length > 0;

  return (
    <div className="monti-app-root">
      <div className={`monti-app${building ? ' building' : ''}`}>
        <div className="monti-pane">
          <GlowCanvas ref={glowRef} muted={muted} className="monti-glow" />
          <div className="monti-top">
            <div className="monti-logo">
              <b>▲</b> M O N T I
            </div>
          </div>
          <div className="monti-center">
            {started ? (
              <div className={`monti-prompt${busy ? ' busy' : ''}`}>
                {busy && !prompt ? 'Monti is thinking…' : prompt}
              </div>
            ) : null}

            {showChips ? (
              <div className="monti-chips">
                {choices.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="monti-chip"
                    disabled={busy}
                    onClick={() => void submitAnswer(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : null}

            {showInput || (expect === 'text' && started && phase === 'chat') ? (
              <form className="monti-ask" onSubmit={onSubmit}>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    busy ? 'Monti is thinking…' : inputHint
                  }
                  disabled={busy}
                  autoComplete="off"
                  aria-label="Answer Monti"
                />
                <button
                  className="monti-go"
                  type="submit"
                  aria-label="send"
                  disabled={busy || (!inputValue.trim() && !allowEmpty)}
                >
                  ↑
                </button>
              </form>
            ) : null}

            {busy && started ? (
              <div className="monti-prompt busy" style={{ fontSize: 13 }}>
                …
              </div>
            ) : null}
          </div>
          <div className="monti-controls">
            <button
              type="button"
              className={`monti-mute${muted ? ' off' : ''}`}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? '🔇 glow calm' : '🔊 glow live'}
            </button>
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
