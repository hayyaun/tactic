# About page — The Human Index

The About route uses `AboutPage`, a Server Component with the site's existing typefaces, colours, navigation and breadcrumb metadata. Other pages retain their shared templates. No homepage component is changed by this work.

## Editing the team

After deploying both the website and standalone Studio through their existing Vercel projects, open Main Pages → About in Studio. Use:

- **Title** for the expressive on-page headline.
- **Search title** for the descriptive search title; the website appends ` | TACTIC`.
- **Team introduction** for the short statement above the portraits.
- **Team members** for actual names, roles, short biographies and portrait uploads. Reorder entries to change their sequence.

Only complete entries with a name, role and valid portrait render as team members. Every portrait requires descriptive alt text. The existing Sanity crop/hotspot tools remain supported. Portraits display in 4:5 frames with grayscale and contrast treatment; names, roles and biographies remain visible without hover. The layout uses one column on small screens, two at tablet sizes and three on larger screens, with a staggered middle column.

An empty team displays the abstract About hero with an explicit portrait-studies caption. The fallback when no hero exists is four abstract vector studies. Neither state invents people or biographies. Add real members to replace the studies automatically.

## Photography direction

Use vertical source images at least 1600×2000 pixels. Shoot chest-up against a plain gray backdrop, with soft light from one side, natural expression and space around the head and shoulders. Keep important details within the central 70% for flexible crops. The presentation applies the monochrome treatment, so colour originals are welcome. Avoid baked-in names, frames, graphic marks or heavy filters; the site supplies those.

A separate synthetic-model reference sheet and its exact generation prompt accompany the content handoff. It is a style guide only and is not uploaded as team imagery.

## Publication and limits

The five main-page documents and six graphic assets were published to Sanity. The custom layout, search-title override and new team editing fields require website and Studio deployment respectively. Until deployment, the existing public template renders the updated content and abstract hero.

Existing restrictions on `/blog` and `/portfolio` in `robots.ts`, and existing static sitemap caching, remain unchanged. Removing restrictions or changing sitemap behavior requires the owner's separate approval. No development server was started or restarted.
