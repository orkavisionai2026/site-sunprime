import Image from 'next/image';
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
      <section className="relative h-screen min-h-[560px] w-full overflow-hidden sm:min-h-[640px] md:min-h-[720px]">
        <VideoHero
          video="/hero/hero.mp4"
          poster="/hero/hero-poster.jpg"
          alt="Vista aérea de Meia Praia, Itapema — Sunprime Empreendimentos"
          className="absolute inset-0 h-full w-full object-cover object-[30%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.4)_30%,rgba(0,0,0,0.6)_65%,#000_95%)]" />

        {/* Logo centralizada — único elemento do hero */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
          <Image
            src="/brand/logo.png"
            alt="Sunprime"
            width={339}
            height={48}
            priority
            className="h-10 w-auto opacity-90 sm:h-12 md:h-14 lg:h-16 xl:h-20"
          />
        </div>

        {/* Scroll-hint discreto no rodapé do hero */}
        <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center md:flex">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-300">↓ role</p>
        </div>
      </section>

      {/* ——— INTRO (eyebrow + título + CTAs) ————————————————————————————— */}
      <section className="relative bg-ink-950 px-6 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 lg:px-16 lg:py-40 xl:px-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="eyebrow">Sunprime · Itapema · desde {institucional.anoFundacao}</span>
          </Reveal>

          <h1 className="display mt-6 text-[2.75rem] leading-[1.02] text-paper-50 sm:mt-8 sm:text-6xl md:text-7xl lg:text-8xl xl:text-display-lg">
            <SunriseText delay={0.2}>Diferente</SunriseText>
            <br />
            <SunriseText delay={0.9} className="italic text-gold-400">
              porque você é.
            </SunriseText>
          </h1>

          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                href="/empreendimentos"
                className="
                  eyebrow glow-box rounded-full bg-gold-500 px-5 py-3 text-center text-ink-950
                  transition-all hover:bg-gold-400 sm:px-6
                "
              >
                Ver empreendimentos
              </Link>
              <Link
                href="/sobre"
                className="
                  eyebrow rounded-full border border-paper-200/60 px-5 py-3 text-center text-paper-100
                  transition-colors hover:border-paper-100 hover:text-white sm:px-6
                "
              >
                Nosso manifesto
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— STATEMENT ——————————————————————————————————————————————————— */}
      <CinematicSection offset={100} fromScale={0.95} className="overflow-hidden bg-ink-950 px-6 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 lg:px-16 lg:py-40 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <Reveal y={70}>
            <p className="display text-3xl leading-[1.05] text-paper-50 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Projetamos espaços
            </p>
          </Reveal>
          <Reveal delay={0.18} y={70}>
            <p className="display text-3xl leading-[1.05] text-paper-50 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              com design inspirador.
            </p>
          </Reveal>
          <Reveal delay={0.36} y={70}>
            <p className="display mt-1 text-3xl leading-[1.05] italic text-gold-400 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Uma explosão de formas.
            </p>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— DESTAQUES ——————————————————————————————————————————————————— */}
      <CinematicSection className="relative bg-ink-950 px-6 py-20 sm:py-24 md:px-10 md:py-32 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="eyebrow">Empreendimentos em destaque</span>
              <h2 className="display mt-4 text-3xl text-paper-50 sm:text-4xl md:text-5xl lg:text-6xl">
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
      <CinematicSection className="relative border-y border-ink-800/60 bg-gradient-to-b from-ink-950 via-ocean-900/40 to-ink-950 px-6 py-20 sm:py-24 md:px-10 md:py-32 lg:py-40">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <span className="eyebrow">{institucional.manifestoTitulo}</span>
          </Reveal>
          <div className="mt-10 space-y-5 sm:space-y-6">
            {institucional.manifestoVersos.slice(0, 4).map((verso, i) => (
              <Reveal key={i} delay={0.15 * i}>
                <p className="display text-2xl leading-tight text-paper-50 sm:text-3xl md:text-4xl lg:text-5xl">
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
      <CinematicSection className="relative bg-ink-950 px-6 py-20 sm:py-24 md:px-10 md:py-32 lg:py-36">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <h2 className="display text-3xl text-paper-50 sm:text-4xl md:text-5xl lg:text-6xl">
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
                  eyebrow glow-box inline-block rounded-full bg-gold-500 px-6 py-3 text-ink-950
                  transition-all hover:bg-gold-400
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
