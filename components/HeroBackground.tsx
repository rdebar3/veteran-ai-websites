'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { heroMedia } from '@/lib/hero-media';

function shouldPreferStaticBackground(): boolean {
  if (typeof window === 'undefined') return true;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrowViewport = window.matchMedia('(max-width: 767px)').matches;

  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  const saveData = connection?.saveData === true;
  const slowConnection =
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    connection?.effectiveType === '3g';

  return prefersReducedMotion || isNarrowViewport || saveData || slowConnection;
}

export default function HeroBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const preferStatic = shouldPreferStaticBackground();
    setUseVideo(!preferStatic);

    if (preferStatic) return;

    const video = videoRef.current;
    if (!video) return;

    const play = async () => {
      try {
        await video.play();
        setVideoReady(true);
      } catch {
        setUseVideo(false);
      }
    };

    if (video.readyState >= 2) {
      void play();
      return;
    }

    const onCanPlay = () => {
      void play();
    };

    const onError = () => {
      setUseVideo(false);
    };

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div className="hero-bg" aria-hidden="true">
      <Image
        src={heroMedia.posterHd}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={92}
        className={`hero-bg__image ${useVideo && videoReady ? 'hero-bg__image--hidden' : ''}`}
      />

      {useVideo && (
        <video
          ref={videoRef}
          className={`hero-bg__video ${videoReady ? 'hero-bg__video--visible' : ''}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroMedia.poster}
        >
          {heroMedia.video.webm && (
            <source src={heroMedia.video.webm} type="video/webm" />
          )}
          <source src={heroMedia.video.src} type={heroMedia.video.type} />
        </video>
      )}
    </div>
  );
}