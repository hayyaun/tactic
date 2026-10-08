import * as THREE from "three";
import { createGlassEdges } from "./glass-faces.js";
import { createStudioEnvironment } from "./studio-lighting.js";
import { configureStudioReflections } from "./studio-reflections.js";

export function setupScene(
  renderer,
  scene,
  camera,
  model,
  sculpture,
  stage,
  hero,
  invalidate,
) {
  const canvas = renderer.domElement;
  const controller = new AbortController();
  const { signal } = controller;
  canvas.addEventListener(
    "webglcontextlost",
    () => {
      stage.dataset.state = "fallback";
    },
    { signal },
  );
  canvas.addEventListener(
    "webglcontextrestored",
    () => {
      stage.dataset.state = "ready";
      invalidate();
    },
    { signal },
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const originalResources = [];
  model.traverse((object) => {
    if (!object.isMesh) return;
    originalResources.push({
      object,
      geometry: object.geometry,
      material: object.material,
    });
    object.geometry = object.geometry.clone();
    object.material = object.material.clone();
  });
  // Preserve fine glass rims when the preview is viewed at a reduced zoom.
  renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1), 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.transmissionResolutionScale = 1;

  scene.background = new THREE.Color("#101211");

  // Tall walls and a forward tilt reveal the broad faces in the concept reference.
  // The parallel view keeps both original logo footprints at equal scale.
  camera.position.set(4, 36, 55);
  camera.lookAt(0, 6.45, 0);

  const studio = createStudioEnvironment(renderer);
  const { environment } = studio;
  scene.environment = environment.texture;
  scene.environmentIntensity = 1;

  sculpture.position.set(0, 0, 0);
  sculpture.rotation.set(0, 0, 0);
  model.position.set(0, 0, 0);
  model.rotation.set(0, 0, 0);
  sculpture.updateMatrixWorld(true);
  const modelBounds = new THREE.Box3().setFromObject(model);
  const centerY = (modelBounds.min.y + modelBounds.max.y) / 2;
  sculpture.position.y = centerY;
  sculpture.rotation.x = THREE.MathUtils.degToRad(12);
  model.position.y = -centerY;
  sculpture.updateMatrixWorld(true);
  const floorOffset = Math.max(
    0,
    -new THREE.Box3().setFromObject(sculpture).min.y,
  );
  sculpture.position.y += floorOffset;
  camera.position.y += floorOffset;
  camera.lookAt(0, 6.45 + floorOffset, 0);
  const pickableMeshes = [];
  const hoverBodies = [];
  const glassProperties = [];
  // Collect the original geometry first; overlays must never enter this traversal.
  model.traverse((object) => {
    if (object.isMesh) pickableMeshes.push(object);
  });
  for (const object of pickableMeshes) {
    // Preserve the GLB's clear transmission and refraction settings.
    // Opaque shadow maps would incorrectly block all light through the glass.
    object.castShadow = false;
    object.receiveShadow = false;
    object.material.dithering = true;
    configureStudioReflections(object.material, studio);
    // Keep the thin rim lines in front of the coplanar glass depth surface.
    object.material.polygonOffset = true;
    object.material.polygonOffsetFactor = 1;
    object.material.polygonOffsetUnits = 1;
    glassProperties.push({
      transmission: object.material.transmission,
      thickness: object.material.thickness,
      ior: object.material.ior,
      attenuationDistance: object.material.attenuationDistance,
    });
    const { frontEdges, rearEdges } = createGlassEdges(object.geometry);
    object.add(rearEdges, frontEdges);
    hoverBodies.push({
      mesh: object,
      materials: [object.material],
      edges: object.children.filter(
        (child) => child.isLineSegments && child.renderOrder === 5,
      ),
      tint: new THREE.Color(
        object.name.includes("Rear") ? "#07351b" : "#400e18",
      ),
      amount: 0,
    });
  }
  stage.dataset.tiltAxis = "x";
  stage.dataset.tiltDegrees = "12";
  stage.dataset.renderQuality = "full-resolution-transmission";
  stage.dataset.meshes = String(pickableMeshes.length);
  stage.dataset.bodies = String(pickableMeshes.length);
  stage.dataset.innerLayers = "0";
  stage.dataset.faceTexture = "none";
  stage.dataset.edgeTexture = "none";
  stage.dataset.edgeTreatment = "physical-bevels-and-faint-contours";
  stage.dataset.environment = "finite-studio-reflections";
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
  let renderCount = 0;

  function renderScene() {
    renderer.render(scene, camera);
    stage.dataset.renderCount = String(++renderCount);
  }

  function needsFrame() {
    return (
      Math.abs(model.rotation.y - pointerYaw) > 0.0001 ||
      hoverBodies.some(
        (body) => body.amount !== (body.mesh === hoveredMesh ? 1 : 0),
      )
    );
  }

  function requestRender() {
    if (!visible || document.hidden) return;
    if (reducedMotion.matches) {
      model.rotation.y = 0;
      updateGlass(true);
      renderScene();
    } else if (!frame && needsFrame()) {
      lastFrame = performance.now();
      stage.dataset.renderState = "active";
      frame = 1;
      invalidate();
    }
  }

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
    // Sub-pixel luminance noise breaks up 8-bit banding in the gentle side glows.
    const lightField = context.getImageData(
      0,
      0,
      backdrop.width,
      backdrop.height,
    );
    for (let index = 0; index < lightField.data.length; index += 4) {
      const noise = ((((index * 13) ^ (index >>> 8)) % 7) - 3) * 0.24;
      for (let channel = 0; channel < 3; channel++) {
        lightField.data[index + channel] += noise;
      }
    }
    context.putImageData(lightField, 0, 0);
    // Use the same light field in CSS and the transmission background, without seams.
    hero.style.backgroundImage = `url(${backdrop.toDataURL()})`;
    hero.style.backgroundSize = "100% 100%";
    const sceneBackdrop = document.createElement("canvas");
    sceneBackdrop.width = Math.max(1, Math.round(artBounds.width));
    sceneBackdrop.height = Math.max(1, Math.round(artBounds.height));
    // CSS stretches the rounded bitmap to fractional layout dimensions.
    // Convert the crop back to bitmap pixels so both backgrounds sample alike.
    const backdropScaleX = backdrop.width / heroBounds.width;
    const backdropScaleY = backdrop.height / heroBounds.height;
    sceneBackdrop
      .getContext("2d")
      .drawImage(
        backdrop,
        (artBounds.left - heroBounds.left) * backdropScaleX,
        (artBounds.top - heroBounds.top) * backdropScaleY,
        artBounds.width * backdropScaleX,
        artBounds.height * backdropScaleY,
        0,
        0,
        sceneBackdrop.width,
        sceneBackdrop.height,
      );
    backgroundTexture?.dispose();
    backgroundTexture = new THREE.CanvasTexture(sceneBackdrop);
    backgroundTexture.colorSpace = THREE.SRGBColorSpace;
    backgroundTexture.generateMipmaps = false;
    backgroundTexture.minFilter = THREE.LinearFilter;
    scene.background = backgroundTexture;
  }

  function pickBody() {
    hoveredMesh = null;
    if (pointerInside) {
      model.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickableMeshes, false)[0]?.object;
      hoveredMesh = hit ?? null;
    }
    stage.dataset.hover = hoveredMesh?.name ?? "none";
  }

  function updateGlass(immediate = false, delta = 1 / 30) {
    for (const body of hoverBodies) {
      const target = body.mesh === hoveredMesh ? 1 : 0;
      body.amount = immediate
        ? target
        : THREE.MathUtils.damp(body.amount, target, 1.1, delta);
      if (Math.abs(body.amount - target) < 0.001) body.amount = target;
      for (const material of body.materials) {
        material.attenuationColor
          .copy(clearColor)
          .lerp(body.tint, body.amount * 0.38);
        material.color.copy(clearColor).lerp(body.tint, body.amount * 0.12);
      }
      for (const edges of body.edges) {
        edges.material.color
          .copy(edgeColor)
          .lerp(body.tint, body.amount * 0.12);
      }
    }
    stage.dataset.hoverStrength = JSON.stringify(
      hoverBodies.map((body) => Math.round(body.amount * 1000) / 1000),
    );
  }

  function clearHover() {
    pointerInside = false;
    pointerYaw = 0;
    pickBody();
    if (!visible || document.hidden) {
      model.rotation.y = 0;
      updateGlass(true);
    } else {
      requestRender();
    }
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
    // Canvas owns renderer size and DPR.
    updateBackground();
    pointerInside = false;
    pointerYaw = 0;
    model.rotation.y = 0;
    pickBody();
    updateGlass(true);
    renderScene();

    // Record projected mesh bounds for checking copy clearance and framing.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const vertex = new THREE.Vector3();
    model.updateMatrixWorld(true);
    model.traverse((object) => {
      if (!pickableMeshes.includes(object)) return;
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
      stage.dataset.renderState = "idle";
      return;
    }
    // Render only while pointer movement or the slow hover fade changes the scene.
    if (time - lastFrame >= 1000 / 30) {
      const delta = Math.min((time - lastFrame) / 1000, 0.1);
      model.rotation.y = THREE.MathUtils.damp(
        model.rotation.y,
        pointerYaw,
        2,
        delta,
      );
      if (Math.abs(model.rotation.y - pointerYaw) < 0.0001) {
        model.rotation.y = pointerYaw;
      }
      pickBody();
      updateGlass(false, delta);
      renderScene();
      lastFrame = time;
    }
    if (needsFrame()) {
      frame = 1;
      invalidate();
    } else {
      frame = 0;
      stage.dataset.renderState = "idle";
    }
  }

  function syncMotion() {
    frame = 0;
    stage.dataset.renderState = "idle";
    if (reducedMotion.matches) {
      model.rotation.y = 0;
      pickBody();
      updateGlass(true);
      if (visible && !document.hidden) renderScene();
    } else if (visible && !document.hidden) {
      renderScene();
      requestRender();
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) clearHover();
    syncMotion();
  });
  visibilityObserver.observe(stage);
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) clearHover();
      syncMotion();
    },
    { signal },
  );
  reducedMotion.addEventListener("change", syncMotion, { signal });
  hero.addEventListener(
    "pointermove",
    (event) => {
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
      pointerYaw =
        pointerInside && !reducedMotion.matches ? (x - 0.5) * 0.08 : 0;
      pickBody();
      requestRender();
    },
    { signal },
  );
  hero.addEventListener("pointerleave", clearHover, { signal });
  hero.addEventListener("pointercancel", clearHover, { signal });
  window.addEventListener("blur", clearHover, { signal });
  window.addEventListener(
    "scroll",
    () => {
      if (pointerInside || hoveredMesh) clearHover();
    },
    { passive: true, signal },
  );

  resize();
  stage.dataset.state = "ready";
  syncMotion();

  function dispose() {
    controller.abort();
    frame = 0;
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    environment.dispose();
    backgroundTexture?.dispose();
    const geometries = new Set();
    const materials = new Set();
    sculpture.traverse((object) => {
      if (!object.geometry) return;
      geometries.add(object.geometry);
      materials.add(object.material);
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const { object, geometry, material } of originalResources) {
      object.geometry = geometry;
      object.material = material;
      for (const child of [...object.children]) {
        if (
          child.userData.role === "rear-glass-edges" ||
          child.userData.role === "front-glass-edges"
        )
          object.remove(child);
      }
    }
    scene.environment = null;
    scene.background = null;
    hero.style.backgroundImage = "";
    stage.dataset.state = "loading";
  }
  return {
    dispose,
    tick(time) {
      if (frame) animate(time);
      else if (visible && !document.hidden) renderScene();
    },
  };
}
