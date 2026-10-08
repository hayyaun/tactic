/** Validate the two original closed glass prisms and actual vendored browser loader. */
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
assert.equal(document.nodes.length, 2);
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
  assert.ok([5126, 5125, 5123].includes(accessor.componentType));
  const width = accessor.componentType === 5123 ? 2 : 4;
  const dimension = { SCALAR: 1, VEC2: 2, VEC3: 3 }[accessor.type];
  assert.ok(dimension, "Supported accessor dimensions");
  assert.equal(view.byteOffset % 4, 0, "Aligned buffer view");
  assert.equal(accessor.byteOffset % width, 0, "Aligned accessor");
  assert.ok(
    view.byteOffset + view.byteLength <= document.buffers[0].byteLength,
  );
  assert.equal(accessor.count * dimension * width, view.byteLength);
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

const positionKey = (point) =>
  point.map((value) => Math.round(value * 1000000)).join(",");
function addEdge(map, a, b) {
  const key = a < b ? a + "|" + b : b + "|" + a;
  const entry = map.get(key) ?? { count: 0, direction: 0 };
  entry.count++;
  entry.direction += a < b ? 1 : -1;
  map.set(key, entry);
}
function meshData(index) {
  const mesh = document.meshes[index],
    primitive = mesh.primitives[0];
  assert.equal(mesh.primitives.length, 1);
  assert.equal(primitive.mode, 4);
  return {
    mesh,
    primitive,
    positions: values(primitive.attributes.POSITION),
    normals: values(primitive.attributes.NORMAL),
    uv: values(primitive.attributes.TEXCOORD_0),
    indices: values(primitive.indices),
  };
}

const details = [];
for (const [meshIndex, component] of outline.shapes.entries()) {
  assert.equal(component.height, 6.6, "Original tall prisms retained");
  assert.ok(!("wallThickness" in component), "No cavity configuration remains");
  const { mesh, primitive, positions, normals, uv, indices } =
    meshData(meshIndex);
  const node = document.nodes[meshIndex];
  assert.equal(mesh.name, component.name);
  assert.equal(node.name, component.name);
  assert.equal(node.mesh, meshIndex);
  assert.ok(!node.children, "No inner mesh children");
  assert.deepEqual(mesh.extras.sourceOutlineXZ, component.outlineXZ);
  for (const field of [
    "wallThickness",
    "cavityOutlineXZ",
    "parentBody",
    "role",
    "boundaryY",
  ]) {
    assert.ok(!(field in mesh.extras), "No obsolete cavity metadata");
  }
  for (const transform of ["matrix", "translation", "rotation", "scale"])
    assert.ok(!node[transform], "Original source placement");
  assert.equal(primitive.material, meshIndex);
  assert.equal(positions.length, normals.length);
  assert.equal(uv.length, (positions.length / 3) * 2);
  assert.equal(indices.length % 3, 0);
  assert.ok(
    indices.every((index) => index >= 0 && index < positions.length / 3),
  );
  assert.ok(
    uv.every((value) => value >= -0.000001 && value <= 1.000001),
    "Finite normalized UVs",
  );
  for (let index = 0; index < positions.length; index += 3) {
    assert.ok(
      Math.abs(Math.hypot(...normals.slice(index, index + 3)) - 1) < 0.00001,
      "Unit normals",
    );
    assert.ok(
      positions[index + 1] >= -0.000001 &&
        positions[index + 1] <= component.height + 0.000001,
      "Original Y range",
    );
  }
  const xs = component.outlineXZ.map((point) => point[0]),
    zs = component.outlineXZ.map((point) => point[1]);
  const minX = Math.min(...xs),
    minZ = Math.min(...zs);
  const width = Math.max(...xs) - minX,
    depth = Math.max(...zs) - minZ;
  const edges = new Map();
  let topCaps = 0,
    bottomCaps = 0,
    signedVolume = 0;
  for (let index = 0; index < indices.length; index += 3) {
    const triangle = indices.slice(index, index + 3);
    const vertices = triangle.map((vertex) =>
      positions.slice(vertex * 3, vertex * 3 + 3),
    );
    const [a, b, c] = vertices;
    for (let edge = 0; edge < 3; edge++)
      addEdge(
        edges,
        positionKey(vertices[edge]),
        positionKey(vertices[(edge + 1) % 3]),
      );
    const ab = b.map((value, axis) => value - a[axis]),
      ac = c.map((value, axis) => value - a[axis]);
    const cross = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0],
    ];
    const area = Math.hypot(...cross);
    assert.ok(area > 0.0000001, "Non-degenerate triangles");
    const top = vertices.every(
      (vertex) => Math.abs(vertex[1] - component.height) < 0.000001,
    );
    const bottom = vertices.every((vertex) => Math.abs(vertex[1]) < 0.000001);
    if (top) {
      assert.ok(cross[1] > 0, "Top cap faces +Y");
      topCaps++;
    }
    if (bottom) {
      assert.ok(cross[1] < 0, "Bottom cap faces -Y");
      bottomCaps++;
    }
    const bc = [
      b[1] * c[2] - b[2] * c[1],
      b[2] * c[0] - b[0] * c[2],
      b[0] * c[1] - b[1] * c[0],
    ];
    signedVolume +=
      a.reduce((sum, value, axis) => sum + value * bc[axis], 0) / 6;
    for (const vertex of triangle) {
      const point = positions.slice(vertex * 3, vertex * 3 + 3);
      const normal = normals.slice(vertex * 3, vertex * 3 + 3);
      assert.ok(
        cross.reduce((sum, value, axis) => sum + value * normal[axis], 0) /
          area >
          0.99,
        "Outward winding agrees with normals",
      );
      if (top || bottom) {
        assert.ok(
          Math.abs(uv[vertex * 2] - (point[0] - minX) / width) < 0.000001,
          "Cap UV U uses planar X bounds",
        );
        assert.ok(
          Math.abs(uv[vertex * 2 + 1] - (point[2] - minZ) / depth) < 0.000001,
          "Cap UV V uses planar Z bounds",
        );
      } else
        assert.ok(
          Math.abs(uv[vertex * 2 + 1] - point[1] / component.height) < 0.000001,
          "Face texture V follows full height",
        );
    }
  }
  assert.equal(topCaps, 4, "Closed six-corner top cap");
  assert.equal(bottomCaps, 4, "Closed six-corner bottom cap");
  for (const edge of edges.values()) {
    assert.equal(edge.count, 2, "Closed 2-manifold prism");
    assert.equal(edge.direction, 0, "Consistent opposite edge winding");
  }
  const sourceArea =
    Math.abs(
      component.outlineXZ.reduce((sum, point, index) => {
        const next =
          component.outlineXZ[(index + 1) % component.outlineXZ.length];
        return sum + point[0] * next[1] - point[1] * next[0];
      }, 0),
    ) / 2;
  assert.ok(
    signedVolume > sourceArea * component.height * 0.99 &&
      signedVolume <= sourceArea * component.height * 1.000001,
    "Full original prism volume",
  );
  for (const [x, z] of component.outlineXZ) {
    let found = false;
    for (let index = 0; index < positions.length; index += 3)
      if (Math.hypot(positions[index] - x, positions[index + 2] - z) < 0.000001)
        found = true;
    assert.ok(found, "Exact source footprint corner retained");
  }
  const center = outline.sourceBoundsPixels.min.map(
    (value, axis) => (value + outline.sourceBoundsPixels.max[axis]) / 2,
  );
  for (const [index, pixel] of component.outlinePixels.entries()) {
    const point = pixel.map(
      (value, axis) => (value - center[axis]) * outline.scaleUnitsPerPixel,
    );
    assert.ok(
      Math.hypot(
        point[0] - component.outlineXZ[index][0],
        point[1] - component.outlineXZ[index][1],
      ) < 0.0000001,
      "One original image scale/center",
    );
  }
  const material = document.materials[meshIndex],
    glass = component.glass;
  assert.deepEqual(material.pbrMetallicRoughness.baseColorFactor, [1, 1, 1, 1]);
  assert.equal(material.pbrMetallicRoughness.metallicFactor, 0);
  assert.equal(material.pbrMetallicRoughness.roughnessFactor, 0.045);
  assert.equal(material.alphaMode, "OPAQUE");
  assert.equal(material.doubleSided, true);
  assert.equal(material.extras.sourceBrandColorSRGB, component.color);
  assert.equal(glass.attenuationColor, "#ffffff");
  assert.equal(
    material.extensions.KHR_materials_transmission.transmissionFactor,
    1,
  );
  assert.equal(material.extensions.KHR_materials_volume.thicknessFactor, 0.45);
  assert.equal(material.extensions.KHR_materials_volume.attenuationDistance, 8);
  assert.deepEqual(
    material.extensions.KHR_materials_volume.attenuationColor,
    [1, 1, 1],
  );
  assert.equal(material.extensions.KHR_materials_ior.ior, 1.28);
  details.push({
    name: mesh.name,
    vertices: positions.length / 3,
    triangles: indices.length / 3,
    topCaps,
    bottomCaps,
    height: component.height,
    signedVolume,
    closedManifold: true,
  });
}

for (const [relative, expectedHash] of Object.entries(provenance.filesSha256)) {
  const vendor = await readFile(
    new URL("../vendor/three/" + relative, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(vendor).digest("hex"),
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
assert.equal(loadedMeshes.length, 2, "Only two original objects");
assert.equal(loaded.scene.children.length, 2);
for (const component of outline.shapes) {
  const mesh = loaded.scene.getObjectByName(component.name);
  assert.equal(mesh.parent, loaded.scene, "Original body is a scene root");
  assert.ok(!loaded.scene.getObjectByName(component.name + "_Inner"));
  const material = mesh.material;
  assert.ok(material.isMeshPhysicalMaterial);
  assert.equal(material.transmission, 1);
  assert.equal(material.opacity, 1);
  assert.equal(material.metalness, 0);
  assert.equal(material.roughness, 0.045);
  assert.equal(material.thickness, 0.45);
  assert.equal(material.attenuationDistance, 8);
  assert.equal(material.ior, 1.28);
  assert.equal(material.userData.sourceBrandColorSRGB, component.color);
  assert.equal(material.side, DoubleSide);
  assert.ok(material.attenuationColor.equals(new Color("#ffffff")));
  assert.ok(mesh.geometry.getAttribute("uv"));
}
console.log(
  JSON.stringify(
    {
      valid: true,
      bytes: glb.length,
      meshCount: 2,
      threeVersion: provenance.version,
      meshes: details,
      closedPrisms: "passed",
      noInnerObjects: "passed",
      uvValidation: "passed",
      officialLoaderParse: "passed",
      vendorIntegrity: "passed",
      preservedFootprintGapUnits: outline.minimumFootprintGapUnits,
    },
    null,
    2,
  ),
);
