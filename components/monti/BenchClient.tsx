'use client';

/**
 * Free, deterministic Monti site-builder bench.
 * Same TradesTemplate path as MontiLiveClient — no LiveKit, no xAI.
 *
 * Viewport simulation uses a same-origin iframe loaded at /monti/bench?embed=1
 * so CSS media queries and window.matchMedia evaluate against the iframe width
 * (not the parent window). A React portal into an iframe would still bind JS
 * window to the parent, so we intentionally use a dedicated embed document.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import TradesTemplate from '@/components/monti/TradesTemplate';
import { emptyRecord } from '@/lib/monti/contract';
import { deepMergeRecord } from '@/lib/monti/merge';
import { TRADE_VIDEOS, type PhotoVariants } from '@/lib/monti/photos';
import { tradeLabel } from '@/lib/monti/trade-labels';
import type {
  FillSection,
  MontiRecord,
  Palette,
  SiteLayout,
  TradeKey,
} from '@/lib/monti/types';
import {
  BENCH_TRADE_KEYS,
  PALETTES,
  SITE_LAYOUTS,
  TRADE_FIXTURES,
  stagesForFixture,
  withStyle,
  type BenchStageName,
} from '@/lib/monti/bench-fixtures';

/** Same budget as MontiLiveClient RENDER_CONFIRM_FALLBACK_MS. */
const SLOW_PAINT_MS = 1200;

const VIEWPORTS = [390, 768, 1280] as const;
type Viewport = (typeof VIEWPORTS)[number];

/** Deterministic photo variants — never call pickTradePhotoVariants (uses Math.random). */
const PHOTO_VARIANTS: PhotoVariants = { hero: 0, support: 0 };

const MSG_SET = 'monti-bench-set';
const MSG_PAINTED = 'monti-bench-painted';
const MSG_HELLO = 'monti-bench-hello';

type StageTiming = {
  stage: BenchStageName;
  fieldsApplied: string;
  elapsedMs: number;
};

type CheckResult = {
  name: string;
  pass: boolean;
  detail: string;
};

type RunAllFailure = {
  trade: TradeKey;
  layout: SiteLayout;
  viewport: Viewport;
  check: string;
  detail: string;
};

type StageTimingStats = {
  stage: BenchStageName;
  n: number;
  min: number;
  median: number;
  max: number;
};

type RunAllSummary = {
  combinations: number;
  failures: RunAllFailure[];
  timingStats: StageTimingStats[];
};

type BenchSetPayload = {
  type: typeof MSG_SET;
  seq: number;
  record: MontiRecord;
  fill: FillSection[];
  showHeroSkeleton: boolean;
  showServicesSkeleton: boolean;
  photoVariants: PhotoVariants;
  heroVideoSrc: string | null;
  reducedMotion: boolean;
};

type BenchPaintedPayload = {
  type: typeof MSG_PAINTED;
  seq: number;
  elapsedMs: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms));
}

function waitPaintIn(win: Window): Promise<number> {
  const t0 = performance.now();
  return new Promise((resolve) => {
    win.requestAnimationFrame(() => {
      win.requestAnimationFrame(() => {
        resolve(performance.now() - t0);
      });
    });
  });
}

function waitImages(root: HTMLElement, timeoutMs = 4000): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  if (imgs.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let remaining = imgs.length;
    let settled = false;
    const done = () => {
      if (settled) return;
      remaining -= 1;
      if (remaining <= 0) {
        settled = true;
        resolve();
      }
    };
    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve();
      }
    }, timeoutMs);

    for (const img of imgs) {
      if (img.complete) {
        done();
        continue;
      }
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }

    if (remaining <= 0) {
      window.clearTimeout(timer);
    }
  });
}

function cssPath(el: Element): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const cls =
    typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
  const parent = el.parentElement;
  if (!parent || parent === el.ownerDocument.body) return `${tag}${cls}`;
  return `${cssPath(parent)} > ${tag}${cls}`;
}

/** Map FillSection → DOM region selectors inside .mt-trades. */
const SECTION_SELECTORS: Record<FillSection, string> = {
  hero: 'section.hero, section.hero-split, section.hero-skel',
  services:
    '#services, section.sec--preview, section.sec .svc-list, section.sec .svc-check, section.sec .grid, section.sec .svc-alt',
  about: '#about, .about-teaser, .about-bold, section.about-bold',
  contact: '#contact, .contact-page, .cta-band, .home-cta',
  trust: '.trustbar, .trust-chips, .availability-strip, .hero-accent-strip',
};

function visibleText(el: Element): string {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  if (s.length % 2 === 1) return s[mid]!;
  return Math.round((s[mid - 1]! + s[mid]!) / 2);
}

function summarizeStageTimings(
  all: StageTiming[],
): StageTimingStats[] {
  const order: BenchStageName[] = ['hero', 'services', 'about', 'contact'];
  return order.map((stage) => {
    const vals = all.filter((t) => t.stage === stage).map((t) => t.elapsedMs);
    return {
      stage,
      n: vals.length,
      min: vals.length ? Math.min(...vals) : 0,
      median: median(vals),
      max: vals.length ? Math.max(...vals) : 0,
    };
  });
}

/** Click each unlocked nav page so multi-page sections (about/contact) are inspected. */
async function visitUnlockedPages(root: HTMLElement): Promise<void> {
  const win = root.ownerDocument.defaultView;
  if (!win) return;
  const nav = root.querySelector('nav.nav');
  if (!nav) return;
  const buttons = Array.from(
    nav.querySelectorAll<HTMLButtonElement>('button.nav-item:not([disabled])'),
  );
  for (const btn of buttons) {
    btn.click();
    await waitPaintIn(win);
    await waitImages(root, 2500);
  }
  const home = buttons.find(
    (b) => (b.textContent || '').trim().toLowerCase() === 'home',
  );
  if (home) {
    home.click();
    await waitPaintIn(win);
  }
}

type OverflowHit = {
  el: HTMLElement;
  pageLabel: string;
  detail: string;
};

/**
 * Trustworthy overflow check:
 *  a) self-overflow: scrollWidth - clientWidth > 2
 *  b) skip overflow-x auto/scroll (intentional scrollers)
 *  c) horizontal escape past document clientWidth
 *  d) report only deepest offender in any ancestor chain
 *  e) include own + container widths in the message
 */
function findOverflowHits(
  root: HTMLElement,
  pageLabel: string,
): OverflowHit[] {
  const doc = root.ownerDocument;
  const docW = doc.documentElement.clientWidth;
  const hits: OverflowHit[] = [];

  root.querySelectorAll('*').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const style = doc.defaultView?.getComputedStyle(node);
    if (!style) return;
    const ox = style.overflowX;
    if (ox === 'auto' || ox === 'scroll') return;

    const reasons: string[] = [];
    const selfDelta = node.scrollWidth - node.clientWidth;
    if (selfDelta > 2) {
      reasons.push(
        `self-overflow scrollW=${node.scrollWidth} clientW=${node.clientWidth} delta=+${selfDelta}`,
      );
    }

    const rect = node.getBoundingClientRect();
    if (rect.right > docW + 2 || rect.left < -2) {
      reasons.push(
        `escape left=${Math.round(rect.left)} right=${Math.round(rect.right)} docW=${docW} elW=${Math.round(rect.width)}`,
      );
    }

    if (reasons.length === 0) return;
    hits.push({
      el: node,
      pageLabel,
      detail: `[${pageLabel}] ${cssPath(node)} — ${reasons.join('; ')}`,
    });
  });

  // Keep only deepest offenders (drop ancestors if a descendant also hits)
  return hits.filter(
    (hit) => !hits.some((other) => other.el !== hit.el && hit.el.contains(other.el)),
  );
}

async function runAutoChecks(
  root: HTMLElement,
  fill: FillSection[],
  timings: StageTiming[],
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const win = root.ownerDocument.defaultView;
  if (!win) {
    return [
      {
        name: 'RENDER',
        pass: false,
        detail: 'no window on template document',
      },
    ];
  }

  await visitUnlockedPages(root);

  const pageDups: string[] = [];
  let headingCount = 0;
  const sectionHasText = new Map<FillSection, boolean>();
  for (const s of fill) sectionHasText.set(s, false);
  const overflowHits: OverflowHit[] = [];
  const broken: string[] = [];
  let imgCount = 0;

  const nav = root.querySelector('nav.nav');
  const buttons = nav
    ? Array.from(
        nav.querySelectorAll<HTMLButtonElement>(
          'button.nav-item:not([disabled])',
        ),
      )
    : [];

  const pagesToScan = buttons.length > 0 ? buttons : [null];

  for (const btn of pagesToScan) {
    const pageLabel = btn
      ? (btn.textContent || '').trim() || 'page'
      : 'home';
    if (btn) {
      btn.click();
      await waitPaintIn(win);
      await waitImages(root, 2500);
    }

    {
      const seen = new Map<string, string>();
      root.querySelectorAll('h1, h2, h3').forEach((h) => {
        const raw = (h.textContent || '').trim();
        if (!raw) return;
        headingCount += 1;
        const key = raw.toLowerCase();
        if (seen.has(key)) {
          pageDups.push(`"${raw}" (${h.tagName.toLowerCase()} on ${pageLabel})`);
        } else {
          seen.set(key, raw);
        }
      });
    }

    for (const section of fill) {
      if (sectionHasText.get(section)) continue;
      const nodes = root.querySelectorAll(SECTION_SELECTORS[section]);
      nodes.forEach((n) => {
        if (visibleText(n).length > 0) sectionHasText.set(section, true);
      });
    }

    overflowHits.push(...findOverflowHits(root, pageLabel));

    root.querySelectorAll('img').forEach((img) => {
      imgCount += 1;
      if (img.naturalWidth === 0) {
        broken.push(img.currentSrc || img.src || '(no src)');
      }
    });
  }

  const homeBtn = buttons.find(
    (b) => (b.textContent || '').trim().toLowerCase() === 'home',
  );
  if (homeBtn) {
    homeBtn.click();
    await waitPaintIn(win);
  }

  results.push({
    name: 'DUPLICATE TEXT',
    pass: pageDups.length === 0,
    detail:
      pageDups.length === 0
        ? `${headingCount} headings across pages, no on-page dups`
        : `duplicates: ${pageDups.join('; ')}`,
  });

  {
    const empty: string[] = [];
    for (const section of fill) {
      if (!sectionHasText.get(section)) empty.push(section);
    }
    results.push({
      name: 'EMPTY SECTION',
      pass: empty.length === 0,
      detail:
        empty.length === 0
          ? `fill=[${fill.join(',')}] all have text`
          : `empty: ${empty.join(', ')}`,
    });
  }

  {
    // Dedupe by detail string; already deepest-only per page
    const unique = Array.from(new Map(overflowHits.map((h) => [h.detail, h])).values());
    const shown = unique.slice(0, 5);
    results.push({
      name: 'OVERFLOW',
      pass: unique.length === 0,
      detail:
        unique.length === 0
          ? 'no self-overflow or horizontal escape >2px'
          : `${unique.length} element(s): ${shown.map((h) => h.detail).join('; ')}${
              unique.length > 5 ? '…' : ''
            }`,
    });
  }

  {
    const uniqueBroken = Array.from(new Set(broken));
    results.push({
      name: 'BROKEN IMAGE',
      pass: uniqueBroken.length === 0,
      detail:
        uniqueBroken.length === 0
          ? `${imgCount} image check(s) ok`
          : uniqueBroken.join('; '),
    });
  }

  {
    const slow = timings.filter((t) => t.elapsedMs > SLOW_PAINT_MS);
    results.push({
      name: 'SLOW PAINT',
      pass: slow.length === 0,
      detail:
        slow.length === 0
          ? timings.map((t) => `${t.stage}=${t.elapsedMs}ms`).join(', ') ||
            'no stages'
          : slow.map((t) => `${t.stage}=${t.elapsedMs}ms`).join(', '),
    });
  }

  return results;
}

function describeFields(stage: ReturnType<typeof stagesForFixture>[number]): string {
  const keys: string[] = [];
  const p = stage.patch;
  if (p.business) keys.push('business');
  if (p.hero) keys.push('hero');
  if (p.services) keys.push(`services[${p.services.length}]`);
  if (p.about) keys.push('about');
  if (p.contact) keys.push('contact');
  if (p.trust?.badges) keys.push('trust.badges');
  if (p.trust?.reviews) keys.push('trust.reviews');
  if (p.layout) keys.push(`layout=${p.layout}`);
  if (p.palette) keys.push(`palette=${p.palette}`);
  if (p.trade_key) keys.push(`trade=${p.trade_key}`);
  return keys.join(', ') || '(none)';
}

// ── Embed document (iframe content) ─────────────────────────────────

function BenchEmbed() {
  const [state, setState] = useState<{
    seq: number;
    record: MontiRecord;
    fill: FillSection[];
    showHeroSkeleton: boolean;
    showServicesSkeleton: boolean;
    photoVariants: PhotoVariants;
    heroVideoSrc: string | null;
    reducedMotion: boolean;
  } | null>(null);

  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      const data = ev.data as BenchSetPayload | null;
      if (!data || data.type !== MSG_SET) return;
      setState({
        seq: data.seq,
        record: data.record,
        fill: data.fill,
        showHeroSkeleton: data.showHeroSkeleton,
        showServicesSkeleton: data.showServicesSkeleton,
        photoVariants: data.photoVariants,
        heroVideoSrc: data.heroVideoSrc,
        reducedMotion: data.reducedMotion,
      });
    };
    window.addEventListener('message', onMessage);
    // Announce ready so host can push initial state
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: MSG_HELLO }, window.location.origin);
    }
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Dual-rAF paint confirm after each state apply (iframe window = real viewport)
  useEffect(() => {
    if (!state) return;
    const seq = state.seq;
    let cancelled = false;
    const t0 = performance.now();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const elapsedMs = Math.round(performance.now() - t0);
        if (window.parent && window.parent !== window) {
          const msg: BenchPaintedPayload = {
            type: MSG_PAINTED,
            seq,
            elapsedMs,
          };
          window.parent.postMessage(msg, window.location.origin);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [state]);

  // Auto-grow document so checks are not clipped
  useEffect(() => {
    if (!state) return;
    const bump = () => {
      // Ensure body can grow with content
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
      document.body.style.margin = '0';
      document.body.style.background = '#fff';
    };
    bump();
    const id = window.setTimeout(bump, 50);
    return () => window.clearTimeout(id);
  }, [state]);

  if (!state) {
    return (
      <div style={{ padding: 12, fontFamily: 'system-ui', fontSize: 12, color: '#666' }}>
        Bench embed waiting for host…
      </div>
    );
  }

  return (
    <div
      className={
        state.reducedMotion
          ? 'monti-bench-embed monti-bench-reduced-motion'
          : 'monti-bench-embed'
      }
      style={{ margin: 0, minHeight: '100%' }}
    >
      {state.reducedMotion ? (
        <style>{`
          .monti-bench-reduced-motion,
          .monti-bench-reduced-motion *,
          .monti-bench-reduced-motion *::before,
          .monti-bench-reduced-motion *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `}</style>
      ) : null}
      <TradesTemplate
        record={state.record}
        fill={state.fill}
        showHeroSkeleton={
          state.showHeroSkeleton && !state.fill.includes('hero')
        }
        showServicesSkeleton={
          state.showServicesSkeleton && !state.fill.includes('services')
        }
        photoVariants={state.photoVariants}
        heroVideoSrc={state.heroVideoSrc}
      />
    </div>
  );
}

// ── Host (controls + iframe) ────────────────────────────────────────

function BenchHost() {
  const [trade, setTrade] = useState<TradeKey>('landscaping');
  const [layout, setLayout] = useState<SiteLayout>('classic');
  const [palette, setPalette] = useState<Palette>('ember');
  const [videoOn, setVideoOn] = useState(false);
  const [viewport, setViewport] = useState<Viewport>(768);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [record, setRecord] = useState<MontiRecord>(() => emptyRecord());
  const [fill, setFill] = useState<FillSection[]>([]);
  const [showHeroSkeleton, setShowHeroSkeleton] = useState(false);
  const [showServicesSkeleton, setShowServicesSkeleton] = useState(false);

  const [timings, setTimings] = useState<StageTiming[]>([]);
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(
    'Idle — pick a fixture and Replay build, or Run all.',
  );
  const [runAll, setRunAll] = useState<RunAllSummary | null>(null);
  const [iframeReady, setIframeReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cancelRef = useRef(false);
  const seqRef = useRef(0);
  const pendingPaintRef = useRef<
    Map<number, { resolve: (ms: number) => void; reject: (e: Error) => void }>
  >(new Map());
  // Latest state for push after hello
  const stateRef = useRef({
    record,
    fill,
    showHeroSkeleton,
    showServicesSkeleton,
    reducedMotion,
    heroVideoSrc: null as string | null,
  });

  const baseFixture = useMemo(
    () => withStyle(TRADE_FIXTURES[trade], layout, palette),
    [trade, layout, palette],
  );

  const heroVideoSrc = useMemo(() => {
    if (!videoOn) return null;
    const clips = TRADE_VIDEOS[trade];
    if (!clips || clips.length === 0) return null;
    return clips[0] ?? null;
  }, [videoOn, trade]);

  stateRef.current = {
    record,
    fill,
    showHeroSkeleton,
    showServicesSkeleton,
    reducedMotion,
    heroVideoSrc,
  };

  const pushToIframe = useCallback(
    (opts?: {
      record: MontiRecord;
      fill: FillSection[];
      showHeroSkeleton: boolean;
      showServicesSkeleton: boolean;
      heroVideoSrc: string | null;
      reducedMotion: boolean;
    }): Promise<number> => {
      const iframe = iframeRef.current;
      const win = iframe?.contentWindow;
      if (!win) return Promise.reject(new Error('iframe not ready'));

      const payload = opts ?? {
        record: stateRef.current.record,
        fill: stateRef.current.fill,
        showHeroSkeleton: stateRef.current.showHeroSkeleton,
        showServicesSkeleton: stateRef.current.showServicesSkeleton,
        heroVideoSrc: stateRef.current.heroVideoSrc,
        reducedMotion: stateRef.current.reducedMotion,
      };

      const seq = ++seqRef.current;
      const msg: BenchSetPayload = {
        type: MSG_SET,
        seq,
        record: payload.record,
        fill: payload.fill,
        showHeroSkeleton: payload.showHeroSkeleton,
        showServicesSkeleton: payload.showServicesSkeleton,
        photoVariants: PHOTO_VARIANTS,
        heroVideoSrc: payload.heroVideoSrc,
        reducedMotion: payload.reducedMotion,
      };

      return new Promise<number>((resolve, reject) => {
        const timer = window.setTimeout(() => {
          pendingPaintRef.current.delete(seq);
          reject(new Error(`paint timeout seq=${seq}`));
        }, 8000);
        pendingPaintRef.current.set(seq, {
          resolve: (ms) => {
            window.clearTimeout(timer);
            resolve(ms);
          },
          reject: (e) => {
            window.clearTimeout(timer);
            reject(e);
          },
        });
        win.postMessage(msg, window.location.origin);
      });
    },
    [],
  );

  // Listen for hello + painted from embed
  useEffect(() => {
    const onMessage = (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin) return;
      const data = ev.data as
        | BenchPaintedPayload
        | { type: typeof MSG_HELLO }
        | null;
      if (!data || typeof data !== 'object') return;

      if (data.type === MSG_HELLO) {
        setIframeReady(true);
        return;
      }
      if (data.type === MSG_PAINTED) {
        const pending = pendingPaintRef.current.get(data.seq);
        if (pending) {
          pendingPaintRef.current.delete(data.seq);
          pending.resolve(data.elapsedMs);
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Push whenever host state changes (interactive mode)
  useEffect(() => {
    if (!iframeReady || busy) return;
    void pushToIframe().catch(() => {
      /* ignore race during teardown */
    });
  }, [
    iframeReady,
    busy,
    record,
    fill,
    showHeroSkeleton,
    showServicesSkeleton,
    heroVideoSrc,
    reducedMotion,
    pushToIframe,
  ]);

  // Resize iframe height to content after paint
  const fitIframeHeight = useCallback(async () => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!iframe || !doc) return;
    await sleep(0);
    const h = Math.max(
      doc.documentElement.scrollHeight,
      doc.body?.scrollHeight ?? 0,
      800,
    );
    iframe.style.height = `${h + 24}px`;
  }, []);

  const getIframeRoot = useCallback((): HTMLElement | null => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return null;
    return doc.querySelector('.mt-trades') as HTMLElement | null;
  }, []);

  const loadFull = useCallback(() => {
    const r = withStyle(TRADE_FIXTURES[trade], layout, palette);
    setRecord(r);
    setFill(['hero', 'services', 'about', 'contact']);
    setShowHeroSkeleton(false);
    setShowServicesSkeleton(false);
    setTimings([]);
    setChecks([]);
    setStatus(
      `Loaded full fixture: ${tradeLabel(trade)} / ${layout} / ${palette}`,
    );
  }, [trade, layout, palette]);

  useEffect(() => {
    if (busy) return;
    loadFull();
  }, [trade, layout, palette, loadFull, busy]);

  const measureAndCheck = useCallback(
    async (
      workingFill: FillSection[],
      stageTimings: StageTiming[],
    ): Promise<CheckResult[]> => {
      await fitIframeHeight();
      const root = getIframeRoot();
      if (!root) {
        return [
          {
            name: 'RENDER',
            pass: false,
            detail: 'template root .mt-trades not found in iframe',
          },
        ];
      }
      await waitImages(root);
      await fitIframeHeight();
      return runAutoChecks(root, workingFill, stageTimings);
    },
    [fitIframeHeight, getIframeRoot],
  );

  const replayBuild = useCallback(async () => {
    if (!iframeReady) {
      setStatus('Iframe not ready yet');
      return;
    }
    cancelRef.current = false;
    setBusy(true);
    setRunAll(null);
    setTimings([]);
    setChecks([]);
    setRecord(emptyRecord());
    setFill([]);
    setShowHeroSkeleton(true);
    setShowServicesSkeleton(true);
    setStatus('Replaying staged build…');

    try {
      await pushToIframe({
        record: emptyRecord(),
        fill: [],
        showHeroSkeleton: true,
        showServicesSkeleton: true,
        heroVideoSrc,
        reducedMotion,
      });
      await sleep(30);
      if (cancelRef.current) {
        setBusy(false);
        return;
      }

      const styled = withStyle(TRADE_FIXTURES[trade], layout, palette);
      const stages = stagesForFixture(styled);
      let working = emptyRecord();
      let workingFill: FillSection[] = [];
      const stageTimings: StageTiming[] = [];

      for (const stage of stages) {
        if (cancelRef.current) break;
        working = deepMergeRecord(working, stage.patch);
        workingFill = Array.from(new Set([...workingFill, ...stage.fill]));
        setRecord(working);
        setFill(workingFill);
        setShowHeroSkeleton(!workingFill.includes('hero'));
        setShowServicesSkeleton(!workingFill.includes('services'));

        const elapsed = await pushToIframe({
          record: working,
          fill: workingFill,
          showHeroSkeleton: !workingFill.includes('hero'),
          showServicesSkeleton: !workingFill.includes('services'),
          heroVideoSrc,
          reducedMotion,
        });
        stageTimings.push({
          stage: stage.name,
          fieldsApplied: describeFields(stage),
          elapsedMs: elapsed,
        });
        setTimings([...stageTimings]);
        await fitIframeHeight();
      }

      const results = await measureAndCheck(workingFill, stageTimings);
      setChecks(results);
      const fails = results.filter((c) => !c.pass).length;
      setStatus(
        `Replay done — ${stageTimings.length} stages, ${fails} check failure(s)`,
      );
    } catch (err) {
      setStatus(
        `Replay error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
    setBusy(false);
  }, [
    iframeReady,
    trade,
    layout,
    palette,
    heroVideoSrc,
    reducedMotion,
    pushToIframe,
    fitIframeHeight,
    measureAndCheck,
  ]);

  const runAllCombos = useCallback(async () => {
    if (!iframeReady) {
      setStatus('Iframe not ready yet');
      return;
    }
    cancelRef.current = false;
    setBusy(true);
    setRunAll(null);
    setTimings([]);
    setChecks([]);
    setStatus('Run all: starting…');

    const failures: RunAllFailure[] = [];
    const allStageTimings: StageTiming[] = [];
    let combinations = 0;
    const fixedPalette = palette;
    const total =
      BENCH_TRADE_KEYS.length * SITE_LAYOUTS.length * VIEWPORTS.length;

    try {
      for (const t of BENCH_TRADE_KEYS) {
        for (const l of SITE_LAYOUTS) {
          for (const vp of VIEWPORTS) {
            if (cancelRef.current) break;
            combinations += 1;
            setStatus(`Run all: ${t} × ${l} × ${vp} (${combinations}/${total})`);
            setTrade(t);
            setLayout(l);
            setViewport(vp);

            // Let iframe width apply before measuring layout
            await sleep(40);

            const styled = withStyle(TRADE_FIXTURES[t], l, fixedPalette);
            const stages = stagesForFixture(styled);
            let working = emptyRecord();
            let workingFill: FillSection[] = [];
            const stageTimings: StageTiming[] = [];

            // Clear
            await pushToIframe({
              record: emptyRecord(),
              fill: [],
              showHeroSkeleton: true,
              showServicesSkeleton: true,
              heroVideoSrc: videoOn
                ? TRADE_VIDEOS[t]?.[0] ?? null
                : null,
              reducedMotion,
            });

            for (const stage of stages) {
              if (cancelRef.current) break;
              working = deepMergeRecord(working, stage.patch);
              workingFill = Array.from(
                new Set([...workingFill, ...stage.fill]),
              );
              const clip = videoOn ? TRADE_VIDEOS[t]?.[0] ?? null : null;
              const elapsed = await pushToIframe({
                record: working,
                fill: workingFill,
                showHeroSkeleton: !workingFill.includes('hero'),
                showServicesSkeleton: !workingFill.includes('services'),
                heroVideoSrc: clip,
                reducedMotion,
              });
              stageTimings.push({
                stage: stage.name,
                fieldsApplied: describeFields(stage),
                elapsedMs: elapsed,
              });
            }

            allStageTimings.push(...stageTimings);
            setTimings(stageTimings);
            setRecord(working);
            setFill(workingFill);

            await fitIframeHeight();
            const root = getIframeRoot();
            if (!root) {
              failures.push({
                trade: t,
                layout: l,
                viewport: vp,
                check: 'RENDER',
                detail: 'template root .mt-trades not found in iframe',
              });
              continue;
            }
            await waitImages(root);
            await fitIframeHeight();
            const results = await runAutoChecks(
              root,
              workingFill,
              stageTimings,
            );
            setChecks(results);
            for (const c of results) {
              if (!c.pass) {
                failures.push({
                  trade: t,
                  layout: l,
                  viewport: vp,
                  check: c.name,
                  detail: c.detail,
                });
              }
            }
          }
          if (cancelRef.current) break;
        }
        if (cancelRef.current) break;
      }
    } catch (err) {
      setStatus(
        `Run all error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const timingStats = summarizeStageTimings(allStageTimings);
    setRunAll({ combinations, failures, timingStats });
    setStatus(
      `Run all complete — ${combinations} combinations, ${failures.length} failures`,
    );
    setBusy(false);
  }, [
    iframeReady,
    palette,
    videoOn,
    reducedMotion,
    pushToIframe,
    fitIframeHeight,
    getIframeRoot,
  ]);

  const embedSrc = useMemo(() => {
    if (typeof window === 'undefined') return '/monti/bench?embed=1';
    return `${window.location.origin}/monti/bench?embed=1`;
  }, []);

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        padding: 12,
        color: '#111',
        background: '#f4f4f4',
        minHeight: '100%',
      }}
    >
      <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>
        Monti site builder bench
      </h1>
      <p style={{ margin: '0 0 12px', color: '#444' }}>
        Free · deterministic · no LiveKit / xAI. Template renders in a
        same-origin iframe so media queries match {viewport}px.
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'flex-end',
          marginBottom: 12,
          padding: 10,
          background: '#fff',
          border: '1px solid #ddd',
        }}
      >
        <label>
          Trade{' '}
          <select
            value={trade}
            disabled={busy}
            onChange={(e) => setTrade(e.target.value as TradeKey)}
          >
            {BENCH_TRADE_KEYS.map((k) => (
              <option key={k} value={k}>
                {tradeLabel(k)} ({k})
              </option>
            ))}
          </select>
        </label>

        <label>
          Layout{' '}
          <select
            value={layout}
            disabled={busy}
            onChange={(e) => setLayout(e.target.value as SiteLayout)}
          >
            {SITE_LAYOUTS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label>
          Palette{' '}
          <select
            value={palette}
            disabled={busy}
            onChange={(e) => setPalette(e.target.value as Palette)}
          >
            {PALETTES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label>
          Hero video{' '}
          <select
            value={videoOn ? 'on' : 'off'}
            disabled={busy}
            onChange={(e) => setVideoOn(e.target.value === 'on')}
          >
            <option value="off">off</option>
            <option value="on">on (clips[0])</option>
          </select>
        </label>

        <label>
          Viewport{' '}
          <select
            value={viewport}
            disabled={busy}
            onChange={(e) => setViewport(Number(e.target.value) as Viewport)}
          >
            {VIEWPORTS.map((v) => (
              <option key={v} value={v}>
                {v}px
              </option>
            ))}
          </select>
        </label>

        <label>
          Reduced motion{' '}
          <select
            value={reducedMotion ? 'on' : 'off'}
            disabled={busy}
            onChange={(e) => setReducedMotion(e.target.value === 'on')}
          >
            <option value="off">off</option>
            <option value="on">on</option>
          </select>
        </label>

        <button
          type="button"
          disabled={busy || !iframeReady}
          onClick={() => void replayBuild()}
        >
          Replay build
        </button>
        <button
          type="button"
          disabled={busy || !iframeReady}
          onClick={() => void runAllCombos()}
        >
          Run all
        </button>
        <button
          type="button"
          disabled={!busy}
          onClick={() => {
            cancelRef.current = true;
          }}
        >
          Cancel
        </button>
        <button type="button" disabled={busy} onClick={loadFull}>
          Load full
        </button>
      </div>

      <p style={{ margin: '0 0 10px', fontWeight: 600 }} data-testid="bench-status">
        {status}
        {!iframeReady ? ' (iframe loading…)' : ''}
      </p>

      {timings.length > 0 ? (
        <div style={{ marginBottom: 12, overflowX: 'auto' }}>
          <table
            style={{
              borderCollapse: 'collapse',
              background: '#fff',
              minWidth: 480,
            }}
          >
            <thead>
              <tr>
                <th style={th}>stage</th>
                <th style={th}>fields applied</th>
                <th style={th}>elapsed ms</th>
              </tr>
            </thead>
            <tbody>
              {timings.map((t) => (
                <tr key={t.stage}>
                  <td style={td}>{t.stage}</td>
                  <td style={td}>{t.fieldsApplied}</td>
                  <td
                    style={{
                      ...td,
                      color: t.elapsedMs > SLOW_PAINT_MS ? '#b00' : undefined,
                      fontWeight: t.elapsedMs > SLOW_PAINT_MS ? 700 : undefined,
                    }}
                  >
                    {t.elapsedMs}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {checks.length > 0 ? (
        <div style={{ marginBottom: 12 }}>
          <table style={{ borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th style={th}>check</th>
                <th style={th}>result</th>
                <th style={th}>detail</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c) => (
                <tr key={c.name}>
                  <td style={td}>{c.name}</td>
                  <td
                    style={{
                      ...td,
                      color: c.pass ? '#0a0' : '#b00',
                      fontWeight: 700,
                    }}
                  >
                    {c.pass ? 'PASS' : 'FAIL'}
                  </td>
                  <td style={td}>{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {runAll ? (
        <div style={{ marginBottom: 12 }}>
          <p
            style={{ fontWeight: 700, margin: '0 0 6px' }}
            data-testid="run-all-summary"
          >
            {runAll.combinations} combinations, {runAll.failures.length}{' '}
            failures
          </p>

          {runAll.timingStats.length > 0 ? (
            <div style={{ marginBottom: 10, overflowX: 'auto' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>
                Paint timings across Run all (ms)
              </p>
              <table
                style={{ borderCollapse: 'collapse', background: '#fff' }}
                data-testid="run-all-timings"
              >
                <thead>
                  <tr>
                    <th style={th}>stage</th>
                    <th style={th}>n</th>
                    <th style={th}>min</th>
                    <th style={th}>median</th>
                    <th style={th}>max</th>
                  </tr>
                </thead>
                <tbody>
                  {runAll.timingStats.map((s) => (
                    <tr key={s.stage}>
                      <td style={td}>{s.stage}</td>
                      <td style={td}>{s.n}</td>
                      <td style={td}>{s.min}</td>
                      <td style={td}>{s.median}</td>
                      <td style={td}>{s.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {runAll.failures.length > 0 ? (
            <table
              style={{
                borderCollapse: 'collapse',
                background: '#fff',
                width: '100%',
              }}
              data-testid="run-all-failures"
            >
              <thead>
                <tr>
                  <th style={th}>trade</th>
                  <th style={th}>layout</th>
                  <th style={th}>viewport</th>
                  <th style={th}>check</th>
                  <th style={th}>detail</th>
                </tr>
              </thead>
              <tbody>
                {runAll.failures.map((f, i) => (
                  <tr key={`${f.trade}-${f.layout}-${f.viewport}-${f.check}-${i}`}>
                    <td style={td}>{f.trade}</td>
                    <td style={td}>{f.layout}</td>
                    <td style={td}>{f.viewport}</td>
                    <td style={td}>{f.check}</td>
                    <td style={td}>{f.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#0a0' }}>No failures.</p>
          )}
        </div>
      ) : null}

      {/*
        Do not max-width:100% the iframe — that would shrink below the selected
        viewport and lie about media queries. Parent page may scroll horizontally.
      */}
      <div style={{ margin: '0 auto', width: viewport, overflow: 'visible' }}>
        <div
          style={{
            fontSize: 11,
            color: '#666',
            marginBottom: 4,
          }}
        >
          iframe viewport = {viewport}px
          {!iframeReady ? ' · loading…' : ' · ready'}
        </div>
        <iframe
          ref={iframeRef}
          title="Monti bench viewport"
          src={embedSrc}
          width={viewport}
          style={{
            width: viewport,
            minWidth: viewport,
            height: 1200,
            border: '1px solid #ccc',
            background: '#fff',
            display: 'block',
          }}
        />
      </div>

      <p style={{ marginTop: 12, color: '#666', fontSize: 11 }}>
        photoVariants fixed to {'{ hero: 0, support: 0 }'} · video =
        TRADE_VIDEOS[trade][0] when on · fixture base: {baseFixture.business.name}{' '}
        · embed route /monti/bench?embed=1 (real media-query viewport)
      </p>
    </div>
  );
}

export default function BenchClient() {
  const [mode, setMode] = useState<'pending' | 'host' | 'embed'>('pending');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setMode(q.get('embed') === '1' ? 'embed' : 'host');
  }, []);

  if (mode === 'pending') {
    return (
      <div style={{ padding: 12, fontFamily: 'system-ui', fontSize: 13 }}>
        Loading bench…
      </div>
    );
  }
  if (mode === 'embed') {
    return <BenchEmbed />;
  }
  return <BenchHost />;
}

const th: CSSProperties = {
  textAlign: 'left',
  border: '1px solid #ccc',
  padding: '4px 8px',
  background: '#eee',
};

const td: CSSProperties = {
  border: '1px solid #ccc',
  padding: '4px 8px',
  verticalAlign: 'top',
};
