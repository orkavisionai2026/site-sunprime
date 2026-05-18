import Link from 'next/link';
import { CinematicSection } from '@/components/cinematic-section';
import { EmpreendimentosCarousel } from '@/components/empreendimentos-carousel';
import { HeroImageSequence } from '@/components/hero-image-sequence';
import { HeroLogo } from '@/components/hero-logo';
import { Marquee } from '@/components/marquee';
import { Act2Skyline } from '@/components/mobile-narrative/act2';
import { Act3Empreendimentos } from '@/components/mobile-narrative/act3';
import { Act4Sion } from '@/components/mobile-narrative/act4';
import { Act5Manifesto } from '@/components/mobile-narrative/act5';
import { MobileScrollHint } from '@/components/mobile-narrative/scroll-hint';
import { MobileStatement } from '@/components/mobile-narrative/statement';
import { Reveal } from '@/components/reveal';
import { SunriseText } from '@/components/sunrise-text';
import { VideoHero } from '@/components/video-hero';
import { getConfiguracaoSite, getEmpreendimento, getEmpreendimentos, getInstitucional } from '@/lib/data';

const PROJETO_DESTAQUE_SLUG = 'sion';

export default function HomePage() {
  const empreendimentos = getEmpreendimentos();
  const institucional = getInstitucional();
  // Fallback: se o slug hardcoded sumir do data, pega o primeiro por ordemDestaque
  const projetoDestaque = getEmpreendimento(PROJETO_DESTAQUE_SLUG) ?? empreendimentos[0];
  const config = getConfiguracaoSite();
  const whatsappDestaque =
    projetoDestaque && config.whatsappUrl
      ? `${config.whatsappUrl}${config.whatsappUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(
          `Olá! Tenho interesse no empreendimento ${projetoDestaque.nome} e gostaria de mais informações.`,
        )}`
      : config.whatsappUrl;

  return (
    <>
      {/* ——— HERO — sequência de imagens controlada por scroll ————————————— */}
      <HeroImageSequence
        basePath="/hero-sequence"
        basePathMobile="/hero-sequence-mobile-v2"
        scrollHeightMobile={200}
        totalFrames={121}
        alt="Vista aérea de Meia Praia, Itapema — Sunprime Empreendimentos"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.4)_30%,rgba(0,0,0,0.6)_65%,#000_95%)]" />

        {/* Logo centralizada — fade in no mount + fade out via scroll */}
        <HeroLogo />

        {/* Scroll-hint discreto no rodapé do hero */}
        <div className="absolute inset-x-0 bottom-8 z-10 hidden justify-center md:flex">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ink-300">↓ role</p>
        </div>
        <MobileScrollHint />
      </HeroImageSequence>

      {/* ——— MOBILE NARRATIVE — sections regulares, fluxo normal ————————— */}
      <Act2Skyline />
      <Act3Empreendimentos empreendimentos={empreendimentos} />
      <MobileStatement />
      {projetoDestaque && (
        <Act4Sion
          empreendimento={projetoDestaque}
          videoSrc="/empreendimentos/sion/destaque.mp4"
          whatsappUrl={whatsappDestaque}
        />
      )}
      <div className="relative border-y border-ink-800/60 bg-ink-950 py-8 md:hidden">
        <Marquee items={empreendimentos.map((e) => e.nome)} duration={32} />
      </div>
      <Act5Manifesto
        versos={institucional.manifestoVersos}
        manifestoTitulo={institucional.manifestoTitulo}
      />

      {/* ——— INTRO (eyebrow + título + CTAs) ————————————————————————————— */}
      <section className="relative hidden bg-ink-950 px-6 py-20 sm:px-8 sm:py-24 md:block md:px-10 md:py-32 lg:px-16 lg:py-40 xl:px-20">
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

      {/* ——— CARROSSEL DE EMPREENDIMENTOS ————————————————————————————————— */}
      <section className="relative hidden bg-ink-950 pt-2 pb-16 sm:pb-20 md:block md:pb-24">
        <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 sm:mb-10 sm:px-8 md:px-10 lg:px-16 xl:px-20">
          <div>
            <span className="eyebrow">Conheça nossos empreendimentos</span>
            <h2 className="display mt-3 text-2xl text-paper-50 sm:text-3xl md:text-4xl lg:text-5xl">
              Skyline em <span className="italic text-gold-400">movimento.</span>
            </h2>
          </div>
          <Link
            href="/empreendimentos"
            className="eyebrow text-ink-200 hover:text-gold-400"
          >
            Ver todos →
          </Link>
        </div>

        <EmpreendimentosCarousel items={empreendimentos} />
      </section>

      {/* ——— STATEMENT (card off-white flutuando no preto) —————————————— */}
      <CinematicSection
        offset={100}
        fromScale={0.95}
        className="hidden overflow-hidden bg-ink-950 px-4 py-20 sm:px-6 sm:py-24 md:block md:px-10 md:py-32 lg:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <div
            className="
              relative rounded-[2rem] bg-paper-50 px-8 py-16 sm:rounded-[2.5rem] sm:px-12 sm:py-20
              md:rounded-[3rem] md:px-16 md:py-28 lg:px-24 lg:py-32
              shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]
            "
          >
            <Reveal y={70}>
              <p className="display text-3xl leading-[1.05] text-ink-950 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Projetamos espaços
              </p>
            </Reveal>
            <Reveal delay={0.18} y={70}>
              <p className="display text-3xl leading-[1.05] text-ink-950 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                com design inspirador.
              </p>
            </Reveal>
            <Reveal delay={0.36} y={70}>
              <p className="display mt-1 text-3xl leading-[1.05] italic text-ink-700 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Uma explosão de formas.
              </p>
            </Reveal>
          </div>
        </div>
      </CinematicSection>

      {/* ——— DESTAQUE EDITORIAL — projeto-bandeira (Sion) ———————————————— */}
      {projetoDestaque && (
        <CinematicSection className="relative hidden overflow-hidden bg-ink-950 px-6 py-20 sm:py-24 md:block md:px-10 md:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <span className="eyebrow text-gold-400">Lançamento em destaque</span>
            </Reveal>

            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-12 lg:gap-16">
              {/* Vídeo do empreendimento */}
              <Reveal>
                <Link
                  href={`/empreendimentos/${projetoDestaque.slug}`}
                  className="group relative block overflow-hidden rounded-2xl bg-ink-900"
                >
                  <div className="relative aspect-[5/6] w-full md:aspect-square lg:aspect-[5/6]">
                    <VideoHero
                      video="/empreendimentos/sion/destaque.mp4"
                      poster="/empreendimentos/sion/destaque-poster.jpg"
                      alt={projetoDestaque.render?.alt ?? projetoDestaque.capa.alt ?? projetoDestaque.nome}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
                  </div>
                  <span
                    className="
                      eyebrow absolute left-5 top-5 rounded-full
                      border border-white/15 bg-white/10 px-3 py-1 text-paper-50 backdrop-blur-md
                    "
                  >
                    {projetoDestaque.status.titulo}
                  </span>
                </Link>
              </Reveal>

              {/* Conteúdo editorial */}
              <Reveal delay={0.15}>
                <div>
                  <h2 className="display text-4xl leading-[1.02] text-paper-50 sm:text-5xl md:text-6xl lg:text-7xl">
                    {projetoDestaque.nome}
                  </h2>
                  {projetoDestaque.localizacao && (
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.3em] text-ink-300">
                      {projetoDestaque.localizacao.bairro && `${projetoDestaque.localizacao.bairro} · `}
                      {projetoDestaque.localizacao.cidade} / {projetoDestaque.localizacao.uf}
                    </p>
                  )}

                  {projetoDestaque.descricao[0] && (
                    <p className="mt-8 text-base leading-relaxed text-ink-200 sm:text-lg">
                      {projetoDestaque.descricao[0]}
                    </p>
                  )}

                  {projetoDestaque.fichaTecnica.length > 0 && (
                    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-800/80 pt-6">
                      {projetoDestaque.fichaTecnica.slice(0, 4).map((item) => (
                        <div key={item.rotulo}>
                          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
                            {item.rotulo}
                          </dt>
                          <dd className="mt-1 text-sm text-paper-100">{item.valor}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                    <Link
                      href={`/empreendimentos/${projetoDestaque.slug}`}
                      className="
                        eyebrow glow-box rounded-full bg-gold-500 px-6 py-3 text-center text-ink-950
                        transition-all hover:bg-gold-400
                      "
                    >
                      Conhecer o {projetoDestaque.nome}
                    </Link>
                    {whatsappDestaque && (
                      <a
                        href={whatsappDestaque}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          eyebrow rounded-full border border-white/15 bg-white/5 px-6 py-3 text-center
                          text-paper-100 backdrop-blur-md
                          shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                          transition-all hover:bg-white/10
                        "
                      >
                        Falar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </CinematicSection>
      )}

      {/* ——— MARQUEE ————————————————————————————————————————————————————— */}
      <div className="relative hidden border-y border-ink-800/60 bg-ink-950 py-10 md:block md:py-16">
        <Marquee items={empreendimentos.map((e) => e.nome)} duration={38} />
      </div>

      {/* ——— MANIFESTO ————————————————————————————————————————————————————— */}
      <CinematicSection className="relative hidden border-y border-ink-800/60 bg-gradient-to-b from-ink-950 via-ocean-900/40 to-ink-950 px-6 py-20 sm:py-24 md:block md:px-10 md:py-32 lg:py-40">
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
      <CinematicSection className="relative hidden bg-ink-950 px-6 py-20 sm:py-24 md:block md:px-10 md:py-32 lg:py-36">
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
