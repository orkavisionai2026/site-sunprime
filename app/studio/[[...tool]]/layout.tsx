/**
 * Layout dedicado do Studio — o Sanity renderiza a própria UI, então neutralizamos
 * as fontes/estilos do shell principal para não vazarem no /studio.
 */
export const metadata = {
  title: 'Sunprime · Studio',
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
