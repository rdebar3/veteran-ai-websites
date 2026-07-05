export default function CircuitOverlay({ className = '' }: { className?: string }) {
  return (
    <div className={`circuit-overlay ${className}`.trim()} aria-hidden="true">
      <svg className="circuit-overlay__svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="circuit-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e8a33d" stopOpacity="0.12" />
          </linearGradient>
          <filter id="circuit-blur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <g className="circuit-overlay__paths" stroke="url(#circuit-glow)" strokeWidth="1" fill="none">
          <path d="M0 180 H320 L380 240 H620 L680 180 H960 L1020 260 H1440" />
          <path d="M0 420 H240 L300 360 H520 L580 440 H840 L900 380 H1200 L1260 460 H1440" />
          <path d="M0 660 H180 L240 720 H480 L540 640 H780 L840 700 H1080 L1140 620 H1440" />
          <path d="M320 180 V420 M680 180 V440 M1020 260 V660" opacity="0.35" />
          <path d="M380 240 L300 360 M620 440 L580 440 M900 380 L840 700" opacity="0.25" />
        </g>
        <g className="circuit-overlay__nodes" fill="#22d3ee">
          <circle cx="320" cy="180" r="3" opacity="0.55" />
          <circle cx="680" cy="180" r="2.5" opacity="0.45" />
          <circle cx="1020" cy="260" r="3" opacity="0.5" />
          <circle cx="300" cy="360" r="2" opacity="0.4" />
          <circle cx="580" cy="440" r="2.5" opacity="0.45" />
          <circle cx="840" cy="700" r="3" opacity="0.5" />
          <circle cx="1140" cy="620" r="2" opacity="0.35" />
        </g>
        <g className="circuit-overlay__pulse" filter="url(#circuit-blur)">
          <circle cx="680" cy="180" r="6" fill="#22d3ee" opacity="0.2" />
          <circle cx="580" cy="440" r="5" fill="#38bdf8" opacity="0.18" />
          <circle cx="840" cy="700" r="6" fill="#e8a33d" opacity="0.12" />
        </g>
      </svg>
    </div>
  );
}