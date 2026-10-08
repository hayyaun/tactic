import { ShaderChunk, Vector3 } from "three";

const configuredMaterials = new WeakMap();
const shaderKey = "tactic-studio-box-reflections-r186-v1";

const projectionShader = /* glsl */ `
uniform vec3 studioReflectionBoxMin;
uniform vec3 studioReflectionBoxMax;
uniform vec3 studioReflectionCapturePosition;
varying vec3 vStudioReflectionWorldPosition;

vec3 studioReflectionDirection( const in vec3 worldDirection ) {
  vec3 position = vStudioReflectionWorldPosition;
  if ( any( lessThan( position, studioReflectionBoxMin ) ) ||
       any( greaterThan( position, studioReflectionBoxMax ) ) ) {
    return worldDirection;
  }

  vec3 ray = normalize( worldDirection );
  vec3 positive = step( vec3( 0.0 ), ray );
  vec3 safeRay = ( positive * 2.0 - 1.0 ) * max( abs( ray ), vec3( 0.000001 ) );
  vec3 boundary = mix( studioReflectionBoxMin, studioReflectionBoxMax, positive );
  vec3 distances = ( boundary - position ) / safeRay;
  float distance = min( min( distances.x, distances.y ), distances.z );
  vec3 intersection = position + ray * max( distance, 0.0 );
  return normalize( intersection - studioReflectionCapturePosition );
}
`;

function copyVector(value, label) {
  const vector = value?.isVector3
    ? value.clone()
    : new Vector3().fromArray(value ?? []);
  if (![vector.x, vector.y, vector.z].every(Number.isFinite)) {
    throw new TypeError(`${label} must contain three finite coordinates.`);
  }
  return vector;
}

/**
 * Add finite-probe parallax to the existing physical environment reflection.
 * Bounds and capturePosition use world coordinates; capturePosition must match
 * PMREMGenerator.fromScene(..., { position: capturePosition }). No extra passes
 * or textures are allocated. Transmission and the material's BRDF stay intact.
 */
export function configureStudioReflections(
  material,
  { boxMin, boxMax, capturePosition },
) {
  if (!material?.isMeshPhysicalMaterial) {
    throw new TypeError("Studio reflections require a MeshPhysicalMaterial.");
  }

  const minimum = copyVector(boxMin, "boxMin");
  const maximum = copyVector(boxMax, "boxMax");
  const capture = copyVector(capturePosition, "capturePosition");
  for (const axis of ["x", "y", "z"]) {
    if (minimum[axis] >= maximum[axis]) {
      throw new RangeError("Studio reflection bounds must have positive size.");
    }
    if (capture[axis] <= minimum[axis] || capture[axis] >= maximum[axis]) {
      throw new RangeError("The reflection capture must be inside the studio.");
    }
  }

  const existing = configuredMaterials.get(material);
  if (existing) {
    existing.studioReflectionBoxMin.value.copy(minimum);
    existing.studioReflectionBoxMax.value.copy(maximum);
    existing.studioReflectionCapturePosition.value.copy(capture);
    return material;
  }

  const uniforms = {
    studioReflectionBoxMin: { value: minimum },
    studioReflectionBoxMax: { value: maximum },
    studioReflectionCapturePosition: { value: capture },
  };
  const previousCompile = material.onBeforeCompile;
  const previousCacheKey = material.customProgramCacheKey();
  const reflectionMarker =
    "reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );";
  if (!ShaderChunk.envmap_physical_pars_fragment.includes(reflectionMarker)) {
    throw new Error("The installed Three.js reflection shader has changed.");
  }

  const environmentShader = ShaderChunk.envmap_physical_pars_fragment.replace(
    reflectionMarker,
    `${reflectionMarker}\n\t\t\treflectVec = studioReflectionDirection( reflectVec );`,
  );

  material.onBeforeCompile = function (shader, renderer) {
    previousCompile.call(this, shader, renderer);
    if (
      !shader.vertexShader.includes("#include <worldpos_vertex>") ||
      !shader.fragmentShader.includes(
        "#include <envmap_physical_pars_fragment>",
      )
    ) {
      throw new Error("The installed Three.js physical shader has changed.");
    }
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vStudioReflectionWorldPosition;",
      )
      .replace(
        "#include <worldpos_vertex>",
        `#include <worldpos_vertex>
#ifdef USE_ENVMAP
  vStudioReflectionWorldPosition = worldPosition.xyz;
#else
  vStudioReflectionWorldPosition = vec3( 0.0 );
#endif`,
      );
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <envmap_physical_pars_fragment>",
      `${projectionShader}\n${environmentShader}`,
    );
  };
  material.customProgramCacheKey = () => `${previousCacheKey}|${shaderKey}`;
  material.needsUpdate = true;
  configuredMaterials.set(material, uniforms);
  return material;
}
