'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Below-the-fold photos stay out of the document until the page scrolls,
 * so a phone's first load does not fetch them.
 */
export function FoldImage(props: ImageProps) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 24) setShow(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;
  return <Image {...props} />;
}
