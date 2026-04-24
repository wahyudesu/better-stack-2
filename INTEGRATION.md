# ZenPost - Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ZenPost Architecture                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────────┐ │
│   │  Clerk   │────▶│  Next.js │────▶│  Server  │────▶│  Zernio API  │ │
│   │  Auth    │     │   Web    │     │  Worker  │     │  zernio.com  │ │
│   └──────────┘     └──────────┘     └──────────┘     └──────────────┘ │
│                         │                │                              │
│                    ┌────▼────┐     ┌─────▼─────┐                        │
│                    │ Convex  │     │  /v1/*    │                        │
│                    │   DB    │     │  Proxy    │                        │
│                    └─────────┘     └───────────┘                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Environment Configuration

### apps/web (.env.local for dev)
```
NEXT_PUBLIC_CONVEX_URL=https://first-cobra-587.convex.cloud
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### apps/server (.env)
```
PORT=8787
ZERNIO_API_KEY=sk_xxx                    # Server's own API key (fallback)
CLERK_SECRET_KEY=sk_test_xxx            # For Clerk verification
```

## Authentication Flow

1. User enters their Zernio API key in settings
2. Key stored in `useAuthStore` (Zustand)
3. All API calls from web use user's API key via `Authorization: Bearer <key>`
4. If no user key, server falls back to its own `ZERNIO_API_KEY`

```typescript
// client.ts - API calls use user's API key
const apiKey = useAuthStore.getState().apiKey;
if (apiKey) {
  headers.Authorization = `Bearer ${apiKey}`;
}
```

## API Route Structure

### Web → Server Proxy

| Path | Method | Purpose |
|------|--------|---------|
| `/api/zernio/[...path]` | * | Proxy all `/v1/*` requests to Zernio |
| `/api/validate-key` | POST | Validate user's API key |

### Server (Cloudflare Worker)

| Path | Method | Purpose |
|------|--------|---------|
| `/v1/*` | * | Proxy to Zernio API |
| `/v1/usage-stats` | GET | Get usage stats |
| `/openapi.json` | GET | OpenAPI spec |
| `/docs` | GET | Scalar API docs |
| `/health` | GET | Health check |

## Client API Methods (client.ts)

All methods return `Promise<ApiResponse<T>>`:

```typescript
import { api } from "@/lib/client";

// Profiles
api.getProfiles()
api.getProfile(profileId)
api.createProfile({ name, description? })

// Accounts
api.getAccounts(profileId?)
api.getConnectUrl(platform, profileId, redirectUrl)

// Posts
api.getPosts({ page?, limit?, profileId?, status?, sortBy? })
api.getPost(postId)
api.createPost(body)
api.updatePost(postId, body)
api.deletePost(postId)
api.queuePost(body)

// Analytics
api.getPostAnalytics(postId)
api.getAccountAnalytics({ accountId, startDate?, endDate? })
api.getDailyMetrics({ accountId, metric?, startDate?, endDate? })

// Queue
api.getQueue(profileId?, limit?)
api.listQueueSlots(profileId, { startDate?, endDate? })

// Media
api.getPresignedUrl({ filename, contentType })

// Usage
api.getUsageStats()
```

## Response Format

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
```

## Type Definitions

Key types in `client.ts`:

```typescript
interface Profile {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialAccount {
  _id: string;
  platform: string;
  username: string;
  displayName?: string;
  isActive: boolean;
  profilePicture?: string;
  profileId: string;
}

interface Post {
  _id: string;
  text: string;
  profileId: string;
  socialAccountIds: string[];
  scheduledAt?: string;
  publishedAt?: string;
  media?: Array<{ url: string; type?: string; altText?: string }>;
  status: "draft" | "scheduled" | "published" | "failed" | "cancelled";
}

interface PostAnalytics {
  postId: string;
  platform: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  engagement: number;
}
```

## Usage Example

```typescript
import { api } from "@/lib/client";

async function loadPosts() {
  const { data, error } = await api.getPosts({ status: "scheduled" });
  if (error) {
    console.error("Failed to load posts:", error);
    return;
  }
  console.log("Posts:", data?.posts);
}
```

## Development

```bash
# Start web (port 3000)
pnpm run dev:web

# Start server (port 8787)
pnpm run dev:server

# Deploy server to Cloudflare
wrangler deploy --config ../../wrangler.jsonc
```

## Production URLs

| Service | URL |
|---------|-----|
| Web (Next.js) | `https://zenpost.in` (Cloudflare Workers) |
| Server (Hono) | `https://zenpost-server.workers.dev` |
| Convex | `https://first-cobra-587.convex.cloud` |
| Zernio API | `https://zernio.com/api` |

## Important Notes

1. **API Key**: User provides their own Zernio API key. Server has fallback key.
2. **CORS**: Server allows all origins (`origin: '*'`)
3. **Server doesn't need CORS_ORIGIN**: Already removed from wrangler.jsonc
4. **Relative URLs**: `NEXT_PUBLIC_SERVER_URL` can be empty in production (Cloudflare auto-detects)
