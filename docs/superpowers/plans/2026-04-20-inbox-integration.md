# Inbox Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect frontend inbox UI to server routes. Replace mock conversations + mock automation rules with real server data. Add message sending + label assignment mutations.

**Architecture:**
1. Extend `ZernioClient` with inbox routes (conversations, messages, comments, reviews, contacts, sequences, broadcasts)
2. Create `useInbox` hook with TanStack Query caching + polling for new messages
3. Create `usePlanGate` hook to detect free vs paid plan via `/v1/usage-stats`
4. Add free-plan upsell gating: show upgrade prompt instead of errors when 403 hits
5. Replace `mockConversations` in `InboxContent.tsx` with hook data
6. Replace `mockRules` in `InboxAutomation.tsx` with sequences + commentAutomations data
7. Add mutations: send message, add/remove reaction, reply to comment, label assignment

**Zernio Plan Gating:**
All `/v1/inbox/*` endpoints return `403 Inbox addon required` on free plan. Frontend must:
1. Detect plan via `usePlanGate()` hook (checks usage stats)
2. Show upsell UI instead of empty/error state when inbox blocked
3. Preserve existing mock data as fallback during transition

**Tech Stack:** TanStack Query v5, React Query, existing ZernioClient pattern

---

## File Map

| File | Role |
|------|------|
| `apps/web/src/hooks/use-zernio.ts` | ZernioClient (add inbox methods) |
| `apps/web/src/hooks/use-inbox.ts` | **NEW** - conversations + messages + comments hooks |
| `apps/web/src/hooks/use-inbox-automation.ts` | **NEW** - sequences + broadcasts + commentAutomations hooks |
| `apps/web/src/app/inbox/InboxContent.tsx` | Inbox UI (replace mock) |
| `apps/web/src/app/inbox/InboxAutomation.tsx` | Automation UI (replace mock) |
| `apps/server/src/routes/inbox/inbox.ts` | Server conversations + messages routes |
| `apps/server/src/routes/inbox/contacts.ts` | Server contacts routes |
| `apps/server/src/routes/inbox/sequences.ts` | Server sequences routes |
| `apps/server/src/routes/inbox/broadcasts.ts` | Server broadcasts routes |
| `apps/server/src/routes/inbox/commentAutomations.ts` | Server commentAutomations routes |
| `apps/web/src/hooks/use-plan-gate.ts` | **NEW** - plan detection + upsell gating |

---

## Task 0: Create usePlanGate Hook (Plan Detection + Upsell)

**Files:**
- Create: `apps/web/src/hooks/use-plan-gate.ts`

- [ ] **Step 1: Write plan gate hook**

Create `apps/web/src/hooks/use-plan-gate.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { useZernioClient } from "./use-zernio";

export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export interface PlanInfo {
  tier: PlanTier;
  hasInboxAddon: boolean;
  inboxStatus: "available" | "blocked" | "unknown";
  blockedReason?: string;
  // Usage limits
  usage: {
    uploads: number;
    profiles: number;
  };
  limits: {
    uploads: number;
    profiles: number;
  };
  planName: string;
}

// Known plan names per tier (Zernio API response)
const INBOX_ADDON_PLANS = [
  "starter",
  "pro",
  "professional",
  "business",
  "enterprise",
];

function parsePlanTier(planName: string): PlanTier {
  const lower = planName.toLowerCase();
  if (lower.includes("enterprise")) return "enterprise";
  if (lower.includes("pro") || lower.includes("professional")) return "pro";
  if (lower.includes("starter")) return "starter";
  return "free";
}

export function usePlanGate() {
  const client = useZernioClient();

  return useQuery({
    queryKey: ["plan-gate"],
    queryFn: async (): Promise<PlanInfo> => {
      const { data, error } = await client.usage.getUsageStats();

      if (error) {
        // On error, assume unknown - don't block UI
        return {
          tier: "free",
          hasInboxAddon: false,
          inboxStatus: "unknown",
          usage: { uploads: 0, profiles: 0 },
          limits: { uploads: 0, profiles: 0 },
          planName: "Unknown",
        };
      }

      const tier = parsePlanTier(data.planName);
      const hasInboxAddon = INBOX_ADDON_PLANS.some(p =>
        data.planName.toLowerCase().includes(p)
      );

      return {
        tier,
        hasInboxAddon,
        inboxStatus: hasInboxAddon ? "available" : "blocked",
        blockedReason: hasInboxAddon ? undefined : "Inbox requires Starter plan or higher",
        usage: data.usage,
        limits: data.limits,
        planName: data.planName,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 min - plan rarely changes
    enabled: !!client,
  });
}

/**
 * Hook to check if inbox feature is accessible
 * Returns: { canAccess: boolean, UpgradeUI: ReactComponent | null }
 */
export function useInboxAccess() {
  const { data: plan, isLoading } = usePlanGate();

  const canAccess = plan?.inboxStatus === "available" || plan?.inboxStatus === "unknown";

  return {
    canAccess,
    isLoading,
    plan,
    // Show upgrade prompt if blocked
    UpgradePrompt: !canAccess && !isLoading ? UpgradePromptComponent : null,
  };
}

function UpgradePromptComponent({ tier = "free" }: { tier?: PlanTier }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <svg className="w-16 h-16 mx-auto text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Inbox Unavailable</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Inbox requires a Starter plan or higher. Upgrade to access conversations, comments, and automation.
      </p>
      <button
        onClick={() => window.open("/settings?tab=billing", "_blank")}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        View Plans
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Export from hooks/index.ts**

Add to `apps/web/src/hooks/index.ts`:

```typescript
export {
  usePlanGate,
  useInboxAccess,
  type PlanTier,
  type PlanInfo,
} from "./use-plan-gate";
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-plan-gate.ts apps/web/src/hooks/index.ts
git commit -m "feat: add usePlanGate hook for 403 upsell handling"
```

---

## Task 1: Extend ZernioClient with Inbox Routes

**Files:**
- Modify: `apps/web/src/hooks/use-zernio.ts`

- [ ] **Step 1: Add inbox types to ZernioClient interface**

After line 82 (closing `usage` block), add:

```typescript
inbox: {
  // Conversations
  listConversations: (params?: {
    accountId?: string;
    platform?: string;
    page?: number;
    limit?: number;
  }) => Promise<{ data: { conversations: any[] }; error: any }>;
  getConversation: (params: {
    path: { conversationId: string };
  }) => Promise<{ data: any; error: any }>;
  listMessages: (params: {
    path: { conversationId: string };
    query?: { page?: number; limit?: number };
  }) => Promise<{ data: { messages: any[] }; error: any }>;
  sendMessage: (params: {
    path: { conversationId: string };
    body: { text: string; mediaUrl?: string };
  }) => Promise<{ data: any; error: any }>;
  markAsRead: (params: {
    path: { conversationId: string };
  }) => Promise<{ error: any }>;
  // Comments
  listComments: (params?: {
    accountId?: string;
    page?: number;
    limit?: number;
  }) => Promise<{ data: { comments: any[] }; error: any }>;
  hideComment: (params: {
    path: { postId: string; commentId: string };
  }) => Promise<{ error: any }>;
  privateReply: (params: {
    path: { postId: string; commentId: string };
    body: { text: string };
  }) => Promise<{ data: any; error: any }>;
  // Reviews
  listReviews: (params?: {
    accountId?: string;
    page?: number;
    limit?: number;
  }) => Promise<{ data: { reviews: any[] }; error: any }>;
  replyToReview: (params: {
    path: { reviewId: string };
    body: { text: string };
  }) => Promise<{ data: any; error: any }>;
};
contacts: {
  list: (params?: { page?: number; limit?: number; search?: string }) => Promise<{ data: { contacts: any[] }; error: any }>;
  get: (params: { path: { contactId: string } }) => Promise<{ data: any; error: any }>;
  create: (params: { body: { phone?: string; email?: string; firstName?: string; lastName?: string; tags?: string[] } }) => Promise<{ data: any; error: any }>;
  update: (params: { path: { contactId: string }; body: { firstName?: string; lastName?: string; tags?: string[] } }) => Promise<{ data: any; error: any }>;
  delete: (params: { path: { contactId: string } }) => Promise<{ error: any }>;
};
sequences: {
  list: (params?: { page?: number; limit?: number; status?: string }) => Promise<{ data: { sequences: any[] }; error: any }>;
  create: (params: { body: { name: string; steps: Array<{ delay?: number; action?: string; templateId?: string }> } }) => Promise<{ data: any; error: any }>;
  update: (params: { path: { sequenceId: string }; body: { name?: string; steps?: any[] } }) => Promise<{ data: any; error: any }>;
  delete: (params: { path: { sequenceId: string } }) => Promise<{ error: any }>;
  activate: (params: { path: { sequenceId: string } }) => Promise<{ data: any; error: any }>;
  pause: (params: { path: { sequenceId: string } }) => Promise<{ data: any; error: any }>;
};
broadcasts: {
  list: (params: { accountId: string; page?: number; limit?: number }) => Promise<{ data: { broadcasts: any[] }; error: any }>;
  create: (params: { body: { accountId: string; templateName: string; recipientIds?: string[]; segmentFilter?: object } }) => Promise<{ data: any; error: any }>;
  send: (params: { path: { broadcastId: string }; body: { accountId: string } }) => Promise<{ data: any; error: any }>;
};
```

- [ ] **Step 2: Implement inbox methods in createZernioClient**

After the existing `analytics` block (around line 186), add:

```typescript
inbox: {
  listConversations: async ({ query } = {}) => {
    const params = new URLSearchParams();
    if (query?.accountId) params.set("accountId", query.accountId);
    if (query?.platform) params.set("platform", query.platform);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ conversations: any[] }>(`/v1/inbox/conversations${queryStr ? `?${queryStr}` : ""}`);
  },
  getConversation: async ({ path }) => {
    return api.get<any>(`/v1/inbox/conversations/${path.conversationId}`);
  },
  listMessages: async ({ path, query } = {}) => {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ messages: any[] }>(`/v1/inbox/conversations/${path.conversationId}/messages${queryStr ? `?${queryStr}` : ""}`);
  },
  sendMessage: async ({ path, body }) => {
    return api.post<any>(`/v1/inbox/conversations/${path.conversationId}/messages`, body);
  },
  markAsRead: async ({ path }) => {
    return api.post(`/v1/inbox/conversations/${path.conversationId}/read`, {});
  },
  listComments: async ({ query } = {}) => {
    const params = new URLSearchParams();
    if (query?.accountId) params.set("accountId", query.accountId);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ comments: any[] }>(`/v1/inbox/comments${queryStr ? `?${queryStr}` : ""}`);
  },
  hideComment: async ({ path }) => {
    return api.post(`/v1/inbox/comments/${path.postId}/${path.commentId}/hide`, {});
  },
  privateReply: async ({ path, body }) => {
    return api.post<any>(`/v1/inbox/comments/${path.postId}/${path.commentId}/private-reply`, body);
  },
  listReviews: async ({ query } = {}) => {
    const params = new URLSearchParams();
    if (query?.accountId) params.set("accountId", query.accountId);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ reviews: any[] }>(`/v1/inbox/reviews${queryStr ? `?${queryStr}` : ""}`);
  },
  replyToReview: async ({ path, body }) => {
    return api.post<any>(`/v1/inbox/reviews/${path.reviewId}/reply`, body);
  },
},
contacts: {
  list: async ({ query } = {}) => {
    const params = new URLSearchParams();
    if (query?.search) params.set("search", query.search);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ contacts: any[] }>(`/v1/contacts${queryStr ? `?${queryStr}` : ""}`);
  },
  get: async ({ path }) => {
    return api.get<any>(`/v1/contacts/${path.contactId}`);
  },
  create: async ({ body }) => {
    return api.post<any>("/v1/contacts", body);
  },
  update: async ({ path, body }) => {
    return api.patch<any>(`/v1/contacts/${path.contactId}`, body);
  },
  delete: async ({ path }) => {
    return api.delete(`/v1/contacts/${path.contactId}`);
  },
},
sequences: {
  list: async ({ query } = {}) => {
    const params = new URLSearchParams();
    if (query?.status) params.set("status", query.status);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const queryStr = params.toString();
    return api.get<{ sequences: any[] }>(`/v1/sequences${queryStr ? `?${queryStr}` : ""}`);
  },
  create: async ({ body }) => {
    return api.post<any>("/v1/sequences", body);
  },
  update: async ({ path, body }) => {
    return api.patch<any>(`/v1/sequences/${path.sequenceId}`, body);
  },
  delete: async ({ path }) => {
    return api.delete(`/v1/sequences/${path.sequenceId}`);
  },
  activate: async ({ path }) => {
    return api.post<any>(`/v1/sequences/${path.sequenceId}/activate`, {});
  },
  pause: async ({ path }) => {
    return api.post<any>(`/v1/sequences/${path.sequenceId}/pause`, {});
  },
},
broadcasts: {
  list: async ({ query }) => {
    const params = new URLSearchParams();
    params.set("accountId", query.accountId);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    return api.get<{ broadcasts: any[] }>(`/v1/broadcasts?${params}`);
  },
  create: async ({ body }) => {
    return api.post<any>("/v1/broadcasts", body);
  },
  send: async ({ path, body }) => {
    return api.post<any>(`/v1/broadcasts/${path.broadcastId}/send`, body);
  },
},
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-zernio.ts
git commit -m "feat: extend ZernioClient with inbox, contacts, sequences, broadcasts"
```

---

## Task 2: Create useInbox Hook

**Files:**
- Create: `apps/web/src/hooks/use-inbox.ts`

- [ ] **Step 1: Write inbox hooks with polling**

Create `apps/web/src/hooks/use-inbox.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useZernioClient } from "./use-zernio";

// Cache keys
export const inboxKeys = {
  conversations: (accountId?: string, platform?: string) =>
    ["inbox", "conversations", accountId, platform] as const,
  conversation: (conversationId: string) =>
    ["inbox", "conversation", conversationId] as const,
  messages: (conversationId: string, page?: number) =>
    ["inbox", "messages", conversationId, page] as const,
  comments: (accountId?: string) =>
    ["inbox", "comments", accountId] as const,
  reviews: (accountId?: string) =>
    ["inbox", "reviews", accountId] as const,
};

const STALE_TIME = 30 * 1000;        // 30 sec - messages change often
const POLLING_INTERVAL = 15 * 1000; // poll every 15 sec for new messages
const STALE_TIME_SLOW = 5 * 60 * 1000; // 5 min - comments/reviews change less

export function useConversations(accountId?: string, platform?: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: inboxKeys.conversations(accountId, platform),
    queryFn: async () => {
      const { data, error } = await client.inbox.listConversations({
        accountId,
        platform,
        limit: 50,
      });
      if (error) throw error;
      return data?.conversations ?? [];
    },
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
    enabled: !!client,
  });
}

export function useConversation(conversationId: string | null) {
  const client = useZernioClient();

  return useQuery({
    queryKey: inboxKeys.conversation(conversationId ?? ""),
    queryFn: async () => {
      if (!conversationId) return null;
      const { data, error } = await client.inbox.getConversation({
        path: { conversationId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIME,
    enabled: !!client && !!conversationId,
  });
}

export function useMessages(conversationId: string | null) {
  const client = useZernioClient();

  return useQuery({
    queryKey: inboxKeys.messages(conversationId ?? ""),
    queryFn: async () => {
      if (!conversationId) return [];
      const { data, error } = await client.inbox.listMessages({
        path: { conversationId },
        query: { limit: 50 },
      });
      if (error) throw error;
      return data?.messages ?? [];
    },
    staleTime: STALE_TIME,
    refetchInterval: POLLING_INTERVAL,
    enabled: !!client && !!conversationId,
  });
}

export function useSendMessage(conversationId: string) {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await client.inbox.sendMessage({
        path: { conversationId },
        body: { text },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.messages(conversationId),
      });
    },
  });
}

export function useMarkAsRead(conversationId: string) {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await client.inbox.markAsRead({
        path: { conversationId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inboxKeys.conversations(),
      });
    },
  });
}

export function useComments(accountId?: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: inboxKeys.comments(accountId),
    queryFn: async () => {
      const { data, error } = await client.inbox.listComments({ accountId });
      if (error) throw error;
      return data?.comments ?? [];
    },
    staleTime: STALE_TIME_SLOW,
    enabled: !!client,
  });
}

export function useHideComment() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string; commentId: string }) => {
      const { error } = await client.inbox.hideComment({ path: { postId, commentId } });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.comments() });
    },
  });
}

export function usePrivateReply() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, commentId, text }: { postId: string; commentId: string; text: string }) => {
      const { data, error } = await client.inbox.privateReply({
        path: { postId, commentId },
        body: { text },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inboxKeys.comments() });
    },
  });
}

export function useReviews(accountId?: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: inboxKeys.reviews(accountId),
    queryFn: async () => {
      const { data, error } = await client.inbox.listReviews({ accountId });
      if (error) throw error;
      return data?.reviews ?? [];
    },
    staleTime: STALE_TIME_SLOW,
    enabled: !!client,
  });
}
```

- [ ] **Step 2: Export from hooks/index.ts**

Add to `apps/web/src/hooks/index.ts`:

```typescript
export {
  inboxKeys,
  useConversations,
  useConversation,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useComments,
  useHideComment,
  usePrivateReply,
  useReviews,
} from "./use-inbox";
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-inbox.ts apps/web/src/hooks/index.ts
git commit -m "feat: add useInbox hooks with polling for real-time messages"
```

---

## Task 3: Create useInboxAutomation Hook

**Files:**
- Create: `apps/web/src/hooks/use-inbox-automation.ts`

- [ ] **Step 1: Write automation hooks**

Create `apps/web/src/hooks/use-inbox-automation.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useZernioClient } from "./use-zernio";

export const automationKeys = {
  sequences: (status?: string) => ["automation", "sequences", status] as const,
  sequence: (sequenceId: string) => ["automation", "sequence", sequenceId] as const,
  broadcasts: (accountId: string) => ["automation", "broadcasts", accountId] as const,
};

const STALE_TIME = 60 * 1000; // 1 min

export function useSequences(status?: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: automationKeys.sequences(status),
    queryFn: async () => {
      const { data, error } = await client.sequences.list({ status });
      if (error) throw error;
      return data?.sequences ?? [];
    },
    staleTime: STALE_TIME,
    enabled: !!client,
  });
}

export function useCreateSequence() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: { name: string; steps: any[] }) => {
      const { data, error } = await client.sequences.create({ body });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
    },
  });
}

export function useUpdateSequence() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sequenceId, ...body }: { sequenceId: string; name?: string; steps?: any[] }) => {
      const { data, error } = await client.sequences.update({
        path: { sequenceId },
        body,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { sequenceId }) => {
      queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
      queryClient.invalidateQueries({ queryKey: automationKeys.sequence(sequenceId) });
    },
  });
}

export function useDeleteSequence() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sequenceId: string) => {
      const { error } = await client.sequences.delete({ path: { sequenceId } });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
    },
  });
}

export function useToggleSequence() {
  const client = useZernioClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sequenceId, enabled }: { sequenceId: string; enabled: boolean }) => {
      if (enabled) {
        const { data, error } = await client.sequences.activate({ path: { sequenceId } });
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await client.sequences.pause({ path: { sequenceId } });
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.sequences() });
    },
  });
}

export function useBroadcasts(accountId: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: automationKeys.broadcasts(accountId),
    queryFn: async () => {
      const { data, error } = await client.broadcasts.list({ accountId });
      if (error) throw error;
      return data?.broadcasts ?? [];
    },
    staleTime: STALE_TIME,
    enabled: !!client && !!accountId,
  });
}
```

- [ ] **Step 2: Export from hooks/index.ts**

Add to `apps/web/src/hooks/index.ts`:

```typescript
export {
  automationKeys,
  useSequences,
  useCreateSequence,
  useUpdateSequence,
  useDeleteSequence,
  useToggleSequence,
  useBroadcasts,
} from "./use-inbox-automation";
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-inbox-automation.ts apps/web/src/hooks/index.ts
git commit -m "feat: add useInboxAutomation hooks for sequences and broadcasts"
```

---

## Task 4: Refactor InboxContent.tsx

**Files:**
- Modify: `apps/web/src/app/inbox/InboxContent.tsx`

- [ ] **Step 1: Add hook imports**

After existing imports, add:

```typescript
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useInboxAccess,
  type Conversation,
  type ChatMessage,
} from "@/hooks";
```

- [ ] **Step 2: Add UpsellGate for free plan**

At the top of `InboxContent` component function, after `useAuthGate` call:

```typescript
const { canAccess, UpgradePrompt, isLoading: planLoading } = useInboxAccess();

if (!canAccess && !planLoading) {
  return (
    <div className={pageContainerClassName} style={pageMaxWidth}>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold tracking-tight">Inbox</h1>
        <p className="text-sm text-muted-foreground">Manage conversations and automation</p>
      </div>
      <div className="border rounded-lg">
        <UpgradePrompt />
      </div>
    </div>
  );
}
```

Also handle 403 errors from hooks gracefully. When `useConversations` returns a 403 error, fall back to empty state + upsell hint:

```typescript
const { data: serverConversations = [], isLoading: convLoading, error: convError } = useConversations(...);

if (convError && (convError.message?.includes("addon") || (convError as any).status === 403)) {
  return (
    <div className="p-4 text-center">
      <p className="text-sm text-muted-foreground mb-2">Inbox requires Starter plan</p>
      <UpgradePrompt />
    </div>
  );
}
```

- [ ] **Step 3: Replace mockConversations with useConversations**

Find the line (around 375):
```typescript
const filteredConversations = useMemo(() => {
  let result = mockConversations.filter((conv) => {
```

Replace `mockConversations` usage with server data. First, add hook calls after the state declarations (around line 327):

```typescript
// Replace: const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
// Keep state but initialize from server
const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

// Fetch conversations from server
const { data: serverConversations = [], isLoading: convLoading } = useConversations(undefined, platform === "all" ? undefined : platform);

// Map server conversations to UI format
const conversations = useMemo((): Conversation[] => {
  return serverConversations.map((conv: any) => ({
    id: conv.id,
    platform: conv.platform,
    type: conv.type,
    sender: conv.senderName ?? conv.sender ?? "Unknown",
    avatar: conv.avatarUrl ?? `https://i.pravatar.cc/150?u=${conv.id}`,
    isOnline: conv.isOnline ?? false,
    isRead: conv.isRead ?? true,
    isStarred: conv.isStarred ?? false,
    lastMessage: conv.lastMessage ?? "",
    lastMessageTime: conv.lastMessageTime ?? "",
    unreadCount: conv.unreadCount ?? 0,
    messages: (conv.messages ?? []).map((m: any): ChatMessage => ({
      id: m.id,
      content: m.text ?? m.content ?? "",
      timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      isFromMe: m.isFromMe ?? false,
    })),
    mediaPost: conv.mediaPost,
    customerLabel: conv.customerLabel,
  }));
}, [serverConversations]);

// Fetch messages for selected conversation
const { data: serverMessages = [], isLoading: messagesLoading } = useMessages(selectedConversationId);
const sendMessage = useSendMessage(selectedConversationId ?? "");

// When conversation selected from list, set ID
const handleSelectConversation = gatedCallback((conv: Conversation) => {
  setSelectedConversationId(conv.id);
  // Mark as read
  useMarkAsRead(conv.id);
}, { title: "View Messages", description: "Sign in to view messages." });

// Build selected conversation object from server data
const selectedConversation = useMemo(() => {
  if (!selectedConversationId) return null;
  const conv = conversations.find(c => c.id === selectedConversationId);
  if (!conv) return null;
  // Merge server messages
  return {
    ...conv,
    messages: serverMessages.map((m: any): ChatMessage => ({
      id: m.id,
      content: m.text ?? m.content ?? "",
      timestamp: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
      isFromMe: m.isFromMe ?? false,
    })),
  };
}, [selectedConversationId, conversations, serverMessages]);
```

- [ ] **Step 4: Replace filteredConversations useMemo**

Replace the `filteredConversations` useMemo (around line 375) to use `conversations` instead of `mockConversations`:

```typescript
const filteredConversations = useMemo(() => {
  let result = conversations.filter((conv) => {
    // ... existing filter logic unchanged
  });
  // ... existing sort logic unchanged
  return result;
}, [conversations, platform, typeFilter, searchQuery, sortBy, messageFilter]);
```

- [ ] **Step 5: Replace handleSendMessage to call mutation**

Replace the `handleSendMessageInternal` function (around line 353):

```typescript
const handleSendMessageInternal = () => {
  if (!messageInput.trim() || !selectedConversationId) return;
  sendMessage.mutate(messageInput);
  setMessageInput("");
};
```

- [ ] **Step 6: Add loading skeleton**

In the conversation list section, wrap with loading state:

```typescript
{convLoading ? (
  <div className="p-4 space-y-3">
    {[1,2,3].map(i => (
      <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
    ))}
  </div>
) : filteredConversations.length === 0 ? (
  // existing empty state
) : (
  filteredConversations.map(conv => ...)
)}
```

- [ ] **Step 7: Add polling indicator (optional polish)**

Add subtle "syncing" indicator in header when refetching.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/app/inbox/InboxContent.tsx
git commit -m "refactor(inbox): connect InboxContent to server via hooks"
```

---

## Task 5: Refactor InboxAutomation.tsx

**Files:**
- Modify: `apps/web/src/app/inbox/InboxAutomation.tsx`

- [ ] **Step 1: Add hook imports**

```typescript
import {
  useSequences,
  useCreateSequence,
  useUpdateSequence,
  useDeleteSequence,
  useToggleSequence,
} from "@/hooks";
import type { AutomationRule } from "@/lib/types/inbox-automation";
```

- [ ] **Step 2: Replace mockRules with useSequences**

Find line (around 107):
```typescript
const [rules, setRules] = useState<AutomationRule[]>(mockRules);
```

Replace with:

```typescript
const { data: sequences = [], isLoading } = useSequences();
const createSequence = useCreateSequence();
const updateSequence = useUpdateSequence();
const deleteSequence = useDeleteSequence();
const toggleSequence = useToggleSequence();

// Map sequences to AutomationRule format
const rules: AutomationRule[] = sequences.map((seq: any) => ({
  id: seq.id,
  type: seq.type === "auto-reply" ? "auto-reply" : "auto-comment",
  name: seq.name,
  enabled: seq.status === "active",
  trigger: seq.trigger ?? "all",
  keywords: seq.keywords ?? [],
  platforms: seq.platforms ?? [],
  response: seq.responseMessage ?? seq.steps?.[0]?.templateId ?? "",
  delaySeconds: seq.delaySeconds ?? 30,
  createdAt: seq.createdAt ?? new Date().toISOString().split("T")[0],
}));
```

- [ ] **Step 3: Replace local state mutations with server mutations**

Replace `saveRule` function (around line 138):

```typescript
const saveRule = () => {
  const keywordsArray = form.keywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  if (editingRule) {
    updateSequence.mutate({
      sequenceId: editingRule.id,
      name: form.name,
      steps: [{ delay: form.delaySeconds, action: form.type, templateId: form.response }],
    });
  } else {
    createSequence.mutate({
      name: form.name,
      steps: [{ delay: form.delaySeconds, action: form.type, templateId: form.response }],
    });
  }
  closeDialog();
};
```

Replace `toggleRule` function (around line 179):

```typescript
const toggleRule = (id: string) => {
  const rule = rules.find(r => r.id === id);
  if (rule) {
    toggleSequence.mutate({ sequenceId: id, enabled: !rule.enabled });
  }
};
```

Replace `deleteRule` function (around line 185):

```typescript
const deleteRule = (id: string) => {
  deleteSequence.mutate(id);
};
```

- [ ] **Step 4: Add loading state**

Wrap rules list with loading skeleton:

```typescript
{isLoading ? (
  <div className="space-y-3">
    {[1,2,3].map(i => (
      <Card key={i} className="p-4 h-24 animate-pulse bg-muted" />
    ))}
  </div>
) : rules.length === 0 ? (
  // existing empty state
) : (
  rules.map(rule => ...)
)}
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/inbox/InboxAutomation.tsx
git commit -m "refactor(inbox): connect InboxAutomation to sequences API"
```

---

## Task 6: Handle Label Assignment via Contacts API

**Files:**
- Modify: `apps/web/src/app/inbox/InboxContent.tsx`

- [ ] **Step 1: Add updateContact mutation**

The label dropdown in chat view needs to persist label changes to a contact. Add mutation:

```typescript
const updateContact = useMutation({
  mutationFn: async ({ contactId, tags }: { contactId: string; tags: string[] }) => {
    const { error } = await client.contacts.update({
      path: { contactId },
      body: { tags },
    });
    if (error) throw error;
  },
});
```

The conversation object from server should include `contactId`. When user changes label via the dropdown, call `updateContact.mutate({ contactId, tags: [label] })`.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/inbox/InboxContent.tsx
git commit -m "feat(inbox): persist label changes to contacts API"
```

---

## Verification Checklist

After all tasks:

- [ ] `use-plan-gate.ts` exports `usePlanGate` + `useInboxAccess` hooks
- [ ] `use-zernio.ts` exports `ZernioClient` with `inbox`, `contacts`, `sequences`, `broadcasts` methods
- [ ] `use-inbox.ts` exports 8 hooks: `useConversations`, `useConversation`, `useMessages`, `useSendMessage`, `useMarkAsRead`, `useComments`, `useHideComment`, `usePrivateReply`
- [ ] `use-inbox-automation.ts` exports 6 hooks: `useSequences`, `useCreateSequence`, `useUpdateSequence`, `useDeleteSequence`, `useToggleSequence`, `useBroadcasts`
- [ ] `InboxContent.tsx` no longer imports `mockConversations`
- [ ] `InboxAutomation.tsx` no longer imports `mockRules`
- [ ] `useConversations` uses `refetchInterval: 15000` (15s polling)
- [ ] `useMessages` uses `refetchInterval: 15000` (15s polling)
- [ ] Conversations list has loading skeleton
- [ ] Automation rules list has loading skeleton
- [ ] Message sending calls `sendMessage` mutation
- [ ] Label changes call `updateContact` mutation
- [ ] Free plan 403 triggers upsell UI (not error or empty state)
- [ ] `usePlanGate` reads `planName` from usage stats and maps to tier
- [ ] All tests pass (`pnpm run check` in apps/web)

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?