export default function NeuralOverlay() {
  return (
    <div className="neural-overlay" aria-hidden="true">
      <svg className="neural-overlay__svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="neural-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#e8a33d" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#b23a48" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <g stroke="url(#neural-glow)" strokeWidth="0.5" fill="none" opacity="0.6">
          <path d="M0 200 Q300 180 500 220 T1000 190 L1200 200" />
          <path d="M0 400 Q250 370 600 410 T1200 390" />
          <path d="M0 600 Q400 580 700 620 T1200 600" />
          <circle cx="200" cy="200" r="3" fill="#22d3ee" opacity="0.4" />
          <circle cx="500" cy="220" r="2" fill="#22d3ee" opacity="0.3" />
          <circle cx="800" cy="190" r="3" fill="#e8a33d" opacity="0.25" />
          <circle cx="300" cy="400" r="2" fill="#22d3ee" opacity="0.25" />
          <circle cx="600" cy="410" r="3" fill="#22d3ee" opacity="0.3" />
          <circle cx="900" cy="390" r="2" fill="#e8a33d" opacity="0.22" />
          <line x1="200" y1="200" x2="500" y2="220" opacity="0.2" />
          <line x1="500" y1="220" x2="800" y2="190" opacity="0.2" />
          <line x1="300" y1="400" x2="600" y2="410" opacity="0.15" />
          <line x1="600" y1="410" x2="900" y2="390" opacity="0.15" />
          <line x1="500" y1="220" x2="600" y2="410" opacity="0.1" />
        </g>
      </svg>
    </div>
  );
}