# TACTIC — design demo

A standalone, dependency-free HTML/CSS/JavaScript direction for TACTIC. Open `index.html` directly, or serve this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory demo
```

From the repository root, open http://localhost:4173.

## Design direction

Light and sculptural: warm ivory surfaces, dark green typography, sage and coral accents, faded dividers, and filled controls. Centered desktop copy sits above the oversized TACTIC mark, showing more of both forms while cropping their lower edges. Soft daylight and brighter material reflections give the scene a quiet presence. The floating header stays visible from the start. A custom SVG sculpture interprets the paired diagonal TACTIC marks; the favicon uses both original brand colors.

The abilities section takes composition inspiration from `assets/example-section.jpg`, with original TACTIC concept boards for brand and design, web and app design/development, and AI advertising films. The three brand explorations use supplied artwork. All boards are studio concepts; they are not client projects. Studio and capabilities text is draft copy for design review.

## Interactions

- Always-visible floating navigation, responsive menu, section links, and back-to-top link.
- Three capability boards with accessible tabs, arrow-key navigation, Home/End, and visible focus.
- Brand-study dialogs with keyboard dismissal and focus restoration.
- Project-enquiry dialog with field validation and a copyable brief. It does not send or persist data. A real studio inbox or submission endpoint must be supplied before launch.
- Visible keyboard focus and reduced-motion support.

## Assets

WebP files are resized, re-encoded copies of supplied TACTIC assets. Original compositions are preserved. Fonts are local Geist files already present in the installed Next.js package. The SVG mark follows the supplied icon geometry. `assets/ai-campaign.png` is an AI-generated advertising concept still (a smoked glass perfume bottle in a sage/coral landscape); it illustrates art direction and is not a playable video.

No Next.js application files or dependencies are changed. This folder is the design review surface; migration can follow once the direction is approved.
