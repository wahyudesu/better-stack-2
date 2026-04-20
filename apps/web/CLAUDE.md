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
- **Charts**: Hybrid - @visx for custom charts (line/area/ring/pie), Recharts for simple charts
- **UI Primitives**: @base-ui/react (NOT Radix) - different API patterns
- **Styling**: Tailwind CSS + Biome for linting/formatting
- **Animations**: Motion (Framer Motion v12) - use `<motion>` components for transitions
- **Desktop**: Tauri for desktop app (`pnpm run desktop:dev` / `desktop:build`)
- **Motion packages**: Two packages exist - `framer-motion` and `motion` (both v12), use `<motion>` from framer-motion

## Component Patterns

- **Dashboard components**: Use direct imports, NOT barrel imports:
  ```tsx
  // ❌ Don't
  import { StatsCards } from "@/components/dashboard";
  // ✅ Do
  import { StatsCards } from "@/components/dashboard/stats-cards";
  ```
- **Platform filtering**: Use centralized filter from `@/components/ui/platform-filter`:
  ```tsx
  import { PlatformFilterDropdown, PLATFORM_OPTIONS } from "@/components/ui/platform-filter";
  ```
- **Metric persistence**: Use `useMetricPreference` hook for user metric preferences:
  ```tsx
  import { useMetricPreference } from "@/lib/hooks/use-metric-pref";
  const { metric, setMetric } = useMetricPreference();
  ```
- **Depth buttons**: Use DepthButtonMenu for app's distinctive dropdown style:
  ```tsx
  import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
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
pnpm run dev:bare       # Dev without Cloudflare tunneling (port 3001)
pnpm run preview        # Preview Cloudflare build locally
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
- **React Compiler**: `babel-plugin-react-compiler` active - hooks must follow Rules of React where applicable

## Data Structure: Social Media, Posts & Analytics

### Overview
Centralized data types for dashboard and calendar features. Defined in `src/lib/types/social.ts` with sample data in `src/lib/data/social-data.ts`. Future: Will migrate to Convex.

### 1. Social Media Profile
```typescript
interface SocialMediaProfile {
  id: string;
  platform: ProfilePlatform;  // instagram, tiktok, twitter, linkedin, youtube, facebook, pinterest
  name: string;
  username: string;
  avatarUrl?: string;
  status: "active" | "disconnected" | "error" | "pending";
  connectedAt: Date;
  lastSyncAt?: Date;
  platformUserId?: string;
  errorMessage?: string;
}
```

### 2. Content Post
```typescript
interface ContentPost {
  id: string;
  title: string;
  content: string;
  media: PostMedia[];  // { url, type: 'image'|'video', alt?, thumbnailUrl? }
  platforms: ProfilePlatform[];  // Multiple platforms (cross-posting)
  profileIds: string[];  // Which profiles to use
  createdAt: Date;
  updatedAt: Date;
  status: "draft" | "review" | "scheduled" | "publishing" | "published" | "failed" | "cancelled";
  scheduledAt?: Date;
  publishedAt?: Date;
  errorMessage?: string;
  hashtags?: string[];
  cta?: string;
  notes?: string;
  platformPostIds?: Partial<Record<ProfilePlatform, string>>;  // External IDs
}
```

### 3. Post Analytics (Per Platform)
```typescript
interface PostAnalytics {
  id: string;
  postId: string;
  platform: ProfilePlatform;
  profileId: string;
  fetchedAt: Date;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
  saves?: number;
  engagementRate?: number;
  extraMetrics?: Record<string, number | string>;
}
```

### Usage
```typescript
import { samplePosts, sampleAnalytics, getCalendarItems } from "@/lib/data/social-data";
import type { ContentPost, SocialMediaProfile } from "@/lib/types";

// Get all posts
const posts = samplePosts;

// Get posts by status
const scheduledPosts = samplePosts.filter(p => p.status === "scheduled");

// Get calendar items with analytics
const calendarItems = getCalendarItems();
```

### Design Decisions
- **Multi-profile support**: Each user can have multiple social media profiles (one per platform)
- **Cross-posting**: One post can be published to multiple platforms at once
- **Per-platform analytics**: Analytics are stored separately per platform, enabling comparison
- **No tags/categories**: Content organization is simple (by status and date only)
- **Approval workflow**: Draft → Review → Scheduled → Published flow
