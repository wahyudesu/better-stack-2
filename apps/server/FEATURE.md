# Zernio Server Feature Specification

## Overview

Hono-based server acts as API proxy and SDK client for Zernio Social Media API. Enables frontend to manage posts, analytics, contacts, and more across 14 social platforms.

---

## Current State

### Architecture

```
Frontend (Next.js)
    ↓ HTTP
Hono Server (Cloudflare Worker / Node.js)
    ↓ /v1/* proxy
Zernio API (zernio.com/api)
```

**Approach:** Proxy-only. Server forwards all requests to Zernio API. SDK client available for future direct route handlers.

### Implemented Components

| Component | Path | Status |
|-----------|------|--------|
| Hono Server | `src/index.ts` | ✅ Active |
| SDK Client | `src/client.ts` | ✅ Active |
| Route Modules | `src/routes/*.ts` | ✅ 26 modules |
| Generic Proxy | `/v1/*` | ✅ Active |
| OpenAPI Docs | `/docs` (Scalar) | ✅ Active |
| OpenAPI Spec | `zernio-api-openapi.yaml` | ✅ Synced |

### Route Modules (SDK)

```
src/routes/
├── posts.ts              # Posts CRUD, bulkUpload, retry, unpublish, edit
├── accounts.ts           # Accounts, GMB, LinkedIn, Pinterest, Reddit, Discord
├── analytics.ts          # Instagram, YouTube, Google Business analytics
├── tools.ts              # Media download, validate
├── inbox.ts              # Conversations, messages, comments, reviews
├── profiles.ts           # Profiles CRUD
├── users.ts              # Users
├── queue.ts              # Queue slots, preview, nextSlot
├── webhooks.ts           # Webhook settings, test, logs
├── media.ts              # Media upload, presign, uploadDirect
├── usage.ts              # Usage stats
├── connect.ts            # OAuth connect flows
├── accountGroups.ts      # Account groups CRUD
├── apiKeys.ts           # API keys CRUD
├── invites.ts           # Invite tokens
├── discord.ts           # Discord channels & settings
├── logs.ts              # Webhook & post logs
├── whatsapp.ts          # WhatsApp templates, groups, phone numbers
├── whatsappFlows.ts     # WhatsApp flow messaging
├── contacts.ts          # Contacts CRUD, bulk, channels, fields
├── customFields.ts      # Custom fields CRUD
├── broadcasts.ts        # WhatsApp broadcast campaigns
├── sequences.ts         # Sequence automations
├── commentAutomations.ts # Comment auto-reply
├── ads.ts              # Facebook/Instagram ads
├── adAudiences.ts      # Custom audiences
└── index.ts            # Re-exports all route types
```

### Generic Proxy

**Endpoint:** `/v1/*` → proxies to Zernio API

Forwards all requests to `https://zernio.com/api` with:
- Bearer token from `ZERNIO_API_KEY` env
- Preserves method, headers, body, query params

**Example:**
```
GET /v1/posts?profileId=xxx
→ https://zernio.com/api/v1/posts?profileId=xxx

POST /v1/posts
→ https://zernio.com/api/v1/posts
```

### Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `ZERNIO_API_KEY` | Yes | - |
| `API_BASE_URL` | No | `https://zernio.com/api` |

---

## Future: Explicit Route Handlers (TBD)

Direct route handlers with validation, logging, caching, rate limiting — planned for future when needed.

---

## API Reference

### OpenAPI Docs

Available at `/docs` (Scalar UI) when server running.

### Quick Reference

```typescript
import { ZernioClient } from './client'

const client = new ZernioClient({
  apiKey: process.env.ZERNIO_API_KEY
})

// Posts
client.posts.list({ profileId: 'xxx' })
client.posts.create({ profileId: 'xxx', text: 'Hello', socialAccountIds: ['acc_1'] })
client.posts.get('post_123')
client.posts.update('post_123', { text: 'Updated' })
client.posts.delete('post_123')

// Accounts
client.accounts.list()
client.accounts.get('acc_123')
client.accounts.health('acc_123')
client.accounts.gmbReviews('acc_123', { locationId: 'loc_1' })

// Analytics
client.analytics.get('acc_123', { startDate: '2024-01-01' })
client.analytics.instagramAccountInsights('acc_123')
client.analytics.youtubeDailyViews('acc_123', { videoId: 'vid_1' })

// WhatsApp
client.whatsapp.listTemplates('acc_123')
client.whatsapp.listGroups('acc_123')
client.broadcasts.send('acc_123', 'broadcast_1')

// Sequences
client.sequences.list()
client.sequences.enroll('seq_1', { contactIds: ['c_1', 'c_2'] })
```

---

## Development

```bash
pnpm install
pnpm run dev      # Start dev server (tsx watch)
pnpm run build    # Build with tsdown
pnpm run start    # Start production server
pnpm run check-types  # Type check
```

### Environment Setup

```bash
# .env file
ZERNIO_API_KEY=your_api_key_here
API_BASE_URL=https://zernio.com/api
```

### Testing

```bash
# Health check
curl http://localhost:8787/health

# OpenAPI docs
curl http://localhost:8787/docs

# List posts via proxy
curl http://localhost:8787/v1/posts

# Create post via example endpoint
curl -X POST http://localhost:8787/example/posts \
  -H "Content-Type: application/json" \
  -d '{"profileId":"xxx","text":"Hello","socialAccountIds":["acc_1"]}'
```

---

## Notes

- Server runs on Cloudflare Workers (serverless) or Node.js
- Generic proxy handles all `/api/*` routes automatically
- SDK (`src/client.ts`) used for explicit route handlers
- OpenAPI spec synced with Zernio API updates
- 26 route modules covering all Zernio endpoints