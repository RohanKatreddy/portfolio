# Rohan Katreddy — portfolio

Aviation-themed portfolio built from the design handoff in `portfolio_design_handoff/`.
Next.js (App Router) + TypeScript + CSS Modules, exported as a static site.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm start            # serve out/ locally
npm run typecheck
npm run intro:raster # regenerate public/intro/*.webp from the intro's SVG sources
```

Deploy by uploading `out/` to any static host (Vercel, Netlify, GitHub Pages, S3…).

## Where things live

| Path | What |
|---|---|
| `app/page.tsx`, `app/experiences/`, `app/projects/` | The three routes |
| `app/globals.css` | Theme tokens (Glass/Paper × light/dark) and the page shell |
| `lib/site.ts` | `BG_STYLE` constant and the pre-paint boot script (saved mode, intro decision) |
| `lib/theme.ts` | `useMode()`; `<html data-mode>` is the source of truth, saved to `localStorage['rk-mode']` |
| `components/` | Logo, Night/Day pill, tag, bar light, strips, cards |
| `components/intro/` | Intro timeline (`timeline.ts`, ported from `intro-animation.jsx`) and overlay |
| `content/` | Experiences, projects and contact links as typed arrays |
| `public/assets/` | Tag faces, paper texture, project drawings (copied from the handoff) |
| `public/intro/` | Pre-rasterised sun, moon and contrail textures |

## Behaviour notes

- **Theme:** colours are CSS-driven from `html[data-mode]`, set before first paint, so there is no flash. The page background crossfades over 300ms.
- **Intro:** plays once per session when landing on `/`; skipped under `prefers-reduced-motion`, and when the visit starts on another route. Skip with the button, a click, or Esc. It uses the saved mode (sun or moon), and the field fades to the Glass background so the logo lands seamlessly on Home.
- **Dev helper:** `/?introT=3.2` freezes the intro at 3.2s (development only).
- **Bar light:** `lit = lampOverride ?? isDark`; the chain toggles only the light, and Night/Day resets it.

## Open items (TODOs in code)

1. Real years for five projects (`content/projects.ts`, shown as "20XX").
2. Flora Feed drawing (`floraFeed.png` / `floraFeedDark.png`) and a fuller description.
3. Confirm contact links (`content/contact.ts`). X has no URL yet, so its icon is not a link.
4. Optional: expanded view per strip (remaining resume bullets are already in `content/experiences.ts`) and a details view per project.
