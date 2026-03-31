## AI Agent Guidelines for Landing Page

This document helps AI agents work effectively on the landing page.

## Key Context

- **Purpose**: Marketing site, not the main app
- **Goal**: Convert visitors to sign up for the main app
- **Tech**: Next.js 16 App Router + Tailwind CSS v4
- **Deployment**: Cloudflare Workers via OpenNext

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

## Before Making Changes

1. Read `CLAUDE.md` for project context
2. Check if similar UI exists in `apps/web` for consistency
3. Test responsive behavior (mobile + desktop)
