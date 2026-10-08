# TACTIC — design demo

A standalone, dependency-free HTML/CSS/JavaScript direction for TACTIC. Open `index.html` directly, or serve this folder:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory demo
```

From the repository root, open http://localhost:4173.

## Design direction

Minimal, dark, premium: graphite surfaces, warm ivory typography, quiet technical annotations, and the green signal from the supplied brand palette. A custom SVG sculpture interprets the paired diagonal TACTIC marks; the supplied brand images appear in the studio’s visual explorations.

The three brand explorations use supplied artwork and are not presented as client projects. Studio and capabilities text is draft copy for design review.

## Interactions

- Responsive navigation, section links, and back-to-top link.
- Native expandable service rows.
- Brand-study dialogs with keyboard dismissal and focus restoration.
- Project-enquiry dialog with field validation and a copyable brief. It does not send or persist data. A real studio inbox or submission endpoint must be supplied before launch.
- Visible keyboard focus and reduced-motion support.

## Assets

WebP files are resized, re-encoded copies of supplied TACTIC assets. Original compositions are preserved. Fonts are local Geist files already present in the installed Next.js package. The SVG mark follows the supplied icon geometry.

No Next.js application files or dependencies are changed. This folder is the design review surface; migration can follow once the direction is approved.
