# Apps Server - Agent Guidelines

Server components using Hono + Cloudflare Workers. Integrates with Zernio API for social media features.

## Zernio API Integration

**IMPORTANT**: Always read `apps/server/GUIDE.md` for complete Zernio API documentation before working on social media integrations.

### Supported Platforms
Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Reddit, Bluesky, Threads, Google Business, Telegram, Snapchat, WhatsApp, Discord

### Key Features
- Social media account connection via OAuth
- Post creation and scheduling across platforms
- Cross-platform posting
- Analytics data retrieval
- Inbox management (DMs, comments, reviews)
- Ad management (Meta, Google, LinkedIn, TikTok, Pinterest, X)

## Quick Start

```bash
cd apps/server
pnpm install
pnpm run dev          # Start dev server
pnpm run build        # Production build
pnpm run deploy       # Deploy to Cloudflare
```

## Project Structure

```
apps/server/src/
├── index.ts                    # Entry point
├── client.ts                   # Zernio API client
├── types.ts                    # Type definitions
└── routes/
    ├── adapters.ts             # Platform adapters
    ├── index.ts                # Route registration
    └── [category]/
        └── [feature].ts        # Feature routes (posts, analytics, inbox, ads, etc.)
```

## Route Categories

- `core/` - Accounts, API keys, profiles, logs, connect
- `content/` - Posts, media, tools, queue
- `analytics/` - Analytics data
- `advertising/` - Ad campaigns, audiences
- `inbox/` - Messages, comments, reviews, automations, contacts
- `platform/` - Platform-specific (WhatsApp flows, Discord)
- `webhooks/` - Webhook handlers
- `admin/` - User management, account groups, invites, usage

## Before Making Changes

1. Read `apps/server/GUIDE.md` for Zernio API documentation
2. Follow existing route patterns in `src/routes/`
3. Use type definitions from `src/types.ts`
4. Test with `pnpm run dev` before committing

## API Base URL
Zernio API: `https://zernio.com/api/v1`

Authentication: `Authorization: Bearer YOUR_API_KEY`