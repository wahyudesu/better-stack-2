# Better Stack 2 - Agent Guidelines

## Project Type

Monorepo pnpm workspace with:
- `apps/web` - Next.js 16 + Convex backend (social media dashboard)
- `apps/landing` - Marketing landing page
- `apps/server` - Server components (Hono + Cloudflare Workers)
- `packages/ui` - Shared UI components
- `packages/infra` - Infrastructure utilities
- `packages/env` - Environment validation (Zod)
- `packages/config` - Shared config

## Key Technologies

### Web App
- Next.js 16.2 + React 19
- Convex for backend
- Clerk for auth
- @base-ui/react for UI primitives
- react-router-dom v7 for routing
- @tanstack/react-query for data fetching
- zustand for state management
- Tailwind CSS v4 + Biome
- Motion (Framer Motion v12) for animations
- @visx for custom charts (line/area/ring/pie), Recharts for simple charts
- Tauri for desktop packaging

### Server App
- Hono framework
- Cloudflare Workers via @opennextjs/cloudflare
- Zernio API for social media integration (see `apps/server/GUIDE.md`)

### Landing App
- Next.js 16.1.5 + React 19
- Tailwind CSS v4
- Vitest + Playwright for testing
- Cloudflare Workers deployment

### UI Package
- @base-ui-components/react + @base-ui/react
- shadcn v4 for component primitives
- @hugeicons/react for icons
- Motion (Framer Motion) for animations
- @visx for charts

## Important Conventions

### Imports
- Dashboard components: direct imports, no barrel
  ```tsx
  // Bad
  import { StatsCards } from "@/components/dashboard";
  // Good
  import { StatsCards } from "@/components/dashboard/stats-cards";
  ```
- Platform filtering: use `PlatformFilterDropdown` from `@/components/ui/platform-filter`
- Metric preferences: use `useMetricPreference` hook

### Select onChange
```tsx
onValueChange={(v) => setValue(v ?? "default")}
```

### Type Imports
`verbatimModuleSyntax` requires `type` keyword for type imports

### UI Primitives
@base-ui/react — NOT Radix. Different API:
- `Tabs.Root`, `Tabs.List` (not `Tabs` as root)
- See `@zenpost/ui` for wrapped components

### Animation
Two motion packages in use:
- `framer-motion` (use `<motion>` components)
- `motion` (v12, separate package)

## Zernio API Integration

All social media API endpoints declared in `apps/server`. See `apps/server/GUIDE.md` for full platform documentation.

**Supported platforms**: Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Reddit, Bluesky, Threads, Google Business, Telegram, Snapchat, WhatsApp, Discord

**Key features**: Account connection (OAuth), post creation/scheduling, cross-platform posting, analytics, inbox (DMs/comments/reviews), ad management

## Before Making Changes

1. Read `CLAUDE.md` for project context
2. For Convex code: read `convex/_generated/ai/guidelines.md` first
3. For server/Zernio integration: read `apps/server/GUIDE.md`
4. For web app: read `apps/web/CLAUDE.md`
5. For landing: read `apps/landing/AGENTS.md`
6. For server: read `apps/server/AGENTS.md`

## Deployment

| App | Deployment |
|-----|------------|
| Web | Cloudflare Workers via `@opennextjs/cloudflare` |
| Landing | Cloudflare Workers |
| Server | Cloudflare Workers |

## Quick Start Commands

```bash
pnpm install          # Install all dependencies
pnpm run dev          # Dev server (root)
```

### Web
```bash
cd apps/web
pnpm run dev          # Next.js dev (port 3000)
pnpm run dev:bare     # Without Cloudflare tunneling (port 3001)
pnpm run build:cf     # Build for Cloudflare Workers
pnpm run desktop:dev  # Tauri desktop dev
```

### Landing
```bash
cd apps/landing
pnpm run dev          # Next.js dev
pnpm run test         # Vitest tests
pnpm run test:e2e     # Playwright e2e
```

### Server
```bash
cd apps/server
pnpm run dev          # Wrangler dev
pnpm run deploy        # Deploy to Cloudflare
```
