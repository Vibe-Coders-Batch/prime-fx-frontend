"use client";

import type * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { Color, ACESFilmicToneMapping, Vector2 } from "three";
import { BookModel } from "./BookModel";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";

// Camera keyframes — x offset shifts camera right so book sits left of centre,
// making room for the beside-right/left panels at the sides.
const CAM = [
  { p: 0.00, x: -0.14, y: 0.10, z: 4.3, fov: 37 },  // cover closed — book left-of-centre
  { p: 0.20, x: -0.10, y: 0.05, z: 4.0, fov: 37 },  // cover lifting
  { p: 0.50, x:  0.05, y: 0.02, z: 4.1, fov: 36 },  // pages turning — centre for inside panels
  { p: 1.00, x: -0.10, y: 0.00, z: 4.4, fov: 35 },  // fully open — back left for CTA panel
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

function sampleCam(p: number) {
  let i = 0;
  for (let k = 0; k < CAM.length - 1; k++) {
    if (p >= CAM[k].p && p <= CAM[k + 1].p) { i = k; break; }
  }
  if (p >= CAM[CAM.length - 1].p) i = CAM.length - 2;
  const a = CAM[i], b = CAM[i + 1];
  const t = easeInOut(Math.max(0, Math.min(1, (p - a.p) / Math.max(b.p - a.p, 0.001))));
  return { x: lerp(a.x,b.x,t), y: lerp(a.y,b.y,t), z: lerp(a.z,b.z,t), fov: lerp(a.fov,b.fov,t) };
}

// Mouse position target — updated on mousemove, lerped in useFrame
const mouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

function SceneCamera() {
  const { camera } = useThree();
  const parallaxRef = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const kf = sampleCam(useScrollStore.getState().bookProgress);
    const s = 0.055;

    // Smooth mouse parallax (very subtle — 0.06 units max)
    const px = parallaxRef.current;
    px.x += (mouse.x * 0.06 - px.x) * 0.04;
    px.y += (-mouse.y * 0.04 - px.y) * 0.04;

    camera.position.x += (kf.x + px.x - camera.position.x) * s;
    camera.position.y += (kf.y + px.y - camera.position.y) * s;
    camera.position.z += (kf.z - camera.position.z) * s;
    const pc = camera as THREE.PerspectiveCamera;
    pc.fov += (kf.fov - pc.fov) * 0.04;
    pc.lookAt(0, 0.03, 0);
    pc.updateProjectionMatrix();
  });
  return null;
}

function RimLight() {
  const ref = useRef<THREE.SpotLight>(null!);
  useFrame(() => {
    if (!ref.current) return;
    const p    = useScrollStore.getState().bookProgress;
    const ramp = Math.max(0, Math.min(1, (p - 0.08) / 0.25));
    const fade = p > 0.42 ? Math.max(0.1, 1 - (p - 0.42) / 0.18) : 1;
    ref.current.intensity = 0.8 + ramp * fade * 3.0;
  });
  return (
    <spotLight
      ref={ref}
      position={[-2.5, 2.0, -1.2]}
      angle={0.5}
      penumbra={0.9}
      intensity={0.8}
      color="#E0B458"
    />
  );
}

function PostFX({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.26}
        luminanceSmoothing={0.85}
        kernelSize={KernelSize.MEDIUM}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new Vector2(0.0005, 0.0005)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette offset={0.38} darkness={0.72} />
    </EffectComposer>
  );
}

function SceneInterior({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {/* No <Environment> — avoids any HDR network fetch that crashes offline.
          All illumination is from direct lights only. Cover roughness is tuned
          so these lights produce visible highlights on the metallic surface. */}

      {/* Key light — warm, upper right */}
      <directionalLight
        position={[2.5, 4.5, 3.5]}
        intensity={2.0}
        color="#FFF4E0"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />

      {/* Cool fill from left */}
      <directionalLight position={[-2.0, 1.5, 2.0]} intensity={0.6} color="#B0C8FF" />

      {/* Back-top accent — catches the top edge of the book */}
      <directionalLight position={[0, 3, -3]} intensity={0.4} color="#E0B458" />

      {/* Ambient — prevents pitch-black shadows */}
      <ambientLight intensity={0.4} color="#1a2a44" />

      {/* Hemisphere — sky warm, ground dark */}
      <hemisphereLight args={["#2a4060", "#0B192F", 0.6]} />

      {/* Animated gold rim (spine light leak) */}
      <RimLight />

      <SceneCamera />
      <BookModel />
      <PostFX isMobile={isMobile} />
    </>
  );
}

export function BookScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label="Animated book opening to reveal Prime Learning chapters"
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [-0.14, 0.1, 4.3], fov: 37, near: 0.05, far: 60 }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(new Color("#0B192F"), 1);
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.8;
        }}
      >
        <SceneInterior isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
