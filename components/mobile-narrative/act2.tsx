'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Ato 2 — section regular de uma viewport com texto centralizado.
 * Reveal animado por scroll: entra de baixo, fica visível, sai por cima.
 * Sem pin, sem overlay — flui no scroll natural depois do hero.
 */
export function Act2Skyline() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-svh items-center justify-center bg-ink-950 px-6 text-center md:hidden"
    >
      <m.div
        style={{ opacity, y: reduced ? 0 : y }}
        className="will-change-[opacity,transform]"
      >
        <h2 className="display text-[2rem] leading-[1.05] text-paper-50">
          Onze empreendimentos.
          <br />
          <span className="italic text-gold-400">Um skyline.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xs font-mono text-[11px] uppercase tracking-[0.25em] text-ink-200">
          A cada projeto, uma nova forma de viver Itapema.
        </p>
      </m.div>
    </section>
  );
}
