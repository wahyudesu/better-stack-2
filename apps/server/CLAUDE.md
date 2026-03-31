## Social Media API Server

Backend API server for social media integrations and data fetching.

## Purpose

- Wrapper/integration layer for social media APIs
- Authentication proxy (OAuth tokens)
- Rate limiting and caching
- Unified API response format

## Tech Stack

- **Framework**: Hono
- **Runtime**: Node.js (dev) / Compiled binary (prod)
- **Validation**: Zod
- **Config**: Workspace env package

## Quick Start

```bash
pnpm install
pnpm run dev          # Start dev server (tsx watch)
pnpm run build        # Build with tsdown
pnpm run start        # Start production server
pnpm run compile      # Compile to binary (Bun)
pnpm run check-types  # Type check
```

## API Endpoints (To Implement)

```
GET  /health           # Health check
GET  /api/platforms    # List supported platforms

# Social Media Integrations
GET  /api/instagram/:userId/posts
GET  /api/tiktok/:userId/posts
GET  /api/twitter/:userId/posts
GET  /api/youtube/:userId/posts

# Auth/Webhook
POST /api/auth/:platform/callback
POST /api/webhook/:platform
```

## Supported Platforms

- Instagram (Basic Display API)
- TikTok
- Twitter/X
- YouTube
- Facebook
- LinkedIn
- Pinterest
- Threads

## Environment Variables

```bash
# Social Media API Keys
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
# ... etc for each platform
```

## Architecture Notes

- **Hono** for fast, type-safe routing
- **Zod** for request/response validation
- **Workspace env** for shared config
- **Compiled output** for production (Bun bytecode)

## Development

- Uses `tsx watch` for hot reload in dev
- Entry point: `src/index.ts`
- Export: `src/index.ts` → `dist/index.mjs`
