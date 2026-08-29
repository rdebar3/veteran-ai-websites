import type { KickerFamily } from './copy';
import { kickerFamilyFor } from './copy';

export function motifFamilyFor(category?: string): KickerFamily {
  return kickerFamilyFor(category);
}

function RoofingMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path
        d="M48 248 L168 92 L288 248"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M120 268 L248 78 L376 268"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M196 282 L328 108 L452 282"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GcMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.8">
        <path d="M56 48 V340 M80 48 V340 M104 48 V340 M128 48 V340 M152 48 V340 M176 48 V340 M200 48 V340 M224 48 V340 M248 48 V340 M272 48 V340 M296 48 V340 M320 48 V340" />
        <path d="M40 64 H340 M40 88 H340 M40 112 H340 M40 136 H340 M40 160 H340 M40 184 H340 M40 208 H340 M40 232 H340 M40 256 H340 M40 280 H340 M40 304 H340" />
      </g>
      <rect
        x="88"
        y="96"
        width="196"
        height="124"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
      <rect
        x="168"
        y="176"
        width="176"
        height="132"
        stroke="var(--a2)"
        strokeOpacity="0.12"
        strokeWidth="1.35"
      />
    </svg>
  );
}

function HvacMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path
        d="M72 332 A148 148 0 0 1 220 184"
        stroke="currentColor"
        strokeOpacity="0.07"
        strokeWidth="1.2"
      />
      <path
        d="M72 332 A196 196 0 0 1 268 136"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1.35"
      />
      <path
        d="M72 332 A244 244 0 0 1 316 88"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="1.5"
      />
      <path
        d="M72 332 A292 292 0 0 1 364 44"
        stroke="var(--a2)"
        strokeOpacity="0.08"
        strokeWidth="1.2"
      />
      <circle
        cx="72"
        cy="332"
        r="18"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function PlumbingMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path
        d="M48 96 H228 A28 28 0 0 1 256 124 V308"
        stroke="currentColor"
        strokeOpacity="0.14"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M420 72 V212 A28 28 0 0 1 392 240 H168"
        stroke="var(--a2)"
        strokeOpacity="0.1"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="256" cy="124" r="11" fill="currentColor" fillOpacity="0.16" />
      <circle cx="392" cy="240" r="11" fill="currentColor" fillOpacity="0.12" />
      <circle cx="168" cy="240" r="8" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

function ElectricMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path
        d="M212 36 L132 176 H204 L108 352"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />
      <path
        d="M132 176 H64"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1.3"
      />
      <path
        d="M204 176 H292"
        stroke="var(--a2)"
        strokeOpacity="0.1"
        strokeWidth="1.3"
      />
      <path
        d="M108 352 H196"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1.2"
      />
      <circle cx="64" cy="176" r="6" fill="currentColor" fillOpacity="0.14" />
      <circle cx="292" cy="176" r="6" fill="currentColor" fillOpacity="0.12" />
      <circle cx="196" cy="352" r="5" fill="currentColor" fillOpacity="0.1" />
      <circle cx="132" cy="176" r="4.5" fill="currentColor" fillOpacity="0.08" />
    </svg>
  );
}

function AutoMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path d="M24 92 H360" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1.1" />
      <path d="M24 132 H412" stroke="currentColor" strokeOpacity="0.09" strokeWidth="1.2" />
      <path d="M24 172 H456" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.3" />
      <path d="M24 212 H388" stroke="var(--a2)" strokeOpacity="0.08" strokeWidth="1.15" />
      <path
        d="M168 348 A128 128 0 0 1 424 348"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.05"
      />
    </svg>
  );
}

function TowingMotif() {
  return (
    <svg viewBox="0 0 480 400" fill="none" aria-hidden="true">
      <path
        d="M8 188 H472"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="1.4"
      />
      <path
        d="M8 228 H472"
        stroke="currentColor"
        strokeOpacity="0.08"
        strokeWidth="1.2"
        strokeDasharray="18 14"
      />
      <path
        d="M292 188 C 360 188, 392 248, 348 292 C 324 316, 292 304, 304 272"
        stroke="var(--a2)"
        strokeOpacity="0.16"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function HeroMotif({ category }: { category?: string }) {
  const family = motifFamilyFor(category);
  let motif = <GcMotif />;
  if (family === 'roofing') motif = <RoofingMotif />;
  else if (family === 'hvac') motif = <HvacMotif />;
  else if (family === 'plumbing') motif = <PlumbingMotif />;
  else if (family === 'electric') motif = <ElectricMotif />;
  else if (family === 'auto') motif = <AutoMotif />;
  else if (family === 'towing') motif = <TowingMotif />;
  return (
    <div className="hero-motif" aria-hidden="true" data-motif={family}>
      {motif}
    </div>
  );
}
