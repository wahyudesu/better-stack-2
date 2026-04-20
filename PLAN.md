# Better Stack 2 - Implementation Plan

## Overview

Implementasi mekanisme Zernio API client (seperti Latewiz) ke Better Stack 2 dengan frontend-backend separation.

---

## Current State

- **Frontend** (`apps/web`): Next.js, data masih dummy di `src/data/mock.ts` dan `src/lib/data/social-data.ts`
- **Backend** (`apps/server`): Cloudflare Worker, sudah ada Zernio API client + proxy routes
- **Auth**: Belum ada, data masih publicly accessible via dummy

---

## Target State

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                     │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────────┐  │
│  │ Zustand  │  │ TanStack   │  │ API Routes        │  │
│  │ Stores   │  │ Query Hooks│  │ /api/validate-key │  │
│  └──────────┘  └─────────────┘  └───────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ REST
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Backend (Cloudflare Worker / Hono)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Routes: profiles, accounts, posts, queue, etc   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │ Zernio API
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Zernio API (zernio.com/api)                           │
│  - Profiles, Accounts, Posts, Media, Queue, Analytics │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Backend Enhancement

### 1.1 Validate & Update Client

File: `apps/server/src/client.ts`

```typescript
// Sudah ada, verify isinya Zernio client
```

### 1.2 Auth Middleware

File: `apps/server/src/middleware/auth.ts`

```typescript
// Middleware untuk validasi API key
export async function authMiddleware(c: Context) {
  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!apiKey) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Optionally: validate against Zernio API
  const valid = await validateApiKey(apiKey);
  if (!valid) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  c.set('apiKey', apiKey);
}
```

### 1.3 Protected Routes Pattern

```typescript
// apps/server/src/routes/profiles.ts
export function createProfilesRoutes(fetch: FetchFn, auth: AuthMiddleware) {
  return {
    list: () => {
      return fetch<any>('/v1/profiles')
    },
    create: (data: { name: string }) => {
      return fetch<any>('/v1/profiles', { method: 'POST', body: data })
    },
    // ...
  }
}
```

### 1.4 Endpoints to Implement

| Route | Methods | Description |
|-------|---------|-------------|
| `/profiles` | GET, POST | List/Create profiles |
| `/profiles/:id` | GET, PATCH, DELETE | Profile CRUD |
| `/accounts` | GET | List accounts by profile |
| `/accounts/:id` | DELETE | Disconnect account |
| `/accounts/health` | GET | Health check all accounts |
| `/posts` | GET, POST | List/Create posts |
| `/posts/:id` | GET, PATCH, DELETE | Post CRUD |
| `/posts/:id/retry` | POST | Retry failed post |
| `/posts/:id/unpublish` | POST | Unpublish post |
| `/queue` | GET | Get upcoming scheduled posts |
| `/media/upload` | POST | Upload media |
| `/analytics` | GET | Post analytics |
| `/usage` | GET | Usage stats (limits) |
| `/connect/:platform` | GET | OAuth URL for platform |

---

## Phase 2: Frontend - Auth Stores

### 2.1 Auth Store

File: `apps/web/src/stores/auth-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UsageStats {
  planName: string
  limits: { uploads: number; profiles: number }
  usage: { uploads: number; profiles: number }
}

interface AuthState {
  apiKey: string | null
  usageStats: UsageStats | null
  isValidating: boolean
  error: string | null
  hasHydrated: boolean
  setApiKey: (key: string | null) => void
  setUsageStats: (stats: UsageStats | null) => void
  setIsValidating: (validating: boolean) => void
  setError: (error: string | null) => void
  setHasHydrated: (hydrated: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      apiKey: null,
      usageStats: null,
      isValidating: false,
      error: null,
      hasHydrated: false,
      setApiKey: (key) => set({ apiKey: key, error: null }),
      setUsageStats: (stats) => set({ usageStats: stats }),
      setIsValidating: (validating) => set({ isValidating: validating }),
      setError: (error) => set({ error }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      logout: () => set({ apiKey: null, usageStats: null, error: null }),
    }),
    {
      name: 'betterstack-auth',  // localStorage key
      partialize: (state) => ({
        apiKey: state.apiKey,
        usageStats: state.usageStats,
      }),
    }
  )
)
```

### 2.2 App Store

File: `apps/web/src/stores/app-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  timezone: string
  defaultProfileId: string | null
  sidebarOpen: boolean
  setTimezone: (timezone: string) => void
  setDefaultProfileId: (profileId: string | null) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      defaultProfileId: null,
      sidebarOpen: true,
      setTimezone: (timezone) => set({ timezone }),
      setDefaultProfileId: (profileId) => set({ defaultProfileId: profileId }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'betterstack-app',
      partialize: (state) => ({
        timezone: state.timezone,
        defaultProfileId: state.defaultProfileId,
      }),
    }
  )
)
```

---

## Phase 3: Frontend - API Client

### 3.1 API Client

File: `apps/web/src/lib/client.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T; error: any }> {
  const apiKey = useAuthStore.getState().apiKey

  if (!apiKey) {
    return { data: null as T, error: 'Not authenticated' }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { data: null as T, error: data.error || 'Request failed' }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null as T, error: error.message }
  }
}

export const api = {
  get: <T>(path: string) => fetchApi<T>(path),
  post: <T>(path: string, body: any) =>
    fetchApi<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: any) =>
    fetchApi<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => fetchApi<T>(path, { method: 'DELETE' }),
}
```

---

## Phase 4: Frontend - TanStack Query Hooks

### 4.1 Hooks Structure

```
apps/web/src/hooks/
├── index.ts              # Export all hooks
├── use-zernio.ts         # Client getter (like use-late.ts)
├── use-profiles.ts
├── use-accounts.ts
├── use-posts.ts
├── use-queue.ts
├── use-media.ts
└── use-analytics.ts
```

### 4.2 use-zernio.ts

```typescript
import { useMemo } from 'react'
import { useAuthStore } from '@/stores'

// Type for Zernio client - match server client types
export function useZernio() {
  const { apiKey } = useAuthStore()

  const client = useMemo(() => {
    if (!apiKey) return null
    // Return a client wrapper that uses the API
    return createZernioClient(apiKey)
  }, [apiKey])

  return client
}

export function useZernioClient() {
  const client = useZernio()
  if (!client) {
    throw new Error('Not authenticated. Please connect your API key.')
  }
  return client
}
```

### 4.3 use-profiles.ts

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useZernio } from './use-zernio'
import { useAppStore } from '@/stores'
import { useEffect } from 'react'

export const profileKeys = {
  all: ['profiles'] as const,
  detail: (id: string) => ['profiles', id] as const,
}

export function useProfiles() {
  const zernio = useZernio()
  const { defaultProfileId, setDefaultProfileId } = useAppStore()

  const query = useQuery({
    queryKey: profileKeys.all,
    queryFn: async () => {
      if (!zernio) throw new Error('Not authenticated')
      const { data, error } = await zernio.profiles.list()
      if (error) throw error
      return data
    },
    enabled: !!zernio,
  })

  // Auto-set default profile
  useEffect(() => {
    if (query.data?.profiles?.length && !defaultProfileId) {
      setDefaultProfileId(query.data.profiles[0]._id)
    }
  }, [query.data, defaultProfileId, setDefaultProfileId])

  return query
}

export function useCreateProfile() {
  const zernio = useZernio()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      if (!zernio) throw new Error('Not authenticated')
      return zernio.profiles.create({ name })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all })
    },
  })
}
```

### 4.4 use-accounts.ts

```typescript
export const accountKeys = {
  all: ['accounts'] as const,
  list: (profileId: string) => ['accounts', 'list', profileId] as const,
  health: (profileId: string) => ['accounts', 'health', profileId] as const,
}

export function useAccounts(profileId?: string) {
  const zernio = useZernio()
  const { defaultProfileId } = useAppStore()
  const targetProfileId = profileId || defaultProfileId

  return useQuery({
    queryKey: accountKeys.list(targetProfileId || ''),
    queryFn: async () => {
      if (!zernio) throw new Error('Not authenticated')
      return zernio.accounts.list({ profileId: targetProfileId })
    },
    enabled: !!zernio && !!targetProfileId,
  })
}

export function useAccountsHealth(profileId?: string) {
  // Similar pattern...
}

export function useConnectAccount() {
  const zernio = useZernio()
  const { defaultProfileId } = useAppStore()

  return useMutation({
    mutationFn: async ({ platform }: { platform: string }) => {
      if (!zernio) throw new Error('Not authenticated')
      const redirectUrl = `${window.location.origin}/callback`
      return zernio.connect.getUrl({
        platform,
        profileId: defaultProfileId,
        redirectUrl,
      })
    },
  })
}
```

### 4.5 use-posts.ts

```typescript
export const postKeys = {
  all: ['posts'] as const,
  list: (profileId?: string) => ['posts', 'list', profileId] as const,
  detail: (postId: string) => ['posts', detail, postId] as const,
  queue: (profileId?: string) => ['posts', 'queue', profileId] as const,
}

export function usePosts(profileId?: string) {
  const zernio = useZernio()
  const { defaultProfileId } = useAppStore()

  return useQuery({
    queryKey: postKeys.list(profileId || defaultProfileId),
    queryFn: async () => {
      if (!zernio) throw new Error('Not authenticated')
      return zernio.posts.list({ profileId: profileId || defaultProfileId })
    },
    enabled: !!zernio,
  })
}

export function useCreatePost() {
  const zernio = useZernio()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePostInput) => {
      if (!zernio) throw new Error('Not authenticated')
      return zernio.posts.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
  })
}

export function useDeletePost() {
  // Similar mutation pattern...
}

export function useRetryPost() {
  // For failed posts...
}
```

---

## Phase 5: API Validation Route

File: `apps/web/src/app/api/validate-key/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey || typeof apiKey !== 'string') {
      return NextResponse.json({ error: 'API key required' }, { status: 400 })
    }

    if (!apiKey.startsWith('sk_')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 })
    }

    // Test the API key
    const response = await fetch(`${API_BASE_URL}/usage`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    const data = await response.json()

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}
```

---

## Phase 6: Connect Page (OAuth Callback)

File: `apps/web/src/app/callback/page.tsx`

```typescript
// Handle OAuth callback from Zernio
// Extract state/code from URL
// Exchange for account connection
// Redirect to dashboard
```

---

## Phase 7: Replace Dummy Data

逐步替换:

1. `src/data/mock.ts` → Remove, replace with TanStack Query hooks
2. `src/lib/data/social-data.ts` → Remove sample data
3. Components → use hooks instead of direct data import

---

## Migration Sequence

```
Step 1: Setup stores (auth-store, app-store)
Step 2: Create API client lib
Step 3: Create validate-key API route
Step 4: Create TanStack Query hooks
Step 5: Create callback page
Step 6: Update components to use hooks
Step 7: Remove dummy data files
Step 8: Cleanup
```

---

## Notes

- Backend server jalan di Cloudflare Workers (port 8787 untuk local dev)
- API key validation happens via server, not directly to Zernio
- All state persisted to localStorage via Zustand persist
- Query invalidation pattern: `onSuccess: () => queryClient.invalidateQueries({ queryKey: ... })`
