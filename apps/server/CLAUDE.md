# Apps Server - Project Context

Hono + Cloudflare Workers server for Better Stack 2.

## Zernio API Integration

**IMPORTANT**: Always read `apps/server/GUIDE.md` for complete Zernio API documentation.

### Supported Platforms
Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Reddit, Bluesky, Threads, Google Business, Telegram, Snapchat, WhatsApp, Discord

### Key Features
- Social media account connection via OAuth
- Post creation and scheduling
- Cross-platform posting
- Analytics retrieval
- Inbox management (DMs, comments, reviews)
- Ad management (Meta, Google, LinkedIn, TikTok, Pinterest, X)

## Quick Start

```bash
cd apps/server
pnpm install
pnpm run dev          # Wrangler dev server
pnpm run build        # Production build
pnpm run deploy       # Deploy to Cloudflare Workers
```

## Tech Stack

- **Framework**: Hono
- **Runtime**: Cloudflare Workers via `@opennextjs/cloudflare`
- **API**: Zernio API (`https://zernio.com/api/v1`)
- **Auth**: `Authorization: Bearer YOUR_API_KEY`

## Before Making Changes

1. Read `apps/server/GUIDE.md` for Zernio API docs
2. Follow existing route patterns in `src/routes/`
3. Use type definitions from `src/types.ts`
4. Test with `pnpm run dev` before committing
