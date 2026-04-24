'use client';

import { m, useScroll, useSpring } from 'framer-motion';

/**
 * Barra fina dourada no topo que reflete o progresso de scroll da página.
 * Usa spring pra ter o "catch up" depois do Lenis suavizar o scroll.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="
        pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left
        bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500
      "
    />
  );
}
