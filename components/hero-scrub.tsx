'use client';

import { type MotionValue, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';

/** Expõe o `scrollYProgress` (já amortecido) pra filhos consumirem (ex: logo com fade out). */
export const HeroScrubProgress = createContext<MotionValue<number> | null>(null);

type Props = {
  video: string;
  poster: string;
  alt: string;
  /** Altura total do scroll-spacer em viewport heights. Default 300 (= 2x de scroll com hero pinned). Maior = scrub mais suave. */
  scrollHeight?: number;
  children?: ReactNode;
};

/**
 * Hero com scroll-controlled video estilo Apple.
 *
 * - Desktop e mobile: vídeo pausado e `currentTime` segue diretamente
 *   o progresso do scroll. Section tem altura grande (default 300vh) e
 *   o conteúdo fica `position: sticky` no topo — efeito Apple AirPods/iPhone.
 *   iOS Safari 14+ e Chrome Android suportam seek programático com
 *   `playsInline + muted`.
 *
 * - prefers-reduced-motion ativo: fallback automático pra vídeo em loop
 *   autoplay muted (sem scrub).
 *
 * Mantém: muted, playsInline, disablePictureInPicture, disableRemotePlayback,
 * webkit-playsinline (iOS legado), data-bg pra herdar regras CSS.
 */
export function HeroScrub({
  video,
  poster,
  alt,
  scrollHeight = 300,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // SSR-safe: começa em fallback. Hidrata e ativa scrub se ambiente permitir.
  const [scrubMode, setScrubMode] = useState(false);
  const [scrubReady, setScrubReady] = useState(false);
  const durationRef = useRef(0);

  // 1. Detecta ambiente — scrub habilitado em todos os dispositivos
  // (iOS Safari 14+ e Chrome Android suportam seek programático com
  // playsInline + muted). Único fallback é prefers-reduced-motion.
  useEffect(() => {
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setScrubMode(!mqReduced.matches);
    update();
    mqReduced.addEventListener('change', update);
    return () => mqReduced.removeEventListener('change', update);
  }, []);

  // 2. Setup do <video> de acordo com o modo
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!scrubMode) {
      // Fallback: autoplay loop muted (comportamento original)
      v.loop = true;
      v.autoplay = true;
      v.muted = true;
      const tryPlay = () => v.play().catch(() => {});
      tryPlay();
      v.addEventListener('canplay', tryPlay, { once: true });
      v.addEventListener('loadeddata', tryPlay, { once: true });
      return () => {
        v.removeEventListener('canplay', tryPlay);
        v.removeEventListener('loadeddata', tryPlay);
      };
    }

    // Scrub mode: pausa, sem loop, espera metadata
    v.loop = false;
    v.autoplay = false;
    v.muted = true;
    setScrubReady(false);

    const onMetadata = () => {
      durationRef.current = v.duration || 0;
      if (durationRef.current > 0) setScrubReady(true);
    };

    // Pre-buffer: dispara um play→pause rápido pra forçar bufferização
    // completa do vídeo. Isso reduz drasticamente o "travamento" no seek
    // reverso (MP4 precisa decodificar do I-frame anterior).
    const preBuffer = async () => {
      try {
        await v.play();
        v.pause();
        v.currentTime = 0;
      } catch {
        /* autoplay pode falhar — segue mesmo assim */
      }
    };

    if (v.readyState >= 1 && v.duration && !isNaN(v.duration)) {
      onMetadata();
      preBuffer();
    } else {
      v.addEventListener('loadedmetadata', () => {
        onMetadata();
        preBuffer();
      }, { once: true });
    }
    v.load();

    return () => v.removeEventListener('loadedmetadata', onMetadata);
  }, [scrubMode]);

  // 3. Scroll progress (0→1 enquanto a section transita do start ao end)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Spring "leve" — segue com lag suave, sem travamento brusco.
  // Stiffness baixo + mass moderada = movimento mais fluido que absorve
  // saltos de scroll. Bom pra scrub que precisa decodificar reversamente.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.7,
    restDelta: 0.0001,
  });

  // 4. Mapeia scroll → currentTime do vídeo (com fastSeek quando disponível)
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (!scrubMode || !scrubReady) return;
    const v = videoRef.current;
    const dur = durationRef.current;
    if (!v || !dur) return;
    const target = Math.min(dur, Math.max(0, latest * dur));
    // Threshold = 1 frame (~16ms) pra scrub mais granular
    if (Math.abs(v.currentTime - target) > 0.016) {
      try {
        // fastSeek é otimizado pra navegação scroll-driven (Safari/Firefox)
        if (typeof (v as HTMLVideoElement & { fastSeek?: (t: number) => void }).fastSeek === 'function') {
          (v as HTMLVideoElement & { fastSeek: (t: number) => void }).fastSeek(target);
        } else {
          v.currentTime = target;
        }
      } catch {
        /* Safari pode rejeitar set se o vídeo ainda não tem metadata; ignora. */
      }
    }
  });

  return (
    <HeroScrubProgress.Provider value={smoothProgress}>
      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: scrubMode ? `${scrollHeight}vh` : undefined }}
      >
        <div
          className="
            sticky top-0 w-full overflow-hidden
            h-screen min-h-[560px] sm:min-h-[640px] md:min-h-[720px]
          "
          style={{ willChange: scrubMode ? 'transform' : undefined }}
        >
          <video
            ref={videoRef}
            data-bg
            src={video}
            poster={poster}
            aria-label={alt}
            muted
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            // Atributos legados pra iOS Safari antigo + WeChat browser
            {...({ 'webkit-playsinline': '', 'x5-playsinline': '' } as Record<string, string>)}
            className="absolute inset-0 h-full w-full object-cover object-[30%_center] md:object-center"
            style={{ pointerEvents: 'none' }}
          />
          {children}
        </div>
      </section>
    </HeroScrubProgress.Provider>
  );
}
