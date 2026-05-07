# Social Media Connections - Store in Convex

**Date:** 2026-05-06
**Status:** Approved

## Overview

Store social media account data from Zernio API in Convex database to reduce API calls and enable offline access. OAuth callback handled server-side for token security.

## Architecture

```
User → Frontend → Server (get authUrl) → Zernio OAuth
Zernio → Server Callback → Convex Mutation → Stored Account
Frontend → Convex (read accounts, no Zernio direct)
```

## Components

### 1. Server Callback Handler
**File:** `apps/server/src/routes/core/callback.ts`

- `GET /v1/callback/:platform` - OAuth callback endpoint
- Validates state param (CSRF protection)
- Exchanges auth code for tokens via Zernio
- Calls Convex mutation `storeAccount()`
- Redirects to frontend `/connections?status={success|error}`

### 2. Convex Mutation: storeAccount
**File:** `apps/web/convex/accounts.ts` (new)

```typescript
mutation storeAccount({
  platform: string,
  accountId: string,
  accountName: string,
  avatarUrl?: string,
  tokens: string, // encrypted
  status: "active" | "error"
})
```

- Encrypt tokens before storage (using `edgesecret` or similar)
- Upsert logic: update if accountId exists, else insert
- Link to current user via `userId` from auth context

### 3. Convex Queries: account queries
**File:** `apps/web/convex/accounts.ts` (new)

```typescript
query getAccounts() // list all connected accounts for current user
query getAccount(accountId: string) // single account details
mutation disconnectAccount(accountId: string) // set status to "disconnected"
mutation refreshAccount(accountId: string) // re-fetch from Zernio, update tokens
```

### 4. Server Convex Admin Client
**File:** `apps/server/src/lib/convex-admin.ts` (new)

- Uses `CONVEX_DEPLOYMENT_KEY` (internal env var)
- Calls Convex mutations from server context
- Admin-only, not exposed to frontend

### 5. Frontend Updates
**File:** `apps/web/src/hooks/use-accounts.ts`

- `useAccounts()` → reads from Convex query (not React Query → Zernio direct)
- `useConnectAccount()` → still calls server `/v1/connect/{platform}`, redirects to OAuth
- `useDisconnectAccount()` → calls Convex mutation

## Security

| Concern | Solution |
|---------|----------|
| Tokens exposed to frontend | Never sent to frontend, server handles exchange |
| CSRF on callback | Validate `state` param from OAuth flow |
| Token storage | Encrypt tokens at rest in Convex |
| Server→Convex auth | `CONVEX_DEPLOYMENT_KEY` internal env |
| Frontend can only read own accounts | Convex query filters by `userId` from auth |

## Environment Variables

**Server** (`apps/server/.dev.vars` or Cloudflare secrets):
- `CONVEX_DEPLOYMENT_KEY` - Admin key for server to write to Convex

## Data Flow Detail

```
1. GET /v1/connect/twitter?profileId=xxx&redirect_url=https://app.com/callback
   → Server calls Zernio, returns { authUrl, state }

2. User redirected to Zernio OAuth → authenticates

3. Zernio calls GET /v1/callback/twitter?code=xxx&state=yyy
   → Server validates state
   → Server POST to Zernio /oauth/token with code
   → Server calls convex mutation storeAccount({ platform, tokens, ... })
   → Server redirect to https://app.com/connections?status=success

4. Frontend /connections loads
   → useAccounts() calls Convex query getAccounts()
   → Returns socialAccounts from Convex (no Zernio call)
```

## Files to Create/Modify

| File | Action |
|------|--------|
| `apps/server/src/routes/core/callback.ts` | Create |
| `apps/server/src/lib/convex-admin.ts` | Create |
| `apps/server/src/index.ts` | Modify - add callback routes |
| `apps/web/convex/accounts.ts` | Create - queries & mutations |
| `apps/web/convex/schema.ts` | Modify - add token encryption helper |
| `apps/web/src/hooks/use-accounts.ts` | Modify - use Convex instead of direct API |
| `apps/web/src/components/features/settings/connections-tab.tsx` | Modify - adapt to new hooks |
| `apps/web/src/lib/client.ts` | Modify - remove account-related calls |

## Statuses

- `active` - connected and working
- `error` - token expired or API error
- `disconnected` - user manually disconnected

## Testing

- OAuth flow end-to-end
- Token encryption/decryption roundtrip
- Convex query returns correct accounts per user
- Disconnect updates status, doesn't delete record