'use client';

import { m, useMotionValue, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useContext } from 'react';
import { HeroSequenceProgress } from '@/components/hero-image-sequence';

/**
 * Logo central do hero da home.
 * - Renderiza visível (opacity 1) desde o primeiro frame para qualificar como
 *   candidato a LCP (com `elementtiming="hero-logo"`). O canvas do hero
 *   redesenha continuamente e é excluído da heurística de LCP, então o
 *   logo é o âncora estável que o Chrome consegue medir.
 * - Fade-out controlado pelo scroll: some entre 75% e 95% do hero scrub.
 */
export function HeroLogo() {
  const progress = useContext(HeroSequenceProgress);
  const fallback = useMotionValue(0);
  const opacity = useTransform(progress ?? fallback, [0, 0.75, 0.95], [1, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
      <m.div style={{ opacity }} className="will-change-[opacity,transform]">
        <Image
          src="/brand/logo.png"
          alt="Sunprime"
          width={339}
          height={48}
          quality={85}
          priority
          unoptimized
          fetchPriority="high"
          {...({ elementtiming: 'hero-logo' } as Record<string, string>)}
          className="h-10 w-auto sm:h-12 md:h-14 lg:h-16 xl:h-20"
        />
      </m.div>
    </div>
  );
}
