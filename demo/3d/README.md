# TACTIC logo model

`../assets/tactic-mark.glb` is a genuine indexed glTF 2.0 binary model with two
beveled meshes, each a solid closed prism. The six-corner footprints are traced
from the two actual white shapes in the original `assets/1.jpg`; the demo SVG is
not used. The vertical prisms echo the architecture in `assets/5.png` and the glass reference
`assets/example-hero-object-from-logo.jpg`.

The model uses Y-up coordinates. Image X maps to X; image Y maps to Z, so the upper
rear shape is at negative Z. Both parts share the original relative position and
uniform scale. The footprint is 4 by approximately 5.412 units. Both forms are
6.6 units high and based at Y=0, balancing the original pair's nearly equal
footprints. These heights are interpreted rather than source measurements. The
minimum traced footprint gap remains approximately 0.36681 units, or 9.17% of the
overall width. No individual translation or independent centering is applied.
An inward 0.03-unit bevel preserves the exterior footprint.

The traced rear and front widths are both 3.972973 units, while their depths are
2.918919 and 2.908784 units. Their footprint areas are 5.020076 and 4.996519 square
units: the front is only 0.47% smaller. Both have approximately 1.14-unit strokes
and corresponding long outside edges of approximately 3.262 units. No perspective
scaling is baked into the geometry.

The scene has two root meshes, `TACTIC_Green_Rear` and `TACTIC_Red_Front`, at
mesh/node indices 0 and 1. Each prism has its own glass material for body-wide
hover.
The nodes have no individual transform that changes the original footprint.

Each mesh has indexed triangles, positions, normals, and `TEXCOORD_0`, and is
independently a closed, consistently wound manifold with positive signed volume.
Normals point outward, with top caps facing +Y and bottom caps facing -Y.
Wall UV U follows horizontal distance along each straight segment, normalized
to that segment; V is Y/6.6 so face fades share a height coordinate. Cap UVs use
the original footprint's planar XZ bounds. These UVs are available for the
hero's separate white-to-transparent face overlay.

PBR materials are glass: metalness 0, roughness 0.045,
transmission 1, opacity 1, and IOR 1.28. `KHR_materials_transmission`,
`KHR_materials_volume`, and `KHR_materials_ior` encode these properties in the GLB.
The surface base color and volume attenuation are both neutral white, producing
clear glass that preserves the color of incoming light. Original brand colors
`#16913b` and `#d61932` remain in material extras for the hero's green/rear and
red/front hover effect. Scene lights and reflections can tint the clear glass
independently. Thickness 0.45 and attenuation distance 8 provide an optical
approximation for the real-time renderer, rather than exact ray traversal through
the tall geometry. `alphaMode` remains `OPAQUE`: transmission handles optical transparency,
while opacity keeps the physical surface fully present. `doubleSided` renders
both sides of each surface. No textures or external buffers are required.

The hero's scene background and reflection lighting influence glass appearance.
Three.js screen-space transmission approximates glass viewed through another
glass object; exact multilayer refraction and caustics require a different
rendering approach.

## Reproduce and validate

From the project root, using the existing Python environment with Pillow, NumPy
and SciPy, and Node.js:

```sh
python3 demo/3d/vendor-three.py
python3 demo/3d/extract-outline.py
node demo/3d/generate-logo.mjs
node demo/3d/validate-logo.mjs
```

The vendor script downloads the pinned official Three.js 0.186.1 npm tarball into
a temporary directory, verifies its SHA-512 package integrity, and copies only
the needed files. It does not install dependencies into the application.
`demo/vendor/three/provenance.json` records the tarball and each copied file hash.
Vendor files remain unchanged and retain their MIT license.

The validator checks binary structure, accessor bounds and alignment, indices,
finite coordinates and UVs, unit normals, triangle winding, non-degenerate
triangles, cap directions and heights, two independently closed manifolds,
positive signed volumes, unchanged source footprint and gap, encoded/runtime
glass properties, vendored source hashes, and parsing with the actual official
GLTFLoader. It imports RoomEnvironment and Reflector to ensure their complete
local dependency chains resolve. Browser rendering is
validated by the hero integration separately.

## Browser imports

```html
<script type="importmap">
  {
    "imports": {
      "three": "./vendor/three/build/three.module.js",
      "three/addons/": "./vendor/three/examples/jsm/"
    }
  }
</script>
```

```js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Reflector } from "three/addons/objects/Reflector.js";
```

The nested official addon structure is preserved, including GLTFLoader's
`../utils/BufferGeometryUtils.js` and `../utils/SkeletonUtils.js` imports.
