'use client';

import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import type { Empreendimento } from '@/lib/data';

const STATUS_BADGE: Record<Empreendimento['status']['cor'], string> = {
  'gold-500': 'bg-gold-500 text-ink-950',
  'ocean-500': 'bg-ocean-500 text-paper-100',
  'ink-500': 'bg-ink-700 text-paper-100',
};

export function EmpreendimentoCard({
  emp,
  priority = false,
  size = 'md',
}: {
  emp: Empreendimento;
  priority?: boolean;
  size?: 'md' | 'lg';
}) {
  const aspectClass = size === 'lg' ? 'aspect-[3/4]' : 'aspect-[4/5]';
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  // Tilt 3D — rotação em X/Y baseada na posição do mouse dentro do card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div style={reduced ? undefined : { perspective: 1200 }}>
      <m.a
        ref={ref}
        href={`/empreendimentos/${emp.slug}`}
        onMouseMove={reduced ? undefined : onMove}
        onMouseLeave={reduced ? undefined : onLeave}
        style={
          reduced
            ? undefined
            : { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }
        }
        className="group relative block overflow-hidden rounded-xl bg-ink-800 will-change-transform"
      >
        <div className={`relative w-full ${aspectClass}`}>
          <Image
            src={emp.capa.src}
            alt={emp.capa.alt ?? emp.nome}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
          <span
            className={`eyebrow inline-flex w-fit items-center rounded-full px-3 py-1 ${
              STATUS_BADGE[emp.status.cor]
            }`}
          >
            {emp.status.titulo}
          </span>
          <h3 className="display text-3xl text-paper-50 md:text-4xl">{emp.nome}</h3>
          {emp.descricao[0] && (
            <p className="line-clamp-2 max-w-md text-sm text-ink-200">
              {emp.descricao[0]}
            </p>
          )}
        </div>
      </m.a>
    </div>
  );
}
