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
- `app/components/header.tsx`, `capability-tabs.tsx`, `dialog-buttons.tsx`, and `interactions.tsx`: responsive navigation, accessible tabs, native dialogs, and project briefs. Static panel content passes from the server into the tab component. Dialogs are a sibling island; the page has no client provider. Triggers do not import the form implementation.
- `app/components/hero-art.tsx`: client-only, lazy-loaded 3D canvas with a persistent SVG fallback. WebGL 2 support is checked before mounting the renderer so unsupported browsers avoid renderer exceptions.
- `app/components/hero-canvas.tsx`: declarative R3F meshes, lights, materials, and pointer events. Drei supplies `useGLTF`, `OrthographicCamera`, `Environment`, `Lightformer`, `useBoxProjectedEnv`, and `Line`. The physical glass uses box-projected reflections directly, with a version-specific adapter for Three r186 shader names and the finite studio bounds. Lightformer materials reproduce the reference’s panel falloffs; Line contours preserve its structural creases and top rims. Cached model geometry is shared without disposal; Fiber and Drei manage owned GPU resources. Ref-based animation uses `useFrame` and demand rendering, stopping when idle, offscreen, or hidden. A small `ScreenQuad` shader matches the CSS backdrop through the glass.
- `app/globals.css`: Tailwind v4 entrypoint and shared theme tokens. Components use literal utilities for layout, typography, responsive behavior, and interaction states. `base.css` contains native element defaults; `artwork.css` contains a few bespoke illustration pseudo-elements.
- `public/studio/`: local artwork, fonts, brand mark, and GLB. Fonts use `next/font/local`; content images use `next/image`. The Next.js app does not load the demo's vendored Three.js or use a CDN/import map.

Fiber v9 matches React 19. Check Fiber/Drei/Three compatibility before dependency upgrades, and compare the glass appearance in a browser.

## Validation

```sh
npm run lint
npm run build
npm run format:check
```

Use `npm run format` to format authored files and sort Tailwind classes. Browser checks should cover mobile/desktop framing, all capability tabs, keyboard navigation, study dialogs, enquiry validation/edit/copy, hover tinting, reduced motion, renderer fallback, and idle/offscreen rendering. See `AGENTS.md` for project conventions.

## Content and launch requirements

Capability boards and brand studies are studio concepts rather than client projects. The AI film board contains concept stills, not playable video. The enquiry form validates locally and prepares a copyable brief; it does not send or persist personal information. Connect a real studio inbox or submission endpoint before launch.
