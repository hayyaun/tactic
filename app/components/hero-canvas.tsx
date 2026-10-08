"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Group, OrthographicCamera } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { setupScene } from "./three/setup-scene";

type StageRef = RefObject<HTMLDivElement | null>;
function Sculpture({ stage }: { stage: StageRef }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const gltf = useLoader(GLTFLoader, "/studio/tactic-mark.glb");
  const model = useMemo(() => gltf.scene.clone(true), [gltf]);
  const sculpture = useRef<Group>(null);
  const runtime = useRef<ReturnType<typeof setupScene> | null>(null);
  useEffect(() => {
    const element = stage.current;
    const hero = element?.closest<HTMLElement>(".hero");
    if (
      !element ||
      !hero ||
      !sculpture.current ||
      !(camera instanceof OrthographicCamera)
    )
      return;
    // Clone hierarchy and resources inside setupScene; useLoader's cache stays immutable.
    const mounted = setupScene(
      gl,
      scene,
      camera,
      model,
      sculpture.current,
      element,
      hero,
      invalidate,
    );
    runtime.current = mounted;
    return () => {
      runtime.current = null;
      mounted.dispose();
    };
  }, [gl, scene, camera, model, stage, invalidate]);
  // Fiber owns scheduling; the original demand-driven transition renderer caps GPU work at 30fps.
  useFrame(() => runtime.current?.tick(performance.now()), 1);
  return (
    <group ref={sculpture} dispose={null}>
      <primitive object={model} dispose={null} />
    </group>
  );
}
export default function HeroCanvas({ stage }: { stage: StageRef }) {
  return (
    <Canvas
      className="hero-canvas"
      orthographic
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: [4, 36, 55], near: 0.1, far: 200, manual: true }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      fallback={null}
    >
      <directionalLight color="white" intensity={2} position={[-1, 10, 12]} />
      <directionalLight color="white" intensity={0.45} position={[5, 4, 1]} />
      <directionalLight color="white" intensity={2} position={[1, 6, -5]} />
      <directionalLight color="#80e650" intensity={2.2} position={[-6, 5, 2]} />
      <directionalLight color="#ff2c4b" intensity={2} position={[6, 5, 2]} />
      <Suspense fallback={null}>
        <Sculpture stage={stage} />
      </Suspense>
    </Canvas>
  );
}
