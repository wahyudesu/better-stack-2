<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (port 3000)
pnpm run format       # Format code with Biome
pnpm run lint         # Lint code (Biome)
pnpm run lint:fix     # Auto-fix lint issues
pnpm run check        # Check and fix code (Biome)
pnpm run build        # Production build
```

## Project Structure

This is a **pnpm workspace monorepo**:
- `apps/web` - Next.js 16 app (this directory)
- `packages/ui` - Shared UI components package

Key directories:
- `src/app/` - Next.js app router pages
  - `/dashboard` - Main dashboard with analytics
  - `/ai` - AI content generator
  - `/calendar` - Content calendar
  - `/tools` - Content tools (script builder, branding)
  - `/settings` - User settings
- `src/components/` - React components
  - `features/` - Feature-specific components (calendar, settings, tools)
  - `dashboard/` - Dashboard-specific components
  - `charts/` - Visualization components using @visx
  - `ui/` - Shared UI components (wraps @base-ui/react)
- `src/lib/` - Utilities and shared code
  - `constants/` - App constants (platforms, status, dashboard data)
  - `data/` - Static data files (analytics data)
  - `types/` - TypeScript type definitions
  - `hooks/` - Custom React hooks
  - `metrics.ts` - Metric formatting utilities

## Tech Stack Notes

- **Auth**: Clerk (`@clerk/nextjs`) - see Clerk docs for patterns
- **Backend**: Convex - read `convex/_generated/ai/guidelines.md` before modifying
- **Charts**: @visx (d3-based) - heavy library, consider lazy loading
- **UI Primitives**: @base-ui/react (NOT Radix) - different API patterns
- **Styling**: Tailwind CSS + Biome for linting/formatting

## Component Patterns

- **Dashboard components**: Use direct imports, NOT barrel imports:
  ```tsx
  // ❌ Don't
  import { StatsCards } from "@/components/dashboard";
  // ✅ Do
  import { StatsCards } from "@/components/dashboard/stats-cards";
  ```
- **Select onChange**: Use inline null coalescing:
  ```tsx
  onValueChange={(v) => setValue(v ?? "default")}
  ```

## Deployment

**Cloudflare Workers (OpenNext):**
```bash
pnpm run build:cf      # Build for Cloudflare
pnpm run deploy:cf     # Deploy to Cloudflare Workers
```

Note: Uses `@opennextjs/cloudflare` adapter. Set `OPENNEXT_DISABLE_MONOREPO=1` for workspace.

## Desktop App

Uses Tauri for desktop packaging:
```bash
pnpm run desktop:dev   # Dev mode
pnpm run desktop:build # Build desktop app
```

## Gotchas

- **Select onChange**: Select components pass `string | null` - use `v ?? "default"` pattern
- **@base-ui/react**: Uses different API than Radix (e.g., `Tabs.Root`, `Tabs.List` vs Radix names)
- **Type imports**: `verbatimModuleSyntax` requires `type` keyword for some imports
- **Build cache**: Run `rm -rf .next` if stale type errors after file deletions
- **Barrel imports**: Dashboard barrel causes tree-shaking issues - import directly
- **Hugeicons**: Heavy library - defer with `lazy()` if only used for icons
- **Dialog**: DialogContent requires `DialogContentProps` interface export for type compatibility
