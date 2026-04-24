import type { Metadata } from 'next';
import { CinematicSection } from '@/components/cinematic-section';
import { Reveal } from '@/components/reveal';
import { getConfiguracaoSite } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Contato',
  description:
    'Fale com a Sunprime Empreendimentos. WhatsApp, telefone, e-mail e endereço em Meia Praia, Itapema/SC.',
};

export default function ContatoPage() {
  const c = getConfiguracaoSite();
  const telDigits = c.telefone.replace(/\D/g, '');

  return (
    <div className="bg-ink-950">
      {/* ——— HERO ————————————————————————————————————————————————————————— */}
      <CinematicSection className="relative px-6 pt-40 pb-24 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="eyebrow">Contato</span>
            <h1 className="display mt-4 text-5xl text-paper-50 md:text-7xl lg:text-8xl">
              Falar com<br />
              <span className="italic text-gold-400">a Sunprime.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg text-ink-200">
              Estamos em Meia Praia, Itapema. Atendimento presencial, por telefone, e-mail
              ou WhatsApp — do jeito que for mais prático pra você.
            </p>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— CANAIS PRINCIPAIS (WhatsApp + Telefone) —————————————————————— */}
      <CinematicSection className="px-6 pb-12 md:px-10">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {c.whatsappUrl && c.whatsapp && (
            <Reveal>
              <a
                href={c.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-500 to-gold-600 p-8 text-ink-950 transition-colors hover:from-gold-400 hover:to-gold-500 md:p-10"
              >
                <div className="flex items-start justify-between">
                  <span className="eyebrow text-ink-950/70">WhatsApp</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="display text-4xl leading-tight md:text-5xl">
                    {c.whatsapp}
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em]">
                    Tocar para iniciar conversa →
                  </p>
                </div>
              </a>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <a
              href={`tel:${telDigits}`}
              className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 p-8 text-paper-100 transition-colors hover:border-gold-500/50 md:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="eyebrow">Telefone fixo</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p className="display text-4xl leading-tight text-paper-50 md:text-5xl">
                  {c.telefone}
                </p>
                {c.horarioAtendimento && (
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-300">
                    {c.horarioAtendimento}
                  </p>
                )}
              </div>
            </a>
          </Reveal>
        </div>
      </CinematicSection>

      {/* ——— E-MAIL + ENDEREÇO + SOCIAL ——————————————————————————————————— */}
      <CinematicSection className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-3">
          <Reveal>
            <span className="eyebrow">E-mail</span>
            <a
              href={`mailto:${c.email}`}
              className="display mt-6 block text-2xl text-paper-50 hover:text-gold-400 md:text-3xl"
            >
              {c.email}
            </a>
          </Reveal>

          <Reveal delay={0.1}>
            <span className="eyebrow">Endereço</span>
            <p className="mt-6 text-lg leading-snug text-paper-100">{c.endereco}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.endereco)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow mt-4 inline-block text-gold-400 hover:text-gold-200"
            >
              Abrir no Maps →
            </a>
          </Reveal>

          {c.redesSociais.length > 0 && (
            <Reveal delay={0.2}>
              <span className="eyebrow">Redes</span>
              <ul className="mt-6 space-y-3 text-lg capitalize">
                {c.redesSociais.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-paper-100 hover:text-gold-400"
                    >
                      {r.plataforma}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </CinematicSection>

      {/* ——— MAPA ————————————————————————————————————————————————————————— */}
      <CinematicSection className="px-6 pb-28 md:px-10 md:pb-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-ink-800">
              <iframe
                title="Sede Sunprime · Meia Praia, Itapema"
                src={`https://www.google.com/maps?q=${encodeURIComponent(c.endereco)}&output=embed`}
                className="h-[480px] w-full grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </CinematicSection>
    </div>
  );
}
