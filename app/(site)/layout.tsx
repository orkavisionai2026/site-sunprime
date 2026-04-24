import { CustomCursor } from '@/components/custom-cursor';
import { Footer } from '@/components/footer';
import { Nav } from '@/components/nav';
import { ScrollProgress } from '@/components/scroll-progress';
import { Splash } from '@/components/splash';
import { getConfiguracaoSite } from '@/lib/data';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = getConfiguracaoSite();
  return (
    <>
      <Splash />
      <ScrollProgress />
      <CustomCursor />
      <Nav
        menu={config.menuPrincipal}
        whatsapp={config.whatsapp}
        whatsappUrl={config.whatsappUrl}
      />
      <main className="min-h-screen pt-0">{children}</main>
      <Footer config={config} />
    </>
  );
}
