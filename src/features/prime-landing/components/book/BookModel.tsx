"use client";

import type * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial, ShaderMaterial, AdditiveBlending } from "three";
import { PageStack } from "./PageStack";
import {
  goldInlayVert, goldInlayFrag,
  coverFaceVert, coverFaceFrag,
  dustVert, dustFrag,
} from "./book-shaders";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

const BW  = 1.4;
const BH  = 1.9;
const BD  = 0.16;
const SPX = -BW / 2;
const COVER_OPEN_ANGLE = -Math.PI * 0.944;
const DUST_COUNT = 160;

function easeInOut(t: number) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

// Cover open uses a custom curve: slow start, quick snap, then tiny spring-back overshoot
function easeSpring(t: number): number {
  if (t < 0.7) {
    // Accelerate (like easeInQuad on first 70%)
    const u = t / 0.7;
    return u * u * 0.85;
  }
  // Overshoot then settle
  const u = (t - 0.7) / 0.3;
  return 0.85 + 0.18 * Math.sin(u * Math.PI) + 0.12 * (1 - Math.cos(u * Math.PI * 2)) * (1 - u);
}

function DustMotes() {
  const matRef = useRef<ShaderMaterial>(null!);

  const { positions, sizes, speeds } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const sizes     = new Float32Array(DUST_COUNT);
    const speeds    = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      sizes[i]  = 0.4 + Math.random() * 1.2;
      speeds[i] = 0.3 + Math.random() * 0.6;
    }
    return { positions, sizes, speeds };
  }, []);

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
  }), []);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize"    args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aSpeed"   args={[speeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={dustVert}
        fragmentShader={dustFrag}
        uniforms={uniforms}
        blending={AdditiveBlending}
        depthWrite={false}
        transparent
      />
    </points>
  );
}

export function BookModel() {
  const coverGroupRef  = useRef<THREE.Group>(null!);
  const goldMatRef     = useRef<ShaderMaterial>(null!);
  const coverFaceRef   = useRef<ShaderMaterial>(null!);

  const goldUniforms = useMemo(() => ({
    uEmissiveStrength: { value: 0.3 },
    uTime:             { value: 0 },
  }), []);

  const coverFaceUniforms = useMemo(() => ({
    uGlow: { value: 0.55 },
    uTime: { value: 0 },
  }), []);

  const coverMat = useMemo(() => new MeshStandardMaterial({
    color: "#0e2040",
    roughness: 0.42,
    metalness: 0.45,
  }), []);

  useFrame(({ clock }) => {
    const p   = useScrollStore.getState().bookProgress;
    const t   = clock.getElapsedTime();

    // Cover opens: P 0.12 → 0.48 with spring easing
    const coverP = easeSpring(Math.max(0, Math.min(1, (p - 0.12) / 0.36)));
    if (coverGroupRef.current) {
      coverGroupRef.current.rotation.y = coverP * COVER_OPEN_ANGLE;
    }

    // Gold filigree glow
    const glowRamp = Math.max(0, Math.min(1, (p - 0.08) / 0.22));
    const glowFade = p > 0.42 ? Math.max(0.15, 1 - (p - 0.42) / 0.20) : 1;
    if (goldMatRef.current) {
      goldMatRef.current.uniforms.uEmissiveStrength.value = 0.3 + glowRamp * glowFade * 0.75;
      goldMatRef.current.uniforms.uTime.value = t;
    }

    // Cover face emblem — fully visible when closed, fades as cover opens
    if (coverFaceRef.current) {
      coverFaceRef.current.uniforms.uGlow.value = 0.55 + (1 - coverP) * 0.45;
      coverFaceRef.current.uniforms.uTime.value  = t;
    }
  });

  return (
    <group>
      {/* Desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -BH / 2 - 0.01, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#080f1c" roughness={0.92} metalness={0.05} />
      </mesh>

      {/* Back cover */}
      <mesh position={[0, 0, -BD / 2 - 0.008]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, 0.014]} />
        <primitive object={coverMat} attach="material" />
      </mesh>

      {/* Page block */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[BW - 0.05, BH - 0.05, BD]} />
        <meshStandardMaterial color="#F2EDE3" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* Animated curl pages */}
      <PageStack />

      {/* Spine */}
      <mesh position={[SPX + 0.012, 0, 0]}>
        <boxGeometry args={[0.024, BH + 0.01, BD + 0.018]} />
        <meshStandardMaterial color="#07101e" roughness={0.28} metalness={0.88} />
      </mesh>

      {/* Front cover — pivots around spine */}
      <group ref={coverGroupRef} position={[SPX, 0, 0]}>
        {/* Cover board */}
        <mesh position={[BW / 2, 0, BD / 2 + 0.008]} castShadow receiveShadow>
          <boxGeometry args={[BW, BH, 0.014]} />
          <primitive object={coverMat} attach="material" />
        </mesh>

        {/* Gold filigree border (additive layer) */}
        <mesh position={[BW / 2, 0, BD / 2 + 0.020]}>
          <planeGeometry args={[BW * 0.84, BH * 0.84]} />
          <shaderMaterial
            ref={goldMatRef}
            vertexShader={goldInlayVert}
            fragmentShader={goldInlayFrag}
            uniforms={goldUniforms}
            blending={AdditiveBlending}
            depthWrite={false}
            transparent
          />
        </mesh>

        {/* Cover emblem face — the crest, title bars, border */}
        <mesh position={[BW / 2, 0, BD / 2 + 0.022]}>
          <planeGeometry args={[BW * 0.92, BH * 0.92]} />
          <shaderMaterial
            ref={coverFaceRef}
            vertexShader={coverFaceVert}
            fragmentShader={coverFaceFrag}
            uniforms={coverFaceUniforms}
            blending={AdditiveBlending}
            depthWrite={false}
            transparent
          />
        </mesh>
      </group>

      <DustMotes />
    </group>
  );
}
