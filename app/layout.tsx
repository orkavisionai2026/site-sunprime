import type { Metadata, Viewport } from 'next';
import { instrumentSerif } from '@/lib/fonts';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sunprime.com.br'),
  title: {
    default: 'Sunprime Empreendimentos — Diferente porque você é',
    template: '%s · Sunprime',
  },
  description:
    'Incorporadora de Itapema/SC. Arquitetura autoral, design inspirador e empreendimentos que transformam o skyline.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Sunprime',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0B',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={instrumentSerif.variable}>
      <head>
        {/* Preconnect ao Fontshare pra acelerar o load do Satoshi */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        {/* Satoshi: preload + stylesheet (substitui @import bloqueante do globals.css) */}
        <link
          rel="preload"
          as="style"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
