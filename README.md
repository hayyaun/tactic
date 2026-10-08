# TACTIC

The TACTIC design demo, migrated to Next.js App Router, Tailwind CSS v4, and React Three Fiber. The original standalone reference remains in `demo/`.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview, run `npm run build` followed by `npm start`.

## Structure

- `app/page.tsx` and `app/components/capabilities.tsx`: server-rendered studio content and concept boards.
- `app/components/header.tsx`, `capability-tabs.tsx`, and `interactions.tsx`: responsive navigation, accessible tabs, native dialogs, and project briefs. Static panel content passes from the server into the tab component.
- `app/components/hero-art.tsx`: client-only, lazy-loaded 3D canvas with a persistent SVG fallback.
- `app/components/hero-canvas.tsx`: R3F Canvas, cached GLTF loading, and mount/unmount lifecycle. Hooks run inside Canvas. A manual orthographic camera preserves the reference framing across viewport changes.
- `app/components/three/`: the reference glass contours, finite-probe reflection shader, baked studio environment, and scene controller. Fiber owns the renderer and frame scheduling; GPU rendering is capped at 30fps during transitions and stops when idle, offscreen, or hidden. Each mounted scene clones and disposes its own resources without modifying the loader cache. Listeners and observers are removed on unmount.
- `app/globals.css`: Tailwind entrypoint and theme tokens. `base.css`, `studio.css`, and `abilities.css` are imported by the root layout in cascade order; detailed art-directed styling stays in base/components layers so utilities can override it.
- `public/studio/`: local artwork, fonts, brand mark, and GLB. Fonts use `next/font/local`; content images use `next/image`. The Next.js app does not load the demo's vendored Three.js or use a CDN/import map.

Three.js is pinned to the demo's 0.186.1 release because the custom physical-material shader extension checks its shader chunks. Review that extension and compare the glass appearance before upgrading Three.js. Fiber v9 matches React 19.

## Validation

```sh
npm run lint
npm run build
npm run format:check
```

Use `npm run format` to format authored files and sort Tailwind classes. Browser checks should cover mobile/desktop framing, all capability tabs, keyboard navigation, study dialogs, enquiry validation/edit/copy, hover tinting, reduced motion, renderer fallback, and idle/offscreen rendering. See `AGENTS.md` for project conventions.

## Content and launch requirements

Capability boards and brand studies are studio concepts rather than client projects. The AI film board contains concept stills, not playable video. The enquiry form validates locally and prepares a copyable brief; it does not send or persist personal information. Connect a real studio inbox or submission endpoint before launch.
