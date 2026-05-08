'use client';

import { animate, m, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { HeroSequenceProgress } from '@/components/hero-image-sequence';

/**
 * Logo central do hero com:
 *  - Fade-in inicial no mount (animação cinematográfica de entrada)
 *  - Fade-out controlado pelo scroll (some junto com o hero ao rolar)
 *
 * Lê o `scrollYProgress` do <HeroScrub> via Context. Funciona em qualquer
 * profundidade dentro dele.
 */
export function HeroLogo() {
  const reduced = useReducedMotion();
  const progress = useContext(HeroSequenceProgress);

  // Opacidade da animação de entrada (0 → 1 no mount)
  const intro = useMotionValue(0);

  // Opacidade controlada pelo scroll (1 → 0 conforme rola o hero)
  // Fica 100% até 75% do scroll; some no finalzinho (entre 75% e 95%).
  const fallback = useMotionValue(0);
  const scrollOpacity = useTransform(progress ?? fallback, [0, 0.75, 0.95], [1, 1, 0]);

  // Combinação: opacidade final = mínimo entre intro e scroll
  const opacity = useTransform([intro, scrollOpacity], ([a, b]: number[]) => Math.min(a, b));

  // Dispara fade-in no mount
  useEffect(() => {
    if (reduced) {
      intro.set(1);
      return;
    }
    const ctrl = animate(intro, 1, {
      delay: 0.4,
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1], // cubic-bezier "ease-out-expo" suave
    });
    return () => ctrl.stop();
  }, [intro, reduced]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
      <m.div style={{ opacity }} className="will-change-[opacity,transform]">
        <Image
          src="/brand/logo.png"
          alt="Sunprime"
          width={339}
          height={48}
          quality={100}
          priority
          unoptimized
          className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 xl:h-20"
        />
      </m.div>
    </div>
  );
}
