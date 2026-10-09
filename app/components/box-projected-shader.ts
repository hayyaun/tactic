type ShaderSource = { vertexShader: string; fragmentShader: string };

// These anchors belong to Drei 10.7.9 and Three r186. Fail explicitly when an
// upgrade changes their shader layout instead of silently dropping corrections.
function guarded(source: string) {
  const replace = (anchor: string, replacement: string, all = false) => {
    if (!source.includes(anchor)) {
      throw new Error(
        `Box-projected shader is incompatible: missing ${JSON.stringify(anchor)}. Review the Three/Drei adapter before upgrading.`,
      );
    }
    source = all
      ? source.replaceAll(anchor, replacement)
      : source.replace(anchor, replacement);
    return api;
  };
  const api = {
    replace: (anchor: string, replacement: string) =>
      replace(anchor, replacement),
    replaceAll: (anchor: string, replacement: string) =>
      replace(anchor, replacement, true),
    source: () => source,
  };
  return api;
}

export function adaptBoxProjectedShader(shader: ShaderSource) {
  // Namespace Drei 10.7.9's varying: Three r186 also declares
  // vWorldPosition for transmission. Preserve both shader paths.
  shader.vertexShader = guarded(shader.vertexShader)
    .replace("varying vec3 vWorldPosition;", "varying vec3 vBoxWorldPosition;")
    .replace(
      "#ifdef BOX_PROJECTED_ENV_MAP\n    vWorldPosition =",
      "#ifdef BOX_PROJECTED_ENV_MAP\n    vBoxWorldPosition =",
    )
    .source();
  shader.fragmentShader = guarded(shader.fragmentShader)
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
    )
    .source();
}
