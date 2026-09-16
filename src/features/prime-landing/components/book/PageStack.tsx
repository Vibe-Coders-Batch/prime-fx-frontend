"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, ShaderMaterial, Color } from "three";
import { pageCurlVert, pageCurlFrag } from "./book-shaders";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

// Each page turn corresponds to a content stage transition.
// Cover opens: P 0.12→0.48 (handled in BookModel.tsx cover pivot)
// Page turns start after cover is open:
const PAGE_CONFIG = [
  { startAt: 0.36, endAt: 0.52, zOffset:  0.006 },  // stage 2 — Programmes
  { startAt: 0.50, endAt: 0.64, zOffset:  0.003 },  // stage 3 — How It Works
  { startAt: 0.62, endAt: 0.76, zOffset:  0.000 },  // stage 4 — Stats
  { startAt: 0.72, endAt: 0.83, zOffset: -0.003 },  // stage 5 (early) — CTA lead-in
  { startAt: 0.80, endAt: 0.90, zOffset: -0.006 },  // final settle
];

const PAPER_COLOR = new Color("#F5F0E8");
const LINE_COLOR  = new Color("#ddd9cc");

function PageMesh({ startAt, endAt, zOffset, pageIndex }: typeof PAGE_CONFIG[0] & { pageIndex: number }) {
  const matRef = useRef<ShaderMaterial>(null!);

  const uniforms = useMemo(() => ({
    uCurlProgress: { value: 0 },
    uLift:         { value: 0.20 },
    uPaperColor:   { value: PAPER_COLOR },
    uLineColor:    { value: LINE_COLOR },
    uPageIndex:    { value: pageIndex },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [pageIndex]);

  useFrame(() => {
    const p     = useScrollStore.getState().bookProgress;
    const local = Math.max(0, Math.min(1, (p - startAt) / Math.max(endAt - startAt, 0.001)));
    if (matRef.current) matRef.current.uniforms.uCurlProgress.value = local;
  });

  return (
    <mesh position={[0, 0, zOffset]} castShadow receiveShadow>
      <planeGeometry args={[1.34, 1.85, 32, 24]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={pageCurlVert}
        fragmentShader={pageCurlFrag}
        uniforms={uniforms}
        side={DoubleSide}
      />
    </mesh>
  );
}

export function PageStack() {
  return (
    <group>
      {PAGE_CONFIG.map((cfg, i) => (
        <PageMesh key={i} {...cfg} pageIndex={i} />
      ))}
    </group>
  );
}
