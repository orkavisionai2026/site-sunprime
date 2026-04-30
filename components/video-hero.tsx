'use client';

import { useEffect, useRef } from 'react';

type Props = {
  video: string;
  poster: string;
  alt: string;
  className?: string;
};

export function VideoHero({ video, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tryPlay = () => {
      el.play().catch(() => {
        // Autoplay bloqueado: poster permanece, sem botão clicável.
      });
    };
    tryPlay();
    el.addEventListener('canplay', tryPlay, { once: true });
    el.addEventListener('loadeddata', tryPlay, { once: true });
    return () => {
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('loadeddata', tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      data-bg
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      poster={poster}
      className={className}
      style={{ pointerEvents: 'none' }}
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}
