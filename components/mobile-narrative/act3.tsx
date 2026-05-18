'use client';

import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { Empreendimento } from '@/lib/data/types';

const PIN_COORDS: Record<string, { x: number; y: number }> = {
  'suncool-tower': { x: 12, y: 50 },
  'sunsky-tower': { x: 24, y: 46 },
  'sunview-tower': { x: 36, y: 52 },
  'chateau-excellence': { x: 48, y: 48 },
  era: { x: 56, y: 56 },
  futura: { x: 68, y: 50 },
  'sunstar-ocean-tower': { x: 80, y: 54 },
  organica: { x: 92, y: 52 },
};

type Props = { empreendimentos: Empreendimento[] };

/**
 * Ato 3 — section regular com city bg + pins luminosos + carrossel
 * sliding horizontalmente conforme o scroll vertical avança pela section.
 * Não pina nada externo; cada section é independente.
 */
export function Act3Empreendimentos({ empreendimentos }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0.05, 0.2, 0.8, 0.95], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0.2, 0.8], ['2%', '-87%']);

  const total = empreendimentos.length;
  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.2 || v > 0.8) return;
    const local = (v - 0.2) / 0.6;
    const idx = Math.min(total - 1, Math.max(0, Math.round(local * (total - 1))));
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  const activeSlug = empreendimentos[activeIdx]?.slug;
  const pinSlugs = Object.keys(PIN_COORDS);

  return (
    <m.section
      ref={ref}
      style={{ opacity }}
      className="relative h-svh overflow-hidden bg-ink-950 md:hidden"
    >
      {/* City background — frame estático da sequência pra ancorar os pins */}
      <Image
        src="/hero-sequence-mobile-v2/0060.jpg"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/60" />

      {/* Pins luminosos */}
      <div className="absolute inset-0">
        {pinSlugs.map((slug) => {
          const c = PIN_COORDS[slug];
          const active = slug === activeSlug;
          return (
            <div
              key={slug}
              className="absolute"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-hidden="true"
            >
              <div className="relative">
                {active && !reduced && (
                  <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/70 motion-safe:animate-ping" />
                )}
                <span
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-sm transition-all duration-300 ${
                    active ? 'h-5 w-5 bg-gold-300/80' : 'h-3 w-3 bg-paper-100/40'
                  }`}
                />
                <span
                  className={`relative block rounded-full transition-all duration-300 ${
                    active
                      ? 'h-3 w-3 bg-gold-200 shadow-[0_0_12px_rgba(212,175,127,0.9)]'
                      : 'h-1.5 w-1.5 bg-paper-100/80'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strip horizontal de cards — slide controlado pelo scroll da section */}
      <div className="absolute inset-x-0 bottom-10 overflow-hidden">
        <m.div
          style={{ x }}
          className="flex w-max gap-3 px-6 will-change-transform"
        >
          {empreendimentos.map((emp, i) => {
            const isActive = i === activeIdx;
            return (
              <Link
                key={emp.slug}
                href={`/empreendimentos/${emp.slug}`}
                className={`block h-[260px] w-[70vw] shrink-0 overflow-hidden rounded-2xl bg-ink-900 transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 ring-1 ring-gold-400/80'
                    : 'opacity-70'
                }`}
              >
                <div className="relative h-3/4 w-full">
                  <Image
                    src={emp.capa.src}
                    alt={emp.capa.alt ?? emp.nome}
                    fill
                    sizes="70vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-white/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-50 backdrop-blur-md">
                    {emp.status.titulo}
                  </span>
                </div>
                <div className="flex h-1/4 items-center px-4">
                  <h3 className="display text-base leading-tight text-paper-50">{emp.nome}</h3>
                </div>
              </Link>
            );
          })}
        </m.div>
      </div>
    </m.section>
  );
}
