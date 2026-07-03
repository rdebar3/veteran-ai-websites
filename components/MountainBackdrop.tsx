'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { mountainLayers } from '@/lib/mountain-journey';
import NeuralOverlay from '@/components/NeuralOverlay';

function MountainLayer({
  layer,
  index,
  scrollYProgress,
  total,
}: {
  layer: (typeof mountainLayers)[number];
  index: number;
  scrollYProgress: MotionValue<number>;
  total: number;
}) {
  const spread = 0.18;
  const peak = layer.peak;
  const start = Math.max(0, peak - spread);
  const end = Math.min(1, peak + spread);

  const opacity = useTransform(
    scrollYProgress,
    index === 0
      ? [0, end]
      : index === total - 1
        ? [start, 1]
        : [start, peak, end],
    index === 0
      ? [1, 0]
      : index === total - 1
        ? [0, 1]
        : [0, 1, 0]
  );
  const y = useTransform(scrollYProgress, [0, 1], [index * -8, index * -40]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);

  return (
    <motion.div className="mountain-layer" style={{ opacity, y, scale }}>
      <Image
        src={layer.src}
        alt=""
        fill
        priority={index <= 1}
        sizes="100vw"
        className="mountain-layer__image"
        quality={index === 0 ? 90 : 80}
      />
    </motion.div>
  );
}

export default function MountainBackdrop() {
  const { scrollYProgress } = useScroll();
  const layers = useMemo(() => mountainLayers, []);

  return (
    <div className="mountain-backdrop" aria-hidden="true">
      {layers.map((layer, index) => (
        <MountainLayer
          key={layer.id}
          layer={layer}
          index={index}
          scrollYProgress={scrollYProgress}
          total={layers.length}
        />
      ))}
      <div className="mountain-backdrop__veil" />
      <NeuralOverlay />
      <div className="mountain-backdrop__stars" />
    </div>
  );
}