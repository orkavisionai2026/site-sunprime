import { Footer } from '@/components/footer';
import { Nav } from '@/components/nav';
import { ScrollProgress } from '@/components/scroll-progress';
import { Splash } from '@/components/splash';
import { getConfiguracaoSite, getEmpreendimentos } from '@/lib/data';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = getConfiguracaoSite();
  const empreendimentos = getEmpreendimentos();
  const nomePorSlug = Object.fromEntries(empreendimentos.map((e) => [e.slug, e.nome]));
  return (
    <>
      <Splash />
      <ScrollProgress />
      <Nav
        menu={config.menuPrincipal}
        whatsapp={config.whatsapp}
        whatsappUrl={config.whatsappUrl}
        nomePorSlug={nomePorSlug}
      />
      <main className="min-h-screen pt-0">{children}</main>
      <Footer config={config} />
    </>
  );
}
