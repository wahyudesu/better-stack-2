# ZenPost - Social Media Dashboard

## Project Type
Monorepo pnpm workspace with:
- `apps/web` - Next.js 16 + Convex backend (social media dashboard)
- `apps/landing` - Landing page (zenpost.in)
- `apps/server` - Server components
- `packages/ui` - Shared UI package

## Key Technologies
- Next.js 16.2 + React 19
- Convex for backend (read `convex/_generated/ai/guidelines.md`)
- Clerk for auth
- @base-ui/react (NOT Radix) for UI primitives
- Tailwind CSS + Biome for styling/linting
- Tauri for desktop app
- Cloudflare Workers via @opennextjs/cloudflare

## Important Conventions
- Direct imports for dashboard components (no barrel)
- Select onChange: `v ?? "default"` pattern
- Lazy load Hugeicons
- verbatimModuleSyntax requires `type` keyword for type imports