export default function PatrioticOverlay({ className = '' }: { className?: string }) {
  return (
    <div className={`patriotic-overlay ${className}`.trim()} aria-hidden="true">
      <div className="patriotic-overlay__stripe patriotic-overlay__stripe--crimson" />
      <div className="patriotic-overlay__stripe patriotic-overlay__stripe--gold" />
      <div className="patriotic-overlay__stripe patriotic-overlay__stripe--cyan" />
      <div className="patriotic-overlay__flag-wave" />
      <div className="patriotic-overlay__stars">
        <span>★</span>
        <span>★</span>
        <span>★</span>
      </div>
    </div>
  );
}