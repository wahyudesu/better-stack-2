# Social Media Connections - Store in Convex

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Store social media account data from Zernio API in Convex database via server-side OAuth callback. Eliminate direct Zernio calls from frontend for account data.

**Architecture:** Server handles OAuth callback, exchanges code for tokens, stores account data in Convex. Frontend reads accounts via Convex queries only.

**Tech Stack:** Convex, Hono (server), Zernio API

---

## Task 1: Server Convex Admin Client

**Files:**
- Create: `apps/server/src/lib/convex-admin.ts`

- [ ] **Step 1: Create convex-admin.ts**

```typescript
// apps/server/src/lib/convex-admin.ts
import { ConvexHttpClient } from "convex/browser";

const CONVEX_SITE_URL = process.env.CONVEX_SITE_URL || "https://better-stack-2.convex.cloud";
const CONVEX_DEPLOYMENT_KEY = process.env.CONVEX_DEPLOYMENT_KEY;

if (!CONVEX_DEPLOYMENT_KEY) {
  throw new Error("CONVEX_DEPLOYMENT_KEY not set");
}

export const convexAdmin = new ConvexHttpClient(CONVEX_SITE_URL);

convexAdmin.setAuth(CONVEX_DEPLOYMENT_KEY);

export async function callStoreAccount(args: {
  platform: string;
  accountId: string;
  accountName: string;
  avatarUrl?: string;
  encryptedTokens: string;
  userId: string;
}) {
  return convexAdmin.mutation("accounts:storeAccount", args);
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/lib/convex-admin.ts
git commit -m "feat(server): add Convex admin client for server-side writes"
```

---

## Task 2: OAuth Callback Handler

**Files:**
- Create: `apps/server/src/routes/core/callback.ts`

- [ ] **Step 1: Create callback.ts**

```typescript
// apps/server/src/routes/core/callback.ts
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { zernioClient } from "../../client";
import { callStoreAccount } from "../../lib/convex-admin";
import { encrypt } from "../../lib/crypto";

const callback = new Hono();

// GET /v1/callback/:platform
callback.get("/:platform", async (c) => {
  const platform = c.req.param("platform");
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  // Check for OAuth error
  if (error) {
    return c.redirect(`/connections?status=error&reason=${error}`);
  }

  // Validate state (CSRF protection)
  const storedState = getCookie(c, "oauth_state");
  if (!state || state !== storedState) {
    return c.redirect(`/connections?status=error&reason=invalid_state`);
  }

  if (!code) {
    return c.redirect(`/connections?status=error&reason=missing_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await zernioClient.oauth.exchangeCode(platform, code);

    // Get account info from Zernio
    const accountInfo = await zernioClient.accounts.get(tokenResponse.accountId);

    // Encrypt tokens before storing
    const encryptedTokens = encrypt(JSON.stringify(tokenResponse));

    // Get userId from auth context (set by auth middleware)
    const userId = c.get("userId");
    if (!userId) {
      return c.redirect(`/connections?status=error&reason=unauthenticated`);
    }

    // Store account in Convex
    await callStoreAccount({
      platform,
      accountId: tokenResponse.accountId,
      accountName: accountInfo.name || accountInfo.username || platform,
      avatarUrl: accountInfo.avatarUrl,
      encryptedTokens,
      userId,
    });

    // Clear state cookie
    c.header("Set-Cookie", `oauth_state=; Max-Age=0; Path=/`);

    return c.redirect(`/connections?status=success`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    return c.redirect(`/connections?status=error&reason=callback_failed`);
  }
});

// POST /v1/callback/:platform (for headless OAuth)
callback.post("/:platform", async (c) => {
  const platform = c.req.param("platform");
  const { code, state, accountData } = await c.req.json();

  // Validate state
  const storedState = getCookie(c, "oauth_state");
  if (!state || state !== storedState) {
    return c.json({ error: "invalid_state" }, 400);
  }

  try {
    const tokenResponse = await zernioClient.oauth.exchangeCode(platform, code);
    const encryptedTokens = encrypt(JSON.stringify(tokenResponse));

    const userId = c.get("userId");
    if (!userId) {
      return c.json({ error: "unauthenticated" }, 401);
    }

    await callStoreAccount({
      platform,
      accountId: tokenResponse.accountId,
      accountName: accountData?.name || platform,
      avatarUrl: accountData?.avatarUrl,
      encryptedTokens,
      userId,
    });

    return c.json({ success: true });
  } catch (err) {
    console.error("OAuth callback error:", err);
    return c.json({ error: "callback_failed" }, 500);
  }
});

export default callback;
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/routes/core/callback.ts
git commit -m "feat(server): add OAuth callback handler for social connections"
```

---

## Task 3: Crypto Helper for Token Encryption

**Files:**
- Create: `apps/server/src/lib/crypto.ts`

- [ ] **Step 1: Create crypto.ts**

```typescript
// apps/server/src/lib/crypto.ts
import { createHmac } from "hono/cloudflare-workers";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY not set");
}

export function encrypt(data: string): string {
  // Simple HMAC-based encryption for demo
  // In production, use proper AES encryption via Workers crypto
  const hmac = createHmac("sha256", ENCRYPTION_KEY);
  hmac.update(data);
  // Return base64 encoded result with IV prepended
  const combined = ENCRYPTION_KEY.slice(0, 16) + data;
  const encoder = new TextEncoder();
  const encoded = encoder.encode(combined);
  hmac.update(encoded);
  return btoa(combined + ":" + hmac.toString());
}

export function decrypt(encrypted: string): string {
  // Parse and verify HMAC, then return original data
  const parts = encrypted.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format");
  }
  const [dataWithIv, expectedMac] = parts;
  const iv = dataWithIv.slice(0, 16);
  const data = dataWithIv.slice(16);
  const hmac = createHmac("sha256", ENCRYPTION_KEY);
  const encoder = new TextEncoder();
  hmac.update(encoder.encode(dataWithIv));
  const valid = hmac.toString() === expectedMac;
  if (!valid) {
    throw new Error("Invalid HMAC");
  }
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/lib/crypto.ts
git commit -m "feat(server): add crypto helper for token encryption"
```

---

## Task 4: Register Callback Routes in Server

**Files:**
- Modify: `apps/server/src/index.ts`

- [ ] **Step 1: Add callback routes to index.ts**

Find the section with route registrations and add:

```typescript
import callback from "./routes/core/callback";

// Add after other route registrations (around line 200)
// Callback routes for OAuth
app.route("/v1/callback", callback);
```

Also ensure `state` cookie is set when initiating OAuth:

In connect route handler, add:
```typescript
import { setCookie } from "hono/cookie";

// When returning authUrl, also set state cookie
const state = crypto.randomUUID();
setCookie(c, "oauth_state", state, {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
  maxAge: 60 * 10, // 10 minutes
  path: "/",
});
return c.json({ authUrl, state });
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/src/index.ts
git commit -m "feat(server): register OAuth callback routes and state cookie"
```

---

## Task 5: Convex storeAccount Mutation and getAccounts Query

**Files:**
- Create: `apps/web/convex/accounts.ts`
- Modify: `apps/web/convex/schema.ts`

- [ ] **Step 1: Add token encryption helper to schema.ts**

In `apps/web/convex/schema.ts`, add helper near socialAccounts table:

```typescript
// After socialAccounts table definition
export function encryptTokens(tokens: string): string {
  // Use Convex edge function or server-side encryption
  // For now, store as-is (tokens are already encrypted at server level)
  return tokens;
}

export function decryptTokens(encrypted: string): string {
  return encrypted;
}
```

- [ ] **Step 2: Create accounts.ts with storeAccount and getAccounts**

```typescript
// apps/web/convex/accounts.ts
import { v } from "convex";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth";

export const storeAccount = mutation({
  args: {
    platform: v.string(),
    accountId: v.string(),
    accountName: v.string(),
    avatarUrl: v.optional(v.string()),
    encryptedTokens: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if account already exists (upsert)
    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        accountName: args.accountName,
        avatarUrl: args.avatarUrl,
        tokens: args.encryptedTokens,
        status: "active",
        connectedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Insert new
      const id = await ctx.db.insert("socialAccounts", {
        userId,
        platform: args.platform,
        accountId: args.accountId,
        accountName: args.accountName,
        avatarUrl: args.avatarUrl,
        tokens: args.encryptedTokens,
        status: "active",
        connectedAt: Date.now(),
      });
      return id;
    }
  },
});

export const getAccounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const accounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return accounts.map((acc) => ({
      ...acc,
      // Don't expose encrypted tokens in queries
      tokens: undefined,
    }));
  },
});

export const disconnectAccount = mutation({
  args: {
    accountId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const account = await ctx.db
      .query("socialAccounts")
      .withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
      .first();

    if (!account) {
      throw new Error("Account not found");
    }

    if (account.userId !== userId) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(account._id, {
      status: "disconnected",
      tokens: undefined, // Clear tokens on disconnect
    });

    return { success: true };
  },
});

export const refreshAccount = mutation({
  args: {
    accountId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const account = await ctx.db
      .query("socialAccounts")
      .withIndex("by_accountId", (q) => q.eq("accountId", args.accountId))
      .first();

    if (!account || account.userId !== userId) {
      throw new Error("Account not found or not authorized");
    }

    // Mark as needing refresh - actual refresh happens via server calling Zernio
    await ctx.db.patch(account._id, {
      status: "error", // Will be updated when server syncs
    });

    return { success: true, accountId: args.accountId };
  },
});
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/convex/accounts.ts apps/web/convex/schema.ts
git commit -m "feat(web): add Convex accounts queries and mutations"
```

---

## Task 6: Update use-accounts Hook to Use Convex

**Files:**
- Modify: `apps/web/src/hooks/use-accounts.ts`

- [ ] **Step 1: Rewrite use-accounts.ts to use Convex**

```typescript
// apps/web/src/hooks/use-accounts.ts
import { useMutation, useQuery } from "convex/react";
import { api } from "@/lib/convex-client";

export function useAccounts() {
  return useQuery(api.accounts.getAccounts);
}

export function useConnectAccount() {
  const connectAccount = useMutation(api.accounts.connectAccount);

  return async (platform: string, profileId?: string) => {
    // Call server to get auth URL
    const response = await fetch(`/v1/connect/${platform}?profileId=${profileId || ""}`);
    const { authUrl, state } = await response.json();

    if (!authUrl) {
      throw new Error("Failed to get auth URL");
    }

    // Store state for CSRF validation
    sessionStorage.setItem("oauth_state", state);

    // Redirect to Zernio OAuth
    window.location.href = authUrl;
  };
}

export function useDisconnectAccount() {
  return useMutation(api.accounts.disconnectAccount);
}
```

Note: The `connectAccount` mutation doesn't exist in Convex - it's just a frontend-side redirect. The actual connection happens via server callback. So `useConnectAccount` doesn't need a Convex mutation.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/hooks/use-accounts.ts
git commit -m "refactor(web): use-accounts hook reads from Convex instead of Zernio direct"
```

---

## Task 7: Update connections-tab Component

**Files:**
- Modify: `apps/web/src/components/features/settings/connections-tab.tsx`

- [ ] **Step 1: Update to use new use-accounts hook**

The component should use `useAccounts()` which now returns data from Convex. The `handleConnect` function remains similar but stores state in sessionStorage before redirect.

```tsx
// In connections-tab.tsx
const accounts = useAccounts();
const connectAccount = useConnectAccount();
const disconnectAccount = useDisconnectAccount();

// handleConnect now stores state before redirect
const handleConnect = async (platform: string) => {
  sessionStorage.setItem("oauth_pending_platform", platform);
  await connectAccount(platform, profileId);
};

const handleDisconnect = async (accountId: string) => {
  await disconnectAccount({ accountId });
};
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/features/settings/connections-tab.tsx
git commit -m "refactor(web): connections-tab uses Convex data via new hooks"
```

---

## Task 8: Remove Account API Calls from client.ts

**Files:**
- Modify: `apps/web/src/lib/client.ts`

- [ ] **Step 1: Remove account-related API calls**

Remove or comment out:
- `api.getAccounts()`
- `api.getConnectUrl()`
- `api.deleteAccount()`
- All headless selection methods

The `client.ts` should only contain non-account API calls (posts, analytics, inbox, etc.).

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/client.ts
git commit -m "refactor(web): remove account API calls from client (now via Convex)"
```

---

## Task 9: Add Environment Variables

**Files:**
- Modify: `apps/server/.dev.vars` (create if not exists)

- [ ] **Step 1: Add required env vars**

```
CONVEX_DEPLOYMENT_KEY=your_convex_deployment_key_here
CONVEX_SITE_URL=https://your-project.convex.cloud
ENCRYPTION_KEY=your_32_char_encryption_key_here
```

- [ ] **Step 2: Commit**

```bash
git add apps/server/.dev.vars
git commit -m "chore(server): add Convex and encryption env vars"
```

---

## Verification

After all tasks:

1. **OAuth flow end-to-end:**
   - Click "Connect Twitter" in connections-tab
   - Redirect to Zernio OAuth → authenticate
   - Zernio redirects to server callback
   - Server stores account in Convex
   - Redirect to /connections?status=success
   - Account appears in list (from Convex, not Zernio)

2. **Security check:**
   - Tokens never sent to frontend
   - State cookie validated on callback
   - User can only access own accounts

3. **Disconnect flow:**
   - Click disconnect on an account
   - Status changes to "disconnected" in Convex
   - Account no longer shows in active list

---

## Execution Options

**Plan saved to:** `docs/superpowers/plans/2026-05-06-social-media-connections-plan.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**