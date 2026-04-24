'use client';

import { m, useReducedMotion } from 'framer-motion';

/**
 * Template do (site) — diferente do layout.tsx, o template re-renderiza a cada
 * navegação. Usamos isso pra animação de entrada de página: fade + y curto +
 * blur leve que some. Dá a sensação de "uma cena se compondo".
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <m.div
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
