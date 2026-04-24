import type { Metadata } from 'next';
import Image from 'next/image';
import { CinematicSection } from '@/components/cinematic-section';
import { Reveal } from '@/components/reveal';
import { getInstitucional } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Sobre',
  description:
    'Manifesto, missão e valores da Sunprime Empreendimentos — incorporadora em Itapema/SC desde 2012.',
};

export default function SobrePage() {
  const sobre = getInstitucional();

  return (
    <div className="bg-ink-950">
      {/* ——— MANIFESTO ————————————————————————————————————————————————————— */}
      <CinematicSection className="relative min-h-screen px-6 pt-40 pb-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="eyebrow">{sobre.manifestoTitulo}</span>
          </Reveal>
          <div className="mt-14 space-y-10">
            {sobre.manifestoVersos.map((verso, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p
                  className={`
                    display leading-[1.05] text-paper-50
                    ${i === 0 ? 'text-5xl md:text-7xl' : 'text-3xl md:text-5xl'}
                    ${i % 2 === 1 ? 'md:pl-16 text-gold-400 italic' : ''}
                  `}
                >
                  {verso}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* ——— MISSÃO ——————————————————————————————————————————————————————— */}
      <CinematicSection className="relative border-y border-ink-800/60 px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2 md:items-center">
          <Reveal>
            <span className="eyebrow">{sobre.missaoTitulo}</span>
            <p className="display mt-8 text-3xl leading-snug text-paper-50 md:text-5xl">
              {sobre.missaoTexto}
            </p>
          </Reveal>
          {sobre.missaoImagem && (
            <Reveal delay={0.15}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-800">
                <Image
                  src={sobre.missaoImagem.src}
                  alt={sobre.missaoImagem.alt ?? 'Missão Sunprime'}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </CinematicSection>

      {/* ——— VALORES ——————————————————————————————————————————————————————— */}
      <CinematicSection className="px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <span className="eyebrow">Nossos valores</span>
            <h2 className="display mt-4 text-4xl text-paper-50 md:text-6xl">
              Quatro princípios
              <br />
              <span className="italic text-gold-400">que nos guiam.</span>
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {sobre.valores.map((valor, i) => (
              <Reveal key={valor.nome} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-ink-800 bg-ink-900/40 p-8 transition-colors hover:border-gold-500/50">
                  <span className="font-mono text-xs text-gold-400">
                    0{i + 1}
                  </span>
                  <h3 className="display text-3xl text-paper-50">{valor.nome}</h3>
                  <p className="text-sm leading-relaxed text-ink-200">{valor.descricao}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* ——— QUEM SOMOS / CEO ———————————————————————————————————————————— */}
      <CinematicSection className="border-t border-ink-800/60 px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-[1fr_1.2fr] md:items-center">
          {sobre.ceo.foto && (
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-800">
                <Image
                  src={sobre.ceo.foto.src}
                  alt={sobre.ceo.foto.alt ?? sobre.ceo.nome}
                  fill
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
          <Reveal delay={0.15}>
            <span className="eyebrow">Quem somos · desde {sobre.anoFundacao}</span>
            <h2 className="display mt-6 text-4xl text-paper-50 md:text-6xl">
              {sobre.ceo.headline}
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-200">
              {sobre.ceo.paragrafos.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-gold-400">
              {sobre.ceo.nome} · {sobre.ceo.cargo}
            </p>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— QUOTE DNA ———————————————————————————————————————————————————— */}
      <CinematicSection className="relative overflow-hidden border-y border-ink-800/60">
        {sobre.quoteDna.imagem && (
          <Image
            src={sobre.quoteDna.imagem.src}
            alt={sobre.quoteDna.imagem.alt ?? 'DNA Sunprime'}
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/80 via-ink-950/60 to-ocean-900/70" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center md:px-10 md:py-48">
          <Reveal>
            <p className="display text-3xl italic leading-snug text-paper-50 md:text-5xl">
              “{sobre.quoteDna.texto}”
            </p>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.3em] text-gold-300">
              — {sobre.quoteDna.autor}
            </p>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— TAGLINE FINAL ——————————————————————————————————————————————— */}
      <CinematicSection className="px-6 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="display text-4xl leading-tight text-paper-50 md:text-7xl">
              {sobre.taglineFinal}
            </p>
          </Reveal>
        </div>
      </CinematicSection>
    </div>
  );
}
