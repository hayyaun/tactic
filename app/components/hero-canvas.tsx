"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  Line,
  Environment,
  Lightformer,
  OrthographicCamera,
  ScreenQuad,
  useGLTF,
  useBoxProjectedEnv,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  Vector3,
  type Group,
} from "three";

type SceneProps = {
  active: boolean;
  reducedMotion: boolean;
  onReady: () => void;
};
type MarkGLTF = ReturnType<typeof useGLTF> & {
  nodes: { TACTIC_Green_Rear: Mesh; TACTIC_Red_Front: Mesh };
};

function PanelRadiance({ kind }: { kind: number }) {
  const uniforms = useMemo(() => ({ kind: { value: kind } }), [kind]);
  return (
    <shaderMaterial
      side={DoubleSide}
      toneMapped={false}
      uniforms={uniforms}
      vertexShader={`varying vec2 panelUV; void main(){panelUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`}
      fragmentShader={`uniform float kind; varying vec2 panelUV;
      void main(){float u=panelUV.x;float v=panelUV.y;float energy;
        if(kind<.5) energy=.015+2.2*smoothstep(.02,.22,u)*(1.-smoothstep(.78,.98,u))*(1.-smoothstep(.18,.48,v));
        else if(kind<1.5) energy=.005+5.5*smoothstep(.58,.62,u)*(1.-smoothstep(.65,.69,u))*smoothstep(.12,.45,v)*(1.-smoothstep(.8,1.,v));
        else if(kind<2.5) energy=.005+4.8*smoothstep(.51,.56,u)*(1.-smoothstep(.62,.69,u))*smoothstep(.02,.18,v)*(1.-smoothstep(.82,.98,v));
        else energy=.005+6.25*smoothstep(.56,.63,v)*(1.-smoothstep(.7,.77,v))*(.6+.4*smoothstep(.3,.7,u));
        gl_FragColor=vec4(vec3(energy),1.);
        #include <colorspace_fragment>
      }`}
    />
  );
}

function StudioEnvironment() {
  const warmupFrames = useRef(0);
  useFrame(({ invalidate }) => {
    if (warmupFrames.current++ < 3) invalidate();
  });
  return (
    <Environment frames={3} resolution={256} near={0.1} far={100}>
      <color attach="background" args={["#0c0e0d"]} />
      <group position={[0, -3.3, 0]}>
        <Lightformer
          position={[-7, 3, 0]}
          target={[0, -0.3, 0]}
          scale={[18, 20]}
        >
          <PanelRadiance kind={0} />
        </Lightformer>
        <Lightformer
          position={[7, 3, 0]}
          target={[0, -0.3, 0]}
          scale={[18, 20]}
        >
          <PanelRadiance kind={1} />
        </Lightformer>
        <Lightformer position={[0, 13, 0]} target={[0, 0, 0]} scale={[14, 18]}>
          <PanelRadiance kind={2} />
        </Lightformer>
        <Lightformer
          position={[0, 3, 9]}
          target={[0, -0.3, 0]}
          scale={[14, 20]}
        >
          <PanelRadiance kind={3} />
        </Lightformer>
      </group>
    </Environment>
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

// Extract the concept's structural creases and top contours; Drei owns the lines.
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
    return { points, colors, rear };
  });
}
function GlassContours({ geometry }: { geometry: BufferGeometry }) {
  const contours = useMemo(() => contourData(geometry), [geometry]);
  return contours.map(({ points, colors, rear }) => (
    <Line
      key={String(rear)}
      points={points}
      vertexColors={colors}
      segments
      color="#f3f7f2"
      transparent
      opacity={rear ? 0.08 : 0.35}
      depthTest={!rear}
      depthWrite={false}
      toneMapped={false}
      renderOrder={rear ? 4 : 5}
      raycast={() => {}}
    />
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
             vec3 nDir = normalize(v);`,
            )
            .replaceAll("cubeSize + cubePos", "cubeSize + boxCenter")
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
          projection.customProgramCacheKey() + "-transmission-r186"
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
      <GlassContours geometry={geometry} />
    </mesh>
  );
}

function Sculpture({ active, reducedMotion, onReady }: SceneProps) {
  const { nodes } = useGLTF("/studio/tactic-mark.glb") as MarkGLTF;
  const bodies = [nodes.TACTIC_Green_Rear, nodes.TACTIC_Red_Front];
  const moving = useRef<Group>(null);
  const yaw = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const size = useThree((state) => state.size);
  const pointer = useThree((state) => state.pointer);
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
      yaw.current = 0;
      invalidate();
    };
    window.addEventListener("blur", reset);
    window.addEventListener("scroll", reset, { passive: true });
    return () => {
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", reset);
    };
  }, [invalidate]);
  useFrame((_, delta) => {
    if (!moving.current) return;
    const target = reducedMotion || !active || !hovered ? 0 : yaw.current;
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
                yaw.current = pointer.x * 0.04;
                invalidate();
              }}
              onOut={() =>
                setHovered((current) =>
                  current === body.name ? null : current,
                )
              }
              onMove={(event) => {
                event.stopPropagation();
                yaw.current = pointer.x * 0.04;
                invalidate();
              }}
            />
          ))}
        </group>
      </group>
    </>
  );
}

export default function HeroCanvas(props: SceneProps) {
  return (
    <Canvas
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
        <Sculpture {...props} />
      </Suspense>
    </Canvas>
  );
}
