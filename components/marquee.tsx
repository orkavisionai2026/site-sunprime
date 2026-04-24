'use client';

import { m, useReducedMotion } from 'framer-motion';

type Props = {
  items: string[];
  /** Segundos para completar 1 volta (quanto maior, mais lento). Default 32. */
  duration?: number;
  /** Direção do deslocamento. Default left. */
  direction?: 'left' | 'right';
  className?: string;
};

/**
 * Marquee infinito. Duplica o conteúdo e anima x de 0% a -50%, o que faz o
 * loop ser perfeitamente contínuo (sem "salto" no fim do ciclo).
 *
 * Respeita prefers-reduced-motion (mostra estático).
 */
export function Marquee({ items, duration = 32, direction = 'left', className }: Props) {
  const reduced = useReducedMotion();
  const loop = [...items, ...items];
  const from = direction === 'left' ? '0%' : '-50%';
  const to = direction === 'left' ? '-50%' : '0%';

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      {/* Fade nas bordas pra amaciar a saída/entrada */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />

      <m.div
        className="flex whitespace-nowrap"
        animate={reduced ? undefined : { x: [from, to] }}
        transition={reduced ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="display mx-10 flex items-center gap-10 text-5xl text-paper-100 md:text-7xl"
          >
            {item}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold-500" />
          </span>
        ))}
      </m.div>
    </div>
  );
}
