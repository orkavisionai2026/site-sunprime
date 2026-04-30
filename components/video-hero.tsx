'use client';

type Props = {
  video: string;
  poster: string;
  alt: string;
  className?: string;
};

export function VideoHero({ video, poster, className }: Props) {
  return (
    <video
      data-bg
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      className={className}
    >
      <source src={video} type="video/mp4" />
    </video>
  );
}
