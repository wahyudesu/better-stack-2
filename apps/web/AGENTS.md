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
- **Routing**: Next.js App Router (react-router-dom v7 for some routes)
- **Backend**: Supabase (PostgreSQL) via API routes + `@supabase/ssr` for server-side auth
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
│   ├── api/               # API routes (Supabase backend)
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
- `src/lib/supabase.ts` - Supabase client setup with Clerk auth

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
2. Check existing components for patterns before adding new ones
3. Run `pnpm run check` before committing

## Supabase Schema & API Routes

### User Identity Pattern
All API routes MUST use this pattern to access user data:

```typescript
// 1. Get user UUID from Clerk ID
const { data: user } = await supabase
  .from("users")
  .select("id")
  .eq("clerk_id", userId)
  .single();

if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

// 2. Query child tables with user_id (NOT clerk_id)
const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("user_id", user.id);
```

### Tables
- `users` — `clerk_id` (Clerk ID), `id` (UUID PK)
- `user_settings` — `user_id` (UUID FK), `api_key`, `last_synced_at`
- `posts`, `social_accounts`, `media` — `user_id` (UUID FK)
- `organizations` — `clerk_id` (TEXT, direct)

### Important
- Child tables (`posts`, `social_accounts`, `media`) use `user_id` FK — NOT `clerk_id`
- `organizations` uses `clerk_id` directly (no FK)
- Never query child tables with `clerk_id` directly — will cause Postgres error