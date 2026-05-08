'use client';

import {
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { createContext, useEffect, useRef, useState, type ReactNode } from 'react';

/** Expõe o `scrollYProgress` (já amortecido) pra filhos consumirem (ex: logo com fade-out). */
export const HeroSequenceProgress = createContext<MotionValue<number> | null>(null);

type Props = {
  /** Pasta pública com os frames desktop (sem barra final). Ex: "/hero-sequence". */
  basePath: string;
  /** Pasta pública com versão mobile (opcional, ativa adaptive loading). Ex: "/hero-sequence-mobile". */
  basePathMobile?: string;
  /** Largura máxima (px) considerada "mobile" pra escolher o basePathMobile. Default 768. */
  mobileBreakpoint?: number;
  /** Total de frames. Os arquivos devem ser `0001.jpg`, `0002.jpg`... */
  totalFrames: number;
  /** Padding numérico do nome do arquivo. Default 4 (=0001). */
  padding?: number;
  /** Extensão do arquivo. Default "jpg". */
  ext?: string;
  /** Altura do scroll-spacer em viewport heights. Default 400 (=3x de scroll com hero pinned). Maior = scrub mais longo. */
  scrollHeight?: number;
  /** Altura do scroll-spacer em mobile (<768px). Default 200 (=1x scroll extra). Reduz "demora" pra rolar até a próxima seção. */
  scrollHeightMobile?: number;
  alt: string;
  children?: ReactNode;
};

/**
 * Hero com sequência de imagens controlada por scroll — técnica usada nas
 * landing pages da Apple (AirPods, iPhone). Renderiza frames numa <canvas>
 * de acordo com o progresso do scroll. Bidirectional perfeito (não tem
 * o problema de seek reverso de MP4).
 *
 * - Pré-carrega TODOS os frames em paralelo com prioridade ao primeiro
 * - Canvas em DPR alto (retina-ready) com object-cover manual
 * - Spring smoothing pra fluidez tipo manteiga
 * - Suporte completo a desktop (wheel) e mobile (touch) via useScroll global
 * - Indicador de progresso de loading
 * - Fallback pra prefers-reduced-motion (mostra só o primeiro frame)
 */
export function HeroImageSequence({
  basePath,
  basePathMobile,
  mobileBreakpoint = 768,
  totalFrames,
  padding = 4,
  ext = 'jpg',
  scrollHeight = 400,
  scrollHeightMobile = 200,
  alt,
  children,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);
  const rafRef = useRef<number | null>(null);
  const pendingFrameRef = useRef<number>(0);

  const reduced = useReducedMotion();
  const [loadedCount, setLoadedCount] = useState(0);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  // Adaptive loading: começa null pra evitar flash; decide no useEffect.
  const [activeBase, setActiveBase] = useState<string | null>(null);
  const [activeScrollHeight, setActiveScrollHeight] = useState(scrollHeight);

  // Detecta viewport: escolhe basePath e scrollHeight conforme tamanho.
  // (não troca em runtime — ficaria caro recarregar todos os frames).
  useEffect(() => {
    const isMobile = window.innerWidth < mobileBreakpoint;
    setActiveBase(isMobile && basePathMobile ? basePathMobile : basePath);
    setActiveScrollHeight(isMobile ? scrollHeightMobile : scrollHeight);
  }, [basePath, basePathMobile, mobileBreakpoint, scrollHeight, scrollHeightMobile]);

  // ============================================
  // 1. Pré-carregamento progressivo com prioridades
  //    Estratégia para sequências grandes (centenas de frames):
  //    - Wave 1 (high): primeiro frame (poster instantâneo)
  //    - Wave 2 (high): frames âncora a cada ~10% do total (sub-amostragem)
  //    - Wave 3 (low):  preenche os intermediários
  //    Isso permite scrub utilizável após ~10% baixado, sem
  //    saturar a fila de rede do browser.
  // ============================================
  useEffect(() => {
    if (!activeBase) return; // espera detecção do viewport
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;

    // Reset estados ao trocar basePath
    setLoadedCount(0);
    setFirstFrameReady(false);

    const buildSrc = (i: number) =>
      `${activeBase}/${String(i + 1).padStart(padding, '0')}.${ext}`;

    const loadOne = (i: number, priority: 'high' | 'low' = 'low') => {
      const img = new window.Image();
      img.decoding = priority === 'high' ? 'sync' : 'async';
      img.fetchPriority = priority;
      img.src = buildSrc(i);
      imgs[i] = img;
      img.onload = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
        if (i === 0) {
          setFirstFrameReady(true);
          requestAnimationFrame(() => drawFrame(0));
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
      };
    };

    // Wave 1: primeiro frame (poster)
    loadOne(0, 'high');

    // Wave 2: frames âncora — sub-amostragem do timeline pra dar
    // base mínima de scrub assim que poucos frames carregaram.
    const stride = Math.max(1, Math.floor(totalFrames / 12));
    for (let i = stride; i < totalFrames; i += stride) {
      loadOne(i, 'high');
    }

    // Wave 3: preenche os intermediários em paralelo (low priority)
    for (let i = 1; i < totalFrames; i++) {
      if (!imgs[i]) loadOne(i, 'low');
    }

    imagesRef.current = imgs;
    return () => {
      cancelled = true;
      imgs.forEach((img) => {
        if (img) img.onload = img.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBase, totalFrames, padding, ext]);

  // ============================================
  // 2. Setup do canvas (DPR retina + resize com redraw obrigatório)
  // ============================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (w === 0 || h === 0) return; // evita resize precoce
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        // Sempre tenta redesenhar — se ainda não tem frame, drawFrame faz fallback
        const idx = lastDrawnRef.current >= 0 ? lastDrawnRef.current : 0;
        drawFrame(idx);
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(canvas);
    window.addEventListener('orientationchange', updateSize);
    window.addEventListener('resize', updateSize);
    // Defensivo: re-mede após o splash sair / fontes carregarem (1s e 2s)
    const t1 = window.setTimeout(updateSize, 1000);
    const t2 = window.setTimeout(updateSize, 2200);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', updateSize);
      window.removeEventListener('resize', updateSize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // 3. Função de desenho — object-fit: cover manual
  //    Se o frame alvo ainda não carregou, faz fallback pro frame
  //    carregado mais próximo (procura simétrica). Garante que o
  //    canvas nunca pisca preto durante o pré-carregamento.
  // ============================================
  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgs = imagesRef.current;
    let img = imgs[idx];

    // Fallback: se o frame alvo não está pronto, busca o mais próximo
    if (!img || !img.complete || img.naturalWidth === 0) {
      let best: HTMLImageElement | undefined;
      for (let radius = 1; radius < imgs.length; radius++) {
        const a = imgs[idx - radius];
        if (a && a.complete && a.naturalWidth > 0) { best = a; break; }
        const b = imgs[idx + radius];
        if (b && b.complete && b.naturalWidth > 0) { best = b; break; }
      }
      if (!best) return;
      img = best;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return; // canvas sem dimensão — pula
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Limpa antes de desenhar (evita resíduos de paint anterior)
    ctx.clearRect(0, 0, cw, ch);

    // object-fit: cover — escala maior pra preencher
    const scale = Math.max(cw / iw, ch / ih);
    const w = iw * scale;
    const h = ih * scale;
    const x = (cw - w) / 2;
    const y = (ch - h) / 2;

    ctx.drawImage(img, x, y, w, h);
    lastDrawnRef.current = idx;
  };

  // ============================================
  // 4. Scroll progress + spring smoothing
  // ============================================
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.7,
    restDelta: 0.0001,
  });

  // ============================================
  // 5. Mapeia scroll → frame index, com rAF batching (evita > 60fps)
  // ============================================
  useMotionValueEvent(smoothProgress, 'change', (v) => {
    if (reduced) return;
    const idx = Math.min(
      totalFrames - 1,
      Math.max(0, Math.round(v * (totalFrames - 1))),
    );
    pendingFrameRef.current = idx;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const target = pendingFrameRef.current;
      if (target !== lastDrawnRef.current) drawFrame(target);
    });
  });

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const loadProgress =
    totalFrames > 0 ? Math.round((loadedCount / totalFrames) * 100) : 0;

  return (
    <HeroSequenceProgress.Provider value={smoothProgress}>
      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: reduced ? undefined : `${activeScrollHeight}vh` }}
        aria-label={alt}
      >
        <div
          className="sticky top-0 w-full overflow-hidden bg-ink-950"
          style={{
            height: '100svh',
            minHeight: '100svh',
            willChange: reduced ? undefined : 'transform',
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              pointerEvents: 'none',
            }}
          />

          {/* Loading state — aparece até o primeiro frame estar pronto */}
          {!firstFrameReady && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-12 md:pb-16">
              <div className="flex w-40 flex-col items-center gap-2 md:w-56">
                <span className="font-mono text-[10px] tracking-[0.3em] text-paper-100/70 uppercase">
                  carregando · {loadProgress}%
                </span>
                <div className="h-px w-full overflow-hidden bg-paper-100/20">
                  <div
                    className="h-full bg-paper-100/80 transition-[width] duration-150 ease-out"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {children}
        </div>
      </section>
    </HeroSequenceProgress.Provider>
  );
}
