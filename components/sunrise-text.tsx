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
 * "Amanhecer" letra-por-letra: cada letra nasce escura + dessaturada +
 * desfocada, sobe 0.4em e vai clareando/focando até o estado natural.
 *
 * Arquitetura das palavras: cada palavra vira um `<span inline-block>` que é
 * atômico no layout (as letras dentro não quebram no meio), e entre palavras
 * há espaço natural que permite wrap. Essencial para mobile — antes as
 * letras quebravam no meio de "Diferente" em telas estreitas.
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

  const words = children.split(' ');
  let letterIndex = 0;

  return (
    <span className={className} aria-label={children}>
      {words.map((word, wi) => {
        const wordChars = [...word];
        const wordContent = (
          <span
            className="inline-block whitespace-nowrap align-baseline"
            aria-hidden
          >
            {wordChars.map((char, ci) => {
              const i = letterIndex++;
              return (
                <m.span
                  key={ci}
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

        return (
          <Fragment key={wi}>
            {wordContent}
            {wi < words.length - 1 && ' '}
          </Fragment>
        );
      })}
    </span>
  );
}
