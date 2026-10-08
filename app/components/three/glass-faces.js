import * as THREE from "three";

function topCapOutline(geometry, topY) {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = source.getAttribute("position");
  const normal = source.getAttribute("normal");
  const capPositions = [];
  for (let index = 0; index < position.count; index += 3) {
    const topCap = [0, 1, 2].every((offset) => {
      const vertex = index + offset;
      return (
        normal.getY(vertex) > 0.999 &&
        Math.abs(position.getY(vertex) - topY) < 0.00001
      );
    });
    if (!topCap) continue;
    for (let offset = 0; offset < 3; offset++) {
      const vertex = index + offset;
      capPositions.push(
        position.getX(vertex),
        position.getY(vertex),
        position.getZ(vertex),
      );
    }
  }
  const cap = new THREE.BufferGeometry();
  cap.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(capPositions, 3),
  );
  const outline = new THREE.EdgesGeometry(cap, 25);
  cap.dispose();
  if (source !== geometry) source.dispose();
  return outline;
}

function structuralSegments(geometry) {
  const { min, max } = geometry.boundingBox;
  const height = max.y - min.y;
  const creases = new THREE.EdgesGeometry(geometry, 25);
  const capOutline = topCapOutline(geometry, max.y);
  const segments = [];
  for (const [source, role] of [
    [creases, "crease"],
    [capOutline, "rim"],
  ]) {
    const position = source.getAttribute("position");
    for (let index = 0; index < position.count; index += 2) {
      const a = [
        position.getX(index),
        position.getY(index),
        position.getZ(index),
      ];
      const b = [
        position.getX(index + 1),
        position.getY(index + 1),
        position.getZ(index + 1),
      ];
      // Retain the six long structural creases, excluding tiny bevel facets.
      if (role === "crease" && Math.abs(a[1] - b[1]) < height * 0.5) continue;
      segments.push({ a, b, role });
      if (role === "rim") {
        // A line through the top suggests thickness; it is not an inner object.
        segments.push({
          a: [a[0], a[1] - 0.1, a[2]],
          b: [b[0], b[1] - 0.1, b[2]],
          role: "inset",
        });
      }
    }
    source.dispose();
  }
  return segments;
}

function edgeGeometry(segments, rear) {
  const positions = [],
    colors = [];
  const stops = [0, 0.12, 0.5, 0.88, 1];
  const alphaByRole = rear
    ? { crease: 0.25, rim: 0.35, inset: 0.65 }
    : { crease: 0.3, rim: 0.7, inset: 0 };
  for (const { a, b, role } of segments) {
    if (!alphaByRole[role]) continue;
    for (let index = 0; index < stops.length - 1; index++) {
      for (const fraction of [stops[index], stops[index + 1]]) {
        positions.push(
          ...a.map((value, axis) => value + (b[axis] - value) * fraction),
        );
        // The endpoint floor keeps connected corners continuous. No height-based
        // white wash: physical bevels and the environment provide the bright light.
        const endpointFade = 0.4 + 0.6 * Math.sin(Math.PI * fraction);
        colors.push(1, 1, 1, alphaByRole[role] * endpointFade);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function edgeMaterial(rear) {
  return new THREE.LineBasicMaterial({
    color: "#f3f7f2",
    vertexColors: true,
    transparent: true,
    opacity: rear ? 0.08 : 0.35,
    depthTest: !rear,
    depthWrite: false,
    dithering: true,
    toneMapped: false,
  });
}

// Lightweight contours only. The physical GLB material owns all face reflections.
export function createGlassEdges(geometry) {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  const segments = structuralSegments(geometry);
  const rearEdges = new THREE.LineSegments(
    edgeGeometry(segments, true),
    edgeMaterial(true),
  );
  rearEdges.name = "TACTIC_Rear_Glass_Contours";
  rearEdges.userData.role = "rear-glass-edges";
  rearEdges.userData.topContourInset = 0.1;
  // A faint depth-free contour stays visible through the front glass surface.
  rearEdges.renderOrder = 4;
  const frontEdges = new THREE.LineSegments(
    edgeGeometry(segments, false),
    edgeMaterial(false),
  );
  frontEdges.name = "TACTIC_Front_Glass_Contours";
  frontEdges.userData.role = "front-glass-edges";
  frontEdges.renderOrder = 5;
  return { frontEdges, rearEdges };
}
