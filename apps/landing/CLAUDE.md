# Apps Landing - Project Context

Marketing landing page for Better Stack 2.

## Tech Stack

- **Framework**: Next.js 16.1.5 + React 19
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Playwright
- **Animation**: Motion (Framer Motion)
- **Deployment**: Cloudflare Workers via OpenNext
- **Analytics**: PostHog for product analytics

## Quick Start

```bash
cd apps/landing
pnpm install
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run test         # Run Vitest tests
pnpm run test:e2e     # Run Playwright e2e tests
```

## Before Making Changes

1. Read root `AGENTS.md` and `CLAUDE.md` for project context
2. Check `apps/web` for UI consistency
3. Test responsive behavior (mobile + desktop)
4. Run `pnpm run build` before deploying
