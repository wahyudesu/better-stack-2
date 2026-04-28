# Apps Web - Agent Guidelines

Main Next.js 16 social media dashboard application.

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

## Tech Stack

- **Framework**: Next.js 16.2 + React 19
- **Routing**: react-router-dom v7
- **Backend**: Convex (read `convex/_generated/ai/guidelines.md` first)
- **Auth**: Clerk (`@clerk/nextjs`)
- **Data Fetching**: @tanstack/react-query
- **State**: zustand
- **UI Primitives**: @base-ui/react (NOT Radix)
- **Styling**: Tailwind CSS + Biome
- **Charts**: @visx for custom charts, Recharts for simple charts
- **Animations**: Motion (Framer Motion v12) - use `<motion>` components

## Project Structure

```
apps/web/src/
├── app/                   # Next.js App Router pages
│   ├── dashboard/         # Main dashboard with analytics
│   ├── analytics/         # Deep analytics with charts
│   ├── posts/             # Content calendar + management
│   ├── ai/                # AI content generator
│   ├── inbox/             # Unified inbox (DMs, comments, reviews)
│   ├── ads/               # Ad campaign management
│   ├── settings/          # User settings
│   └── user-profile/      # User profile
├── components/
│   ├── features/          # Feature-specific components
│   ├── dashboard/          # Dashboard components
│   ├── charts/             # @visx chart components
│   └── ui/                 # Shared UI components
├── lib/
│   ├── constants/         # App constants
│   ├── data/              # Static/mock data
│   ├── types/             # TypeScript types
│   ├── hooks/             # Custom React hooks
│   ├── api/               # API client functions
│   ├── stores/            # zustand stores
│   └── metrics.ts        # Metric formatting utilities
└── convex/                # Convex backend definitions
```

## Component Patterns

- **Dashboard components**: Direct imports, NOT barrel imports
  ```tsx
  // Bad
  import { StatsCards } from "@/components/dashboard";
  // Good
  import { StatsCards } from "@/components/dashboard/stats-cards";
  ```

- **Platform filtering**: Use centralized filter
  ```tsx
  import { PlatformFilterDropdown, PLATFORM_OPTIONS } from "@/components/ui/platform-filter";
  ```

- **Metric persistence**: Use `useMetricPreference` hook
  ```tsx
  import { useMetricPreference } from "@/lib/hooks/use-metric-pref";
  const { metric, setMetric } = useMetricPreference();
  ```

- **Select onChange**: Use inline null coalescing
  ```tsx
  onValueChange={(v) => setValue(v ?? "default")}
  ```

- **Depth buttons**: Use `DepthButtonMenu` for distinctive dropdown style
  ```tsx
  import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
  ```

## Key Files

- `src/lib/types/social.ts` - Social media type definitions
- `src/lib/data/social-data.ts` - Sample data for development
- `src/lib/api/` - API client functions for backend communication

## Before Modifying Convex Code

Always read `convex/_generated/ai/guidelines.md` first for Convex-specific patterns and rules.

## Deployment

```bash
pnpm run build:cf      # Build for Cloudflare Workers
pnpm run deploy:cf     # Deploy to Cloudflare Workers
pnpm run dev:bare      # Dev without Cloudflare tunneling (port 3001)
pnpm run preview       # Preview Cloudflare build locally
pnpm run desktop:dev   # Tauri desktop dev
pnpm run desktop:build # Tauri desktop build
```

## Before Making Changes

1. Read root `AGENTS.md` and `CLAUDE.md` for project context
2. For Convex code: read `convex/_generated/ai/guidelines.md` first
3. Check existing components for patterns before adding new ones
4. Run `pnpm run check` before committing

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
