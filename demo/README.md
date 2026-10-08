# TACTIC — design demo

A standalone HTML/CSS/JavaScript direction for TACTIC, with a local Three.js renderer. Serve this folder so the browser can load its 3D model and modules:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory demo
```

From the repository root, open http://localhost:4173.

## Design direction

Dark and sculptural: a charcoal stage, ivory typography, and two clear glass towers, framed by green light on the left and red light on the right. Centered desktop copy sits above the upper faces; the tall lower ends extend beyond the viewport. The actual white silhouette in `assets/1.jpg` supplies the two nearly identical base footprints, extruded upward with beveled edges into `assets/tactic-mark.glb`. Both forms are 4.6 units tall. Their close composition follows `assets/example-hero-object-from-logo.jpg`. A lower orthographic view preserves the original base spacing and gives the front form more visible height. Physical transmission, neutral studio panels, side lights, and real reflections define the surfaces. The floating header stays visible from the start; the favicon uses both original brand colors.

The abilities section takes composition inspiration from `assets/example-section.jpg`, with original TACTIC concept boards for brand and design, web and app design/development, and AI advertising films. The three brand explorations use supplied artwork. All boards are studio concepts; they are not client projects. Studio and capabilities text is draft copy for design review.

## Interactions

- Always-visible floating navigation, responsive menu, section links, and back-to-top link.
- Subtle 3D parallax, paused offscreen and when the page is hidden. Reduced-motion preference keeps the model still. A two-color mark remains visible while loading or if WebGL is unavailable.
- Mesh-only raycasting adds a green volume tint to the rear form or a red tint to the front form while hovered. The nearest surface wins where forms overlap. The GLB has neutral white surface and volume colors at rest; background and side-light reflections remain visible in the clear glass. Hover transitions become immediate under reduced motion, and leaving or blurring the scene restores clear glass.
- Three capability boards with accessible tabs, arrow-key navigation, Home/End, and visible focus.
- Brand-study dialogs with keyboard dismissal and focus restoration.
- Project-enquiry dialog with field validation and a copyable brief. It does not send or persist data. A real studio inbox or submission endpoint must be supplied before launch.
- Visible keyboard focus and reduced-motion support.

## Assets

WebP files are resized, re-encoded copies of supplied TACTIC assets. Original compositions are preserved. Fonts are local Geist files already present in the installed Next.js package. The SVG favicon follows the supplied icon geometry. `assets/ai-campaign.png` is an AI-generated advertising concept still (a smoked glass perfume bottle in a sage/coral landscape); it illustrates art direction and is not a playable video.

The 23 KB GLB contains two indexed, beveled meshes and physical materials. [The model build notes](3d/README.md) cover extraction, generation, and validation. Three.js 0.186.1 and required addons are vendored locally under `vendor/three`, with their MIT license and registry provenance. No runtime CDN request is needed. Formatting and linting skip the unchanged vendor distribution; authored demo code remains checked.

No Next.js application files or dependencies are changed. This folder is the design review surface; migration can follow once the direction is approved.
