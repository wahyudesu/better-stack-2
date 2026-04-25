# Better Stack 2 - Social Media Dashboard

## Project Type
Monorepo pnpm workspace with:
- `apps/web` - Next.js 16 + Convex backend (social media dashboard)
- `apps/landing` - Landing page
- `apps/server` - Server components (Hono/Cloudflare Workers)
- `packages/ui` - Shared UI package

## Key Technologies
- Next.js 16.2 + React 19
- Convex for backend (read `convex/_generated/ai/guidelines.md`)
- Clerk for auth
- @base-ui/react (NOT Radix) for UI primitives
- Tailwind CSS + Biome for styling/linting
- Cloudflare Workers via @opennextjs/cloudflare

## Important Conventions
- Direct imports for dashboard components (no barrel)
- Select onChange: `v ?? "default"` pattern
- Lazy load Hugeicons
- verbatimModuleSyntax requires `type` keyword for type imports
- Server app uses Zernio API for social media integration (see `apps/server/GUIDE.md`)

## Zernio API Integration
All social media API endpoints declared in `apps/server`. See `apps/server/GUIDE.md` for full platform documentation.

Supported platforms: Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Reddit, Bluesky, Threads, Google Business, Telegram, Snapchat, WhatsApp, Discord

## Deployment
- Web app: Cloudflare Workers via `@opennextjs/cloudflare`
- Landing: Cloudflare Workers
- Server: Cloudflare Workers

## Before Making Changes
1. Read `CLAUDE.md` for project context
2. For Convex code: read `convex/_generated/ai/guidelines.md` first
3. For server/Zernio integration: read `apps/server/GUIDE.md`