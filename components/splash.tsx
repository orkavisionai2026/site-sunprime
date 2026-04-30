'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'sunprime-splash-seen';
const MIN_DISPLAY_MS = 1100;
const FADE_MS = 700;
const PREFETCH_ROUTES = ['/empreendimentos', '/sobre', '/contato'];

/**
 * Tela de carregamento: logo stacked + ring dourado + porcentagem.
 * - Aparece uma vez por sessão (sessionStorage)
 * - Anima 0→100% baseado em (a) curva de tempo, (b) window.load real
 * - Faz prefetch das outras rotas em background pra próxima navegação ser instantânea
 * - Respeita prefers-reduced-motion
 */
export function Splash() {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Já foi visto nesta sessão → pula
    if (sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      setMounted(false);
      return;
    }

    // Prefetch das próximas rotas durante o splash
    PREFETCH_ROUTES.forEach((r) => {
      try {
        router.prefetch(r);
      } catch {
        /* no-op */
      }
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minMs = prefersReduced ? 300 : MIN_DISPLAY_MS;
    const start = performance.now();
    const loadedRef = { current: document.readyState === 'complete' };

    let frame = 0;
    const tick = () => {
      const elapsed = performance.now() - start;

      if (loadedRef.current) {
        // Pós-load: corre suavemente até 100
        setProgress((p) => {
          const next = p + Math.max(1.2, (100 - p) * 0.18);
          if (next >= 100) return 100;
          frame = requestAnimationFrame(tick);
          return next;
        });
      } else {
        // Pré-load: ramp assintótico até ~92% (sensação de progresso real)
        const target = 92 * (1 - Math.exp(-elapsed / 1400));
        setProgress(target);
        frame = requestAnimationFrame(tick);
      }
    };

    const onLoad = () => {
      loadedRef.current = true;
    };

    if (!loadedRef.current) {
      window.addEventListener('load', onLoad, { once: true });
    }

    frame = requestAnimationFrame(tick);

    // Esconde quando bater 100% E o tempo mínimo passar
    const hideCheckId = window.setInterval(() => {
      const elapsed = performance.now() - start;
      if (progress >= 100 && elapsed >= minMs) {
        // será tratado pelo effect de fade-out abaixo
      }
    }, 50);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(hideCheckId);
      window.removeEventListener('load', onLoad);
    };
  }, [router]);

  // Quando progress chega a 100, espera o tempo mínimo e dispara fade-out
  useEffect(() => {
    if (progress < 100) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const id = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1');
      setVisible(false);
      window.setTimeout(() => setMounted(false), FADE_MS);
    }, 200);

    return () => window.clearTimeout(id);
  }, [progress]);

  if (!mounted) return null;

  const pct = Math.round(progress);

  return (
    <div
      aria-hidden={!visible}
      role="status"
      aria-live="polite"
      className={`
        fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink-950
        transition-opacity ease-out
        ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}
      `}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <div className="relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
        {/* Ring dourado girando */}
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

        <div className="absolute inset-1 rounded-full border border-ink-800/80" />

        <Image
          src="/brand/logo-rodape.png"
          alt="Sunprime"
          width={105}
          height={131}
          priority
          className="relative z-10 h-16 w-auto md:h-20"
        />
      </div>

      {/* Porcentagem + barra fina */}
      <div className="flex w-44 flex-col items-center gap-3 md:w-56">
        <span
          className="font-mono text-sm tracking-[0.3em] text-paper-100 md:text-base"
          aria-label={`Carregando ${pct}%`}
        >
          {pct.toString().padStart(2, '0')}%
        </span>
        <div className="h-px w-full overflow-hidden bg-ink-800">
          <div
            className="h-full bg-paper-100 transition-[width] duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="sr-only">Carregando</span>
    </div>
  );
}
