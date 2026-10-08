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
  scene.background = new THREE.Color("#101211");

  // Neutral studio panels define the clear glass; side lights belong to the stage.
  const room = new RoomEnvironment();
  room.traverse((object) => {
    if (object.material?.isMeshStandardMaterial) {
      object.material.color.set("#232524");
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
  camera.position.set(4, 30, 55);
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

  const greenLight = new THREE.DirectionalLight("#80e650", 2.2);
  greenLight.position.set(-6, 5, 2);
  scene.add(greenLight);
  const redLight = new THREE.DirectionalLight("#ff2c4b", 2);
  redLight.position.set(6, 5, 2);
  scene.add(redLight);

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
        color: new THREE.Color(0.35, 0.35, 0.35),
        side: THREE.DoubleSide,
      }),
    );
    card.position.set(x, 2, -3.2);
    lightCards.add(card);
  }
  scene.add(lightCards);

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
  const pickableMeshes = [];
  const hoverBodies = [];
  const glassProperties = [];
  model.traverse((object) => {
    if (!object.isMesh) return;
    pickableMeshes.push(object);
    // Preserve the GLB's clear transmission and refraction settings.
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
    hoverBodies.push({
      mesh: object,
      edges,
      tint: new THREE.Color(object.material.userData.sourceBrandColorSRGB),
      amount: 0,
    });
  });
  scene.add(model);
  stage.dataset.meshes = String(pickableMeshes.length);
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
  let hoveredMesh = null;
  let pointerInside = false;
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const clearColor = new THREE.Color("#ffffff");
  const edgeColor = new THREE.Color("#f3f7f2");
  let backgroundTexture;

  function updateBackground() {
    const heroBounds = hero.getBoundingClientRect();
    const artBounds = stage.getBoundingClientRect();
    const backdrop = document.createElement("canvas");
    backdrop.width = Math.max(1, Math.round(heroBounds.width));
    backdrop.height = Math.max(1, Math.round(heroBounds.height));
    const context = backdrop.getContext("2d");
    context.fillStyle = "#101211";
    context.fillRect(0, 0, backdrop.width, backdrop.height);
    for (const [x, color] of [
      [-0.08, "128, 230, 80"],
      [1.08, "255, 44, 75"],
    ]) {
      const glow = context.createRadialGradient(
        x * backdrop.width,
        backdrop.height * 0.8,
        0,
        x * backdrop.width,
        backdrop.height * 0.8,
        backdrop.width * 0.65,
      );
      glow.addColorStop(0, `rgba(${color}, 0.32)`);
      glow.addColorStop(0.45, `rgba(${color}, 0.095)`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, backdrop.width, backdrop.height);
    }
    // Use the same light field in CSS and the transmission background, without seams.
    hero.style.backgroundImage = `url(${backdrop.toDataURL()})`;
    hero.style.backgroundSize = "100% 100%";
    const sceneBackdrop = document.createElement("canvas");
    sceneBackdrop.width = Math.max(1, Math.round(artBounds.width));
    sceneBackdrop.height = Math.max(1, Math.round(artBounds.height));
    sceneBackdrop
      .getContext("2d")
      .drawImage(
        backdrop,
        artBounds.left - heroBounds.left,
        artBounds.top - heroBounds.top,
        artBounds.width,
        artBounds.height,
        0,
        0,
        sceneBackdrop.width,
        sceneBackdrop.height,
      );
    backgroundTexture?.dispose();
    backgroundTexture = new THREE.CanvasTexture(sceneBackdrop);
    backgroundTexture.colorSpace = THREE.SRGBColorSpace;
    scene.background = backgroundTexture;
  }

  function pickBody() {
    hoveredMesh = null;
    if (pointerInside) {
      model.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      hoveredMesh =
        raycaster.intersectObjects(pickableMeshes, false)[0]?.object ?? null;
    }
    stage.dataset.hover = hoveredMesh?.name ?? "none";
  }

  function updateGlass(immediate = false) {
    for (const body of hoverBodies) {
      const target = body.mesh === hoveredMesh ? 1 : 0;
      body.amount = immediate
        ? target
        : THREE.MathUtils.lerp(body.amount, target, 0.14);
      if (Math.abs(body.amount - target) < 0.001) body.amount = target;
      body.mesh.material.attenuationColor
        .copy(clearColor)
        .lerp(body.tint, body.amount);
      body.mesh.material.emissive
        .copy(body.tint)
        .multiplyScalar(body.amount * 0.16);
      body.edges.material.color
        .copy(edgeColor)
        .lerp(body.tint, body.amount * 0.75);
      body.edges.material.opacity = 0.2 + body.amount * 0.22;
    }
    stage.dataset.hoverStrength = JSON.stringify(
      hoverBodies.map((body) => Math.round(body.amount * 1000) / 1000),
    );
  }

  function clearHover() {
    pointerInside = false;
    pointerYaw = 0;
    pickBody();
    updateGlass(true);
    renderer.render(scene, camera);
  }

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    const viewHeight = Math.max(3.6, (height / Math.max(width, 1)) * 4.7);
    const viewWidth = viewHeight * (width / Math.max(height, 1));
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    updateBackground();
    pointerInside = false;
    pickBody();
    updateGlass(true);
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
      pickBody();
      updateGlass();
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
      pickBody();
      updateGlass(true);
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
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearHover();
    syncMotion();
  });
  reducedMotion.addEventListener("change", syncMotion);
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pointerInside =
      x >= 0 &&
      x <= 1 &&
      y >= 0 &&
      y <= 1 &&
      !event.target.closest("a, button, nav");
    pointer.set(x * 2 - 1, 1 - y * 2);
    pointerYaw = reducedMotion.matches ? 0 : (x - 0.5) * 0.08;
    pickBody();
    if (reducedMotion.matches) {
      updateGlass(true);
      renderer.render(scene, camera);
    }
  });
  hero.addEventListener("pointerleave", clearHover);
  hero.addEventListener("pointercancel", clearHover);
  window.addEventListener("blur", clearHover);
  window.addEventListener(
    "scroll",
    () => {
      if (pointerInside || hoveredMesh) clearHover();
    },
    { passive: true },
  );

  resize();
  stage.dataset.state = "ready";
  syncMotion();

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    environment.dispose();
    backgroundTexture.dispose();
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
