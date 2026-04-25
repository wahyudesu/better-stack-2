## AI Agent Guidelines for Landing Page

This document helps AI agents work effectively on the landing page.

## Key Context

- **Purpose**: Marketing site, not the main app
- **Goal**: Convert visitors to sign up for the main app
- **Tech**: Next.js 16 App Router + Tailwind CSS v4
- **Deployment**: Cloudflare Workers via OpenNext

## Product Identity

**What it is:** ZenPost — social media management dashboard for agencies and businesses in Indonesia.

**Features:**
- Analytics (engagement, followers, ad performance)
- Scheduler (content planning + posting)
- Inbox Management (DM, comment, mention — all platforms in one place)
- Ads Analytics (Google, Meta, TikTok — unified view)
- AI Analytics (insights, caption suggestion, content ideas)

**Target users:**
- Agency owners (manage multiple clients)
- Business owners (handle own brand)
- Social media managers (work at a company)
- Freelance creators

**Pain points solved:**
1. Reporting eats 5-10 hours/month per client
2. Must open 5+ different platforms for monitoring
3. Inbox scattered across email, DM, comment, mention
4. Ads data fragmented — no unified view to prove ROI

**Tagline:** "Every metrics. Every channel. One dashboard."
**Hero (pain-driven):** "Stop juggling 5 platforms. All your social media metrics—finally in one place."

## Design Guidelines

- Use existing design tokens from `@better-stack-2/ui`
- Maintain consistency with main web app's visual style
- Mobile-first responsive design
- Keep it simple and fast-loading

## Component Patterns

- Prefer `@better-stack-2/ui` components when available
- Use `motion` (Framer Motion) for subtle animations
- Keep landing page components self-contained (no complex state)

## Content Guidelines

- Headlines should be clear and benefit-focused
- CTAs should point to `/app` (main application)
- Avoid jargon, speak to user pain points

### Conversion-Focused Writing

**Hero:** Pain-driven headline first. "Stop juggling 5 platforms..." not vague "Boost your growth".
**Subheadline:** Explain: analytics + scheduler + inbox + ads + AI, one dashboard, for Indonesia.
**Primary CTA:** "Get Early Access" — action verb + value.
**Feature priority:** Analytics → Inbox → Ads → Scheduler → AI (benefit order, not feature list).
**Benefit framing:** Connect features to outcomes — save time, prove ROI, handle conversations faster.
**No jargon** in hero section.

### Story Sequence

1. **Hook** — Pain point: "Stop juggling 5 platforms"
2. **Problem** — What hurts: fragmented tools, wasted time, no unified view
3. **Solution** — ZenPost: all-in-one dashboard
4. **How It Works** — 3 steps: Connect → View all metrics → Generate reports
5. **Features Breakdown** — Analytics → Inbox → Scheduler → Ads → AI
6. **Benefits** — Save time, prove ROI, respond faster
7. **Social Proof** — Early access badge, waitlist count, product screenshots
8. **CTA** — "Get Early Access"

## Before Making Changes

1. Read `CLAUDE.md` for project context
2. Check if similar UI exists in `apps/web` for consistency
3. Test responsive behavior (mobile + desktop)

```bash
pnpm install
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run deploy       # Deploy to Cloudflare
pnpm run preview      # Build + preview locally
```

## Goals

- Fast loading (Cloudflare edge)
- SEO optimized
- Responsive (mobile-first)
- Accessible (WCAG AA)
