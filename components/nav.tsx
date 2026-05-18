'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha o menu ao navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Trava scroll do body quando o menu mobile está aberto
  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  // Focus trap + ESC pra fechar — quando menu mobile abre
  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const overlay = overlayRef.current;
      if (!overlay) return;
      const focusable = overlay.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-10 md:py-5">

        <div className="flex items-center gap-2 sm:gap-3 md:gap-10">
          {/* Hamburger — só mobile, à esquerda */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="
              flex h-10 w-10 items-center justify-center rounded-full
              border border-white/15 bg-white/5 text-paper-100 backdrop-blur-md
              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
              transition-all hover:bg-white/10 md:hidden
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

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
                <span className="hidden sm:inline">Voltar</span>
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
                <span className="hidden sm:inline">Início</span>
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
                  border border-white/15 bg-white/5 px-3 py-2 text-paper-50 backdrop-blur-md
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                  transition-all duration-300
                  hover:bg-white/10
                  sm:px-4 md:px-5 md:py-2.5
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
                <span className="relative">Realize seu sonho</span>
              </a>
            </Magnetic>
          ) : (
            <Link
              href="/contato"
              className="
                eyebrow rounded-full
                border border-white/15 bg-white/5 px-3 py-2 text-paper-50 backdrop-blur-md
                shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                transition-all duration-300
                hover:bg-white/10
                sm:px-4 md:px-5 md:py-2.5
              "
            >
              Realize seu sonho
            </Link>
          )}
        </div>

      </div>

      {/* Overlay mobile — full-screen menu */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        data-open={menuOpen}
        aria-hidden={!menuOpen}
        className="
          fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-md
          transition-opacity duration-300 md:hidden
          data-[open=false]:pointer-events-none data-[open=false]:opacity-0
          data-[open=true]:opacity-100
        "
      >
        <div className="flex h-full flex-col px-6 pt-20 pb-10">
          <button
            ref={closeRef}
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="
              absolute right-4 top-3 flex h-10 w-10 items-center justify-center
              rounded-full text-paper-100 transition-colors hover:bg-ink-800/60
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <nav className="flex flex-1 flex-col justify-center">
            {menu.map((item) => {
              const isActive =
                pathname === item.url || pathname?.startsWith(item.url + '/');
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setMenuOpen(false)}
                  className={`
                    display block border-b border-white/15 py-6 text-4xl leading-none
                    transition-colors first:border-t first:border-white/15
                    ${isActive ? 'text-gold-400' : 'text-paper-50 hover:text-gold-400'}
                  `}
                  target={item.externo ? '_blank' : undefined}
                  rel={item.externo ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {contextualWhatsappUrl && whatsapp && (
            <a
              href={contextualWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="
                eyebrow flex items-center justify-center gap-2 rounded-full
                bg-gold-500 px-6 py-4 text-ink-950
                shadow-[0_0_0_1px_rgba(255,255,255,0.15)]
                transition-all hover:bg-gold-400
              "
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Realize seu sonho · {whatsapp}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
