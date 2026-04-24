'use client';

type Props = {
  /** Animated AVIF (AV1 codec, brand avis) — primário, qualidade top */
  animatedAvif: string;
  /** Animated WebP — fallback para browsers sem suporte AVIF animado */
  animatedWebp: string;
  /** Poster JPG (fallback enquanto carrega, primeiro frame do loop) */
  poster: string;
  alt: string;
  className?: string;
};

/**
 * Hero de fundo usando imagem animada em vez de <video>.
 *
 * Por quê imagem em vez de vídeo: browsers aplicam autoplay policy em <video>
 * mesmo com muted+playsinline+JS forçado, e alguns usuários veem overlay
 * nativo de play que não dá pra matar via CSS. Imagens animadas (AVIF/WebP)
 * não têm essa policy, sempre rodam em loop desde o primeiro frame.
 *
 * Não seguimos `prefers-reduced-motion` aqui: o conteúdo é um drone aéreo
 * lento, sem parallax nem cortes bruscos — mais próximo de um ambiente do
 * que de uma animação. Respeitar reduced-motion faria mobile com "Reduzir
 * Movimento" ligado perder o hero inteiro.
 */
export function VideoHero({ animatedAvif, animatedWebp, poster, alt, className }: Props) {
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
        // poster como background — aparece durante o load inicial e some quando a imagem chega
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  );
}
