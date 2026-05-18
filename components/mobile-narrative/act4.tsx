'use client';

import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Empreendimento } from '@/lib/data/types';

type Props = {
  empreendimento: Empreendimento;
  videoSrc: string;
  whatsappUrl?: string;
};

const STAT_TARGETS = {
  pavimentos: 29,
  andares: 23,
  garagens: 4,
  apartamentos: 86,
};

/**
 * Ato 4 — section regular com vídeo do Sion como backdrop + conteúdo
 * editorial + stats counter + CTAs. Sem pin — flui no scroll natural.
 */
export function Act4Sion({ empreendimento, videoSrc, whatsappUrl }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const blockOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.8, 0.95], [0, 1, 1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.8, 0.92], [0, 1, 1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.45, 0.55], [20, 0]);

  // Stats counter — anima entre 0.25 e 0.45 do scroll da section
  const [stats, setStats] = useState({
    pavimentos: 0,
    andares: 0,
    garagens: 0,
    apartamentos: 0,
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v < 0.25) {
      if (stats.pavimentos !== 0) {
        setStats({ pavimentos: 0, andares: 0, garagens: 0, apartamentos: 0 });
      }
      return;
    }
    if (v >= 0.45) {
      if (stats.pavimentos !== STAT_TARGETS.pavimentos) {
        setStats(STAT_TARGETS);
      }
      return;
    }
    const t = (v - 0.25) / 0.2;
    setStats({
      pavimentos: Math.round(STAT_TARGETS.pavimentos * t),
      andares: Math.round(STAT_TARGETS.andares * t),
      garagens: Math.round(STAT_TARGETS.garagens * t),
      apartamentos: Math.round(STAT_TARGETS.apartamentos * t),
    });
  });

  // Vídeo: play/pause sob demanda
  const videoRef = useRef<HTMLVideoElement>(null);
  const playingRef = useRef(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const el = videoRef.current;
    if (!el) return;
    if (v > 0.1 && !playingRef.current) {
      playingRef.current = true;
      el.play().catch(() => {});
    } else if (v < 0.05 && playingRef.current) {
      playingRef.current = false;
      el.pause();
    }
  });

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.pause();
  }, []);

  const formatStat = (n: number) => n.toString().padStart(2, '0');

  return (
    <m.section
      ref={ref}
      style={{ opacity: blockOpacity }}
      className="relative min-h-svh overflow-hidden bg-ink-950 md:hidden"
    >
      {/* Vídeo como backdrop */}
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="metadata"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        className="absolute inset-0 h-full w-full object-cover"
        style={{ pointerEvents: 'none' }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/30" />

      {/* Conteúdo */}
      <div className="relative flex min-h-svh flex-col justify-end px-6 pb-10 pt-20">
        <span className="eyebrow text-gold-400">Lançamento em destaque</span>

        <h2 className="display mt-3 text-[2.5rem] leading-[1.02] text-paper-50">
          {empreendimento.nome}
        </h2>

        {empreendimento.localizacao && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-300">
            {empreendimento.localizacao.bairro && `${empreendimento.localizacao.bairro} · `}
            {empreendimento.localizacao.cidade} / {empreendimento.localizacao.uf}
          </p>
        )}

        <dl
          aria-live="polite"
          aria-atomic="false"
          className="mt-6 grid grid-cols-4 gap-2 border-t border-ink-700/60 pt-4"
        >
          <Stat value={formatStat(stats.pavimentos)} label="Pav." />
          <Stat value={formatStat(stats.andares)} label="Andares" />
          <Stat value={formatStat(stats.garagens)} label="Garagens" />
          <Stat value={formatStat(stats.apartamentos)} label="Apto." />
        </dl>

        {/* CTAs entram um pouco depois do counter terminar */}
        <m.div
          style={{ opacity: ctaOpacity, y: reduced ? 0 : ctaY }}
          className="mt-6 flex flex-col gap-2 will-change-[opacity,transform]"
        >
          <Link
            href={`/empreendimentos/${empreendimento.slug}`}
            className="eyebrow glow-box rounded-full bg-gold-500 px-5 py-3 text-center text-ink-950"
          >
            Conhecer o {empreendimento.nome}
          </Link>
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow rounded-full border border-white/15 bg-white/5 px-5 py-3 text-center text-paper-100 backdrop-blur-md"
            >
              Falar no WhatsApp
            </a>
          )}
        </m.div>
      </div>
    </m.section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">{label}</dt>
      <dd className="display mt-1 text-2xl text-paper-50 tabular-nums">{value}</dd>
    </div>
  );
}
