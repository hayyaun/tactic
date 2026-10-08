/**
 * Generate the real, indexed TACTIC GLB from the traced assets/1.jpg footprint.
 * Run from any working directory: node demo/3d/generate-logo.mjs
 * No dependencies are installed into the application.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  Box3,
  Color,
  ExtrudeGeometry,
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
    count: array.length / (type === "VEC3" ? 3 : 1),
    type,
  };
  if (extrema) Object.assign(accessor, extrema);
  const index = accessors.length;
  accessors.push(accessor);
  return index;
}

for (const component of outline.shapes) {
  const shape = new Shape();
  component.outlineXZ.forEach(([x, z], index) => {
    // Extrude +Z locally, then rotate -90° about X to produce +Y extrusion.
    if (index === 0) shape.moveTo(x, -z);
    else shape.lineTo(x, -z);
  });
  shape.closePath();

  const raw = new ExtrudeGeometry(shape, {
    depth: component.height - 2 * bevel,
    steps: 1,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    // Preserve the source footprint at the vertical wall; bevel inwards.
    bevelOffset: -bevel,
    bevelSegments: 5,
    curveSegments: 1,
  });
  raw.translate(0, 0, bevel);
  raw.rotateX(-Math.PI / 2);
  raw.deleteAttribute("uv");
  const geometry = mergeVertices(raw, 0.000001);
  geometry.computeBoundingBox();

  const position = geometry.getAttribute("position").array;
  const normal = geometry.getAttribute("normal").array;
  const indices = geometry.getIndex().array;
  const bounds = geometry.boundingBox;
  const indexType = indices instanceof Uint32Array ? 5125 : 5123;
  const positionAccessor = appendAccessor(position, "VEC3", 5126, 34962, {
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
  });
  const normalAccessor = appendAccessor(normal, "VEC3", 5126, 34962);
  const indexAccessor = appendAccessor(indices, "SCALAR", indexType, 34963, {
    min: [Math.min(...indices)],
    max: [Math.max(...indices)],
  });

  // Default clear glass has a neutral boundary and neutral volume absorption.
  // Original brand colors stay in extras for the hero's interactive hover tint.
  // glTF attenuation factors are linear RGB; CSS source colors are sRGB.
  const glass = component.glass;
  const attenuation = new Color(glass.attenuationColor);
  materials.push({
    name: `${component.name}_Glass`,
    pbrMetallicRoughness: {
      baseColorFactor: [1, 1, 1, 1],
      metallicFactor: 0,
      roughnessFactor: glass.roughness,
    },
    alphaMode: "OPAQUE",
    doubleSided: true,
    extensions: {
      KHR_materials_transmission: {
        transmissionFactor: glass.transmission,
      },
      KHR_materials_volume: {
        thicknessFactor: glass.thickness,
        attenuationDistance: glass.attenuationDistance,
        attenuationColor: [attenuation.r, attenuation.g, attenuation.b],
      },
      KHR_materials_ior: {
        ior: glass.ior,
      },
    },
    extras: {
      sourceBrandColorSRGB: component.color,
      attenuationColorSRGB: glass.attenuationColor,
    },
  });
  meshes.push({
    name: component.name,
    primitives: [
      {
        attributes: { POSITION: positionAccessor, NORMAL: normalAccessor },
        indices: indexAccessor,
        material: materials.length - 1,
        mode: 4,
      },
    ],
    extras: { height: component.height, baseY: 0, bevelUnits: bevel },
  });
  nodes.push({ name: component.name, mesh: meshes.length - 1 });
  summary.push({
    name: component.name,
    vertices: position.length / 3,
    triangles: indices.length / 3,
    min: bounds.min.toArray(),
    max: bounds.max.toArray(),
    material: { type: "bulk glass", ...glass },
  });
  raw.dispose();
  geometry.dispose();
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
  scenes: [{ name: "TACTIC Logo", nodes: nodes.map((_, index) => index) }],
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
