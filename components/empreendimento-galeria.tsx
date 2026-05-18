'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import { Reveal } from './reveal';
import type { ImageRef } from '@/lib/data';

const EmpreendimentoGaleriaLightbox = dynamic(
  () => import('./empreendimento-galeria-lightbox'),
  { ssr: false },
);

type Props = {
  imagens: ImageRef[];
  nomeEmpreendimento: string;
};

export function EmpreendimentoGaleria({ imagens, nomeEmpreendimento }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const close = useCallback(() => {
    setOpenIndex((idx) => {
      if (idx !== null) {
        requestAnimationFrame(() => thumbRefs.current[idx]?.focus());
      }
      return null;
    });
  }, []);

  return (
    <>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {imagens.map((img, i) => (
          <Reveal key={i} delay={(i % 3) * 0.05}>
            <button
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Ampliar imagem ${i + 1} de ${nomeEmpreendimento}`}
              className="relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg bg-ink-800"
            >
              <Image
                src={img.src}
                alt={img.alt ?? `${nomeEmpreendimento} · imagem ${i + 1}`}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {openIndex !== null && (
        <EmpreendimentoGaleriaLightbox
          imagens={imagens}
          openIndex={openIndex}
          nomeEmpreendimento={nomeEmpreendimento}
          onClose={close}
        />
      )}
    </>
  );
}
