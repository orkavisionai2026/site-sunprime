'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  /** Animated AVIF (AV1 codec, brand avis) — primário, qualidade top */
  animatedAvif: string;
  /** Animated WebP — fallback para browsers sem suporte AVIF animado */
  animatedWebp: string;
  /** Poster JPG para prefers-reduced-motion e fallback enquanto carrega */
  poster: string;
  alt: string;
  className?: string;
};

/**
 * Hero de fundo usando imagem animada em vez de <video>.
 *
 * Por quê: browsers aplicam autoplay policy em <video> mesmo com
 * muted+playsinline+JS forçado — alguns usuários veem overlay nativo de play
 * que não dá pra matar via CSS. Imagens animadas (AVIF/WebP) não têm essa
 * policy, sempre rodam em loop desde o primeiro frame.
 *
 * Estratégia:
 *  - <picture> oferece AVIF (AV1, ~10x mais eficiente que WebP) e WebP fallback
 *  - prefers-reduced-motion → poster estático
 *  - Não passa pelo next/image: o otimizador extrai primeiro frame e serve
 *    estático, matando a animação
 */
export function VideoHero({ animatedAvif, animatedWebp, poster, alt, className }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return (
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={className}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={animatedAvif} />
      <source type="image/webp" srcSet={animatedWebp} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={animatedWebp}
        alt={alt}
        className={className}
        decoding="async"
        fetchPriority="high"
      />
    </picture>
  );
}
