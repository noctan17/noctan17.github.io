# Design: Next.js 15 Migration

Date: 2026-04-29
Status: Approved

## Overview

Migrate the current noctan17 portfolio (React CDN + Babel + plain CSS) to a proper Next.js 15 build stack while preserving the visual design exactly. Deploy via GitHub Actions to GitHub Pages.

## Tech Stack

- **Next.js 15** — App Router, static export (`output: 'export'`)
- **React 18.3**
- **Tailwind CSS 3.4** — layout/spacing/responsive only
- **TypeScript**
- **GitHub Actions** — build on push to main, deploy via `actions/deploy-pages`
- **GitHub Pages** — source set to "GitHub Actions" in repo settings

Excluded: react-spring, scrollreveal, react-icons, tweaks-panel

## Repository Structure

```
noctan17.github.io/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, CSS vars
│   ├── page.tsx            # Single page entry point
│   └── globals.css         # All complex CSS (HUD, clip-path, keyframes, CSS vars)
├── components/
│   ├── Hero.tsx            # Hero section: image, HUD, title, scroll hint
│   ├── Dock.tsx            # Fixed top nav bar
│   ├── HudCorner.tsx       # HUD corner elements with live countdowns
│   ├── WorkSection.tsx     # Selected Projects with detail panel
│   ├── StackSection.tsx    # Tools & Tech grid
│   └── ContactSection.tsx  # Contact block + social pills
├── public/
│   ├── assets/             # hero-v2.png, icon-aws.png, icon-java.png, kataribe-icon.png
│   ├── kataribe/           # Privacy policy — URL must not change
│   │   └── privacy/
│   │       └── index.html
│   └── app-ads.txt
├── .github/
│   └── workflows/
│       └── deploy.yml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Architecture

### Routing

Single-page portfolio. One route: `/`. No dynamic routes needed.

### Component Split

Current `app.jsx` (695 lines) is split into focused components:

| Component | Responsibility | `"use client"` |
|---|---|---|
| `Hero` | Image, scanlines, grid, HUD layout | Yes (timers, FPS, viewport) |
| `HudCorner` | Live clock, uptime, countdowns | Yes (setInterval) |
| `Dock` | Nav bar, scroll-spy active state | Yes (scroll events) |
| `WorkSection` | Project list + detail panel | Yes (useState) |
| `StackSection` | Tech grid | No |
| `ContactSection` | Bio block + email copy + social pills | Yes (clipboard) |

`app/page.tsx` and `app/layout.tsx` remain Server Components.

### Styling Strategy

**`app/globals.css`** — contains all styles from current `styles.css` that cannot be expressed with Tailwind utilities:
- CSS custom properties (`--accent`, `--mono-color`, `--hero-bg`)
- All `clip-path: polygon(...)` rules
- All `@keyframes` (hudBlink, dockBootFrame, hudPulse, etc.)
- `backdrop-filter` combinations
- HUD corner classes (`.hud-corner`, `.hud-bracket`, `.hud-stack`, etc.)
- `.ghost-cta`, `.social-pill`, `.stack-group`, `.work-row` etc.

**Tailwind** — used for layout utilities in JSX className:
- `flex`, `grid`, `gap-*`, `p-*`, `m-*`
- `fixed`, `absolute`, `relative`, `inset-*`, `z-*`
- `text-*`, `font-*`, `tracking-*`
- Responsive prefixes (`md:`, `lg:`)

**`tailwind.config.ts` extensions:**
```ts
extend: {
  colors: { accent: 'var(--accent)' },
  fontFamily: {
    display: ['Inter Tight', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  }
}
```

## Deployment

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out
      - uses: actions/deploy-pages@v4
        id: deployment
```

### next.config.ts

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,   // preserves /kataribe/privacy/ URL
  images: { unoptimized: true },
}
```

### One-time Manual Step

Repository Settings → Pages → Source → **"GitHub Actions"**

## Constraints

- Visual design must be reproduced exactly — no style changes
- `https://noctan17.github.io/kataribe/privacy/` URL must remain unchanged
- `app-ads.txt` must be served at root
- `tweaks-panel` is removed entirely
- No new libraries beyond the approved stack

## Out of Scope

- Design changes of any kind
- react-spring / scrollreveal / react-icons migration
- New features or sections
