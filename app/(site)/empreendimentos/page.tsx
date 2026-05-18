import type { Metadata } from 'next';
import { CinematicSection } from '@/components/cinematic-section';
import { EmpreendimentoCard } from '@/components/empreendimento-card';
import { Reveal } from '@/components/reveal';
import { getEmpreendimentos } from '@/lib/data';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Empreendimentos',
  description:
    'Conheça todos os empreendimentos da Sunprime em Itapema, organizados por status: pré-lançamentos, em construção e entregues.',
};

export default function EmpreendimentosPage() {
  const todos = getEmpreendimentos();
  const grupos = [
    { titulo: 'Pré-lançamentos', lista: todos.filter((e) => e.status.cor === 'gold-500') },
    { titulo: 'Em construção', lista: todos.filter((e) => e.status.cor === 'ocean-500') },
    { titulo: 'Entregues', lista: todos.filter((e) => e.status.cor === 'ink-500') },
  ];

  return (
    <div className="bg-ink-950">
      <CinematicSection className="relative px-6 pt-28 pb-12 sm:pt-32 sm:pb-16 md:px-10 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <span className="eyebrow">{todos.length} empreendimentos</span>
            <h1 className="display mt-4 text-4xl text-paper-50 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              Skyline<br />
              <span className="italic text-gold-400">em movimento.</span>
            </h1>
          </Reveal>
        </div>
      </CinematicSection>

      {grupos.map((grupo) =>
        grupo.lista.length === 0 ? null : (
          <CinematicSection key={grupo.titulo} className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <Reveal>
                <div className="flex items-center gap-6">
                  <span className="eyebrow">{grupo.titulo}</span>
                  <span className="h-px flex-1 bg-ink-700" />
                  <span className="font-mono text-xs text-ink-400">
                    {grupo.lista.length.toString().padStart(2, '0')}
                  </span>
                </div>
              </Reveal>

              <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {grupo.lista.map((emp, i) => (
                  <Reveal key={emp.slug} delay={i * 0.05}>
                    <EmpreendimentoCard emp={emp} />
                  </Reveal>
                ))}
              </div>
            </div>
          </CinematicSection>
        ),
      )}
    </div>
  );
}
