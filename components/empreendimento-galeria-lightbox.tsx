'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import type { ImageRef } from '@/lib/data';

type Props = {
  imagens: ImageRef[];
  openIndex: number;
  nomeEmpreendimento: string;
  onClose: () => void;
};

export default function EmpreendimentoGaleriaLightbox({
  imagens,
  openIndex,
  nomeEmpreendimento,
  onClose,
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const img = imagens[openIndex];
  const w = img.width ?? 1920;
  const h = img.height ?? 1280;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagem ${openIndex + 1} de ${nomeEmpreendimento}`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Fechar imagem"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/80 text-paper-50 transition hover:bg-ink-900 sm:right-6 sm:top-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
        </svg>
      </button>
      <Image
        src={img.src}
        alt={img.alt ?? `${nomeEmpreendimento} · imagem ${openIndex + 1}`}
        width={w}
        height={h}
        sizes="100vw"
        priority
        onClick={(e) => e.stopPropagation()}
        className="h-auto max-h-full w-auto max-w-full object-contain"
      />
    </div>
  );
}
