'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const SESSION_KEY = 'sunprime-splash-seen';
const MIN_DISPLAY_MS = 1100;
const FADE_MS = 700;

/**
 * Tela de carregamento: logo stacked da Sunprime com ring dourado girando.
 * - Aparece uma vez por sessão (sessionStorage)
 * - Fica no mínimo 1.1s e espera o window.load antes de sair
 * - Respeita prefers-reduced-motion (sem spin, fade curto)
 */
export function Splash() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // já foi visto nesta sessão → pula
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      setMounted(false);
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = prefersReduced ? 300 : MIN_DISPLAY_MS;
    const start = performance.now();

    const hide = () => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, minMs - elapsed);
      window.setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, '1');
        setVisible(false);
        window.setTimeout(() => setMounted(false), FADE_MS);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      return () => window.removeEventListener('load', hide);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden={!visible}
      role="status"
      className={`
        fixed inset-0 z-[100] flex items-center justify-center bg-ink-950
        transition-opacity ease-out
        ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}
      `}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
        {/* Ring dourado girando (segmento de ~50% do círculo) */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 h-full w-full motion-safe:animate-spin motion-safe:[animation-duration:2.4s]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="splash-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-gold-500)" stopOpacity="0" />
              <stop offset="60%" stopColor="var(--color-gold-500)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-gold-500)" stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke="url(#splash-grad)"
            strokeWidth="1.75"
            strokeDasharray="230 360"
            strokeLinecap="round"
          />
        </svg>

        {/* Círculo estático de base — dá o efeito "pista" onde o ring corre */}
        <div className="absolute inset-1 rounded-full border border-ink-800/80" />

        {/* Logo centralizada */}
        <Image
          src="/brand/logo-rodape.png"
          alt="Sunprime"
          width={105}
          height={131}
          priority
          className="relative z-10 h-16 w-auto md:h-20"
        />
      </div>

      <span className="sr-only">Carregando</span>
    </div>
  );
}
