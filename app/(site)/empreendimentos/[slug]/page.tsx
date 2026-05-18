import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CinematicSection } from '@/components/cinematic-section';
import { EmpreendimentoGaleria } from '@/components/empreendimento-galeria';
import { Reveal } from '@/components/reveal';
import { SionVideoIntro } from '@/components/sion-video-intro';
import { getAllSlugs, getEmpreendimento } from '@/lib/data';

type Params = { slug: string };

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const emp = getEmpreendimento(params.slug);
  if (!emp) return { title: 'Empreendimento não encontrado' };
  return {
    title: emp.nome,
    description: emp.descricao[0]?.slice(0, 160) ?? emp.status.titulo,
  };
}

export default function EmpreendimentoPage({ params }: { params: Params }) {
  const emp = getEmpreendimento(params.slug);
  if (!emp) notFound();

  return (
    <article className="bg-ink-950 text-paper-100">
      {/* ——— HERO ————————————————————————————————————————————————————————— */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden sm:h-[85vh] sm:min-h-[640px]">
        <Image
          src={emp.render?.src ?? emp.capa.src}
          alt={emp.render?.alt ?? emp.capa.alt ?? emp.nome}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 sm:pb-16 md:px-10">
          <Reveal>
            <span className="eyebrow">{emp.status.titulo}</span>
            <h1 className="display mt-4 text-[2.75rem] leading-[1.02] text-paper-50 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              {emp.nome}
            </h1>
            {emp.localizacao?.cidade && (
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-ink-200">
                {emp.localizacao.bairro && `${emp.localizacao.bairro} · `}
                {emp.localizacao.cidade} / {emp.localizacao.uf}
              </p>
            )}
            {emp.descricao[0] && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-200 sm:mt-8 sm:text-lg">
                {emp.descricao[0].length > 140
                  ? `${emp.descricao[0].slice(0, 140).trimEnd()}…`
                  : emp.descricao[0]}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ——— VÍDEO DE APRESENTAÇÃO (somente Sion) ———————————————————————— */}
      {emp.slug === 'sion' && (
        <SionVideoIntro
          src="/videos/sion.mp4"
          poster="/videos/posters/sion.jpg"
        />
      )}

      {/* ——— GALERIA ——————————————————————————————————————————————————————— */}
      {emp.galeria.length > 0 && (
        <CinematicSection className="px-6 py-16 sm:py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <span className="eyebrow">Galeria · {emp.galeria.length} imagens</span>
            </Reveal>
            <EmpreendimentoGaleria imagens={emp.galeria} nomeEmpreendimento={emp.nome} />
          </div>
        </CinematicSection>
      )}

      {/* ——— DESCRIÇÃO + FICHA ———————————————————————————————————————————— */}
      <CinematicSection className="px-6 py-20 sm:py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
          <Reveal>
            <span className="eyebrow">Sobre o empreendimento</span>
            <div className="mt-8 space-y-6">
              {emp.descricao.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? 'display text-2xl leading-snug text-paper-50 md:text-3xl'
                      : 'text-lg leading-relaxed text-ink-200'
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {emp.fichaTecnica.length > 0 && (
            <Reveal delay={0.15}>
              <div className="rounded-xl border border-ink-800 bg-ink-900/50 p-8">
                <span className="eyebrow">Ficha técnica</span>
                <dl className="mt-6 space-y-4">
                  {emp.fichaTecnica.map((item) => (
                    <div
                      key={item.rotulo}
                      className="flex items-baseline justify-between gap-6 border-b border-ink-800/60 pb-3 last:border-0"
                    >
                      <dt className="font-mono text-xs uppercase tracking-wider text-ink-300">
                        {item.rotulo}
                      </dt>
                      <dd className="text-right text-sm text-paper-100">{item.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          )}
        </div>
      </CinematicSection>

      {/* ——— ARQUITETOS ——————————————————————————————————————————————————— */}
      {emp.arquitetos.length > 0 && (
        <CinematicSection className="border-t border-ink-800/60 bg-gradient-to-b from-ink-950 to-ocean-900/20 px-6 py-20 sm:py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <span className="eyebrow">Assinatura</span>
              <h2 className="display mt-4 text-3xl text-paper-50 sm:text-4xl md:text-5xl">
                Arquitetura & parceiros
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {emp.arquitetos.map((arq, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col gap-6 md:flex-row">
                    {arq.foto && (
                      <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg bg-ink-800 md:w-40">
                        <Image
                          src={arq.foto.src}
                          alt={arq.foto.alt ?? arq.nome}
                          fill
                          sizes="(min-width: 768px) 160px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="display text-2xl text-paper-50">{arq.nome}</h3>
                      {arq.escritorio && (
                        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-gold-400">
                          {arq.escritorio}
                        </p>
                      )}
                      {arq.descricao && (
                        <p className="mt-4 text-sm leading-relaxed text-ink-200">
                          {arq.descricao}
                        </p>
                      )}
                      {arq.quote && (
                        <blockquote className="mt-4 border-l-2 border-gold-500 pl-4 text-sm italic text-ink-200">
                          “{arq.quote}”
                        </blockquote>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </CinematicSection>
      )}

      {/* ——— MAPA ————————————————————————————————————————————————————————— */}
      {emp.localizacao?.iframeSrc && (
        <CinematicSection className="px-6 py-16 sm:py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <span className="eyebrow">Localização</span>
              <h2 className="display mt-4 text-3xl text-paper-50 sm:text-4xl md:text-5xl">
                {emp.localizacao.cidade}, {emp.localizacao.uf}
              </h2>
            </Reveal>
            <div className="mt-8 overflow-hidden rounded-xl border border-ink-800 sm:mt-10">
              <iframe
                src={emp.localizacao.iframeSrc}
                className="h-[360px] w-full grayscale contrast-125 sm:h-[420px] md:h-[480px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${emp.nome}`}
              />
            </div>
          </div>
        </CinematicSection>
      )}

      {/* ——— DISCLAIMER ——————————————————————————————————————————————————— */}
      {emp.disclaimer && (
        <CinematicSection className="border-t border-ink-800/60 px-6 py-12 md:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs leading-relaxed text-ink-400">
              {emp.disclaimer}
            </p>
          </div>
        </CinematicSection>
      )}

      {/* ——— NAVEGAÇÃO ENTRE EMPREENDIMENTOS —————————————————————————————— */}
      <CinematicSection className="border-t border-ink-800/60 px-6 py-12 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
          <Link href="/empreendimentos" className="eyebrow text-ink-200 hover:text-gold-400">
            ← Todos os empreendimentos
          </Link>
          {emp.hotsiteUrl && (
            <a
              href={emp.hotsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-gold-400 hover:text-gold-200"
            >
              Hotsite completo →
            </a>
          )}
        </div>
      </CinematicSection>
    </article>
  );
}
