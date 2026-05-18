'use client';

import { m, useMotionValue, useTransform } from 'framer-motion';
import { useContext } from 'react';
import { HeroSequenceProgress } from '@/components/hero-image-sequence';

/**
 * Hint sutil de scroll no rodapé do hero — só aparece no mobile.
 * Some assim que o usuário começa a rolar (5-10% do master scroll).
 */
export function MobileScrollHint() {
  const fallback = useMotionValue(0);
  const progress = useContext(HeroSequenceProgress) ?? fallback;
  const opacity = useTransform(progress, [0, 0.04, 0.1], [1, 1, 0]);

  return (
    <m.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 md:hidden"
    >
      <span className="block h-6 w-px bg-gradient-to-b from-paper-100/0 to-paper-100/60" />
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-300">deslize</p>
    </m.div>
  );
}
