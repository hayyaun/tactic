# TACTIC logo model

`../assets/tactic-mark.glb` is a genuine indexed glTF 2.0 binary model with two
beveled meshes. The six-corner footprints are traced from the two actual white
shapes in the original `assets/1.jpg`; the demo SVG is not used. The taller green
rear and shorter red front echo the architecture in `assets/5.png`.

The model uses Y-up coordinates. Image X maps to X; image Y maps to Z, so the upper
green shape is at negative Z. Both parts share the original relative position and
uniform scale. The footprint is 4 by approximately 5.412 units. The green form is
4.6 units high, the red form is 4.3 units high, and both are based at Y=0. Their
near-level tops echo `assets/example-hero-object-from-logo.jpg`; the reference is
an illustration, so these heights are interpreted rather than measured. The
minimum traced footprint gap remains approximately 0.36681 units, or 9.17% of the
overall width. No individual translation or independent centering is applied.
An inward 0.03-unit bevel preserves the exterior footprint.

Each mesh has indexed triangles, positions and normals, and forms a closed,
consistently wound volume. PBR materials are glass: metalness 0, roughness 0.10,
transmission 1, opacity 1, and IOR 1.5. `KHR_materials_transmission`,
`KHR_materials_volume`, and `KHR_materials_ior` encode these properties in the GLB.
The surface base color is neutral white; green `#0e713b` and crimson `#a70716`
attenuation colors tint the light within the volume instead of filtering it a
second time at the boundary. These CSS colors are converted to linear RGB for
glTF. Thickness 0.9 and attenuation distance 3 provide an optical approximation
for the real-time renderer, rather than exact ray traversal through the tall
geometry. `alphaMode` remains `OPAQUE`: transmission handles optical transparency,
while opacity keeps the physical surface fully present. `doubleSided` lets the
Three.js transmission pass draw the reverse glass boundary for visible interior
edges. No textures or external buffers are required.

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
finite coordinates, unit normals, triangle winding, non-degenerate triangles,
cap directions and heights, closed manifold edges, unchanged source footprint and
gap, encoded/runtime glass properties, vendored source hashes, and parsing
with the actual official GLTFLoader. It imports RoomEnvironment and Reflector to
ensure their complete local dependency chains resolve. Browser rendering is
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
