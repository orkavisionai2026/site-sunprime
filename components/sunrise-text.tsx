'use client';

import { Fragment } from 'react';
import { m, useReducedMotion } from 'framer-motion';

type Props = {
  children: string;
  className?: string;
  /** Delay inicial antes da primeira letra nascer */
  delay?: number;
  /** Stagger por letra (s). Default 0.05 */
  stagger?: number;
  /** Duração da entrada de cada letra (s). Default 1.6 */
  duration?: number;
};

/**
 * "Amanhecer" — cada letra nasce escura + dessaturada (como se estivesse
 * sob a luz ainda fraca antes do sol aparecer), sobe um pouco e vai clareando
 * + recuperando a saturação até chegar ao estado natural.
 *
 * O filtro `brightness + saturate` é agnóstico à cor original da letra,
 * então funciona tanto no branco do "Diferente" quanto no dourado do
 * "porque você é." sem precisar saber a cor final.
 */
export function SunriseText({
  children,
  className,
  delay = 0,
  stagger = 0.05,
  duration = 1.6,
}: Props) {
  const reduced = useReducedMotion();
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  const chars = [...children];

  return (
    <span className={className} aria-label={children}>
      {chars.map((char, i) => {
        if (char === ' ') return <Fragment key={i}> </Fragment>;
        return (
          <m.span
            key={i}
            aria-hidden
            className="inline-block"
            initial={{
              opacity: 0.15,
              y: '0.4em',
              filter: 'brightness(0.15) saturate(0.35) blur(4px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'brightness(1) saturate(1) blur(0px)',
            }}
            transition={{
              delay: delay + i * stagger,
              duration,
              ease,
            }}
          >
            {char}
          </m.span>
        );
      })}
    </span>
  );
}
