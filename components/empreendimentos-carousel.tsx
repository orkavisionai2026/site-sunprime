'use client';

import { useEffect, useRef, useState } from 'react';
import { EmpreendimentoCard } from './empreendimento-card';
import type { Empreendimento } from '@/lib/data';

type Props = {
  items: Empreendimento[];
};

export function EmpreendimentosCarousel({ items }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-carousel-card]');
    const gap = 16;
    const step = (card?.offsetWidth ?? el.clientWidth * 0.8) + gap;
    el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollBy(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollBy(-1);
    }
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label="Carrossel de empreendimentos"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="
          flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth
          px-6 pb-3 sm:px-8 md:px-10 lg:px-16 xl:px-20
          outline-none focus-visible:ring-2 focus-visible:ring-gold-400
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        "
      >
        {items.map((emp, i) => (
          <div
            key={emp.slug}
            data-carousel-card
            className="
              snap-start shrink-0
              w-[80%] sm:w-[55%] md:w-[42%] lg:w-[32%] xl:w-[28%]
            "
          >
            <EmpreendimentoCard emp={emp} priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Setas — só desktop */}
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        aria-label="Empreendimento anterior"
        className="
          absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center
          rounded-full border border-white/15 bg-white/5 text-paper-100 backdrop-blur-md
          shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
          transition-all hover:bg-white/10
          disabled:pointer-events-none disabled:opacity-30
          md:flex
        "
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        aria-label="Próximo empreendimento"
        className="
          absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center
          rounded-full border border-white/15 bg-white/5 text-paper-100 backdrop-blur-md
          shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
          transition-all hover:bg-white/10
          disabled:pointer-events-none disabled:opacity-30
          md:flex
        "
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
