'use client';

/**
 * Free, deterministic Monti site-builder bench.
 * Same TradesTemplate path as MontiLiveClient — no LiveKit, no xAI.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { flushSync } from 'react-dom';
import TradesTemplate from '@/components/monti/TradesTemplate';
import { emptyRecord } from '@/lib/monti/contract';
import { deepMergeRecord } from '@/lib/monti/merge';
import {
  TRADE_VIDEOS,
  type PhotoVariants,
} from '@/lib/monti/photos';
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
  check: string;
  detail: string;
};

type RunAllSummary = {
  combinations: number;
  failures: RunAllFailure[];
};

function waitPaint(): Promise<number> {
  const t0 = performance.now();
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
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

    // If all were already complete, clear timer via remaining path
    if (remaining <= 0) {
      window.clearTimeout(timer);
    }
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => window.setTimeout(r, ms));
}

function cssPath(el: Element): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const cls =
    typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
      : '';
  const parent = el.parentElement;
  if (!parent || parent === document.body) return `${tag}${cls}`;
  return `${cssPath(parent)} > ${tag}${cls}`;
}

/** Map FillSection → DOM region selectors inside .mt-trades. */
const SECTION_SELECTORS: Record<FillSection, string> = {
  hero: 'section.hero, section.hero-split, section.hero-skel',
  services:
    '#services, section.sec--preview, section.sec .svc-list, section.sec .svc-check, section.sec .grid, section.sec .svc-alt',
  about: '#about, .about-teaser, .about-bold, section.about-bold',
  // home uses .home-cta; contact page uses #contact / .cta-band
  contact: '#contact, .contact-page, .cta-band, .home-cta',
  trust: '.trustbar, .trust-chips, .availability-strip, .hero-accent-strip',
};

function visibleText(el: Element): string {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

/** Click each unlocked nav page so multi-page sections (about/contact) are inspected. */
async function visitUnlockedPages(root: HTMLElement): Promise<void> {
  const nav = root.querySelector('nav.nav');
  if (!nav) return;
  const buttons = Array.from(
    nav.querySelectorAll<HTMLButtonElement>('button.nav-item:not([disabled])'),
  );
  for (const btn of buttons) {
    btn.click();
    await waitPaint();
    await waitImages(root, 2500);
  }
  // Return to Home for a stable resting view
  const home = buttons.find(
    (b) => (b.textContent || '').trim().toLowerCase() === 'home',
  );
  if (home) {
    home.click();
    await waitPaint();
  }
}

async function runAutoChecks(
  root: HTMLElement,
  fill: FillSection[],
  timings: StageTiming[],
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Walk pages so about/contact regions that live off-home still get checked
  await visitUnlockedPages(root);

  // Re-walk collecting per-page signals for checks that need full site coverage
  const pageDups: string[] = [];
  let headingCount = 0;
  const sectionHasText = new Map<FillSection, boolean>();
  for (const s of fill) sectionHasText.set(s, false);
  const overflows: string[] = [];
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

  const pagesToScan =
    buttons.length > 0
      ? buttons
      : [null]; /* single pass if no nav */

  for (const btn of pagesToScan) {
    const pageLabel = btn
      ? (btn.textContent || '').trim() || 'page'
      : 'home';
    if (btn) {
      btn.click();
      await waitPaint();
      await waitImages(root, 2500);
    }

    // DUPLICATE TEXT is per rendered view (known on-page headline bug)
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

    root.querySelectorAll('*').forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const parent = el.parentElement;
      if (!parent) return;
      const over = el.scrollWidth - parent.clientWidth;
      if (over > 2) {
        overflows.push(`[${pageLabel}] ${cssPath(el)} (+${over}px)`);
      }
    });

    root.querySelectorAll('img').forEach((img) => {
      imgCount += 1;
      if (img.naturalWidth === 0) {
        broken.push(img.currentSrc || img.src || '(no src)');
      }
    });
  }

  // Rest on Home
  const homeBtn = buttons.find(
    (b) => (b.textContent || '').trim().toLowerCase() === 'home',
  );
  if (homeBtn) {
    homeBtn.click();
    await waitPaint();
  }

  // 1. DUPLICATE TEXT
  {
    results.push({
      name: 'DUPLICATE TEXT',
      pass: pageDups.length === 0,
      detail:
        pageDups.length === 0
          ? `${headingCount} headings across pages, no on-page dups`
          : `duplicates: ${pageDups.join('; ')}`,
    });
  }

  // 2. EMPTY SECTION
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

  // 3. OVERFLOW
  {
    const unique = Array.from(new Set(overflows));
    const shown = unique.slice(0, 5);
    results.push({
      name: 'OVERFLOW',
      pass: unique.length === 0,
      detail:
        unique.length === 0
          ? 'no horizontal overflow >2px'
          : `${unique.length} element(s): ${shown.join('; ')}${
              unique.length > 5 ? '…' : ''
            }`,
    });
  }

  // 4. BROKEN IMAGE
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

  // 5. SLOW PAINT
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

export default function BenchClient() {
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
  const [status, setStatus] = useState('Idle — pick a fixture and Replay build, or Run all.');
  const [runAll, setRunAll] = useState<RunAllSummary | null>(null);

  const siteRootRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);

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

  const loadFull = useCallback(() => {
    const r = withStyle(TRADE_FIXTURES[trade], layout, palette);
    setRecord(r);
    setFill(['hero', 'services', 'about', 'contact']);
    setShowHeroSkeleton(false);
    setShowServicesSkeleton(false);
    setTimings([]);
    setChecks([]);
    setStatus(`Loaded full fixture: ${tradeLabel(trade)} / ${layout} / ${palette}`);
  }, [trade, layout, palette]);

  // Load full fixture when trade/layout/palette change (not during automated runs)
  useEffect(() => {
    if (busy) return;
    loadFull();
  }, [trade, layout, palette, loadFull, busy]);

  const measureRoot = useCallback(async (): Promise<HTMLElement | null> => {
    await waitPaint();
    const root = siteRootRef.current?.querySelector('.mt-trades') as HTMLElement | null;
    if (root) await waitImages(root);
    return root;
  }, []);

  const replayBuild = useCallback(async () => {
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

    // Let empty + skeleton paint first
    await sleep(50);
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

      flushSync(() => {
        setRecord(working);
        setFill(workingFill);
        setShowHeroSkeleton(!workingFill.includes('hero'));
        setShowServicesSkeleton(!workingFill.includes('services'));
      });

      // Dual-rAF paint measure (same confirm path as MontiLiveClient ~1301)
      const elapsed = Math.round(await waitPaint());
      stageTimings.push({
        stage: stage.name,
        fieldsApplied: describeFields(stage),
        elapsedMs: elapsed,
      });
      setTimings([...stageTimings]);
    }

    const root = await measureRoot();
    if (root) {
      const results = await runAutoChecks(root, workingFill, stageTimings);
      setChecks(results);
      const fails = results.filter((c) => !c.pass).length;
      setStatus(
        `Replay done — ${stageTimings.length} stages, ${fails} check failure(s)`,
      );
    } else {
      setStatus('Replay done — template root not found');
    }
    setBusy(false);
  }, [trade, layout, palette, measureRoot]);

  const runAllCombos = useCallback(async () => {
    cancelRef.current = false;
    setBusy(true);
    setRunAll(null);
    setTimings([]);
    setChecks([]);
    setStatus('Run all: starting…');

    const failures: RunAllFailure[] = [];
    let combinations = 0;
    // Keep palette fixed during matrix so trade×layout is the axis under test
    const fixedPalette = palette;

    for (const t of BENCH_TRADE_KEYS) {
      for (const l of SITE_LAYOUTS) {
        if (cancelRef.current) break;
        combinations += 1;
        setStatus(
          `Run all: ${t} × ${l} (${combinations}/${BENCH_TRADE_KEYS.length * SITE_LAYOUTS.length})`,
        );
        flushSync(() => {
          setTrade(t);
          setLayout(l);
          setRecord(emptyRecord());
          setFill([]);
          setShowHeroSkeleton(true);
          setShowServicesSkeleton(true);
        });
        await sleep(30);

        const styled = withStyle(TRADE_FIXTURES[t], l, fixedPalette);
        const stages = stagesForFixture(styled);
        let working = emptyRecord();
        let workingFill: FillSection[] = [];
        const stageTimings: StageTiming[] = [];

        for (const stage of stages) {
          if (cancelRef.current) break;
          working = deepMergeRecord(working, stage.patch);
          workingFill = Array.from(new Set([...workingFill, ...stage.fill]));
          flushSync(() => {
            setRecord(working);
            setFill(workingFill);
            setShowHeroSkeleton(!workingFill.includes('hero'));
            setShowServicesSkeleton(!workingFill.includes('services'));
          });
          const elapsed = Math.round(await waitPaint());
          stageTimings.push({
            stage: stage.name,
            fieldsApplied: describeFields(stage),
            elapsedMs: elapsed,
          });
        }

        const root = await measureRoot();
        if (!root) {
          failures.push({
            trade: t,
            layout: l,
            check: 'RENDER',
            detail: 'template root .mt-trades not found',
          });
          continue;
        }
        const results = await runAutoChecks(root, workingFill, stageTimings);
        for (const c of results) {
          if (!c.pass) {
            failures.push({
              trade: t,
              layout: l,
              check: c.name,
              detail: c.detail,
            });
          }
        }
        setTimings(stageTimings);
        setChecks(results);
      }
      if (cancelRef.current) break;
    }

    setRunAll({ combinations, failures });
    setStatus(
      `Run all complete — ${combinations} combinations, ${failures.length} failures`,
    );
    setBusy(false);
  }, [palette, measureRoot]);

  const wrapperStyle: CSSProperties = {
    width: viewport,
    maxWidth: '100%',
    margin: '0 auto',
    border: '1px solid #ccc',
    background: '#fff',
    overflow: 'auto',
    maxHeight: '70vh',
    ...(reducedMotion
      ? ({
          // Force reduced motion locally — do not change OS preference
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ['--bench-reduce' as any]: '1',
        } as CSSProperties)
      : {}),
  };

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
      <h1 style={{ fontSize: 18, margin: '0 0 8px' }}>Monti site builder bench</h1>
      <p style={{ margin: '0 0 12px', color: '#444' }}>
        Free · deterministic · no LiveKit / xAI. Same TradesTemplate path as live.
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

        <button type="button" disabled={busy} onClick={() => void replayBuild()}>
          Replay build
        </button>
        <button type="button" disabled={busy} onClick={() => void runAllCombos()}>
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

      <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{status}</p>

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
          <p style={{ fontWeight: 700, margin: '0 0 6px' }} data-testid="run-all-summary">
            {runAll.combinations} combinations, {runAll.failures.length} failures
          </p>
          {runAll.failures.length > 0 ? (
            <table
              style={{ borderCollapse: 'collapse', background: '#fff', width: '100%' }}
              data-testid="run-all-failures"
            >
              <thead>
                <tr>
                  <th style={th}>trade</th>
                  <th style={th}>layout</th>
                  <th style={th}>check</th>
                  <th style={th}>detail</th>
                </tr>
              </thead>
              <tbody>
                {runAll.failures.map((f, i) => (
                  <tr key={`${f.trade}-${f.layout}-${f.check}-${i}`}>
                    <td style={td}>{f.trade}</td>
                    <td style={td}>{f.layout}</td>
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

      <div
        ref={siteRootRef}
        className={
          reducedMotion
            ? 'monti-bench-site monti-bench-reduced-motion'
            : 'monti-bench-site'
        }
        style={wrapperStyle}
      >
        {reducedMotion ? (
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
          record={record}
          fill={fill}
          showHeroSkeleton={showHeroSkeleton && !fill.includes('hero')}
          showServicesSkeleton={
            showServicesSkeleton && !fill.includes('services')
          }
          photoVariants={PHOTO_VARIANTS}
          heroVideoSrc={heroVideoSrc}
        />
      </div>

      <p style={{ marginTop: 12, color: '#666', fontSize: 11 }}>
        photoVariants fixed to {'{ hero: 0, support: 0 }'} · video = TRADE_VIDEOS[trade][0] when on ·
        fixture base: {baseFixture.business.name}
      </p>
    </div>
  );
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
