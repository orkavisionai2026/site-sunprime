'use client';

import { m, useReducedMotion } from 'framer-motion';

type Props = {
  src: string;
  poster?: string;
};

export function SionVideoIntro({ src, poster }: Props) {
  const reduced = useReducedMotion();

  const initial = reduced ? false : { opacity: 0, y: 12 };
  const animate = { opacity: 1, y: 0 };
  const transition = { duration: 0.8, ease: 'easeOut' as const };

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <m.p
          initial={initial}
          animate={animate}
          transition={transition}
          className="display mx-auto max-w-3xl text-center text-2xl leading-snug text-paper-50 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Algumas vistas não cabem em fotos.
        </m.p>

        <m.div
          initial={initial}
          animate={animate}
          transition={{ ...transition, delay: 0.15 }}
          className="mt-10 overflow-hidden rounded-2xl sm:mt-12 md:mt-14"
        >
          <video
            className="block h-auto w-full rounded-2xl"
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Vídeo de apresentação do empreendimento Sion"
          />
        </m.div>
      </div>
    </section>
  );
}
