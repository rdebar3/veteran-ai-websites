'use client';

interface LeadCardProps {
  name: string;
  category: string;
  area: string;
  phone: string;
}

export default function LeadCard({ name, category, area, phone }: LeadCardProps) {
  return (
    <div className="monti-lead" role="status">
      <div className="monti-lead-h">● New hot lead — landed in Rich&apos;s tool</div>
      <div className="monti-lead-card">
        <div className="monti-lead-nm">{name}</div>
        <div className="monti-lead-meta">
          {category}
          {area ? ` · ${area}` : ''}
          {phone ? ` · ${phone}` : ''}
        </div>
        <span className="monti-lead-tag">source: monti · hot_inbound · site drafted</span>
      </div>
    </div>
  );
}
