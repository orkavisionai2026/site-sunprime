'use client';

import { m, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Intensidade do deslocamento vertical (px). Default 60. */
  offset?: number;
  /** Escala inicial (quando abaixo da viewport). Default 0.97. */
  fromScale?: number;
  id?: string;
};

/**
 * Envolve uma <section> e aplica entrada cinematográfica linkada ao scroll:
 *  - escala: fromScale → 1
 *  - y: offset → 0
 *
 * A animação roda continuamente durante o "arrasto" — quanto mais a seção
 * entra na viewport, mais perto do estado final. Muito diferente de um
 * trigger-once: você sente o movimento enquanto rola.
 *
 * Respeita prefers-reduced-motion.
 */
export function CinematicSection({
  children,
  className,
  offset = 60,
  fromScale = 0.97,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Progresso de 0 a 1 enquanto a seção transita de "entrando" até "centralizada"
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  // Spring dá a sensação "viscosa" da animação acompanhar o Lenis
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  const y = useTransform(progress, [0, 1], [offset, 0]);
  const scale = useTransform(progress, [0, 1], [fromScale, 1]);

  if (reduced) {
    return (
      <section ref={ref} id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <m.section
      ref={ref}
      id={id}
      style={{ y, scale, transformOrigin: '50% 100%' }}
      className={className}
    >
      {children}
    </m.section>
  );
}
