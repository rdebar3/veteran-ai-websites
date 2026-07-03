import type { ReactNode } from 'react';

type RevealDelay = 'none' | '1' | '2' | '3' | '4' | '5';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: RevealDelay;
  variant?: 'up' | 'scale' | 'left' | 'right';
}

export default function Reveal({
  children,
  className = '',
  delay = 'none',
  variant = 'up',
}: RevealProps) {
  const delayClass = delay !== 'none' ? `reveal--d${delay}` : '';
  return (
    <div className={`reveal reveal--${variant} ${delayClass} ${className}`.trim()}>
      {children}
    </div>
  );
}