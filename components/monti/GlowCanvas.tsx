'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface GlowCanvasHandle {
  speak(wordCount: number): void;
  impulse(): void;
  setAmplitude(level: number): void;
  setListening(on: boolean): void;
}

interface GlowCanvasProps {
  muted?: boolean;
  className?: string;
  /** Pause WebGL (e.g. mobile + building) — zero GPU while hidden */
  paused?: boolean;
}

const PARTICLE_COUNT_FULL = 3000;
const PARTICLE_COUNT_LITE = 1100;
const AMP_THRESHOLD = 0.045;

const COLOR_BRIGHT = new THREE.Color('#E8A05C');
const COLOR_EMBER = new THREE.Color('#C45C26');
const COLOR_LISTENING = new THREE.Color('#A89070');
const COLOR_IDLE = new THREE.Color('#8B5E3C');
const BG = '#140e0a';

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function detectLiteDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

function ParticleField({
  particleCount,
  amplitudeRef,
  listeningRef,
  energyRef,
  mutedRef,
  reducedMotionRef,
  pausedRef,
}: {
  particleCount: number;
  amplitudeRef: React.MutableRefObject<number>;
  listeningRef: React.MutableRefObject<boolean>;
  energyRef: React.MutableRefObject<number>;
  mutedRef: React.MutableRefObject<boolean>;
  reducedMotionRef: React.MutableRefObject<boolean>;
  pausedRef: React.MutableRefObject<boolean>;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities, seeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 8.6;
      positions[i3 + 1] = Math.random() * 3.0 - 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 3.0;
      velocities[i3] = (Math.random() - 0.5) * 0.0035;
      velocities[i3 + 1] = 0.0018 + Math.random() * 0.0055;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.0028;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, velocities, seeds };
  }, [particleCount]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const pointTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.22, 'rgba(255,230,180,0.55)');
    g.addColorStop(0.55, 'rgba(255,160,60,0.12)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (pausedRef.current) return;
    const pts = pointsRef.current;
    const mat = materialRef.current;
    if (!pts || !mat) return;

    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const amp = amplitudeRef.current;
    const listening = listeningRef.current;
    const muted = mutedRef.current;
    const reduced = reducedMotionRef.current;
    let energy = energyRef.current;

    if (energy > 0) {
      energy = Math.max(0, energy - delta * 1.25);
      energyRef.current = energy;
    }

    const forceCalm = muted || reduced;
    const effectiveAmp = forceCalm ? 0 : amp;
    const speaking = effectiveAmp > AMP_THRESHOLD;
    const burst = forceCalm ? 0 : energy;

    let sizeBase = 0.042;
    let opacity = 0.52;
    let liftMult = 1;
    let wanderMult = 1;
    const color = COLOR_IDLE.clone();

    if (forceCalm) {
      sizeBase = 0.03;
      opacity = 0.32;
      liftMult = 0.12;
      wanderMult = 0.08;
      color.copy(COLOR_IDLE).multiplyScalar(0.65);
    } else if (listening && !speaking) {
      sizeBase = 0.033;
      opacity = 0.4;
      liftMult = 0.42;
      wanderMult = 0.5;
      color.copy(COLOR_LISTENING);
    } else if (speaking || burst > 0.04) {
      const t = clamp01(effectiveAmp * 1.35 + burst * 0.75);
      sizeBase = 0.046 + t * 0.05;
      opacity = 0.52 + t * 0.28;
      liftMult = 1.15 + t * 2.2;
      wanderMult = 1.0 + t * 1.5;
      color.copy(COLOR_EMBER).lerp(COLOR_BRIGHT, t);
    } else {
      const breathe = 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 0.52);
      sizeBase = 0.036 + breathe * 0.011;
      opacity = 0.4 + breathe * 0.11;
      liftMult = 0.65 + breathe * 0.22;
      wanderMult = 0.65;
      color.copy(COLOR_IDLE).lerp(COLOR_EMBER, breathe * 0.32);
    }

    mat.size = sizeBase;
    mat.opacity = opacity;
    mat.color.copy(color);

    const dt = Math.min(delta, 0.048);
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const seed = seeds[i]!;
      const wx = Math.sin(time * 0.33 + seed) * 0.0032 * wanderMult;
      const wz = Math.cos(time * 0.27 + seed * 1.27) * 0.0026 * wanderMult;
      arr[i3]! += (velocities[i3]! * wanderMult + wx) * (60 * dt);
      arr[i3 + 2]! += (velocities[i3 + 2]! * wanderMult + wz) * (60 * dt);
      const lift =
        velocities[i3 + 1]! * liftMult * (0.55 + effectiveAmp * 1.75 + burst * 2.1);
      arr[i3 + 1]! += lift * (60 * dt);
      if (
        arr[i3 + 1]! > 3.7 ||
        Math.abs(arr[i3]!) > 5.1 ||
        Math.abs(arr[i3 + 2]!) > 2.35
      ) {
        arr[i3] = (Math.random() - 0.5) * 8.2;
        arr[i3 + 1] = -0.55 + Math.random() * 0.45;
        arr[i3 + 2] = (Math.random() - 0.5) * 2.9;
      }
    }
    posAttr.needsUpdate = true;
  });

  useEffect(() => {
    return () => {
      geometry.dispose();
      pointTexture.dispose();
      materialRef.current?.dispose();
    };
  }, [geometry, pointTexture]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={materialRef}
        map={pointTexture}
        size={0.042}
        sizeAttenuation
        transparent
        opacity={0.52}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={COLOR_EMBER}
        toneMapped={false}
      />
    </points>
  );
}

function GLSetup({ maxDpr }: { maxDpr: number }) {
  const { gl } = useThree();
  useEffect(() => {
    const dpr = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      maxDpr,
    );
    gl.setPixelRatio(dpr);
    gl.setClearColor(new THREE.Color(BG), 1);
    return () => {
      gl.dispose();
    };
  }, [gl, maxDpr]);
  return null;
}

const GlowCanvas = forwardRef<GlowCanvasHandle, GlowCanvasProps>(
  function GlowCanvas({ muted = false, className, paused = false }, ref) {
    const amplitudeRef = useRef(0);
    const listeningRef = useRef(false);
    const energyRef = useRef(0);
    const mutedRef = useRef(muted);
    const reducedMotionRef = useRef(false);
    const pausedRef = useRef(false);
    // Client-only mount guard: WebGL canvas + document/texture work never runs during SSR.
    const [mounted, setMounted] = useState(false);
    const [lite, setLite] = useState(false);

    useEffect(() => {
      setLite(detectLiteDevice());
      setMounted(true);
    }, []);

    useEffect(() => {
      mutedRef.current = muted;
      if (muted) energyRef.current = 0;
    }, [muted]);

    useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => {
        reducedMotionRef.current = mq.matches;
        if (mq.matches) energyRef.current = 0;
      };
      update();
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }, []);

    useEffect(() => {
      const syncPause = () => {
        pausedRef.current =
          paused || document.visibilityState !== 'visible';
      };
      syncPause();
      document.addEventListener('visibilitychange', syncPause);
      return () => document.removeEventListener('visibilitychange', syncPause);
    }, [paused]);

    useImperativeHandle(
      ref,
      () => ({
        setAmplitude(level: number) {
          amplitudeRef.current = clamp01(level);
        },
        setListening(on: boolean) {
          listeningRef.current = on;
        },
        impulse() {
          if (mutedRef.current || reducedMotionRef.current) return;
          energyRef.current = Math.min(1, Math.max(energyRef.current, 0.85));
        },
        speak(wordCount: number) {
          if (mutedRef.current || reducedMotionRef.current) return;
          const boost = 0.4 + Math.min(Math.max(wordCount, 0), 14) * 0.035;
          energyRef.current = Math.min(1, Math.max(energyRef.current, boost));
        },
      }),
      [],
    );

    const particleCount = lite ? PARTICLE_COUNT_LITE : PARTICLE_COUNT_FULL;
    const maxDpr = lite ? 1 : 1.5;
    const frameActive = !paused;

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background: BG,
        }}
        aria-hidden
      >
        {mounted ? (
          <Canvas
            dpr={lite ? 1 : [1, 1.5]}
            gl={{
              antialias: false,
              alpha: false,
              powerPreference: lite ? 'low-power' : 'high-performance',
              stencil: false,
              depth: false,
            }}
            camera={{ position: [0, 1.05, 5.4], fov: 45, near: 0.1, far: 40 }}
            style={{ width: '100%', height: '100%' }}
            frameloop={frameActive ? 'always' : 'never'}
          >
            <GLSetup maxDpr={maxDpr} />
            <ParticleField
              key={lite ? 'lite' : 'full'}
              particleCount={particleCount}
              amplitudeRef={amplitudeRef}
              listeningRef={listeningRef}
              energyRef={energyRef}
              mutedRef={mutedRef}
              reducedMotionRef={reducedMotionRef}
              pausedRef={pausedRef}
            />
          </Canvas>
        ) : null}
      </div>
    );
  },
);

GlowCanvas.displayName = 'GlowCanvas';

export default GlowCanvas;
