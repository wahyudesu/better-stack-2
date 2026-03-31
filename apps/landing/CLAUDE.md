## Landing Page

Marketing/preview site for the Better Stack platform.

## Purpose

- Introduce the product value proposition
- Showcase features and capabilities
- Provide clear CTAs (Sign up, Learn more)
- Deploy on Cloudflare Pages via OpenNext

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Deployment**: Cloudflare Workers (via @opennextjs/cloudflare)
- **Styling**: Tailwind CSS v4
- **UI Components**: @better-stack-2/ui (shared)

## Quick Start

```bash
pnpm install
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run deploy       # Deploy to Cloudflare
pnpm run preview      # Build + preview locally
```

## Project Structure

```
src/app/
├── page.tsx          # Hero section + main landing
├── layout.tsx        # Root layout
└── globals.css       # Global styles
```

## Key Sections (To Build)

1. **Hero** - Headline, subheadline, CTA buttons
2. **Features** - Grid of key features
3. **Demo/Screenshot** - Visual preview of dashboard
4. **Pricing** (optional) - Pricing tiers
5. **FAQ** (optional) - Common questions
6. **Footer** - Links, social, copyright

## Deployment

Deployed to Cloudflare Workers via OpenNext:
```bash
pnpm run deploy
```

## Design Goals

- Fast loading (Cloudflare edge)
- SEO optimized
- Responsive (mobile-first)
- Accessible (WCAG AA)
