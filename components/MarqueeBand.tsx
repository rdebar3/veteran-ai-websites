import { marqueeItems } from '@/lib/cinematic';

export default function MarqueeBand() {
  const items = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__fade marquee__fade--left" />
      <div className="marquee__fade marquee__fade--right" />
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee__item">
            <span className="marquee__star">★</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}