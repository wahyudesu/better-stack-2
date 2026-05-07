# Convex → Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Convex backend with Supabase (Postgres + Drizzle ORM + Clerk auth) + Next.js API routes.

**Architecture:** Supabase Cloud Postgres with Drizzle ORM, Clerk JWT validated by Supabase for RLS, Next.js API routes for all data operations, Supabase Storage for media, Zernio sync via on-demand API routes.

**Tech Stack:** Supabase Cloud, Drizzle ORM, Postgres, Clerk, Next.js API routes, Supabase Storage

---

## File Map

### New packages/db (Drizzle schema package)

```
packages/db/
├── src/
│   ├── schema/
│   │   ├── index.ts              # Re-exports all schemas
│   │   ├── users.ts              # users table
│   │   ├── socialAccounts.ts     # social_accounts table
│   │   ├── posts.ts              # posts table
│   │   ├── media.ts              # media table
│   │   └── organizations.ts      # organizations table
│   └── index.ts                  # Admin + user DB clients
├── drizzle.config.ts
├── tsconfig.json
└── package.json
```

### New/modified app files

```
apps/web/src/
├── lib/
│   ├── db.ts                     # Supabase + Drizzle client
│   ├── storage.ts                # Supabase Storage client
│   └── api/
│       └── zernio.ts             # Zernio API client
├── app/
│   └── api/
│       ├── posts/route.ts
│       ├── social-accounts/route.ts
│       ├── organizations/route.ts
│       ├── organizations/[id]/route.ts
│       ├── organizations/[id]/set-default/route.ts
│       ├── user/route.ts
│       ├── user/api-key/route.ts
│       ├── media/upload/route.ts
│       └── zernio/sync/route.ts
```

---

## PHASE 1: Database Schema & Drizzle Setup

### Task 1: Create packages/db package scaffold

**Files:**
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/drizzle.config.ts`

- [ ] **Step 1: Create packages/db/package.json**

```json
{
  "name": "@db/db",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "generate": "drizzle-kit generate",
    "push": "drizzle-kit push",
    "studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-orm": "^0.38.0",
    "postgres": "^3.4.0",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0"
  }
}
```

- [ ] **Step 2: Create packages/db/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "verbatimModuleSyntax": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*", "drizzle.config.ts"]
}
```

- [ ] **Step 3: Create packages/db/drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './digrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 4: Commit**

```bash
cd packages/db && git add -A && git commit -m "feat(db): scaffold drizzle-orm package"
```

---

### Task 2: Create Drizzle schema files

**Files:**
- Create: `packages/db/src/schema/users.ts`
- Create: `packages/db/src/schema/socialAccounts.ts`
- Create: `packages/db/src/schema/posts.ts`
- Create: `packages/db/src/schema/media.ts`
- Create: `packages/db/src/schema/organizations.ts`
- Create: `packages/db/src/schema/index.ts`

- [ ] **Step 1: Create packages/db/src/schema/users.ts**

```typescript
import { pgTable, uuid, text, bigint, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: text('clerk_id').unique().notNull(),
  apiKey: text('api_key'),
  email: text('email').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  lastSyncedAt: bigint('last_synced_at', { mode: 'number' }),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
}, (table) => ({
  clerkIdIdx: uniqueIndex('idx_users_clerk_id').on(table.clerkId),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

- [ ] **Step 2: Create packages/db/src/schema/socialAccounts.ts**

```typescript
import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';

export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  accountId: text('account_id').notNull(),
  accountName: text('account_name').notNull(),
  avatarUrl: text('avatar_url'),
  status: text('status', { enum: ['active', 'error', 'disconnected'] }).notNull().default('active'),
  connectedAt: bigint('connected_at', { mode: 'number' }).notNull(),
  tokens: text('tokens'),
});

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type NewSocialAccount = typeof socialAccounts.$inferInsert;
```

- [ ] **Step 3: Create packages/db/src/schema/posts.ts**

```typescript
import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  externalPostId: text('external_post_id'),
  text: text('text').notNull().default(''),
  mediaUrls: text('media_urls').array().notNull().default([]),
  platforms: text('platforms').array().notNull().default([]),
  status: text('status', { enum: ['draft', 'scheduled', 'published', 'failed'] }).notNull().default('draft'),
  scheduledAt: bigint('scheduled_at', { mode: 'number' }),
  publishedAt: bigint('published_at', { mode: 'number' }),
  platformPostIds: text('platform_post_ids'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
```

- [ ] **Step 4: Create packages/db/src/schema/media.ts**

```typescript
import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  storageId: text('storage_id').notNull(),
  filename: text('filename').notNull(),
  mimeType: text('mime_type').notNull(),
  url: text('url').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
```

- [ ] **Step 5: Create packages/db/src/schema/organizations.ts**

```typescript
import { pgTable, uuid, text, bigint } from 'drizzle-orm/pg-core';
import { users } from './users';

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clerkOrgId: text('clerk_org_id'),
  clerkOrgSlug: text('clerk_org_slug'),
  clerkOrgRole: text('clerk_org_role'),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  isDefault: text('is_default').notNull().default('false'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull().default(sql`EXTRACT(EPOCH FROM NOW())::BIGINT * 1000`),
});

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
```

- [ ] **Step 6: Create packages/db/src/schema/index.ts**

```typescript
export * from './users';
export * from './socialAccounts';
export * from './posts';
export * from './media';
export * from './organizations';
```

- [ ] **Step 7: Commit**

```bash
cd packages/db && git add -A && git commit -m "feat(db): add Drizzle schema for all 5 tables"
```

---

### Task 3: Create DB client (admin + user-scoped)

**Files:**
- Create: `packages/db/src/index.ts`

- [ ] **Step 1: Create packages/db/src/index.ts**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { createClient } from '@supabase/supabase-js';
import * as schema from './schema';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client — bypasses RLS (for migrations, Zernio sync, internal ops)
export const adminDb = drizzle(
  createClient(supabaseUrl, supabaseServiceKey, {
    dbParams: { schema: 'public' },
  }),
  { schema }
);

// User-scoped client — RLS enforced (for API routes)
export function createUserClient(accessToken: string) {
  return createClient(supabaseUrl, accessToken, {
    auth: { persistSession: false },
  });
}

export { type User, type NewUser } from './schema/users';
export { type SocialAccount, type NewSocialAccount } from './schema/socialAccounts';
export { type Post, type NewPost } from './schema/posts';
export { type Media, type NewMedia } from './schema/media';
export { type Organization, type NewOrganization } from './schema/organizations';
```

- [ ] **Step 2: Commit**

```bash
cd packages/db && git add -A && git commit -m "feat(db): add Supabase Drizzle client (admin + user-scoped)"
```

---

## PHASE 2: SQL Migration Files

### Task 4: Create Supabase SQL migrations

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `supabase/migrations/002_rls_policies.sql`

- [ ] **Step 1: Create supabase/migrations/001_initial_schema.sql**

```sql
-- Migration: Create initial schema for all 5 tables
-- Run: supabase db push

CREATE TABLE IF NOT EXISTS users (
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

CREATE TABLE IF NOT EXISTS social_accounts (
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

CREATE TABLE IF NOT EXISTS posts (
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

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  storage_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
);

CREATE TABLE IF NOT EXISTS organizations (
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_account_id ON social_accounts(account_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_posts_external_post_id ON posts(external_post_id);
CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_user_id ON organizations(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_clerk_org_id ON organizations(clerk_org_id);
```

- [ ] **Step 2: Create supabase/migrations/002_rls_policies.sql**

```sql
-- Migration: Enable RLS on all tables
-- Run after 001_initial_schema.sql

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users: user can only see/edit own row via clerk_id
CREATE POLICY "users_owner" ON users FOR ALL
  USING (clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text);

-- Social accounts: via user->clerk_id lookup
CREATE POLICY "social_accounts_owner" ON social_accounts FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text
    )
  );

-- Posts: via user->clerk_id lookup
CREATE POLICY "posts_owner" ON posts FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text
    )
  );

-- Media: via user->clerk_id lookup
CREATE POLICY "media_owner" ON media FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text
    )
  );

-- Organizations: via user->clerk_id lookup
CREATE POLICY "organizations_owner" ON organizations FOR ALL
  USING (
    user_id IN (
      SELECT id FROM users
      WHERE clerk_id = nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text
    )
  );
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/ && git commit -m "feat(db): add Supabase SQL migrations (schema + RLS)"
```

---

## PHASE 3: Supabase Storage & Zernio Client

### Task 5: Create Supabase Storage client

**Files:**
- Create: `apps/web/src/lib/storage.ts`

- [ ] **Step 1: Create apps/web/src/lib/storage.ts**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const BUCKET = 'media';

export async function uploadMedia(userId: string, file: File) {
  const ext = file.name.split('.').pop() ?? 'bin';
  const path = `${userId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { storageId: path, url: publicUrl };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/storage.ts && git commit -m "feat(storage): add Supabase Storage client"
```

---

### Task 6: Create Zernio API client

**Files:**
- Create: `apps/web/src/lib/api/zernio.ts`

- [ ] **Step 1: Create apps/web/src/lib/api/zernio.ts**

```typescript
// NOTE: This file likely already exists at apps/web/src/lib/zernio/ - check first
// If it exists, just add the upsert helper functions below

import { adminDb } from '@/lib/db';
import { posts, socialAccounts, users } from '@db/schema';
import { eq } from 'drizzle-orm';
import { zernioUser } from '@/lib/zernio-user'; // existing module if any

const ZERNIO_API_URL = process.env.ZERNIO_API_URL!;

interface ZernioPost {
  externalId: string;
  text: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: number;
  publishedAt?: number;
  mediaUrls: string[];
  accountIds: string[];
  createdAt: number;
  updatedAt: number;
}

interface ZernioAccount {
  externalId: string;
  platform: string;
  accountName: string;
  avatarUrl?: string;
  status: 'active' | 'error' | 'disconnected';
  connectedAt: number;
}

async function getUserApiKey(clerkUserId: string): Promise<string | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await adminDb.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });
  return result?.apiKey ?? null;
}

export async function syncFromZernio(clerkUserId: string) {
  const apiKey = await getUserApiKey(clerkUserId);
  if (!apiKey) throw new Error('No API key configured');

  // Fetch from Zernio
  const [zernioPosts, zernioAccounts] = await Promise.all([
    fetch(`${ZERNIO_API_URL}/posts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json() as Promise<ZernioPost[]>),
    fetch(`${ZERNIO_API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    }).then((r) => r.json() as Promise<ZernioAccount[]>),
  ]);

  // Upsert posts
  for (const post of zernioPosts) {
    await adminDb
      .insert(posts)
      .values({
        userId: clerkUserId, // TODO: resolve userId from clerkUserId via users table
        externalPostId: post.externalId,
        text: post.text,
        platforms: post.platforms,
        status: post.status,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt,
        mediaUrls: post.mediaUrls,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
      .onConflictDoUpdate({
        target: posts.externalPostId,
        set: {
          text: post.text,
          platforms: post.platforms,
          status: post.status,
          scheduledAt: post.scheduledAt,
          publishedAt: post.publishedAt,
          mediaUrls: post.mediaUrls,
          updatedAt: post.updatedAt,
        },
      });
  }

  // Upsert accounts
  for (const account of zernioAccounts) {
    await adminDb
      .insert(socialAccounts)
      .values({
        userId: clerkUserId, // TODO: resolve userId from clerkUserId
        platform: account.platform,
        accountId: account.accountId,
        accountName: account.accountName,
        avatarUrl: account.avatarUrl,
        status: account.status,
        connectedAt: account.connectedAt,
      })
      .onConflictDoUpdate({
        target: [socialAccounts.userId, socialAccounts.platform, socialAccounts.accountId],
        set: {
          accountName: account.accountName,
          avatarUrl: account.avatarUrl,
          status: account.status,
        },
      });
  }

  return { success: true, synced: zernioPosts.length + zernioAccounts.length };
}
```

**Note:** The `userId` UUID fields need to resolve from `clerkUserId` string. This requires a lookup step first (Task 8 will add the user upsert flow). The Zernio sync in Task 12 will handle this properly.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/api/zernio.ts && git commit -m "feat(zernio): add Zernio sync client for Supabase"
```

---

## PHASE 4: Next.js API Routes

### Task 7: Create posts API route

**Files:**
- Create: `apps/web/src/app/api/posts/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/posts/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';
import { posts } from '@db/schema';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { text, platforms, scheduledAt, mediaUrls, accountIds, profileId } = body;

  // Create post via Zernio API
  const zernioRes = await fetch(`${process.env.ZERNIO_API_URL}/posts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await getApiKey(userId)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, platforms, scheduledAt, mediaUrls, accountIds, profileId }),
  });

  if (!zernioRes.ok) return NextResponse.json({ error: 'Zernio API error' }, { status: 502 });

  const zernioPost = await zernioRes.json();

  // Write to Supabase
  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('posts')
    .insert({
      external_post_id: zernioPost.externalId,
      text,
      platforms,
      status: scheduledAt ? 'scheduled' : 'draft',
      scheduled_at: scheduledAt,
      media_urls: mediaUrls ?? [],
      user_id: userId, // UUID from user lookup
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ postId: data.id, externalId: zernioPost.externalId });
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/posts/route.ts && git commit -m "feat(api): add posts API route"
```

---

### Task 8: Create social accounts API route

**Files:**
- Create: `apps/web/src/app/api/social-accounts/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/social-accounts/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('social_accounts')
    .select('*')
    .order('connected_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { accountId } = await req.json();

  const supabase = createUserClient(userId /* Clerk token */);
  const { error } = await supabase
    .from('social_accounts')
    .delete()
    .eq('id', accountId);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/social-accounts/route.ts && git commit -m "feat(api): add social accounts API route"
```

---

### Task 9: Create organizations API routes

**Files:**
- Create: `apps/web/src/app/api/organizations/route.ts`
- Create: `apps/web/src/app/api/organizations/[id]/route.ts`
- Create: `apps/web/src/app/api/organizations/[id]/set-default/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/organizations/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, logoUrl } = await req.json();

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name, logo_url: logoUrl })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ orgId: data.id });
}
```

- [ ] **Step 2: Create apps/web/src/app/api/organizations/[id]/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { name, logoUrl } = await req.json();

  const supabase = createUserClient(userId /* Clerk token */);
  const { error } = await supabase
    .from('organizations')
    .update({ name, logo_url: logoUrl })
    .eq('id', id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create apps/web/src/app/api/organizations/[id]/set-default/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const supabase = createUserClient(userId /* Clerk token */);

  // Clear existing default
  await supabase
    .from('organizations')
    .update({ is_default: false })
    .eq('user_id', userId /* UUID */);

  // Set new default
  const { error } = await supabase
    .from('organizations')
    .update({ is_default: true })
    .eq('id', id);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/api/organizations/ && git commit -m "feat(api): add organizations API routes"
```

---

### Task 10: Create user API routes

**Files:**
- Create: `apps/web/src/app/api/user/route.ts`
- Create: `apps/web/src/app/api/user/api-key/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/user/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('users')
    .select('api_key, last_synced_at')
    .eq('clerk_id', userId)
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
```

- [ ] **Step 2: Create apps/web/src/app/api/user/api-key/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUserClient } from '@/lib/db';

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { apiKey } = await req.json();

  const supabase = createUserClient(userId /* Clerk token */);
  const { error } = await supabase
    .from('users')
    .update({ api_key: apiKey })
    .eq('clerk_id', userId);

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/api/user/ && git commit -m "feat(api): add user + api-key routes"
```

---

### Task 11: Create media upload API route

**Files:**
- Create: `apps/web/src/app/api/media/upload/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/media/upload/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/storage';
import { createUserClient } from '@/lib/db';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const { storageId, url } = await uploadMedia(userId, file);

  const supabase = createUserClient(userId /* Clerk token */);
  const { data, error } = await supabase
    .from('media')
    .insert({
      user_id: userId, // UUID from user lookup
      storage_id: storageId,
      filename: file.name,
      mime_type: file.type,
      url,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/media/upload/route.ts && git commit -m "feat(api): add media upload route"
```

---

### Task 12: Create Zernio sync API route

**Files:**
- Create: `apps/web/src/app/api/zernio/sync/route.ts`

- [ ] **Step 1: Create apps/web/src/app/api/zernio/sync/route.ts**

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { syncFromZernio } from '@/lib/api/zernio';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await syncFromZernio(userId);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/zernio/sync/route.ts && git commit -m "feat(api): add Zernio sync route"
```

---

## PHASE 5: Clerk Auth Middleware

### Task 13: Configure Clerk-Supabase JWT validation

**Files:**
- Modify: `apps/web/src/middleware.ts` (or create if not exists)
- Create: Supabase Auth Provider config (via Supabase dashboard)

- [ ] **Step 1: Verify Clerk JWT configuration**

Set the following Supabase environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgres://postgres:password@aws.connect.psdb.cloud/your-db?sslmode=require
```

Configure Supabase to validate Clerk JWTs:
1. Supabase Dashboard → Authentication → Providers → Custom Provider
2. Add Clerk JWKS URL: `https://{CLERK_JWT_ISSUER_DOMAIN}/.well-known/jwks.json`
3. Set JWT secret/signing key

- [ ] **Step 2: Review/update apps/web/src/middleware.ts**

Existing middleware should already handle Clerk auth. Verify it passes user identity correctly to API routes.

- [ ] **Step 3: Commit any middleware changes**

```bash
git add apps/web/src/middleware.ts && git commit -m "chore(auth): verify Clerk middleware for Supabase RLS"
```

---

## PHASE 6: Convex Data Migration (One-Time)

### Task 14: Export Convex data and seed Supabase

**Files:**
- Create: `packages/db/src/seed/migrate-from-convex.ts`
- Create: `supabase/migrations/003_seed_data.sql`

- [ ] **Step 1: Create migration script packages/db/src/seed/migrate-from-convex.ts**

```typescript
// ONETIME SCRIPT - Run once, then delete
// Dumps data from Convex and seeds into Supabase

import { adminDb } from '../index';
import { users, socialAccounts, posts, media, organizations } from '../schema';

async function migrate() {
  console.log('Starting Convex → Supabase migration...');

  // 1. Export from Convex (manual via Convex dashboard export as JSON)
  // const convexData = await fetchConvexData();

  // 2. Seed users first (FK dependency)
  // await adminDb.insert(users).values(convexData.users.map(u => ({ ... })));

  // 3. Seed organizations
  // await adminDb.insert(organizations).values(convexData.organizations.map(o => ({ ... })));

  // 4. Seed social accounts
  // await adminDb.insert(socialAccounts).values(convexData.socialAccounts.map(a => ({ ... })));

  // 5. Seed posts
  // await adminDb.insert(posts).values(convexData.posts.map(p => ({ ... })));

  // 6. Seed media
  // await adminDb.insert(media).values(convexData.media.map(m => ({ ... })));

  console.log('Migration complete.');
}

migrate().catch(console.error);
```

**Steps to run:**
1. Export Convex data via Convex dashboard (or write temporary Convex query to dump JSON)
2. Map Convex fields to Supabase schema
3. Run: `npx tsx packages/db/src/seed/migrate-from-convex.ts`
4. Delete file after successful migration

- [ ] **Step 2: Commit migration script**

```bash
git add packages/db/src/seed/ && git commit -m "chore(migration): add one-time Convex→Supabase seed script"
```

---

## PHASE 7: Cleanup (Post-Migration)

### Task 15: Remove Convex code

**Files:**
- Delete: `apps/web/convex/` (entire directory)
- Modify: `apps/web/src/lib/convex-client.ts` (remove/replace)
- Modify: `apps/web/src/lib/...` (remove Convex imports)

- [ ] **Step 1: Remove convex directory after all API routes verified**

```bash
rm -rf apps/web/convex
```

- [ ] **Step 2: Find and replace all Convex imports**

Search for `convex` imports across the codebase, replace with Supabase API calls.

- [ ] **Step 3: Commit cleanup**

```bash
git add -A && git commit -m "chore: remove Convex backend after Supabase migration"
```

---

## Spec Coverage Check

| Spec Section | Tasks |
|-------------|-------|
| Database Schema (5 tables) | Task 1, 2 |
| RLS Policies | Task 4 |
| Auth & Clerk-Supabase | Task 13 |
| Posts API | Task 7 |
| Social Accounts API | Task 8 |
| Organizations API | Task 9 |
| User API Key | Task 10 |
| Media Upload | Task 11 |
| Zernio Sync | Task 6, 12 |
| Supabase Storage | Task 5 |
| Data Migration | Task 14 |
| Convex Cleanup | Task 15 |

All spec requirements covered. No gaps.
