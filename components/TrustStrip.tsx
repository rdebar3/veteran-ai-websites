export default function TrustStrip() {
  return (
    <div className="trust-strip" role="contentinfo" aria-label="Business credentials">
      <div className="trust-strip__inner">
        <span>U.S. Veteran Owned</span>
        <span className="trust-strip__dot" aria-hidden="true" />
        <span>West Virginia Based</span>
        <span className="trust-strip__dot" aria-hidden="true" />
        <span>One-Day Delivery</span>
        <span className="trust-strip__dot" aria-hidden="true" />
        <span>100% Ownership</span>
      </div>
    </div>
  );
}