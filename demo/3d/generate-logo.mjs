/**
 * Generate the real, indexed TACTIC GLB from the traced assets/1.jpg footprint.
 * Run from any working directory: node demo/3d/generate-logo.mjs
 * No dependencies are installed into the application.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  Box3,
  BufferGeometry,
  Color,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Shape,
} from "../vendor/three/build/three.module.js";
import { mergeVertices } from "../vendor/three/examples/jsm/utils/BufferGeometryUtils.js";

const outlineUrl = new URL(
  "../assets/tactic-mark-outline.json",
  import.meta.url,
);
const outputUrl = new URL("../assets/tactic-mark.glb", import.meta.url);
const outline = JSON.parse(await readFile(outlineUrl, "utf8"));
const bevel = 0.03;
const chunks = [];
const bufferViews = [];
const accessors = [];
const meshes = [];
const nodes = [];
const materials = [];
const summary = [];
let binaryLength = 0;

function appendBuffer(array, target) {
  const bytes = Buffer.from(array.buffer, array.byteOffset, array.byteLength);
  const aligned = Math.ceil(binaryLength / 4) * 4;
  if (aligned > binaryLength) chunks.push(Buffer.alloc(aligned - binaryLength));
  chunks.push(bytes);
  const index = bufferViews.length;
  bufferViews.push({
    buffer: 0,
    byteOffset: aligned,
    byteLength: bytes.length,
    target,
  });
  binaryLength = aligned + bytes.length;
  return index;
}

function appendAccessor(array, type, componentType, target, extrema) {
  const accessor = {
    bufferView: appendBuffer(array, target),
    byteOffset: 0,
    componentType,
    count: array.length / { SCALAR: 1, VEC2: 2, VEC3: 3 }[type],
    type,
  };
  if (extrema) Object.assign(accessor, extrema);
  const index = accessors.length;
  accessors.push(accessor);
  return index;
}

function buildPrism(component) {
  const footprint = component.outlineXZ;
  const path = new Shape();
  footprint.forEach(([x, z], index) => {
    if (index === 0) path.moveTo(x, -z);
    else path.lineTo(x, -z);
  });
  path.closePath();
  const source = new ExtrudeGeometry(path, {
    depth: component.height - 2 * bevel,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 5,
    curveSegments: 1,
  });
  source.translate(0, 0, bevel);
  source.rotateX(-Math.PI / 2);
  const positions = source.getAttribute("position").array;
  const normals = source.getAttribute("normal").array;
  const capGroup = source.groups.find((group) => group.materialIndex === 0);
  const xs = footprint.map((point) => point[0]),
    zs = footprint.map((point) => point[1]);
  const minX = Math.min(...xs),
    minZ = Math.min(...zs);
  const width = Math.max(...xs) - minX,
    depth = Math.max(...zs) - minZ;
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const uv = [];
  for (let offset = 0; offset < positions.length; offset += 9) {
    const cap =
      offset / 3 >= capGroup.start &&
      offset / 3 < capGroup.start + capGroup.count;
    const centroid = [
      (positions[offset] + positions[offset + 3] + positions[offset + 6]) / 3,
      (positions[offset + 2] + positions[offset + 5] + positions[offset + 8]) /
        3,
    ];
    let closest;
    footprint.forEach((start, index) => {
      const end = footprint[(index + 1) % footprint.length];
      const direction = end.map((value, axis) => value - start[axis]);
      const lengthSquared = direction[0] ** 2 + direction[1] ** 2;
      const delta = centroid.map((value, axis) => value - start[axis]);
      const u = clamp(
        (delta[0] * direction[0] + delta[1] * direction[1]) / lengthSquared,
      );
      const distance = Math.hypot(
        delta[0] - u * direction[0],
        delta[1] - u * direction[1],
      );
      if (!closest || distance < closest.distance)
        closest = { start, direction, lengthSquared, distance };
    });
    for (let vertex = 0; vertex < 3; vertex++) {
      const [x, y, z] = positions.slice(
        offset + vertex * 3,
        offset + vertex * 3 + 3,
      );
      if (cap) uv.push(clamp((x - minX) / width), clamp((z - minZ) / depth));
      else {
        const u =
          ((x - closest.start[0]) * closest.direction[0] +
            (z - closest.start[1]) * closest.direction[1]) /
          closest.lengthSquared;
        uv.push(clamp(u), clamp(y / component.height));
      }
    }
  }
  const raw = new BufferGeometry();
  raw.setAttribute("position", new Float32BufferAttribute(positions, 3));
  raw.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  raw.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  const geometry = mergeVertices(raw, 0.000001);
  geometry.computeBoundingBox();
  source.dispose();
  raw.dispose();
  return geometry;
}

function emitGeometry(geometry, meshIndex, component) {
  const position = geometry.getAttribute("position").array;
  const normal = geometry.getAttribute("normal").array;
  const uv = geometry.getAttribute("uv").array;
  const indices = geometry.getIndex().array;
  const bounds = geometry.boundingBox;
  const positionAccessor = appendAccessor(position, "VEC3", 5126, 34962, {
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
  });
  const normalAccessor = appendAccessor(normal, "VEC3", 5126, 34962);
  const uvAccessor = appendAccessor(uv, "VEC2", 5126, 34962);
  const indexAccessor = appendAccessor(
    indices,
    "SCALAR",
    indices instanceof Uint32Array ? 5125 : 5123,
    34963,
    {
      min: [Math.min(...indices)],
      max: [Math.max(...indices)],
    },
  );
  const name = component.name;
  const extras = {
    height: component.height,
    baseY: 0,
    bevelUnits: bevel,
    sourceOutlineXZ: component.outlineXZ,
  };
  meshes[meshIndex] = {
    name,
    extras,
    primitives: [
      {
        attributes: {
          POSITION: positionAccessor,
          NORMAL: normalAccessor,
          TEXCOORD_0: uvAccessor,
        },
        indices: indexAccessor,
        material: meshIndex,
        mode: 4,
      },
    ],
  };
  nodes[meshIndex] = {
    name,
    mesh: meshIndex,
  };
  summary.push({
    name,
    vertices: position.length / 3,
    triangles: indices.length / 3,
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
  });
  geometry.dispose();
}

for (const [componentIndex, component] of outline.shapes.entries()) {
  const geometry = buildPrism(component);
  // Default clear glass has neutral boundary/volume. Brand metadata drives hover.
  const glass = component.glass;
  const attenuation = new Color(glass.attenuationColor);
  materials.push({
    name: component.name + "_Glass",
    pbrMetallicRoughness: {
      baseColorFactor: [1, 1, 1, 1],
      metallicFactor: 0,
      roughnessFactor: glass.roughness,
    },
    alphaMode: "OPAQUE",
    doubleSided: true,
    extensions: {
      KHR_materials_transmission: { transmissionFactor: glass.transmission },
      KHR_materials_volume: {
        thicknessFactor: glass.thickness,
        attenuationDistance: glass.attenuationDistance,
        attenuationColor: [attenuation.r, attenuation.g, attenuation.b],
      },
      KHR_materials_ior: { ior: glass.ior },
    },
    extras: {
      sourceBrandColorSRGB: component.color,
      attenuationColorSRGB: glass.attenuationColor,
    },
  });
  emitGeometry(geometry, componentIndex, component);
}

const binary = Buffer.concat(chunks);
const document = {
  asset: {
    version: "2.0",
    generator: "TACTIC image-contour extrusion / Three.js 0.186.1",
    extras: {
      source: outline.source,
      sourceSha256: outline.sourceSha256,
      coordinateSystem: outline.coordinateSystem,
      footprintSize: outline.footprintSize,
      minimumFootprintGapUnits: outline.minimumFootprintGapUnits,
    },
  },
  extensionsUsed: [
    "KHR_materials_transmission",
    "KHR_materials_volume",
    "KHR_materials_ior",
  ],
  scene: 0,
  scenes: [{ name: "TACTIC Glass Logo", nodes: [0, 1] }],
  nodes,
  meshes,
  materials,
  accessors,
  bufferViews,
  buffers: [{ byteLength: binary.length }],
};
const jsonBytes = Buffer.from(JSON.stringify(document), "utf8");
const jsonChunk = Buffer.alloc(Math.ceil(jsonBytes.length / 4) * 4, 0x20);
jsonBytes.copy(jsonChunk);
const binaryChunk = Buffer.alloc(Math.ceil(binary.length / 4) * 4);
binary.copy(binaryChunk);
const glb = Buffer.alloc(12 + 8 + jsonChunk.length + 8 + binaryChunk.length);
glb.writeUInt32LE(0x46546c67, 0);
glb.writeUInt32LE(2, 4);
glb.writeUInt32LE(glb.length, 8);
glb.writeUInt32LE(jsonChunk.length, 12);
glb.writeUInt32LE(0x4e4f534a, 16);
jsonChunk.copy(glb, 20);
const binHeader = 20 + jsonChunk.length;
glb.writeUInt32LE(binaryChunk.length, binHeader);
glb.writeUInt32LE(0x004e4942, binHeader + 4);
binaryChunk.copy(glb, binHeader + 8);
await writeFile(outputUrl, glb);

const totalBounds = new Box3();
for (const item of summary) {
  totalBounds.union(new Box3().setFromArray([...item.min, ...item.max]));
}
console.log(
  JSON.stringify(
    {
      output: fileURLToPath(outputUrl),
      bytes: glb.length,
      meshCount: meshes.length,
      bounds: {
        min: totalBounds.min.toArray(),
        max: totalBounds.max.toArray(),
      },
      meshes: summary,
    },
    null,
    2,
  ),
);
