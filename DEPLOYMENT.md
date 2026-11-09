# Deployment — Vexon

Live site: https://vexon-nextjs-fuad-3cc8.vercel.app

## Vercel

- Project: `vexon-nextjs` (team `fuad-3cc8`)
- GitHub repo `thamid-fuad/vexon-nextjs` is connected — CI/CD is on.
- Every push to `main` auto-deploys to production; pushes to other
  branches get preview links. A failed build leaves the old version live.

## Favicon

- `app/icon.svg` — Option 4 (dark 3D bot head, glowing neon blue ring).
- `app/favicon.ico` (same artwork) exists in the local project only;
  binary files cannot be pushed through the GitHub connector, so the
  repo relies on `icon.svg` for the tab icon.
