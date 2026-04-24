'use client';

import { LazyMotion, domAnimation } from 'framer-motion';
import { LenisProvider } from '@/lib/lenis-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <LenisProvider>{children}</LenisProvider>
    </LazyMotion>
  );
}
