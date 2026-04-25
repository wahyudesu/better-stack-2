# Apps Web - Agent Guidelines

This is the main Next.js 16 social media dashboard application.

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
- **Backend**: Convex (read `convex/_generated/ai/guidelines.md` first)
- **Auth**: Clerk (`@clerk/nextjs`)
- **UI Primitives**: @base-ui/react (NOT Radix)
- **Styling**: Tailwind CSS + Biome
- **Charts**: @visx for custom charts, Recharts for simple charts
- **Animations**: Motion (Framer Motion v12) - use `<motion>` components

## Project Structure

```
apps/web/
├── src/app/              # Next.js App Router pages
│   ├── dashboard/        # Main dashboard with analytics
│   ├── ai/                # AI content generator
│   ├── calendar/          # Content calendar
│   ├── tools/             # Content tools (script builder, branding)
│   └── settings/          # User settings
├── src/components/       # React components
│   ├── features/          # Feature-specific components
│   ├── dashboard/         # Dashboard-specific components
│   ├── charts/            # Visualization components
│   └── ui/                # Shared UI components
├── src/lib/               # Utilities and shared code
│   ├── constants/         # App constants
│   ├── data/              # Static data files
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── api/               # API client functions
└── convex/                # Convex backend definitions
```

## Component Patterns

- **Dashboard components**: Direct imports, NOT barrel imports
  ```tsx
  // ❌ Don't
  import { StatsCards } from "@/components/dashboard";
  // ✅ Do
  import { StatsCards } from "@/components/dashboard/stats-cards";
  ```

- **Platform filtering**: Use centralized filter
  ```tsx
  import { PlatformFilterDropdown, PLATFORM_OPTIONS } from "@/components/ui/platform-filter";
  ```

- **Metric persistence**: Use `useMetricPreference` hook
  ```tsx
  import { useMetricPreference } from "@/lib/hooks/use-metric-pref";
  ```

- **Select onChange**: Use inline null coalescing
  ```tsx
  onValueChange={(v) => setValue(v ?? "default")}
  ```

## Key Files

- `src/lib/types/social.ts` - Social media type definitions
- `src/lib/data/social-data.ts` - Sample data for development
- `src/lib/api/` - API client functions for backend communication

## Before Modifying Convex Code

Always read `convex/_generated/ai/guidelines.md` first for Convex-specific patterns and rules.

## Deployment

```bash
pnpm run build:cf      # Build for Cloudflare
pnpm run deploy:cf     # Deploy to Cloudflare Workers
pnpm run dev:bare      # Dev without Cloudflare tunneling (port 3001)
pnpm run preview       # Preview Cloudflare build locally
```