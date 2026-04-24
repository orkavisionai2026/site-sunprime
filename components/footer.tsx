import Link from 'next/link';
import type { ConfiguracaoSite } from '@/lib/data';

export function Footer({ config }: { config: ConfiguracaoSite }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-ink-800/80 bg-ink-950 text-ink-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr_1fr] md:px-10">
        <div>
          <p className="display text-4xl leading-[0.95] text-paper-100 md:text-5xl">
            {config.tagline}
          </p>
          <p className="mt-6 max-w-sm text-sm text-ink-300">
            Sunprime Empreendimentos · Itapema · SC
          </p>
        </div>

        <div>
          <span className="eyebrow">Contato</span>
          <ul className="mt-5 space-y-3 text-sm">
            <li>{config.endereco}</li>
            <li>
              <a href={`tel:${config.telefone.replace(/\D/g, '')}`} className="hover:text-gold-400">
                {config.telefone}
              </a>
            </li>
            {config.whatsapp && config.whatsappUrl && (
              <li>
                <a
                  href={config.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400"
                >
                  WhatsApp · {config.whatsapp}
                </a>
              </li>
            )}
            <li>
              <a href={`mailto:${config.email}`} className="hover:text-gold-400">
                {config.email}
              </a>
            </li>
            {config.horarioAtendimento && (
              <li className="text-ink-400">{config.horarioAtendimento}</li>
            )}
          </ul>
        </div>

        <div>
          <span className="eyebrow">Navegar</span>
          <ul className="mt-5 space-y-3 text-sm">
            {config.menuPrincipal.map((m) => (
              <li key={m.url}>
                <Link href={m.url} className="hover:text-gold-400">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>

          {config.redesSociais.length > 0 && (
            <>
              <span className="eyebrow mt-8 block">Redes</span>
              <ul className="mt-5 flex gap-5 text-sm capitalize">
                {config.redesSociais.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gold-400"
                    >
                      {r.plataforma}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-ink-800/60 px-6 py-6 font-mono text-xs text-ink-400 md:px-10">
        <span>© {year} Sunprime Empreendimentos · Todos os direitos reservados</span>
        <Link href="/studio" className="hover:text-gold-400">
          Studio
        </Link>
      </div>
    </footer>
  );
}
