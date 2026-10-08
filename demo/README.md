# TACTIC — design demo

A standalone HTML/CSS/JavaScript direction for TACTIC, with a local Three.js renderer. Serve this folder so the browser can load its 3D model and modules:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory demo
```

From the repository root, open http://localhost:4173.

## Design direction

Light and sculptural: a neutral ivory stage, dark typography, and distinct green/red glass towers. Centered desktop copy sits above the upper faces; the tall lower ends extend beyond the viewport. The actual white silhouette in `assets/1.jpg` supplies the two base footprints, extruded upward with beveled edges into `assets/tactic-mark.glb`. Their height and close composition follow `assets/example-hero-object-from-logo.jpg`. A lower orthographic view preserves the original base spacing and makes the two forms read as one mark. Physical transmission, colored volume absorption, neutral studio lighting, luminous cards behind the glass, and real reflections define the surfaces. The floating header stays visible from the start; the favicon uses both original brand colors.

The abilities section takes composition inspiration from `assets/example-section.jpg`, with original TACTIC concept boards for brand and design, web and app design/development, and AI advertising films. The three brand explorations use supplied artwork. All boards are studio concepts; they are not client projects. Studio and capabilities text is draft copy for design review.

## Interactions

- Always-visible floating navigation, responsive menu, section links, and back-to-top link.
- Subtle 3D parallax, paused offscreen and when the page is hidden. Reduced-motion preference keeps the model still. A two-color mark remains visible while loading or if WebGL is unavailable.
- Three capability boards with accessible tabs, arrow-key navigation, Home/End, and visible focus.
- Brand-study dialogs with keyboard dismissal and focus restoration.
- Project-enquiry dialog with field validation and a copyable brief. It does not send or persist data. A real studio inbox or submission endpoint must be supplied before launch.
- Visible keyboard focus and reduced-motion support.

## Assets

WebP files are resized, re-encoded copies of supplied TACTIC assets. Original compositions are preserved. Fonts are local Geist files already present in the installed Next.js package. The SVG favicon follows the supplied icon geometry. `assets/ai-campaign.png` is an AI-generated advertising concept still (a smoked glass perfume bottle in a sage/coral landscape); it illustrates art direction and is not a playable video.

The 23 KB GLB contains two indexed, beveled meshes and physical materials. [The model build notes](3d/README.md) cover extraction, generation, and validation. Three.js 0.186.1 and required addons are vendored locally under `vendor/three`, with their MIT license and registry provenance. No runtime CDN request is needed. Formatting and linting skip the unchanged vendor distribution; authored demo code remains checked.

No Next.js application files or dependencies are changed. This folder is the design review surface; migration can follow once the direction is approved.
