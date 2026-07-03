interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <header className={`section-header ${align === 'center' ? 'section-header--center' : ''}`}>
      <div className="section-header__meta">
        <span className="section-header__index">{index}</span>
        <span className="section-header__eyebrow">{eyebrow}</span>
      </div>
      <h2 className="section-header__title">{title}</h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </header>
  );
}