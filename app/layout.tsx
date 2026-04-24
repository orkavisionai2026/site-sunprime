import type { Metadata, Viewport } from 'next';
import { fraunces, inter, jetbrainsMono } from '@/lib/fonts';
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
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
