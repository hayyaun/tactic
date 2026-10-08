"use client";

import {
  Canvas,
  createPortal,
  events as createPointerEvents,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  OrthographicCamera,
  ScreenQuad,
  useGLTF,
  useBoxProjectedEnv,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  Box3,
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Color,
  DoubleSide,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  Scene,
  Vector3,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
} from "three";

type SceneProps = {
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
};
type PointerMotion = { yaw: number; inside: boolean; event: Event | null };
type MarkGLTF = ReturnType<typeof useGLTF> & {
  nodes: { TACTIC_Green_Rear: Mesh; TACTIC_Red_Front: Mesh };
};

function PanelRadiance({ kind }: { kind: number }) {
  const colors = useMemo(() => {
    const colors = new Float32Array(33 * 33 * 3);
    const smooth = (low: number, high: number, value: number) =>
      MathUtils.smoothstep(value, low, high);
    for (let row = 0; row <= 32; row++)
      for (let column = 0; column <= 32; column++) {
        const u = column / 32;
        const v = 1 - row / 32;
        const energy =
          kind === 0
            ? 0.015 +
              2.2 *
                smooth(0.02, 0.22, u) *
                (1 - smooth(0.78, 0.98, u)) *
                (1 - smooth(0.18, 0.48, v))
            : kind === 1
              ? 0.005 +
                5.5 *
                  smooth(0.58, 0.62, u) *
                  (1 - smooth(0.65, 0.69, u)) *
                  smooth(0.12, 0.45, v) *
                  (1 - smooth(0.8, 1, v))
              : kind === 2
                ? 0.005 +
                  4.8 *
                    smooth(0.51, 0.56, u) *
                    (1 - smooth(0.62, 0.69, u)) *
                    smooth(0.02, 0.18, v) *
                    (1 - smooth(0.82, 0.98, v))
                : 0.005 +
                  6.25 *
                    smooth(0.56, 0.63, v) *
                    (1 - smooth(0.7, 0.77, v)) *
                    (0.6 + 0.4 * smooth(0.3, 0.7, u));
        colors.fill(
          energy,
          (row * 33 + column) * 3,
          (row * 33 + column) * 3 + 3,
        );
      }
    return colors;
  }, [kind]);
  return (
    <>
      <bufferAttribute attach="geometry-attributes-color" args={[colors, 3]} />
      <meshBasicMaterial vertexColors side={DoubleSide} toneMapped={false} />
    </>
  );
}

function StudioPanel({
  width,
  height,
  position,
  target,
  kind,
}: {
  width: number;
  height: number;
  position: [number, number, number];
  target: [number, number, number];
  kind: number;
}) {
  const lookAt = useMemo(() => new Vector3(...target), [target]);
  return (
    <mesh position={position} onUpdate={(mesh) => mesh.lookAt(lookAt)}>
      <planeGeometry args={[width, height, 32, 32]} />
      <PanelRadiance kind={kind} />
    </mesh>
  );
}

function StudioEnvironment() {
  const room = useMemo(() => new Scene(), []);
  const gl = useThree((state) => state.gl);
  const get = useThree((state) => state.get);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    const scene = get().scene;
    // Drei Environment uses an unblurred cube capture. The reference uses
    // fromScene's initial sigma blur, which that helper does not expose.
    // Fiber owns the portal's panels; only this one-time PMREM target is manual.
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(room, 0.025, 0.1, 100, {
      position: new Vector3(0, 3.3, 0),
      size: 256,
    });
    generator.dispose();
    const previous = scene.environment;
    scene.environment = environment.texture;
    invalidate();
    return () => {
      if (scene.environment === environment.texture)
        scene.environment = previous;
      environment.dispose();
    };
  }, [gl, get, room, invalidate]);
  return createPortal(
    <>
      <color attach="background" args={["#0c0e0d"]} />
      <group>
        <StudioPanel
          position={[-7, 3, 0]}
          target={[0, 3, 0]}
          width={18}
          height={20}
          kind={0}
        />
        <StudioPanel
          position={[7, 3, 0]}
          target={[0, 3, 0]}
          width={18}
          height={20}
          kind={1}
        />
        <StudioPanel
          position={[0, 13, 0]}
          target={[0, 3.3, 0]}
          width={14}
          height={18}
          kind={2}
        />
        <StudioPanel
          position={[0, 3, 9]}
          target={[0, 3, 0]}
          width={14}
          height={20}
          kind={3}
        />
      </group>
    </>,
    room,
  );
}

// This small decorative shader matches the CSS radial background through glass.
// ScreenQuad owns its geometry; Fiber owns the material and rendering lifecycle.
function HeroBackdrop() {
  const size = useThree((state) => state.size);
  const top = size.top + window.scrollY;
  const uniforms = useMemo(
    () => ({ stage: { value: new Vector3(size.width, size.height, top) } }),
    [size.width, size.height, top],
  );
  return (
    <ScreenQuad renderOrder={-1000} raycast={() => {}}>
      <shaderMaterial
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 uvScreen; void main(){uvScreen=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}`}
        fragmentShader={`uniform vec3 stage; varying vec2 uvScreen;
      float glow(vec2 p,vec2 center,float radius){float d=length(p-center)/radius;return d<.45?mix(.32,.095,d/.45):mix(.095,0.,clamp((d-.45)/.55,0.,1.));}
      void main(){float h=stage.y+stage.z;vec2 p=vec2(uvScreen.x*stage.x,(1.-uvScreen.y)*stage.y+stage.z);vec3 c=vec3(16.,18.,17.)/255.;c=mix(c,vec3(128.,230.,80.)/255.,glow(p,vec2(-.08*stage.x,.8*h),.65*stage.x));c=mix(c,vec3(255.,44.,75.)/255.,glow(p,vec2(1.08*stage.x,.8*h),.65*stage.x));gl_FragColor=sRGBTransferEOTF(vec4(c,1.));
#include <colorspace_fragment>
}`}
      />
    </ScreenQuad>
  );
}

// Extract the concept's structural creases; Fiber owns the native line resources.
function contourData(geometry: BufferGeometry) {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox!;
  const capPositions: number[] = [];
  for (let i = 0; i < position.count; i += 3) {
    if (
      [0, 1, 2].every(
        (j) =>
          normal.getY(i + j) > 0.999 &&
          Math.abs(position.getY(i + j) - max.y) < 0.00001,
      )
    )
      for (let j = 0; j < 3; j++)
        capPositions.push(
          position.getX(i + j),
          position.getY(i + j),
          position.getZ(i + j),
        );
  }
  const cap = new BufferGeometry();
  cap.setAttribute("position", new Float32BufferAttribute(capPositions, 3));
  const creases = new EdgesGeometry(geometry, 25);
  const rim = new EdgesGeometry(cap, 25);
  const segments: {
    a: number[];
    b: number[];
    role: "crease" | "rim" | "inset";
  }[] = [];
  for (const [edges, role] of [
    [creases, "crease"],
    [rim, "rim"],
  ] as const) {
    const vertices = edges.getAttribute("position");
    for (let i = 0; i < vertices.count; i += 2) {
      const a = [vertices.getX(i), vertices.getY(i), vertices.getZ(i)];
      const b = [
        vertices.getX(i + 1),
        vertices.getY(i + 1),
        vertices.getZ(i + 1),
      ];
      if (role === "crease" && Math.abs(a[1] - b[1]) < (max.y - min.y) * 0.5)
        continue;
      segments.push({ a, b, role });
      if (role === "rim")
        segments.push({
          a: [a[0], a[1] - 0.1, a[2]],
          b: [b[0], b[1] - 0.1, b[2]],
          role: "inset",
        });
    }
    edges.dispose();
  }
  cap.dispose();
  if (source !== geometry) source.dispose();
  return [true, false].map((rear) => {
    const points: [number, number, number][] = [];
    const colors: [number, number, number, number][] = [];
    const alpha = rear
      ? { crease: 0.25, rim: 0.35, inset: 0.65 }
      : { crease: 0.3, rim: 0.7, inset: 0 };
    const stops = [0, 0.12, 0.5, 0.88, 1];
    for (const { a, b, role } of segments) {
      if (!alpha[role]) continue;
      for (let i = 0; i < stops.length - 1; i++)
        for (const f of [stops[i], stops[i + 1]]) {
          points.push(
            a.map((value, axis) => value + (b[axis] - value) * f) as [
              number,
              number,
              number,
            ],
          );
          colors.push([
            1,
            1,
            1,
            alpha[role] * (0.4 + 0.6 * Math.sin(Math.PI * f)),
          ]);
        }
    }
    return {
      positions: new Float32Array(points.flat()),
      colors: new Float32Array(colors.flat()),
      rear,
    };
  });
}
function GlassContours({
  geometry,
  amount,
  tint,
}: {
  geometry: BufferGeometry;
  amount: RefObject<number>;
  tint: Color;
}) {
  const contours = useMemo(() => contourData(geometry), [geometry]);
  const front = useRef<LineSegments<BufferGeometry, LineBasicMaterial>>(null);
  const rearLine =
    useRef<LineSegments<BufferGeometry, LineBasicMaterial>>(null);
  useFrame(() => {
    rearLine.current?.material.color.set("#f3f7f2");
    front.current?.material.color
      .set("#f3f7f2")
      .lerp(tint, amount.current * 0.12);
  });
  return contours.map(({ positions, colors, rear }) => (
    <lineSegments
      ref={rear ? rearLine : front}
      key={String(rear)}
      renderOrder={rear ? 4 : 5}
      raycast={() => {}}
    >
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 4]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#f3f7f2"
        vertexColors
        transparent
        opacity={rear ? 0.08 : 0.35}
        depthTest={!rear}
        depthWrite={false}
        dithering
        toneMapped={false}
      />
    </lineSegments>
  ));
}

function GlassBody({
  geometry,
  name,
  hovered,
  reducedMotion,
  onOver,
  onMove,
  onOut,
}: {
  geometry: BufferGeometry;
  name: string;
  hovered: boolean;
  reducedMotion: boolean;
  onOver: (event: ThreeEvent<PointerEvent>) => void;
  onMove: (event: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
}) {
  const mesh = useRef<Mesh<BufferGeometry, MeshPhysicalMaterial>>(null);
  const projection = useBoxProjectedEnv([0, 3.3, 0], [14, 20, 18]);
  const amount = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  const tint = useMemo(
    () => new Color(name.includes("Rear") ? "#07351b" : "#400e18"),
    [name],
  );
  useEffect(() => {
    invalidate();
  }, [hovered, reducedMotion, invalidate]);
  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    const next = reducedMotion
      ? target
      : MathUtils.damp(amount.current, target, 1.1, Math.min(delta, 0.1));
    amount.current = Math.abs(next - target) < 0.001 ? target : next;
    const material = mesh.current?.material;
    if (material) {
      material.color.set("white").lerp(tint, amount.current * 0.12);
      material.attenuationColor.set("white").lerp(tint, amount.current * 0.38);
    }
    if (amount.current !== target) invalidate();
  });
  return (
    <mesh
      ref={mesh}
      name={name}
      onPointerOver={onOver}
      onPointerMove={onMove}
      onPointerOut={onOut}
    >
      <primitive object={geometry} attach="geometry" dispose={null} />
      <meshPhysicalMaterial
        {...projection}
        onBeforeCompile={(shader) => {
          projection.onBeforeCompile(shader);
          // Namespace Drei 10.7.9's varying: Three r186 also declares
          // vWorldPosition for transmission. Preserve both shader paths.
          shader.vertexShader = shader.vertexShader
            .replace(
              "varying vec3 vWorldPosition;",
              "varying vec3 vBoxWorldPosition;",
            )
            .replace(
              "#ifdef BOX_PROJECTED_ENV_MAP\n    vWorldPosition =",
              "#ifdef BOX_PROJECTED_ENV_MAP\n    vBoxWorldPosition =",
            );
          shader.fragmentShader = shader.fragmentShader
            .replaceAll("vWorldPosition", "vBoxWorldPosition")
            .replace(
              "vec3 nDir = normalize( v );",
              `vec3 boxCenter = cubePos - vec3(0., .3, 0.);
             if(any(lessThan(vBoxWorldPosition, boxCenter - .5 * cubeSize)) ||
                any(greaterThan(vBoxWorldPosition, boxCenter + .5 * cubeSize))) return v;
             vec3 nDir = normalize(v);
             vec3 safeDir = (step(vec3(0.), nDir) * 2. - 1.) * max(abs(nDir), vec3(.000001));`,
            )
            .replaceAll("cubeSize + cubePos", "cubeSize + boxCenter")
            .replaceAll("/ nDir;", "/ safeDir;")
            .replaceAll("nDir.x > 0.", "nDir.x >= 0.")
            .replaceAll("nDir.y > 0.", "nDir.y >= 0.")
            .replaceAll("nDir.z > 0.", "nDir.z >= 0.")
            .replace("nDir * correction", "nDir * max(correction, 0.)")
            .replace(
              "return boxIntersection - cubePos;",
              "return normalize(boxIntersection - cubePos);",
            )
            .replace(
              "reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );",
              "reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\nreflectVec = parallaxCorrectNormal(reflectVec, envMapSize, envMapPosition);",
            );
        }}
        customProgramCacheKey={() =>
          projection.customProgramCacheKey() + "-transmission-r186-safe-rays"
        }
        color="white"
        attenuationColor="white"
        transmission={1}
        thickness={0.45}
        ior={1.28}
        attenuationDistance={8}
        roughness={0.045}
        metalness={0}
        side={DoubleSide}
        dithering
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
      <GlassContours geometry={geometry} amount={amount} tint={tint} />
    </mesh>
  );
}

function Sculpture({
  active,
  reducedMotion,
  onReady,
  motion,
}: SceneProps & {
  motion: RefObject<PointerMotion>;
}) {
  const { nodes } = useGLTF("/studio/tactic-mark.glb") as MarkGLTF;
  const bodies = [nodes.TACTIC_Green_Rear, nodes.TACTIC_Red_Front];
  const moving = useRef<Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const size = useThree((state) => state.size);
  const events = useThree((state) => state.events);
  const invalidate = useThree((state) => state.invalidate);
  const framing = useMemo(() => {
    const bounds = new Box3();
    for (const node of [nodes.TACTIC_Green_Rear, nodes.TACTIC_Red_Front]) {
      node.geometry.computeBoundingBox();
      bounds.union(node.geometry.boundingBox!);
    }
    const center = (bounds.min.y + bounds.max.y) / 2;
    const tilt = MathUtils.degToRad(12);
    const matrix = new Matrix4()
      .makeTranslation(0, center, 0)
      .multiply(new Matrix4().makeRotationX(tilt))
      .multiply(new Matrix4().makeTranslation(0, -center, 0));
    const offset = Math.max(0, -bounds.clone().applyMatrix4(matrix).min.y);
    return { center, tilt, offset };
  }, [nodes]);
  const viewHeight = Math.max(
    3.6,
    (size.height / Math.max(size.width, 1)) * 4.7,
  );
  const viewWidth = (viewHeight * size.width) / Math.max(size.height, 1);
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(() => {
    const reset = () => {
      setHovered(null);
      motion.current.yaw = 0;
      motion.current.inside = false;
      invalidate();
    };
    const onVisibilityChange = () => {
      if (document.hidden) reset();
    };
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("resize", reset);
    document.addEventListener("visibilitychange", onVisibilityChange);
    const source = events.connected;
    source?.addEventListener("pointerleave", reset);
    source?.addEventListener("pointercancel", reset);
    return () => {
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("resize", reset);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      source?.removeEventListener("pointerleave", reset);
      source?.removeEventListener("pointercancel", reset);
    };
  }, [invalidate, events.connected, motion]);
  useFrame((state, delta) => {
    if (!moving.current) return;
    const target = reducedMotion || !active ? 0 : motion.current.yaw;
    const previous = moving.current.rotation.y;
    const next = reducedMotion
      ? target
      : MathUtils.damp(
          moving.current.rotation.y,
          target,
          2,
          Math.min(delta, 0.1),
        );
    moving.current.rotation.y =
      Math.abs(next - target) < 0.0001 ? target : next;
    if (previous !== moving.current.rotation.y && motion.current.inside) {
      moving.current.updateWorldMatrix(true, true);
      state.events.update?.();
    }
    if (moving.current.rotation.y !== target) invalidate();
  });
  return (
    <>
      <OrthographicCamera
        makeDefault
        manual
        left={-viewWidth / 2}
        right={viewWidth / 2}
        top={viewHeight / 2}
        bottom={-viewHeight / 2}
        near={0.1}
        far={200}
        position={[4, 36 + framing.offset, 55]}
        onUpdate={(camera) => camera.lookAt(0, 6.45 + framing.offset, 0)}
      />
      <group
        position={[0, framing.center + framing.offset, 0]}
        rotation={[framing.tilt, 0, 0]}
      >
        <group ref={moving} position={[0, -framing.center, 0]}>
          {bodies.map((body) => (
            <GlassBody
              key={body.name}
              geometry={body.geometry}
              name={body.name}
              hovered={active && hovered === body.name}
              reducedMotion={reducedMotion}
              onOver={(event) => {
                if (
                  event.pointerType !== "mouse" &&
                  event.pointerType !== "pen"
                )
                  return;
                event.stopPropagation();
                setHovered(body.name);
              }}
              onOut={() =>
                setHovered((current) =>
                  current === body.name ? null : current,
                )
              }
              onMove={(event) => {
                event.stopPropagation();
                setHovered(body.name);
              }}
            />
          ))}
        </group>
      </group>
    </>
  );
}

export default function HeroCanvas(props: SceneProps) {
  const source = useRef<HTMLElement>(null);
  const motion = useRef<PointerMotion>({ yaw: 0, inside: false, event: null });
  const events = useMemo<NonNullable<Parameters<typeof Canvas>[0]["events"]>>(
    () => (store) => ({
      ...createPointerEvents(store),
      compute(event, state) {
        const bounds = state.gl.domElement.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        // Repicking during animation reuses the last event; it must not undo a reset.
        if (motion.current.event !== event) {
          motion.current.event = event;
          motion.current.inside =
            (!("pointerType" in event) ||
              event.pointerType === "mouse" ||
              event.pointerType === "pen") &&
            x >= 0 &&
            x <= 1 &&
            y >= 0 &&
            y <= 1 &&
            !(
              event.target instanceof Element &&
              event.target.closest("a, button, nav")
            );
          const yaw = motion.current.inside ? (x - 0.5) * 0.08 : 0;
          if (yaw !== motion.current.yaw) {
            motion.current.yaw = yaw;
            state.invalidate();
          }
        }
        state.pointer.set(x * 2 - 1, 1 - y * 2);
        state.raycaster.setFromCamera(state.pointer, state.camera);
      },
      filter: (hits) => (motion.current.inside ? hits : []),
    }),
    [],
  );
  return (
    <Canvas
      eventSource={source}
      events={events}
      onCreated={(state) => {
        source.current = state.gl.domElement.closest("section");
        if (source.current) state.events.connect?.(source.current);
      }}
      className="absolute inset-0 size-full"
      frameloop={props.active ? "demand" : "never"}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: NeutralToneMapping,
        toneMappingExposure: 0.9,
        transmissionResolutionScale: 1,
      }}
    >
      <HeroBackdrop />
      <directionalLight color="white" intensity={2} position={[-1, 10, 12]} />
      <directionalLight color="white" intensity={0.45} position={[5, 4, 1]} />
      <directionalLight color="white" intensity={2} position={[1, 6, -5]} />
      <directionalLight color="#80e650" intensity={2.2} position={[-6, 5, 2]} />
      <directionalLight color="#ff2c4b" intensity={2} position={[6, 5, 2]} />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <Sculpture {...props} motion={motion} />
      </Suspense>
    </Canvas>
  );
}
