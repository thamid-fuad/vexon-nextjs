# Vexon — Next.js + TypeScript rebuild

Real Next.js (App Router) + TypeScript rebuild of the Vexon AI & Robotics
site. **Separate from the approved static demo** (`why-choose-vexon`
artifact) — that demo is untouched and stays the design reference.

## Stack (main base: TypeScript + Next.js)

- **Next.js 16.4.5** (App Router) + **React 19** + **TypeScript 5**
- **Framer Motion 14** — hero copy entrance (more sections later)
- **GSAP 3.15** — search-overlay entrance (more animations later)
- **Three.js + React Three Fiber 9 + drei 10** — hero robot (curved
  head/body meshes, 360° together on the alternating 3s/4s cycle)
- **GLSL** — planned for step 2+ (hero smoke/nebula shader); the
  current smoke flow is the approved CSS-sheet version, unchanged
- **Plain CSS** (no Tailwind) — design tokens copied from the approved
  build: blue `#2fb9ec` family, teal `#14e0c8`, dark navy `#030b16`,
  black `#000`, white `#eef6fb`
- **Go backend** — not in this repo yet; planned after the frontend
  sections (contact form, blog data, search API — Gin/Fiber + PostgreSQL)

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (must pass before any step is "done")
npm start
```

## Step 2 — DONE (1-file conversion, Fuad's method)

The whole approved static site was converted into this Next.js app in
one file — no section-by-section hand rewrite:

- `app/globals.css` — the static site's full `<style>` block, copied
  verbatim (only `assets/` URLs re-rooted to `/`)
- `app/page.tsx` — the static `<body>` converted to JSX by script
  (`/tmp/convert_vexon.py`, html.parser based: class->className,
  for->htmlFor, inline styles->objects, SVG attrs camelCased,
  entities preserved, `linearGradient` etc. restored)
- `app/legacy-scripts.ts` — the page's 5 inline scripts, stored as
  strings and run verbatim in `useEffect` via
  `new Function("gsap", "ScrollTrigger", code)` (gsap/ScrollTrigger
  imported from npm, also set on window). No hand rewrite.
- Hero robot: the old `assets/r3f-bundle.js` was NOT copied; the
  existing `components/Robot3D.tsx` (R3F only) is mounted inside
  `#robotGL` via `next/dynamic` (`ssr: false`) and `handleRobotReady`
  adds `.gl-on`, exactly like the static build's swap.
- All `assets/*` copied to `public/` (except `r3f-bundle.js`).
- The Step-1 `components/Navbar.tsx` / `Hero.tsx` are kept in the repo,
  unused for now — the converted page carries its own navbar + hero.

Verified: `npm run build` passes (TS clean); production server smoke
test served `/` (HTTP 200) with every section present in the SSR HTML
and all assets HTTP 200; the 5 legacy scripts were executed in jsdom
against the SSR HTML — logo/icon injection, mega menu, search (13
results), testimonial next (Eline -> Alexander), blog reader open
(5 paragraphs) + back all work. NOT visually verified in a browser
(headless Chromium cannot start in this environment).

## Step 1 — DONE

- **Navbar** — FINAL design 3, Minimal + Mega Menu: Bot Head logo,
  centred Home/About/Services/Projects/Blog/Contact, Services mega
  menu (6 services), teal 44px search circle, divider, always-visible
  hamburger, side panel (Get a Quote kept in its footer), live-filter
  search overlay, toast. Mobile: logo + hamburger only.
- **Hero** — v2 sample 1 cinematic nebula: static nebula image,
  3 blue-smoke sheets flowing right, wisps, particles flowing left
  only, copy "Empowering / The Future With / AI & Robotics",
  Explore Now + 200+ Trusted Companies, robot fixed in place with
  head+body 360° together on alternating 3s/4s, big light-blue boost
  glow from the round engine disc (no added nozzle). R3F canvas takes
  over once textures load; layered images + CSS spin stay as fallback.

## Remaining

- Step 2: Why Choose + Trusted By + Transform
- Step 3: Services + Projects + Testimonials
- Step 4: Stats strip + Blog (with 300-word article pages) + Footer
- Step 5: Go backend (contact/newsletter/blog API) + Vercel deploy

Design rule for every step: **same-to-same as the approved static
build — no design change**, verified section by section.
