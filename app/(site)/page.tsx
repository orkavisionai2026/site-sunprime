import Link from 'next/link';
import { CinematicSection } from '@/components/cinematic-section';
import { EmpreendimentoCard } from '@/components/empreendimento-card';
import { Marquee } from '@/components/marquee';
import { Reveal } from '@/components/reveal';
import { SunriseText } from '@/components/sunrise-text';
import { VideoHero } from '@/components/video-hero';
import { getEmpreendimentos, getInstitucional } from '@/lib/data';

export default function HomePage() {
  const empreendimentos = getEmpreendimentos();
  const destaques = empreendimentos.slice(0, 3);
  const institucional = getInstitucional();

  return (
    <>
      {/* ——— HERO ————————————————————————————————————————————————————————— */}
      <section className="relative h-screen min-h-[720px] w-full overflow-hidden">
        <VideoHero
          animatedAvif="/hero/hero.avif"
          animatedWebp="/hero/hero.webp"
          poster="/hero/hero-poster.jpg"
          alt="Vista aérea de Itapema — Sunprime Empreendimentos"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/30 to-ink-950" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pt-40 pb-16 md:px-10">
          <Reveal>
            <span className="eyebrow">Sunprime · Itapema · desde {institucional.anoFundacao}</span>
          </Reveal>

          <div className="max-w-5xl">
            <h1 className="display text-display sm:text-display-lg lg:text-display-xl text-paper-50">
              <SunriseText delay={0.4}>Diferente</SunriseText>
              <br />
              <SunriseText delay={1.1} className="italic text-gold-400">
                porque você é.
              </SunriseText>
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-xl text-lg text-ink-200 md:text-xl">
                Projetamos espaços com design inspirador. Uma explosão de formas que
                transforma o skyline das cidades.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/empreendimentos"
                  className="
                    eyebrow rounded-full bg-gold-500 px-6 py-3 text-ink-950
                    transition-colors hover:bg-gold-400
                  "
                >
                  Ver empreendimentos
                </Link>
                <Link
                  href="/sobre"
                  className="
                    eyebrow rounded-full border border-ink-500 px-6 py-3 text-paper-100
                    transition-colors hover:border-gold-500 hover:text-gold-300
                  "
                >
                  Nosso manifesto
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.6}>
            <div className="hidden items-end justify-between md:flex">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-300">
                ↓ role
              </p>
              <p className="max-w-xs text-xs text-ink-400">
                Itapema, SC · Meia Praia
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— DESTAQUES ——————————————————————————————————————————————————— */}
      <CinematicSection className="relative bg-ink-950 px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow">Empreendimentos em destaque</span>
              <h2 className="display mt-4 text-4xl text-paper-50 md:text-6xl">
                Cada projeto conta
                <br />
                <span className="italic text-gold-400">uma história.</span>
              </h2>
            </div>
            <Link
              href="/empreendimentos"
              className="eyebrow text-ink-200 hover:text-gold-400"
            >
              Ver todos →
            </Link>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {destaques.map((emp, i) => (
              <Reveal key={emp.slug} delay={i * 0.1}>
                <EmpreendimentoCard emp={emp} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </CinematicSection>

      {/* ——— MARQUEE ————————————————————————————————————————————————————— */}
      <div className="relative border-y border-ink-800/60 bg-ink-950 py-10 md:py-16">
        <Marquee items={empreendimentos.map((e) => e.nome)} duration={38} />
      </div>

      {/* ——— MANIFESTO ————————————————————————————————————————————————————— */}
      <CinematicSection className="relative border-y border-ink-800/60 bg-gradient-to-b from-ink-950 via-ocean-900/40 to-ink-950 px-6 py-28 md:px-10 md:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow">{institucional.manifestoTitulo}</span>
          </Reveal>
          <div className="mt-10 space-y-6">
            {institucional.manifestoVersos.slice(0, 4).map((verso, i) => (
              <Reveal key={i} delay={0.15 * i}>
                <p className="display text-3xl leading-tight text-paper-50 md:text-5xl">
                  {verso}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.8}>
            <Link
              href="/sobre"
              className="eyebrow mt-14 inline-block text-gold-400 hover:text-gold-200"
            >
              Ler manifesto completo →
            </Link>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— CTA ———————————————————————————————————————————————————————— */}
      <CinematicSection className="relative bg-ink-950 px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="display text-4xl text-paper-50 md:text-6xl">
              Nunca é apenas
              <br />
              <span className="italic text-gold-400">um prédio vindo da Sunprime.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-col justify-end gap-6">
            <p className="text-ink-200">
              Somos energia para um novo viver: urbano, humano, inovador. Conheça o
              próximo passo da Sunprime.
            </p>
            <div>
              <Link
                href="/contato"
                className="
                  eyebrow inline-block rounded-full bg-gold-500 px-6 py-3 text-ink-950
                  transition-colors hover:bg-gold-400
                "
              >
                Falar com a Sunprime
              </Link>
            </div>
          </Reveal>
        </div>
      </CinematicSection>
    </>
  );
}
