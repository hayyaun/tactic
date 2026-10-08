import * as THREE from "three";

const smooth = (low, high, value) =>
  THREE.MathUtils.smoothstep(value, low, high);

// These are luminous studio panels, baked into a single reflection probe.
// The glass itself has no face map or overlaid highlight geometry.
export function createStudioEnvironment(renderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color("#0c0e0d");
  const boxMin = new THREE.Vector3(-7, -7, -9);
  const boxMax = new THREE.Vector3(7, 13, 9);
  const capturePosition = new THREE.Vector3(0, 3.3, 0);

  function addPanel(width, height, position, target, radiance) {
    const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
    const uv = geometry.getAttribute("uv");
    const colors = [];
    for (let vertex = 0; vertex < uv.count; vertex++) {
      const u = uv.getX(vertex);
      const v = uv.getY(vertex);
      const energy = radiance(u, v);
      colors.push(energy, energy, energy);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const panel = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    panel.position.copy(position);
    panel.lookAt(target);
    room.add(panel);
  }

  // Opposite falloffs create long light-to-clear transitions, not round spots.
  const sideTarget = new THREE.Vector3(0, 3, 0);
  addPanel(18, 20, new THREE.Vector3(-7, 3, 0), sideTarget, (u, v) => {
    const spread = smooth(0.02, 0.22, u) * (1 - smooth(0.78, 0.98, u));
    return 0.015 + 2.2 * spread * (1 - smooth(0.18, 0.48, v));
  });
  addPanel(18, 20, new THREE.Vector3(7, 3, 0), sideTarget, (u, v) => {
    // Offset the card beyond the broad front-wall reflection; retain edge glints.
    const strip = smooth(0.58, 0.62, u) * (1 - smooth(0.65, 0.69, u));
    const lengthFade = smooth(0.12, 0.45, v) * (1 - smooth(0.8, 1, v));
    return 0.005 + 5.5 * strip * lengthFade;
  });
  addPanel(14, 18, new THREE.Vector3(0, 13, 0), capturePosition, (u, v) => {
    const lengthFade = smooth(0.02, 0.18, v) * (1 - smooth(0.82, 0.98, v));
    const strip = smooth(0.51, 0.56, u) * (1 - smooth(0.62, 0.69, u));
    return 0.005 + 4.8 * strip * lengthFade;
  });
  // A high strip in front catches the bevels without washing out the side walls.
  addPanel(14, 20, new THREE.Vector3(0, 3, 9), sideTarget, (u, v) => {
    const upperStrip = smooth(0.56, 0.63, v) * (1 - smooth(0.7, 0.77, v));
    return 0.005 + 6.25 * upperStrip * (0.6 + 0.4 * smooth(0.3, 0.7, u));
  });

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.025, 0.1, 100, {
    position: capturePosition,
    size: 256,
  });
  room.traverse((object) => {
    object.geometry?.dispose();
    object.material?.dispose();
  });
  pmrem.dispose();
  return { environment, boxMin, boxMax, capturePosition };
}
