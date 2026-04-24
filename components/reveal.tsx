'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ComponentProps, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof typeof m;
} & Omit<ComponentProps<typeof m.div>, 'children' | 'initial' | 'whileInView'>;

/**
 * Reveal no primeiro scroll-into-view. Respeita prefers-reduced-motion.
 * LazyMotion (domAnimation) já está habilitado em Providers.
 */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = 'div',
  ...rest
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = m[as] as typeof m.div;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
