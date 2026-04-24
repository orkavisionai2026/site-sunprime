'use client';

import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  /** Força do magnetismo (0–1). 0.35 é um puxão sutil; 0.6 é forte. */
  strength?: number;
  className?: string;
};

/**
 * Wrapper que "puxa" sutilmente o conteúdo em direção ao cursor quando o
 * mouse está dentro dele. Volta à posição original quando o mouse sai,
 * com spring. Padrão clássico de sites premium de arquitetura/agências.
 *
 * Só roda em pointer:fine (desktop). Respeita prefers-reduced-motion.
 */
export function Magnetic({ children, strength = 0.35, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 15, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 180, damping: 15, mass: 0.35 });

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    x.set(mx * strength);
    y.set(my * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </m.div>
  );
}
