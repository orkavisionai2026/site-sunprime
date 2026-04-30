'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Magnetic } from '@/components/magnetic';
import type { MenuItem } from '@/lib/data';

type NavProps = {
  menu: MenuItem[];
  whatsapp?: string;
  whatsappUrl?: string;
  nomePorSlug?: Record<string, string>;
};

export function Nav({ menu, whatsapp, whatsappUrl, nomePorSlug }: NavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isStudio = pathname?.startsWith('/studio');
  if (isStudio) return null;

  const isHome = pathname === '/';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // WhatsApp contextualizado: pré-preenche mensagem com nome do empreendimento atual.
  const empSlugMatch = pathname?.match(/^\/empreendimentos\/([^/]+)$/);
  const empNome = empSlugMatch && nomePorSlug ? nomePorSlug[empSlugMatch[1]] : undefined;
  const whatsappMessage = empNome
    ? `Olá! Tenho interesse no empreendimento ${empNome} e gostaria de mais informações.`
    : 'Olá! Gostaria de saber mais sobre os empreendimentos da Sunprime.';
  const contextualWhatsappUrl = whatsappUrl
    ? `${whatsappUrl}${whatsappUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(whatsappMessage)}`
    : undefined;

  return (
    <header
      data-scrolled={scrolled}
      className="
        fixed inset-x-0 top-0 z-50
        transition-[background,backdrop-filter,border-color,padding] duration-500
        data-[scrolled=false]:bg-transparent
        data-[scrolled=true]:bg-ink-950/70
        data-[scrolled=true]:backdrop-blur-md
        data-[scrolled=true]:border-b data-[scrolled=true]:border-ink-800/60
      "
    >
      {/* Layout: voltar + links à esquerda — botão WhatsApp à direita */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

        <div className="flex items-center gap-6 md:gap-10">
          {/* Voltar (histórico) + Início — visíveis em todas as páginas exceto a home */}
          {!isHome && (
            <>
              <button
                type="button"
                onClick={handleBack}
                aria-label="Voltar para a página anterior"
                className="
                  eyebrow flex items-center gap-2 bg-transparent
                  text-ink-200 transition-colors hover:text-paper-50
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>

              <Link
                href="/"
                aria-label="Ir para a página inicial"
                className="
                  eyebrow flex items-center gap-2 bg-transparent
                  text-ink-200 transition-colors hover:text-paper-50
                "
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8.5z"
                  />
                </svg>
                Início
              </Link>
            </>
          )}

          {/* Links principais — escondido no mobile */}
          <nav className="hidden items-center gap-10 md:flex">
            {menu.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className={`
                  eyebrow transition-colors
                  ${
                    pathname === item.url || pathname?.startsWith(item.url + '/')
                      ? 'text-gold-400'
                      : 'text-ink-200 hover:text-paper-100'
                  }
                `}
                target={item.externo ? '_blank' : undefined}
                rel={item.externo ? 'noopener noreferrer' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botão WhatsApp — sempre à direita */}
        <div className="flex justify-end">
          {contextualWhatsappUrl ? (
            <Magnetic strength={0.4}>
              <a
                href={contextualWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={
                  empNome
                    ? `Falar com a Sunprime no WhatsApp sobre ${empNome}`
                    : whatsapp
                      ? `Realize seu sonho — falar com a Sunprime no WhatsApp · ${whatsapp}`
                      : 'Realize seu sonho — WhatsApp Sunprime'
                }
                className="
                  eyebrow group/cta relative flex items-center gap-2 overflow-hidden rounded-full
                  bg-gold-500 px-5 py-2.5 text-ink-950
                  shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
                  transition-all duration-300
                  hover:bg-gold-400 hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none absolute inset-0 -translate-x-full
                    bg-gradient-to-r from-transparent via-white/40 to-transparent
                    transition-transform duration-700 ease-out
                    group-hover/cta:translate-x-full
                  "
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="relative h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="relative hidden sm:inline">Realize seu sonho</span>
                <span className="relative sm:hidden">Falar agora</span>
              </a>
            </Magnetic>
          ) : (
            <Link
              href="/contato"
              className="
                eyebrow rounded-full bg-gold-500 px-5 py-2.5 text-ink-950
                shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
                transition-all duration-300
                hover:bg-gold-400 hover:shadow-[0_0_28px_rgba(255,255,255,0.35)]
              "
            >
              Realize seu sonho
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
