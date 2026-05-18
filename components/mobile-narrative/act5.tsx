'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

type Props = {
  versos: string[];
  manifestoTitulo: string;
};

/**
 * Ato 5 — section regular com manifesto reveal cumulativo + closing + CTA.
 * Sem pin — flui no scroll natural. Reveal driven pelo scroll da section.
 */
export function Act5Manifesto({ versos, manifestoTitulo }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const lines = versos.slice(0, 4);
  const r0 = useTransform(scrollYProgress, [0.2, 0.3], [0, 1]);
  const r1 = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);
  const r2 = useTransform(scrollYProgress, [0.42, 0.52], [0, 1]);
  const r3 = useTransform(scrollYProgress, [0.52, 0.62], [0, 1]);
  const reveals = [r0, r1, r2, r3];

  const eyebrowOpacity = useTransform(scrollYProgress, [0.15, 0.25], [0, 1]);
  const fullLinkOpacity = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const closingOpacity = useTransform(scrollYProgress, [0.74, 0.84], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.84, 0.92], [0, 1]);
  const ctaScale = useTransform(scrollYProgress, [0.84, 0.92], [0.95, 1]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[120vh] flex-col justify-center bg-gradient-to-b from-ink-950 via-ocean-900/20 to-ink-950 px-6 py-20 md:hidden"
    >
      <m.span
        style={{ opacity: eyebrowOpacity }}
        className="eyebrow text-center text-gold-400"
      >
        {manifestoTitulo}
      </m.span>

      <div className="mt-8 space-y-4 text-center">
        {lines.map((verso, i) => (
          <m.p
            key={i}
            style={{ opacity: reveals[i] }}
            className="display text-[1.6rem] leading-tight text-paper-50"
          >
            {verso}
          </m.p>
        ))}
      </div>

      <m.div
        style={{ opacity: fullLinkOpacity }}
        className="mt-8 flex justify-center"
      >
        <Link href="/sobre" className="eyebrow text-gold-400 hover:text-gold-200">
          Ler manifesto completo →
        </Link>
      </m.div>

      <m.h2
        style={{ opacity: closingOpacity }}
        className="display mt-12 text-center text-3xl leading-[1.05] text-paper-50"
      >
        Nunca é apenas
        <br />
        <span className="italic text-gold-400">um prédio vindo da Sunprime.</span>
      </m.h2>

      <m.div
        style={{ opacity: ctaOpacity, scale: reduced ? 1 : ctaScale }}
        className="mt-10 flex justify-center"
      >
        <Link
          href="/contato"
          className="eyebrow glow-box rounded-full bg-gold-500 px-7 py-4 text-ink-950"
        >
          Falar com a Sunprime
        </Link>
      </m.div>
    </section>
  );
}
