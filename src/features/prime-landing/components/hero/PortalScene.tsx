"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Color, NoToneMapping, Vector2 } from "three";
import { useEffect, useRef, useState } from "react";
import { ParticleIcosahedron } from "./ParticleIcosahedron";
import { useScrollStore } from "@/features/prime-landing/components/providers/ScrollStore";
import { FallbackHero } from "./FallbackHero";

interface Props {
  mode?: "idle" | "graduation";
  source?: "portal" | "graduation";
}

export function PortalScene({ mode = "idle", source = "portal" }: Props) {
  const [canRender, setCanRender] = useState<boolean | null>(null);

  useEffect(() => {
    const hasWebglSupport = (() => {
      try {
        const canvas = document.createElement("canvas");
        const gl2 = canvas.getContext("webgl2");
        const gl =
          gl2 ??
          canvas.getContext("webgl") ??
          canvas.getContext("experimental-webgl");
        return !!gl;
      } catch {
        return false;
      }
    })();

    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lowCore =
      typeof navigator !== "undefined" &&
      (navigator.hardwareConcurrency ?? 4) < 4;
    const forceFallback =
      new URL(window.location.href).searchParams.get("nowebgl") === "1";

    if (!hasWebglSupport || prefersReduced || lowCore || forceFallback) {
      document.body.classList.add("no-webgl");
      setCanRender(false);
    } else {
      setCanRender(true);
    }
  }, []);

  if (canRender === null) return <FallbackHero />;
  if (!canRender) return <FallbackHero />;

  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label={
        mode === "graduation"
          ? "Animated particle cloud forming the word Begin"
          : "Animated particle portal, the Prime Learning gate"
      }
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
        style={{ background: "#0b192f" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new Color("#0b192f"), 1);
          gl.toneMapping = NoToneMapping;
        }}
      >
        <SceneInterior mode={mode} source={source} />
      </Canvas>
    </div>
  );
}

function SceneInterior({ mode, source }: Required<Props>) {
  const { camera, size } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      targetMouse.current.x = (e.clientX / size.width - 0.5) * 2;
      targetMouse.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size.width, size.height]);

  useFrame(() => {
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.05;
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.05;

    camera.rotation.x = -mouse.current.y * 0.05;
    camera.rotation.y = -mouse.current.x * 0.05;

    if (source === "portal") {
      const p = useScrollStore.getState().portalProgress;
      const targetZ = 5 - p * 7;
      camera.position.z += (targetZ - camera.position.z) * 0.12;
    } else {
      const targetZ = 4;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
    }
  });

  return (
    <>
      <mesh position={[0, 0, -8]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color="#0b192f" />
      </mesh>

      <ParticleIcosahedron mode={mode} count={8000} />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          offset={new Vector2(0.001, 0.001)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </>
  );
}

