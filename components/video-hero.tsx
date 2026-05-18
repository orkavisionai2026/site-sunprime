'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  video: string;
  poster: string;
  alt: string;
  className?: string;
};

export function VideoHero({ video, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const el = ref.current;
    if (!el) return;
    const tryPlay = () => {
      el.play().catch(() => {
        // Autoplay bloqueado: poster permanece.
      });
    };
    tryPlay();
    el.addEventListener('canplay', tryPlay, { once: true });
    el.addEventListener('loadeddata', tryPlay, { once: true });
    return () => {
      el.removeEventListener('canplay', tryPlay);
      el.removeEventListener('loadeddata', tryPlay);
    };
  }, [shouldLoad]);

  return (
    <video
      ref={ref}
      data-bg
      autoPlay
      muted
      loop
      playsInline
      preload={shouldLoad ? 'auto' : 'none'}
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      poster={poster}
      className={className}
      style={{ pointerEvents: 'none' }}
    >
      {shouldLoad && <source src={video} type="video/mp4" />}
    </video>
  );
}
