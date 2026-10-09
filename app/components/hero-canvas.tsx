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
  useTexture,
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
  AdditiveBlending,
  Box3,
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  MathUtils,
  Matrix4,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Source,
  type Texture,
  Vector3,
  type Group,
  type LineBasicMaterial,
  type LineSegments,
} from "three";
import type { SceneTelemetry } from "./hero-performance";
import { BACKGROUND_URL } from "./hero-background";
import { adaptBoxProjectedShader } from "./box-projected-shader";
import { SCENE_FRAMING, type SceneSettings } from "./hero-settings";

type SceneProps = {
  backgroundURL: string;
  telemetry: SceneTelemetry;
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onContextLost: () => void;
  settings: SceneSettings;
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

function StudioEnvironment({
  blur,
  intensity,
  contextVersion,
}: {
  blur: number;
  intensity: number;
  contextVersion: number;
}) {
  const room = useMemo(() => new Scene(), []);
  const gl = useThree((state) => state.gl);
  const get = useThree((state) => state.get);
  const invalidate = useThree((state) => state.invalidate);
  useLayoutEffect(() => {
    const scene = get().scene;
    const previous = scene.environmentIntensity;
    scene.environmentIntensity = intensity;
    invalidate();
    return () => {
      scene.environmentIntensity = previous;
    };
  }, [get, intensity, invalidate]);
  useLayoutEffect(() => {
    const scene = get().scene;
    // Drei Environment uses an unblurred cube capture. The reference uses
    // fromScene's initial sigma blur, which that helper does not expose.
    // Fiber owns the portal's panels; only this one-time PMREM target is manual.
    const generator = new PMREMGenerator(gl);
    const environment = generator.fromScene(room, blur, 0.1, 100, {
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
  }, [gl, get, room, invalidate, blur, contextVersion]);
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

// CSS and the transmission pass share one backdrop, including its static grain.
// Configure the cached color texture once; consumers never dispose that cache.
function configureBackdrop(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
}
function updateBackdrop(texture: Texture, image: Texture["image"]) {
  texture.image = image;
  texture.needsUpdate = true;
}
function HeroBackdrop({ backgroundURL }: { backgroundURL: string }) {
  const source = useTexture(BACKGROUND_URL, configureBackdrop);
  // One owned texture is updated for temporary debug images; never mutate or
  // dispose the loader's shared texture, or cache every slider position.
  const texture = useMemo(() => {
    const owned = source.clone();
    owned.source = new Source(source.image);
    owned.colorSpace = SRGBColorSpace;
    return owned;
  }, [source]);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    if (backgroundURL === BACKGROUND_URL) {
      updateBackdrop(texture, source.image);
      invalidate();
      return;
    }
    const image = new Image();
    image.onload = () => {
      updateBackdrop(texture, image);
      invalidate();
    };
    image.onerror = () =>
      console.warn("Could not update the debug background.");
    image.src = backgroundURL;
    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [backgroundURL, source, texture, invalidate]);
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const bounds = gl.domElement.closest("section")?.getBoundingClientRect();
  const offset = size.top - (bounds?.top ?? 0);
  const height = bounds?.height ?? size.height + offset;
  const uniforms = useMemo(
    () => ({
      backdrop: { value: texture },
      stage: { value: new Vector3(height, offset, size.height) },
    }),
    [texture, height, offset, size.height],
  );
  return (
    <ScreenQuad name="hero-backdrop" renderOrder={-1000} raycast={() => {}}>
      <shaderMaterial
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        uniforms={uniforms}
        vertexShader={`varying vec2 uvScreen; void main(){uvScreen=position.xy*.5+.5;gl_Position=vec4(position.xy,1.,1.);}`}
        fragmentShader={`uniform sampler2D backdrop; uniform vec3 stage; varying vec2 uvScreen;
        void main(){
          vec2 uv=vec2(uvScreen.x,1.-((1.-uvScreen.y)*stage.z+stage.y)/stage.x);
          gl_FragColor=texture2D(backdrop,uv);
          #include <colorspace_fragment>
        }`}
      />
    </ScreenQuad>
  );
}
// Read cached GLTF buffers without changing their shared bounding-box metadata.
function geometryBounds(geometry: BufferGeometry) {
  const bounds = new Box3();
  const point = new Vector3();
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i++)
    bounds.expandByPoint(point.fromBufferAttribute(position, i));
  return bounds;
}

// Extract the concept's structural creases; Fiber owns the native line resources.
function contourData(geometry: BufferGeometry) {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");
  const { min, max } = geometryBounds(geometry);
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
  // Walk connected cap edges to give the glint one continuous perimeter path.
  const pending = segments.filter(({ role }) => role === "rim");
  const rimPath = new Map<
    (typeof segments)[number],
    { start: number; length: number; reverse: boolean }
  >();
  let perimeter = 0;
  let endpoint = pending[0]?.a;
  const samePoint = (a: number[], b: number[]) =>
    a.every((value, axis) => Math.abs(value - b[axis]) < 0.00001);
  while (pending.length && endpoint) {
    const index = pending.findIndex(
      ({ a, b }) => samePoint(a, endpoint!) || samePoint(b, endpoint!),
    );
    if (index < 0) break;
    const [edge] = pending.splice(index, 1);
    const reverse = samePoint(edge.b, endpoint);
    const length = Math.hypot(
      ...edge.a.map((value, axis) => edge.b[axis] - value),
    );
    rimPath.set(edge, { start: perimeter, length, reverse });
    perimeter += length;
    endpoint = reverse ? edge.a : edge.b;
  }
  return [true, false].map((rear) => {
    const points: [number, number, number][] = [];
    const glintPoints: number[] = [];
    const colors: [number, number, number, number][] = [];
    const rimSamples: { vertex: number; distance: number }[] = [];
    const alpha = rear
      ? { crease: 0.25, rim: 0.35, inset: 0.65 }
      : { crease: 0.3, rim: 0.7, inset: 0 };
    const stops = [0, 0.12, 0.5, 0.88, 1];
    for (const segment of segments) {
      const { a, b, role } = segment;
      if (!alpha[role]) continue;
      const topRim = !rear && role === "rim";
      const rimStops = topRim
        ? [0, 0.15, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85, 1]
        : stops;
      const dx = Math.abs(b[0] - a[0]);
      const dz = Math.abs(b[2] - a[2]);
      const facing =
        (0.3 + 0.7 * MathUtils.smoothstep((a[2] + b[2]) / 2, min.z, max.z)) *
        (0.45 + 0.55 * (dx / Math.max(dx + dz, 0.00001)));
      for (let i = 0; i < rimStops.length - 1; i++)
        for (const f of [rimStops[i], rimStops[i + 1]]) {
          points.push(
            a.map((value, axis) => value + (b[axis] - value) * f) as [
              number,
              number,
              number,
            ],
          );
          const falloff = Math.sin(Math.PI * f);
          // Concentrate highlights into shorter stretches and vary their
          // strength with the edge's position/orientation in the studio.
          // Structural and rear contours keep their original falloff.
          const radiance = topRim
            ? 0.002 + 1.4 * facing * Math.pow(falloff, 4)
            : 1;
          const opacity = topRim
            ? 0.82
            : (rear ? 0.08 : 0.35) * alpha[role] * (0.4 + 0.6 * falloff);
          colors.push([radiance, radiance, radiance, opacity]);
        }
    }
    if (!rear)
      for (const [edge, path] of rimPath) {
        const divisions = Math.max(
          8,
          Math.ceil(path.length / (perimeter * 0.008)),
        );
        for (let i = 0; i < divisions; i++)
          for (const f of [i / divisions, (i + 1) / divisions]) {
            rimSamples.push({
              vertex: glintPoints.length / 3,
              distance:
                (path.start + path.length * (path.reverse ? 1 - f : f)) /
                perimeter,
            });
            for (let axis = 0; axis < 3; axis++)
              glintPoints.push(
                edge.a[axis] + (edge.b[axis] - edge.a[axis]) * f,
              );
          }
      }
    return {
      positions: new Float32Array(points.flat()),
      colors: new Float32Array(colors.flat()),
      rear,
      rimSamples,
      glintPositions: new Float32Array(glintPoints),
    };
  });
}
function GlassContours({
  geometry,
  amount,
  tint,
  reducedMotion,
  settings,
  shimmerTime,
  shimmerOffset,
}: {
  geometry: BufferGeometry;
  amount: RefObject<number>;
  tint: Color;
  reducedMotion: boolean;
  settings: SceneSettings;
  shimmerTime: RefObject<number>;
  shimmerOffset: number;
}) {
  const contours = useMemo(() => contourData(geometry), [geometry]);
  const front = useRef<LineSegments<BufferGeometry, LineBasicMaterial>>(null);
  const rearLine =
    useRef<LineSegments<BufferGeometry, LineBasicMaterial>>(null);
  const glint = useRef<LineSegments<BufferGeometry, LineBasicMaterial>>(null);
  const frontData = contours.find(({ rear }) => !rear)!;
  const glintColors = useMemo(() => {
    const colors = new Float32Array(frontData.rimSamples.length * 4);
    for (let i = 0; i < colors.length; i += 4) colors.fill(1, i, i + 3);
    return colors;
  }, [frontData]);
  useFrame((state) => {
    if (state.gl.getContext().isContextLost()) return;
    rearLine.current?.material.color.set("#f3f7f2");
    front.current?.material.color
      .set("#f3f7f2")
      .lerp(tint, amount.current * 0.12);
    const phase = shimmerTime.current % settings.rimShimmerInterval;
    const duration = Math.min(
      settings.rimShimmerDuration,
      settings.rimShimmerInterval,
    );
    // The two closed rims take turns within the ten-second sweep. Each needs
    // its own fade: the second rim must not inherit the first rim's full alpha.
    const rimDuration = duration / 2;
    const rimPhase = phase - duration * shimmerOffset;
    const sweeping =
      !reducedMotion &&
      settings.rimShimmer &&
      rimPhase >= 0 &&
      rimPhase < rimDuration;
    const t = MathUtils.clamp(rimPhase / rimDuration, 0, 1);
    const center =
      t < 0.5 ? 8 * Math.pow(t, 4) : 1 - Math.pow(-2 * t + 2, 4) / 2;
    const halfWidth = 0.11;
    const quietDuration = Math.min(1, rimDuration * 0.2);
    const fadeDuration = Math.min(2, (rimDuration - 2 * quietDuration) / 3);
    const envelope = sweeping
      ? MathUtils.smootherstep(
          rimPhase,
          quietDuration,
          quietDuration + fadeDuration,
        ) *
        (1 -
          MathUtils.smootherstep(
            rimPhase,
            rimDuration - quietDuration - fadeDuration,
            rimDuration - quietDuration,
          ))
      : 0;
    glint.current?.material.color.setScalar(settings.rimShimmerStrength);
    const attribute = glint.current?.geometry.getAttribute("color");
    if (!attribute) return;
    for (const { vertex, distance } of frontData.rimSamples) {
      // Distance wraps at the closed rim's seam, preserving the whole glint.
      const directDistance = Math.abs(distance - center);
      const separation = Math.min(directDistance, 1 - directDistance);
      const peak = 1 - MathUtils.smoothstep(separation, 0, halfWidth);
      attribute.setW(vertex, peak * envelope);
    }
    attribute.needsUpdate = true;
  });
  return (
    <>
      {contours.map(({ positions, colors, rear }) => (
        <lineSegments
          ref={rear ? rearLine : front}
          key={String(rear)}
          renderOrder={rear ? 4 : 5}
          raycast={() => {}}
        >
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
            <bufferAttribute attach="attributes-color" args={[colors, 4]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#f3f7f2"
            vertexColors
            transparent
            depthTest={!rear}
            depthWrite={false}
            dithering
            toneMapped={false}
          />
        </lineSegments>
      ))}
      <lineSegments ref={glint} renderOrder={6} raycast={() => {}}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[frontData.glintPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[glintColors, 4]}
            usage={DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="white"
          vertexColors
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>
    </>
  );
}

function GlassBody({
  geometry,
  name,
  hovered,
  reducedMotion,
  onOver,
  onOut,
  settings,
  shimmerTime,
}: {
  geometry: BufferGeometry;
  name: string;
  hovered: boolean;
  reducedMotion: boolean;
  onOver: (event: ThreeEvent<PointerEvent>) => void;
  onOut: () => void;
  settings: SceneSettings;
  shimmerTime: RefObject<number>;
}) {
  const mesh = useRef<Mesh<BufferGeometry, MeshPhysicalMaterial>>(null);
  const projection = useBoxProjectedEnv([0, 3.3, 0], [14, 20, 18]);
  const amount = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  const tint = useMemo(
    () =>
      new Color(name.includes("Rear") ? settings.greenTint : settings.redTint),
    [name, settings.greenTint, settings.redTint],
  );
  useEffect(() => {
    invalidate();
  }, [hovered, reducedMotion, invalidate, settings]);
  useFrame((_, delta) => {
    const target = hovered ? 1 : 0;
    const next = reducedMotion
      ? target
      : MathUtils.damp(
          amount.current,
          target,
          settings.hoverDamping,
          Math.min(delta, 0.1),
        );
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
      onPointerMove={(event) => event.stopPropagation()}
      onPointerOut={onOut}
    >
      <primitive object={geometry} attach="geometry" dispose={null} />
      <meshPhysicalMaterial
        {...projection}
        onBeforeCompile={(shader) => {
          projection.onBeforeCompile(shader);
          adaptBoxProjectedShader(shader);
        }}
        customProgramCacheKey={() =>
          projection.customProgramCacheKey() + "-transmission-r186-safe-rays"
        }
        color="white"
        attenuationColor="white"
        transmission={settings.transmission}
        thickness={settings.thickness}
        ior={settings.ior}
        attenuationDistance={settings.attenuationDistance}
        roughness={settings.roughness}
        metalness={0}
        side={DoubleSide}
        dithering
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
      {settings.contours && (
        <GlassContours
          geometry={geometry}
          amount={amount}
          tint={tint}
          reducedMotion={reducedMotion}
          settings={settings}
          shimmerTime={shimmerTime}
          shimmerOffset={name.includes("Rear") ? 0 : 0.5}
        />
      )}
    </mesh>
  );
}

function Sculpture({
  active,
  reducedMotion,
  onReady,
  motion,
  settings,
  contextVersion,
  telemetry,
}: SceneProps & {
  motion: RefObject<PointerMotion>;
  contextVersion: number;
}) {
  const { nodes } = useGLTF("/studio/tactic-mark.glb") as MarkGLTF;
  const bodies = [nodes.TACTIC_Green_Rear, nodes.TACTIC_Red_Front];
  const moving = useRef<Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const size = useThree((state) => state.size);
  const events = useThree((state) => state.events);
  const invalidate = useThree((state) => state.invalidate);
  const readyFrames = useRef(0);
  const shimmerTime = useRef(0);
  useEffect(() => {
    if (
      !active ||
      reducedMotion ||
      !settings.contours ||
      !settings.rimShimmer ||
      settings.rimShimmerStrength === 0
    )
      return;
    // Only the visible, animated rim requests idle frames; pointer animation
    // can still request native-rate frames through Fiber's demand loop.
    let previous = performance.now();
    let wasSweeping = false;
    let timer = 0;
    const tick = () => {
      const now = performance.now();
      shimmerTime.current += (now - previous) / 1000;
      previous = now;
      const sweeping =
        shimmerTime.current % settings.rimShimmerInterval <
        Math.min(settings.rimShimmerDuration, settings.rimShimmerInterval);
      telemetry.setAnimating(sweeping);
      if (sweeping || wasSweeping) invalidate();
      wasSweeping = sweeping;
      timer = window.requestAnimationFrame(tick);
    };
    timer = window.requestAnimationFrame(tick);
    invalidate();
    return () => {
      window.cancelAnimationFrame(timer);
      telemetry.setAnimating(false);
    };
  }, [
    active,
    reducedMotion,
    settings.contours,
    settings.rimShimmer,
    settings.rimShimmerStrength,
    settings.rimShimmerInterval,
    settings.rimShimmerDuration,
    telemetry,
    invalidate,
  ]);
  useLayoutEffect(() => {
    readyFrames.current = 0;
    invalidate();
  }, [contextVersion, invalidate]);
  const bounds = useMemo(() => {
    const bounds = new Box3();
    for (const node of [nodes.TACTIC_Green_Rear, nodes.TACTIC_Red_Front])
      bounds.union(geometryBounds(node.geometry));
    return bounds;
  }, [nodes]);
  const framing = useMemo(() => {
    const center = (bounds.min.y + bounds.max.y) / 2;
    const tilt = MathUtils.degToRad(settings.tilt);
    const matrix = new Matrix4()
      .makeTranslation(0, center, 0)
      .multiply(new Matrix4().makeRotationX(tilt))
      .multiply(new Matrix4().makeTranslation(0, -center, 0));
    const offset = Math.max(0, -bounds.clone().applyMatrix4(matrix).min.y);
    return { center, tilt, offset };
  }, [bounds, settings.tilt]);
  // Extend the backdrop across the hero without changing the sculpture's
  // original viewport scale or projected position.
  const gl = useThree((state) => state.gl);
  const artBounds = gl.domElement
    .closest("[data-hero-art]")
    ?.getBoundingClientRect();
  const artHeight = Math.max(artBounds?.height ?? size.height, 1);
  const artOffset = (artBounds?.top ?? size.top) - size.top;
  const viewHeight =
    Math.max(
      SCENE_FRAMING.minHeight,
      (artHeight / Math.max(size.width, 1)) * SCENE_FRAMING.minWidth,
    ) / settings.zoom;
  const viewWidth = (viewHeight * size.width) / artHeight;
  const unitsPerPixel = viewHeight / artHeight;
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
    if (state.gl.getContext().isContextLost()) return;
    // Reveal only after the complete scene has produced its first frame.
    if (readyFrames.current === 0) {
      readyFrames.current = 1;
      invalidate();
    } else if (readyFrames.current === 1) {
      readyFrames.current = 2;
      onReady();
    }
    if (!moving.current) return;
    const target =
      reducedMotion || !active || !settings.parallax
        ? 0
        : motion.current.yaw * (settings.parallaxStrength / 0.08);
    const previous = moving.current.rotation.y;
    const next = reducedMotion
      ? target
      : MathUtils.damp(
          moving.current.rotation.y,
          target,
          settings.rotationDamping,
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
        top={viewHeight / 2 + artOffset * unitsPerPixel}
        bottom={
          -viewHeight / 2 -
          (size.height - artOffset - artHeight) * unitsPerPixel
        }
        near={0.1}
        far={200}
        position={[
          settings.cameraX,
          settings.cameraY + framing.offset,
          settings.cameraZ,
        ]}
        onUpdate={(camera) =>
          camera.lookAt(0, settings.targetY + framing.offset, 0)
        }
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
              hovered={active && settings.hover && hovered === body.name}
              reducedMotion={reducedMotion}
              settings={settings}
              shimmerTime={shimmerTime}
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
            />
          ))}
        </group>
      </group>
    </>
  );
}

function RestorableScene(
  props: SceneProps & { motion: RefObject<PointerMotion> },
) {
  const gl = useThree((state) => state.gl);
  const [contextVersion, setContextVersion] = useState(0);
  const onContextLost = props.onContextLost;
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    // Three restores its renderer first; the next commit rebakes the environment
    // and schedules frames before Sculpture reveals the recovered scene.
    const restored = () => setContextVersion((version) => version + 1);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
    };
  }, [gl, onContextLost]);
  return (
    <Suspense fallback={null}>
      <StudioEnvironment
        blur={props.settings.environmentBlur}
        intensity={props.settings.environmentIntensity}
        contextVersion={contextVersion}
      />
      <Sculpture {...props} contextVersion={contextVersion} />
    </Suspense>
  );
}

function FrameTelemetry({ telemetry }: { telemetry: SceneTelemetry }) {
  useFrame((state) => {
    if (!state.gl.getContext().isContextLost()) telemetry.recordFrame();
  });
  return null;
}

export default function HeroCanvas(props: SceneProps) {
  const source = useRef<HTMLElement>(null);
  const motion = useRef<PointerMotion>({ yaw: 0, inside: false, event: null });
  const events = useMemo<NonNullable<Parameters<typeof Canvas>[0]["events"]>>(
    () => (store) => ({
      ...createPointerEvents(store),
      compute(event, state) {
        const bounds = state.gl.domElement.getBoundingClientRect();
        const artBounds =
          state.gl.domElement
            .closest("[data-hero-art]")
            ?.getBoundingClientRect() ?? bounds;
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
            event.clientY >= artBounds.top &&
            event.clientY <= artBounds.bottom &&
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
      dpr={[1, props.settings.dprLimit]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: NeutralToneMapping,
        toneMappingExposure: props.settings.exposure,
        transmissionResolutionScale: props.settings.transmissionResolution,
      }}
    >
      <FrameTelemetry telemetry={props.telemetry} />
      <HeroBackdrop backgroundURL={props.backgroundURL} />
      <directionalLight
        color="white"
        intensity={props.settings.keyLight}
        position={[-1, 10, 12]}
      />
      <directionalLight
        color="white"
        intensity={props.settings.fillLight}
        position={[5, 4, 1]}
      />
      <directionalLight
        color="white"
        intensity={props.settings.rimLight}
        position={[1, 6, -5]}
      />
      <directionalLight
        color="#80e650"
        intensity={props.settings.greenLight}
        position={[-6, 5, 2]}
      />
      <directionalLight
        color="#ff2c4b"
        intensity={props.settings.redLight}
        position={[6, 5, 2]}
      />
      <RestorableScene {...props} motion={motion} />
    </Canvas>
  );
}
