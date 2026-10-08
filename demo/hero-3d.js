import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Reflector } from "three/addons/objects/Reflector.js";

const stage = document.querySelector(".hero-art");
const canvas = stage.querySelector(".hero-canvas");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

async function createScene() {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.transmissionResolutionScale = 0.75;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#f5f4ee");

  // Neutral studio panels produce real surface reflections without tinting the stage.
  const room = new RoomEnvironment();
  room.traverse((object) => {
    if (object.material?.isMeshStandardMaterial) {
      object.material.color.set("#303b33");
    }
  });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.85;
  room.dispose();
  pmrem.dispose();

  const camera = new THREE.OrthographicCamera(-5, 5, 3.2, -3.2, 0.1, 200);
  // A lower, parallel view pulls the logo halves together without changing 1.jpg.
  // Aim above their bases so the tall lower ends continue beyond the viewport.
  camera.position.set(4, 37.4, 55);
  camera.lookAt(0, 4.4, 0);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.75);
  keyLight.position.set(-4, 10, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.radius = 4;
  keyLight.shadow.blurSamples = 8;
  keyLight.shadow.camera.left = -7;
  keyLight.shadow.camera.right = 7;
  keyLight.shadow.camera.top = 7;
  keyLight.shadow.camera.bottom = -7;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.normalBias = 0.025;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.45);
  fillLight.position.set(5, 4, 1);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 2);
  rimLight.position.set(1, 6, -5);
  scene.add(rimLight);

  // Real luminous cards behind the glass are sampled by the transmission pass.
  // Their narrow profile gives the volume a clear light source to refract.
  const lightCards = new THREE.Group();
  for (const [x, width] of [
    [-1.6, 0.1],
    [1.3, 0.22],
  ]) {
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(width, 4),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(1.1, 1.1, 1.1),
        side: THREE.DoubleSide,
      }),
    );
    card.position.set(x, 2, -3.2);
    lightCards.add(card);
  }
  scene.add(lightCards);

  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floor = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshBasicMaterial({ color: "#f5f4ee", toneMapped: false }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.045;
  scene.add(floor);

  // A second camera renders the object into the floor reflection.
  const reflectionShader = {
    ...Reflector.ReflectorShader,
    uniforms: THREE.UniformsUtils.clone(Reflector.ReflectorShader.uniforms),
    fragmentShader: Reflector.ReflectorShader.fragmentShader.replace(
      "vec4( blendOverlay( base.rgb, color ), 1.0 )",
      "vec4( base.rgb, 0.1 )",
    ),
  };
  const reflection = new Reflector(new THREE.PlaneGeometry(24, 24), {
    textureWidth: 768,
    textureHeight: 768,
    multisample: 2,
    clipBias: 0.003,
    shader: reflectionShader,
  });
  reflection.rotation.x = -Math.PI / 2;
  reflection.position.y = -0.03;
  reflection.material.transparent = true;
  reflection.material.depthWrite = false;
  reflection.renderOrder = 1;
  scene.add(reflection);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    new THREE.ShadowMaterial({ color: "#253024", opacity: 0.13 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.015;
  shadow.receiveShadow = true;
  shadow.renderOrder = 2;
  scene.add(shadow);

  const gltf = await new GLTFLoader().loadAsync("assets/tactic-mark.glb");
  const model = gltf.scene;
  let meshes = 0;
  const glassProperties = [];
  model.traverse((object) => {
    if (!object.isMesh) return;
    meshes++;
    // Preserve the GLB's transmission, refraction, and colored volume settings.
    // Opaque shadow maps would incorrectly block all light through the glass.
    object.castShadow = false;
    object.receiveShadow = false;
    object.material.envMapIntensity = 1;
    glassProperties.push({
      transmission: object.material.transmission,
      thickness: object.material.thickness,
      ior: object.material.ior,
      attenuationDistance: object.material.attenuationDistance,
    });
    // Fine creases keep the glass boundaries readable against the pale stage.
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(object.geometry, 12),
      new THREE.LineBasicMaterial({
        color: "#f3f7f2",
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
      }),
    );
    object.add(edges);
  });
  scene.add(model);
  stage.dataset.meshes = String(meshes);
  stage.dataset.engine = `three-r${THREE.REVISION}`;
  stage.dataset.camera = "orthographic";
  stage.dataset.material = glassProperties.every(
    (material) => material.transmission === 1 && material.thickness > 0,
  )
    ? "transmissive-glass"
    : "opaque";
  stage.dataset.glass = JSON.stringify(glassProperties);

  let visible = true;
  let frame = 0;
  let lastFrame = 0;
  let pointerYaw = 0;

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    const viewHeight = Math.max(3.8, (height / Math.max(width, 1)) * 4.7);
    const viewWidth = viewHeight * (width / Math.max(height, 1));
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);

    // Record projected mesh bounds for checking copy clearance and framing.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const vertex = new THREE.Vector3();
    model.updateMatrixWorld(true);
    model.traverse((object) => {
      if (!object.isMesh) return;
      const positions = object.geometry.attributes.position;
      for (let index = 0; index < positions.count; index++) {
        vertex.fromBufferAttribute(positions, index);
        vertex.applyMatrix4(object.matrixWorld).project(camera);
        const x = ((vertex.x + 1) / 2) * width;
        const y = ((1 - vertex.y) / 2) * height;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    });
    stage.dataset.objectBounds = JSON.stringify(
      [minX, minY, maxX, maxY].map((value) => Math.round(value)),
    );
  }

  function animate(time) {
    if (!visible || document.hidden || reducedMotion.matches) {
      frame = 0;
      return;
    }
    // Slow, small changes let highlights move while the mark remains readable.
    if (time - lastFrame >= 1000 / 30) {
      model.rotation.y = THREE.MathUtils.lerp(
        model.rotation.y,
        pointerYaw + Math.sin(time * 0.00015) * 0.012,
        0.06,
      );
      renderer.render(scene, camera);
      lastFrame = time;
    }
    frame = requestAnimationFrame(animate);
  }

  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (reducedMotion.matches) {
      model.rotation.y = 0;
      renderer.render(scene, camera);
    } else if (visible && !document.hidden) {
      frame = requestAnimationFrame(animate);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncMotion();
  });
  visibilityObserver.observe(stage);
  document.addEventListener("visibilitychange", syncMotion);
  reducedMotion.addEventListener("change", syncMotion);
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    pointerYaw = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.1;
  });
  hero.addEventListener("pointerleave", () => {
    pointerYaw = 0;
  });

  resize();
  stage.dataset.state = "ready";
  syncMotion();

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    environment.dispose();
    reflection.dispose();
    scene.traverse((object) => {
      if (!object.geometry) return;
      object.geometry.dispose();
      object.material.dispose();
    });
    renderer.dispose();
  });
}

createScene().catch((error) => {
  stage.dataset.state = "fallback";
  console.warn(
    "TACTIC 3D scene could not load; showing the brand mark.",
    error,
  );
});
