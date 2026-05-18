'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Statement card mobile — bloco off-white sobre fundo escuro com a tagline
 * "Projetamos espaços com design inspirador. Uma explosão de formas."
 *
 * Versão mobile do card que existe no desktop. Reveal animado por scroll.
 */
export function MobileStatement() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0.1, 0.3], [0.92, 1]);

  return (
    <section
      ref={ref}
      className="relative bg-ink-950 px-4 py-20 md:hidden"
    >
      <m.div
        style={{
          opacity,
          y: reduced ? 0 : y,
          scale: reduced ? 1 : scale,
        }}
        className="relative rounded-[2rem] bg-paper-50 px-8 py-16 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] will-change-[opacity,transform]"
      >
        <p className="display text-3xl leading-[1.05] text-ink-950">Projetamos espaços</p>
        <p className="display text-3xl leading-[1.05] text-ink-950">com design inspirador.</p>
        <p className="display mt-3 text-3xl leading-[1.05] italic text-ink-700">
          Uma explosão de formas.
        </p>
      </m.div>
    </section>
  );
}
