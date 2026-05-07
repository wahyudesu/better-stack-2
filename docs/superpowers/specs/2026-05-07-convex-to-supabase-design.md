# Migration Convex → Supabase Design Spec

**Date:** 2026-05-07
**Status:** Draft

---

## 1. Overview

**What:** Replace Convex backend with Supabase (Postgres + Drizzle ORM + Clerk auth) + Next.js API routes
**Why:** Full migration — all Convex tables and API functions move to Supabase Cloud
**Scope:** 5 tables, 15+ API endpoints, media storage, Zernio sync

**Stack:**
- Database: Supabase Cloud (Postgres)
- ORM: Drizzle
- Auth: Clerk (JWT validated by Supabase)
- Sync: Next.js API routes (on-demand + cache TTL)
- Storage: Supabase Storage (S3-like)

---

## 2. Database Schema

**Location:** `packages/db/src/schema/`

### Tables

```sql
-- users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  api_key TEXT,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  last_synced_at BIGINT,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- social_accounts
CREATE TABLE social_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  account_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'disconnected')),
  connected_at BIGINT NOT NULL,
  tokens TEXT
);

-- posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  external_post_id TEXT,
  text TEXT NOT NULL DEFAULT '',
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at BIGINT,
  published_at BIGINT,
  platform_post_ids TEXT,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
  updated_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- media
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  storage_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

-- organizations
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clerk_org_id TEXT,
  clerk_org_slug TEXT,
  clerk_org_role TEXT,
  name TEXT NOT NULL,
  logo_url TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);
```

### Indexes

```sql
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_account_id ON social_accounts(account_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_posts_external_post_id ON posts(external_post_id);
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_organizations_user_id ON organizations(user_id);
CREATE INDEX idx_organizations_clerk_org_id ON organizations(clerk_org_id);
```

### RLS Policies

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
```

Policy: user can only access rows where `users.clerk_id` matches Clerk JWT `sub` claim.

---

## 3. Auth & RLS

**Pattern:** Clerk JWT → Supabase RLS

1. Clerk validates JWT on request (existing middleware)
2. Supabase configured with Clerk JWKS URL for JWT validation
3. Service role key for admin (bypass RLS), user token for regular ops

**Drizzle client setup:**

```typescript
// packages/db/src/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const adminDb = drizzle(createClient(supabaseUrl, supabaseServiceKey), { schema });

export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl, accessToken, { auth: { persistSession: false } });
}
```

---

## 4. API Routes

**Base path:** `apps/web/src/app/api/`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts |
| POST | `/api/posts` | Create post (local + Zernio) |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/social-accounts` | List accounts |
| DELETE | `/api/social-accounts/:id` | Delete account |
| GET | `/api/organizations` | List orgs |
| POST | `/api/organizations` | Create org |
| PATCH | `/api/organizations/:id` | Update org |
| POST | `/api/organizations/:id/set-default` | Set default org |
| GET | `/api/user` | Get user info |
| PATCH | `/api/user/api-key` | Upsert API key |
| POST | `/api/media/upload` | Upload media to Supabase Storage |
| POST | `/api/zernio/sync` | Trigger Zernio sync |

---

## 5. Zernio Sync

**Trigger:** On-demand per user (cache TTL)

```typescript
// apps/web/src/lib/api/zernio.ts
export async function syncFromZernio(userId: string) {
  // 1. Get user's Zernio API key
  // 2. Fetch posts + accounts from Zernio
  // 3. Upsert to Supabase via Drizzle admin client
  return { success: true, synced: count };
}
```

**Scope:** `posts` + `social_accounts` only (no `organizations` — local only)

---

## 6. Storage

**Bucket:** `media` (public or signed URLs)

```typescript
// apps/web/src/lib/storage.ts
export async function uploadMedia(userId: string, file: File) {
  const path = `${userId}/${Date.now()}.${ext}`;
  await supabase.storage.from('media').upload(path, file);
  const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path);
  return { storageId: path, url: publicUrl };
}
```

---

## 7. Migration Order

1. `users`
2. `organizations` (local only)
3. `social_accounts`
4. `posts`
5. `media`

**Steps:**
1. Export Convex data as JSON
2. Create Supabase tables + RLS
3. Seed via Drizzle (admin client, bypass RLS)
4. Switch API routes to Supabase
5. Delete Convex code

---

## 8. Removed Convex Features

| Convex Feature | Replacement |
|----------------|-------------|
| `ctx.auth.getUserIdentity()` | Clerk auth middleware |
| Real-time subscriptions | Not needed (on-demand) |
| `ctx.storage` | Supabase Storage |

---

## 9. Out of Scope

- Organizations → Zernio sync (local only)
- Real-time subscriptions
- Convex file storage (replaced by Supabase Storage)
