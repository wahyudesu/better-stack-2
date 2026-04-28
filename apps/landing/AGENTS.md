# Apps Landing - Agent Guidelines

Marketing landing page for Better Stack 2 social media dashboard.

## Tech Stack

- **Framework**: Next.js 16.1.5 + React 19
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Playwright
- **Animation**: Motion (Framer Motion)
- **Deployment**: Cloudflare Workers via OpenNext
- **Analytics**: PostHog for product analytics

## Product Identity

**Product**: Better Stack 2 — social media management dashboard

**Features**:
- Analytics (engagement, followers, ad performance)
- Scheduler (content planning + posting)
- Inbox Management (DM, comment, mention — all platforms)
- Ads Analytics (Google, Meta, TikTok — unified view)

**Target Users**:
- Agency owners (manage multiple clients)
- Business owners (handle own brand)
- Social media managers
- Freelance creators

## Design Guidelines

- Use design tokens from `@zenpost/ui`
- Mobile-first responsive design
- Keep simple and fast-loading
- Use `motion` for subtle animations

## Content Guidelines

- Headlines: clear and benefit-focused
- CTAs point to `/app` (main application)
- Avoid jargon, speak to user pain points

### Conversion-Focused Writing

1. **Hook** — Pain point: "Stop juggling 5 platforms..."
2. **Problem** — Fragmented tools, wasted time, no unified view
3. **Solution** — All-in-one dashboard
4. **How It Works** — Connect → View metrics → Generate reports
5. **Features** — Analytics → Inbox → Ads → Scheduler
6. **CTA** — "Get Early Access"

## Before Making Changes

1. Read root `AGENTS.md` and `CLAUDE.md` for project context
2. Check `apps/web` for UI consistency
3. Test responsive behavior (mobile + desktop)
4. Run `pnpm run build` before deploying

## Commands

```bash
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run deploy       # Deploy to Cloudflare
pnpm run preview      # Build + preview locally
pnpm run test         # Vitest unit tests
pnpm run test:e2e     # Playwright e2e tests
```

## Goals

- Fast loading (Cloudflare edge)
- SEO optimized
- Responsive (mobile-first)
- Accessible (WCAG AA)
