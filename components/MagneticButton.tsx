'use client';

import {
  useCallback,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useReducedMotion } from 'framer-motion';

type MagneticButtonBaseProps = {
  children: ReactNode;
  className?: string;
  block?: boolean;
  magnetic?: boolean;
};

type MagneticAnchorProps = MagneticButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type MagneticButtonElementProps = MagneticButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type MagneticButtonProps = MagneticAnchorProps | MagneticButtonElementProps;

const MAGNETIC_STRENGTH = 0.24;
const MAGNETIC_RADIUS_FACTOR = 1.15;

export default function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    className = '',
    block = false,
    magnetic = true,
    ...rest
  } = props;
  const href = 'href' in props ? props.href : undefined;
  const disabled = 'disabled' in props ? props.disabled : undefined;

  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const isMagnetic = magnetic && !prefersReducedMotion && !disabled;

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!isMagnetic || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const radius = Math.max(rect.width, rect.height) * MAGNETIC_RADIUS_FACTOR;

      if (distance < radius) {
        const pull = 1 - distance / radius;
        setOffset({
          x: dx * MAGNETIC_STRENGTH * pull,
          y: dy * MAGNETIC_STRENGTH * pull,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    },
    [isMagnetic],
  );

  const resetMotion = useCallback(() => {
    setOffset({ x: 0, y: 0 });
    setHovered(false);
  }, []);

  const motionStyle = isMagnetic
    ? {
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${hovered ? 1.03 : 1})`,
      }
    : undefined;

  const label = <span className="btn__label">{children}</span>;

  const sharedProps = {
    className,
    style: motionStyle,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: resetMotion,
    'data-magnetic': isMagnetic ? 'true' : undefined,
    'data-hovered': hovered ? 'true' : undefined,
  };

  const control =
    href != null ? (
      <a
        ref={ref as RefObject<HTMLAnchorElement | null>}
        href={href}
        {...sharedProps}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {label}
      </a>
    ) : (
      <button
        ref={ref as RefObject<HTMLButtonElement | null>}
        type={(rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
        disabled={disabled}
        {...sharedProps}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {label}
      </button>
    );

  if (!isMagnetic) {
    return block ? <div className="btn-magnetic btn-magnetic--block">{control}</div> : control;
  }

  return (
    <div
      className={`btn-magnetic${block ? ' btn-magnetic--block' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMotion}
    >
      {control}
    </div>
  );
}