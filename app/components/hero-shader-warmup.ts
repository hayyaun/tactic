import {
  BackSide,
  DoubleSide,
  Mesh,
  MeshPhysicalMaterial,
  NoToneMapping,
  WebGLRenderTarget,
  type Camera,
  type Scene,
  type WebGLRenderer,
} from "three";

export async function warmHeroShaders(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  cancelled: () => boolean,
) {
  await renderer.compileAsync(scene, camera);
  if (cancelled()) return;

  // r186's transmission pass renders BackSide glass into a linear target with
  // tone mapping disabled. The ordinary scene compile omits these variants.
  const glass = new Set<MeshPhysicalMaterial>();
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    for (const material of materials)
      if (
        material instanceof MeshPhysicalMaterial &&
        material.transmission > 0 &&
        material.side === DoubleSide
      )
        glass.add(material);
  });
  if (!glass.size) return;
  const target = renderer.getRenderTarget();
  const cubeFace = renderer.getActiveCubeFace();
  const mipLevel = renderer.getActiveMipmapLevel();
  const toneMapping = renderer.toneMapping;
  const transmission = new WebGLRenderTarget(1, 1);
  let pending: ReturnType<WebGLRenderer["compileAsync"]>;
  try {
    renderer.setRenderTarget(transmission);
    renderer.toneMapping = NoToneMapping;
    for (const material of glass) {
      material.side = BackSide;
      material.needsUpdate = true;
    }
    pending = renderer.compileAsync(scene, camera);
  } finally {
    for (const material of glass) {
      material.side = DoubleSide;
      material.needsUpdate = true;
    }
    renderer.setRenderTarget(target, cubeFace, mipLevel);
    renderer.toneMapping = toneMapping;
    transmission.dispose();
  }
  // Only program completion is asynchronous; never leave renderer/material
  // state changed while waiting or while a restored scene starts its warmup.
  await pending;
  if (!cancelled()) await renderer.compileAsync(scene, camera);
}
