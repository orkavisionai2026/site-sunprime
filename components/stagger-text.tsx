'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: string | ReactNode;
  className?: string;
  /** Delay inicial antes da primeira palavra entrar */
  delay?: number;
  /** Espaçamento entre palavras (s) */
  stagger?: number;
  /** Deslocamento inicial em em */
  y?: string;
  /** Duração de cada palavra */
  duration?: number;
};

/**
 * Revela o texto palavra-por-palavra com spring. Usa whitespace para preservar
 * a quebra natural; cada palavra é um span inline-block que entra de baixo.
 *
 * Suporta `string` ou nodes mistos (ex: <span className="italic">). Para nodes
 * mistos, o stagger aplica em nível de child direto (não quebra em palavras).
 */
export function StaggerText({
  children,
  className,
  delay = 0,
  stagger = 0.07,
  y = '0.5em',
  duration = 0.9,
}: Props) {
  const reduced = useReducedMotion();
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  // String: splita em palavras
  if (typeof children === 'string') {
    const words = children.split(' ');
    return (
      <span className={className} aria-label={children}>
        {words.map((word, i) => (
          <span
            key={`${i}-${word}`}
            className="inline-block overflow-hidden align-baseline"
            aria-hidden
          >
            <m.span
              className="inline-block"
              initial={{ y }}
              animate={{ y: 0 }}
              transition={{
                delay: delay + i * stagger,
                duration,
                ease,
              }}
            >
              {word}
              {i < words.length - 1 && ' '}
            </m.span>
          </span>
        ))}
      </span>
    );
  }

  // Nodes mistos (ex: <span className="italic">): entra como bloco único
  return (
    <m.span
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease }}
    >
      {children}
    </m.span>
  );
}
