/** Validate both GLB structure/geometry and the exact vendored browser loader. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Color, DoubleSide } from "../vendor/three/build/three.module.js";
import { GLTFLoader } from "../vendor/three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "../vendor/three/examples/jsm/environments/RoomEnvironment.js";
import { Reflector } from "../vendor/three/examples/jsm/objects/Reflector.js";

const glb = await readFile(
  new URL("../assets/tactic-mark.glb", import.meta.url),
);
const outline = JSON.parse(
  await readFile(
    new URL("../assets/tactic-mark-outline.json", import.meta.url),
    "utf8",
  ),
);
const provenance = JSON.parse(
  await readFile(
    new URL("../vendor/three/provenance.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(glb.readUInt32LE(0), 0x46546c67, "GLB magic");
assert.equal(glb.readUInt32LE(4), 2, "GLB version");
assert.equal(glb.readUInt32LE(8), glb.length, "GLB length");
assert.equal(glb.readUInt32LE(16), 0x4e4f534a, "JSON chunk");
const jsonLength = glb.readUInt32LE(12);
const document = JSON.parse(glb.subarray(20, 20 + jsonLength).toString("utf8"));
const binaryStart = 20 + jsonLength;
assert.equal(glb.readUInt32LE(binaryStart + 4), 0x004e4942, "BIN chunk");
const binary = glb.subarray(binaryStart + 8);
assert.equal(glb.readUInt32LE(binaryStart), binary.length, "BIN length");
assert.equal(document.asset.version, "2.0");
assert.equal(document.meshes.length, 2);
assert.equal(document.materials.length, 2);
assert.deepEqual(document.scenes[document.scene].nodes, [0, 1]);
assert.equal(document.buffers.length, 1);
assert.ok(document.buffers[0].byteLength <= binary.length);
assert.ok(!document.buffers[0].uri, "Single embedded buffer");
assert.equal(document.asset.extras.sourceSha256, outline.sourceSha256);
const sourceJpeg = await readFile(
  new URL("../../assets/1.jpg", import.meta.url),
);
assert.equal(
  createHash("sha256").update(sourceJpeg).digest("hex"),
  outline.sourceSha256,
  "Original JPEG source hash",
);
assert.deepEqual(document.extensionsUsed, [
  "KHR_materials_transmission",
  "KHR_materials_volume",
  "KHR_materials_ior",
]);
assert.deepEqual(outline.footprintSize, [4, 5.412162162162162]);
assert.ok(
  Math.abs(outline.minimumFootprintGapUnits - 0.366810877507793) < 0.000001,
  "Original traced gap preserved",
);

function values(accessorIndex) {
  const accessor = document.accessors[accessorIndex];
  const view = document.bufferViews[accessor.bufferView];
  const width =
    accessor.componentType === 5126 || accessor.componentType === 5125 ? 4 : 2;
  const dimension = accessor.type === "VEC3" ? 3 : 1;
  assert.equal(view.byteOffset % 4, 0, "Aligned buffer view");
  assert.equal(accessor.byteOffset % width, 0, "Aligned accessor");
  assert.ok(
    view.byteOffset + view.byteLength <= document.buffers[0].byteLength,
  );
  assert.ok(accessor.count * dimension * width <= view.byteLength);
  const result = [];
  for (let offset = 0; offset < accessor.count * dimension; offset++) {
    const position = view.byteOffset + accessor.byteOffset + offset * width;
    result.push(
      accessor.componentType === 5126
        ? binary.readFloatLE(position)
        : accessor.componentType === 5125
          ? binary.readUInt32LE(position)
          : binary.readUInt16LE(position),
    );
  }
  assert.ok(result.every(Number.isFinite), "Finite buffer values");
  return result;
}

const details = [];
for (let meshIndex = 0; meshIndex < document.meshes.length; meshIndex++) {
  const mesh = document.meshes[meshIndex];
  const component = outline.shapes[meshIndex];
  assert.equal(
    component.height,
    6.6,
    "Equal extrusion heights balance the original paired footprint",
  );
  assert.equal(mesh.name, component.name);
  assert.equal(document.nodes[meshIndex].mesh, meshIndex);
  for (const transform of ["matrix", "translation", "rotation", "scale"]) {
    assert.ok(
      !document.nodes[meshIndex][transform],
      "No part transform changes original spacing",
    );
  }
  assert.equal(mesh.primitives.length, 1);
  const primitive = mesh.primitives[0];
  assert.equal(primitive.mode, 4);
  assert.equal(primitive.material, meshIndex);
  const positions = values(primitive.attributes.POSITION);
  const normals = values(primitive.attributes.NORMAL);
  const indices = values(primitive.indices);
  assert.equal(positions.length, normals.length);
  assert.equal(indices.length % 3, 0);
  assert.ok(
    indices.every((index) => index >= 0 && index < positions.length / 3),
  );
  let topCaps = 0;
  let bottomCaps = 0;
  const weldedEdges = new Map();
  const positionKey = (vertex) =>
    positions
      .slice(vertex * 3, vertex * 3 + 3)
      .map((value) => Math.round(value * 1000000))
      .join(",");
  for (let index = 0; index < normals.length; index += 3) {
    assert.ok(
      Math.abs(Math.hypot(...normals.slice(index, index + 3)) - 1) < 0.00001,
      "Unit normal",
    );
    const y = positions[index + 1];
    assert.ok(
      y >= -0.000001 && y <= component.height + 0.000001,
      "Correct extrusion height/base",
    );
  }
  for (let index = 0; index < indices.length; index += 3) {
    const triangle = indices.slice(index, index + 3);
    for (let edge = 0; edge < 3; edge++) {
      const a = positionKey(triangle[edge]);
      const b = positionKey(triangle[(edge + 1) % 3]);
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      const entry = weldedEdges.get(key) ?? { count: 0, direction: 0 };
      entry.count++;
      entry.direction += a < b ? 1 : -1;
      weldedEdges.set(key, entry);
    }
    const vertices = indices
      .slice(index, index + 3)
      .map((vertex) => positions.slice(vertex * 3, vertex * 3 + 3));
    const [a, b, c] = vertices;
    const ab = b.map((value, axis) => value - a[axis]);
    const ac = c.map((value, axis) => value - a[axis]);
    const cross = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const area = Math.hypot(...cross);
    assert.ok(area > 0.0000001, "Non-degenerate triangles");
    for (const vertex of indices.slice(index, index + 3)) {
      const normal = normals.slice(vertex * 3, vertex * 3 + 3);
      const dot =
        cross.reduce((sum, value, axis) => sum + value * normal[axis], 0) /
        area;
      assert.ok(dot > 0.99, "Outward winding agrees with vertex normals");
    }
    if (
      vertices.every(
        (vertex) => Math.abs(vertex[1] - component.height) < 0.000001,
      )
    ) {
      assert.ok(cross[1] > 0, "Top cap faces +Y");
      topCaps++;
    }
    if (vertices.every((vertex) => Math.abs(vertex[1]) < 0.000001)) {
      assert.ok(cross[1] < 0, "Bottom cap faces -Y");
      bottomCaps++;
    }
  }
  assert.equal(topCaps, 4, "Six-corner concave cap triangulation");
  assert.equal(bottomCaps, 4, "Six-corner concave cap triangulation");
  for (const edge of weldedEdges.values()) {
    assert.equal(
      edge.count,
      2,
      "Closed manifold boundary required for bulk glass",
    );
    assert.equal(edge.direction, 0, "Consistent opposite edge winding");
  }
  for (const [x, z] of component.outlineXZ) {
    let retained = false;
    for (let index = 0; index < positions.length; index += 3) {
      if (Math.hypot(positions[index] - x, positions[index + 2] - z) < 0.000001)
        retained = true;
    }
    assert.ok(retained, "Exact original footprint corners retained");
  }
  for (let index = 0; index < component.outlinePixels.length; index++) {
    const center = outline.sourceBoundsPixels.min.map(
      (value, axis) => (value + outline.sourceBoundsPixels.max[axis]) / 2,
    );
    const [x, z] = component.outlinePixels[index].map(
      (value, axis) => (value - center[axis]) * outline.scaleUnitsPerPixel,
    );
    assert.ok(
      Math.hypot(
        x - component.outlineXZ[index][0],
        z - component.outlineXZ[index][1],
      ) < 0.0000001,
      "Original source coordinates use one shared scale/center",
    );
  }
  const material = document.materials[meshIndex];
  assert.equal(material.pbrMetallicRoughness.metallicFactor, 0);
  assert.equal(material.pbrMetallicRoughness.roughnessFactor, 0.045);
  assert.deepEqual(
    material.pbrMetallicRoughness.baseColorFactor,
    [1, 1, 1, 1],
    "Neutral fully opaque boundary avoids double tinting",
  );
  assert.equal(
    material.alphaMode,
    "OPAQUE",
    "Transmission instead of alpha blending",
  );
  assert.equal(material.doubleSided, true, "Render both glass boundaries");
  assert.equal(material.extras.sourceBrandColorSRGB, component.color);
  assert.equal(
    material.extensions.KHR_materials_transmission.transmissionFactor,
    1,
  );
  assert.equal(material.extensions.KHR_materials_volume.thicknessFactor, 0.45);
  assert.equal(material.extensions.KHR_materials_volume.attenuationDistance, 8);
  const attenuation = new Color(component.glass.attenuationColor);
  assert.equal(
    component.glass.attenuationColor,
    "#ffffff",
    "Default glass is neutral",
  );
  assert.deepEqual(
    material.extensions.KHR_materials_volume.attenuationColor,
    [1, 1, 1],
    "Neutral volume preserves incoming light color",
  );
  assert.deepEqual(
    material.extensions.KHR_materials_volume.attenuationColor,
    [attenuation.r, attenuation.g, attenuation.b],
    "Linear volume absorption tint",
  );
  assert.equal(material.extensions.KHR_materials_ior.ior, 1.28);
  details.push({
    name: mesh.name,
    vertices: positions.length / 3,
    triangles: indices.length / 3,
    topCaps,
    bottomCaps,
    height: component.height,
    closedManifold: true,
  });
}

for (const [relative, expectedHash] of Object.entries(provenance.filesSha256)) {
  const source = await readFile(
    new URL(`../vendor/three/${relative}`, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    expectedHash,
    "Unmodified official vendor source",
  );
}
assert.equal(typeof RoomEnvironment, "function");
assert.equal(typeof Reflector, "function");
const loaded = await new GLTFLoader().parseAsync(
  glb.buffer.slice(glb.byteOffset, glb.byteOffset + glb.byteLength),
  "",
);
const loadedMeshes = [];
loaded.scene.traverse((object) => {
  if (object.isMesh) loadedMeshes.push(object);
});
assert.equal(loadedMeshes.length, 2, "Official GLTFLoader parses both meshes");
assert.ok(
  loadedMeshes.every((mesh) => mesh.material.isMeshPhysicalMaterial),
  "Physical glass material loaded",
);
for (let index = 0; index < loadedMeshes.length; index++) {
  const material = loadedMeshes[index].material;
  assert.equal(material.transmission, 1, "Runtime transmission");
  assert.equal(material.opacity, 1, "Runtime surface coverage");
  assert.equal(material.metalness, 0, "Runtime dielectric");
  assert.equal(material.roughness, 0.045, "Runtime glass polish");
  assert.equal(material.thickness, 0.45, "Runtime volume");
  assert.equal(material.attenuationDistance, 8, "Runtime absorption distance");
  assert.equal(material.ior, 1.28, "Runtime glass IOR");
  assert.equal(
    material.userData.sourceBrandColorSRGB,
    outline.shapes[index].color,
    "Original brand color remains available for hover",
  );
  assert.equal(
    material.side,
    DoubleSide,
    "Runtime double-sided glass boundaries",
  );
  const expected = new Color(outline.shapes[index].glass.attenuationColor);
  assert.ok(material.attenuationColor.equals(expected), "Runtime volume color");
}
console.log(
  JSON.stringify(
    {
      valid: true,
      bytes: glb.length,
      threeVersion: provenance.version,
      meshes: details,
      officialLoaderParse: "passed",
      vendorIntegrity: "passed",
      preservedFootprintGapUnits: outline.minimumFootprintGapUnits,
    },
    null,
    2,
  ),
);
