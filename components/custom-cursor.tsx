'use client';

import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Cursor customizado com 2 camadas:
 *  - Dot dourado pequeno que acompanha o mouse com spring rápida
 *  - Ring maior com spring mais lenta (gera o "lag" cinematográfico)
 *
 * Ativa só em dispositivos com `pointer: fine` (desktop com mouse).
 * Cresce/muda de cor ao passar sobre elementos interativos.
 * Respeita prefers-reduced-motion (cai pra cursor nativo).
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Dot — rápido, quase 1:1 com o mouse
  const dotX = useSpring(x, { stiffness: 500, damping: 30, mass: 0.15 });
  const dotY = useSpring(y, { stiffness: 500, damping: 30, mass: 0.15 });

  // Ring — mais lento, cria a defasagem visual
  const ringX = useSpring(x, { stiffness: 140, damping: 18, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 140, damping: 18, mass: 0.6 });

  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const INTERACTIVE = 'a, button, [role=button], input, textarea, select, label, [data-cursor=hover]';
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(Boolean(target?.closest(INTERACTIVE)));
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <m.div
        aria-hidden
        style={{ x: dotX, y: dotY }}
        className="
          pointer-events-none fixed left-0 top-0 z-[70] -ml-[3px] -mt-[3px]
          h-[6px] w-[6px] rounded-full bg-gold-400
        "
      />
      <m.div
        aria-hidden
        data-hovering={hovering}
        data-pressed={pressed}
        style={{ x: ringX, y: ringY }}
        className="
          pointer-events-none fixed left-0 top-0 z-[70] rounded-full
          border border-gold-500/60
          transition-[width,height,margin,background,border] duration-300 ease-out
          data-[hovering=true]:border-gold-400 data-[hovering=true]:bg-gold-500/10
          data-[pressed=true]:scale-90
          -ml-[16px] -mt-[16px] h-8 w-8
          data-[hovering=true]:-ml-[28px] data-[hovering=true]:-mt-[28px]
          data-[hovering=true]:h-14 data-[hovering=true]:w-14
        "
      />
    </>
  );
}
