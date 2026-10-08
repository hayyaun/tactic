# TACTIC — design demo

A standalone HTML/CSS/JavaScript direction for TACTIC, with a local Three.js renderer. Serve this folder so the browser can load its 3D model and modules:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory demo
```

From the repository root, open http://localhost:4173.

## Design direction

Dark and sculptural: a charcoal stage, ivory typography, and two clear glass towers, framed by green light on the left and red light on the right. Centered desktop copy sits above the upper faces; the tall lower ends extend beyond the viewport. The actual white silhouette in `assets/1.jpg` supplies the two nearly identical base footprints, extruded upward with beveled edges into `assets/tactic-mark.glb`. Both forms are 6.6 units tall with a shared 12-degree X tilt around their midpoint. Their close composition follows `assets/example-hero-object-from-logo.jpg`. The orthographic camera preserves the original base spacing and equal scale. Physical transmission, neutral studio reflections, and side lights define the surfaces. There are no painted face textures or highlight overlays: finite-probe environment reflections create long transitions between light and clear glass. Refraction renders at full resolution, device pixel ratio stays between 1 and 2, and subtle luminance dithering smooths the side glows. The floating header stays visible from the start; the favicon uses both original brand colors.

The reflection environment uses bright, narrow strips on the right, above, and in front of the glass, against a nearly dark field. Their concentrated highlights replace the broad grey wash; the softer left panel retains the long fade. The direct white key is restrained so the environment defines the reflective surfaces.

The abilities section takes composition inspiration from `assets/example-section.jpg`, with original TACTIC concept boards for brand and design, web and app design/development, and AI advertising films. The three brand explorations use supplied artwork. All boards are studio concepts; they are not client projects. Studio and capabilities text is draft copy for design review.

## Interactions

- Always-visible floating navigation, responsive menu, section links, and back-to-top link.
- Subtle 3D parallax and hover fades render on demand, capped at 30 frames per second during transitions. Rendering stops entirely when the scene settles, is offscreen, or the page is hidden. No nested glass meshes or secondary floor-reflection camera are used. Studio reflections come from an environment map baked once from four luminous panels. Their opposite falloffs are defined with vertex colors, without image textures. Box projection traces each reflected ray from its surface position to the studio boundary before sampling the probe; this lets the reflection vary across flat faces under an orthographic camera. It is a finite-probe approximation, not ray tracing. The original physical Fresnel, roughness, and transmission remain intact. Reduced-motion preference keeps the model still. A two-color mark remains visible while loading or if WebGL is unavailable.
- Mesh-only raycasting adds a restrained dark green tint to the rear form or dark red to the front form while hovered, without emissive glow. Delta-time damping eases in and out over roughly two seconds. The nearest structural surface wins where forms overlap. Only the two outer glass meshes participate in picking. The GLB has neutral white surface and volume colors at rest; background and side-light reflections remain visible in the clear glass. Hover transitions become immediate under reduced motion; leaving, scrolling, or blurring the scene restores clear glass.
- Physical bevels catch the studio lights. Faint structural contours support glass visibility, with native RGBA endpoint fades and a matching six-edge line 0.10 units below the top. The lowered line suggests thickness without an inner glass mesh. Depth-free rear contours are an art-directed visibility treatment; full mutual refraction of multiple glass objects is outside this demo's renderer.
- Three capability boards with accessible tabs, arrow-key navigation, Home/End, and visible focus.
- Brand-study dialogs with keyboard dismissal and focus restoration.
- Project-enquiry dialog with field validation and a copyable brief. It does not send or persist data. A real studio inbox or submission endpoint must be supplied before launch.
- Visible keyboard focus and reduced-motion support.

## Assets

WebP files are resized, re-encoded copies of supplied TACTIC assets. Original compositions are preserved. Fonts are local Geist files already present in the installed Next.js package. The SVG favicon follows the supplied icon geometry. `assets/ai-campaign.png` is an AI-generated advertising concept still (a smoked glass perfume bottle in a sage/coral landscape); it illustrates art direction and is not a playable video.

The GLB contains two closed bodies with indexed geometry, UV coordinates, and physical materials. [The model build notes](3d/README.md) cover extraction, generation, and validation. `glass-faces.js` supplies lightweight contours only; `studio-lighting.js` bakes the studio environment, and `studio-reflections.js` applies finite-probe projection to the physical reflection lookup. Three.js 0.186.1 and required addons are vendored locally under `vendor/three`, with their MIT license and registry provenance. No runtime CDN request is needed. Formatting and linting skip the unchanged vendor distribution; authored demo code remains checked.

No Next.js application files or dependencies are changed. This folder is the design review surface; migration can follow once the direction is approved.
