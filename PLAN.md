# Implementation Plan: Web ↔ Server Integration

## Context
- **Server**: Hono + Cloudflare Workers, port 8787. Fixed endpoints from Zernio API.
- **Web**: Next.js 16, existing pages + design. Need to connect to server.
- **Auth**: Clerk (user login), Zustand (API key storage), TanStack Query (data fetching)

---

## Existing Pages (apps/web/src/app)

| Page | Purpose | Needs Data |
|------|---------|-----------|
| `/dashboard` | Overview stats | Analytics (daily-metrics, follower-stats) |
| `/analytics` | Detailed analytics | Analytics endpoints |
| `/posts` | List posts | GET /v1/posts |
| `/posts/create` | Create post | POST /v1/posts, profiles, accounts |
| `/inbox` | Messages | inbox/conversations, inbox/comments |
| `/settings` | Account settings | Already has API key connect |
| `/ai` | AI generation | tools/validate/* |
| `/tools` | Content tools | Tools validation |

---

## Server Endpoints by Group

### Group 1: Profiles & Accounts (CRITICAL)
**All features depend on this**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/profiles` | GET | Profile selector, default profile |
| `/v1/profiles/{profileId}` | GET | Get profile details |
| `/v1/accounts` | GET | List connected accounts |
| `/v1/accounts/{accountId}` | GET | Account details |
| `/v1/accounts/health` | GET | Account status indicators |
| `/v1/connect/{platform}` | POST | OAuth connect (Instagram, TikTok, etc) |
| `/v1/connect/pending-data` | GET | OAuth callback data |

**Objective**: User can view + connect social accounts

---

### Group 2: Posts & Scheduling (HIGH)
**Core product feature**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/posts` | GET | Post list (filter by status) |
| `/v1/posts` | POST | Create post |
| `/v1/posts/{postId}` | GET | Post details |
| `/v1/posts/{postId}/edit` | PUT | Edit post |
| `/v1/posts/{postId}/unpublish` | POST | Unpublish |
| `/v1/posts/{postId}/retry` | POST | Retry failed |
| `/v1/posts/{postId}/update-metadata` | PUT | Update hashtags, etc |
| `/v1/queue/slots` | GET | Available time slots |
| `/v1/queue/preview` | GET | Queue visualization |
| `/v1/queue/next-slot` | GET | Next slot finder |

**Objective**: Full post creation + scheduling

---

### Group 3: Analytics (HIGH)
**Dashboard + Analytics page**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/analytics` | GET | Overall summary |
| `/v1/analytics/daily-metrics` | GET | Stats cards (views, likes) |
| `/v1/analytics/best-time` | GET | Best posting time |
| `/v1/analytics/post-timeline` | GET | Line chart data |
| `/v1/analytics/posting-frequency` | GET | Posting habits |
| `/v1/analytics/content-decay` | GET | Engagement decay |
| `/v1/analytics/instagram/account-insights` | GET | IG-specific |
| `/v1/analytics/instagram/demographics` | GET | IG audience |
| `/v1/analytics/youtube/daily-views` | GET | YT-specific |
| `/v1/analytics/youtube/demographics` | GET | YT audience |
| `/v1/analytics/googlebusiness/performance` | GET | GMB-specific |
| `/v1/accounts/follower-stats` | GET | Follower growth |

**Objective**: Real data on dashboard, replace mock data

---

### Group 4: Inbox (MEDIUM)
**Unified inbox**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/inbox/conversations` | GET | DM conversations |
| `/v1/inbox/conversations/{id}` | GET | Conversation details |
| `/v1/inbox/conversations/{id}/messages` | GET/POST | Messages |
| `/v1/inbox/comments` | GET | Post comments |
| `/v1/inbox/comments/{postId}` | GET | Comments on post |
| `/v1/inbox/reviews` | GET | Reviews (Google, etc) |
| `/v1/inbox/reviews/{reviewId}/reply` | POST | Reply to review |

**Objective**: Unified inbox for DMs, comments, reviews

---

### Group 5: Media (MEDIUM)
**Post creation needs this**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/media/presign` | POST | Get presigned upload URL |
| `/v1/media/upload-direct` | POST | Direct upload |

**Objective**: Image/video upload for posts

---

### Group 6: Tools (MEDIUM)
**Content validation**

| Endpoint | Method | Web Use |
|----------|--------|---------|
| `/v1/tools/validate/post-length` | POST | Validate text length |
| `/v1/tools/validate/media` | POST | Validate media |
| `/v1/tools/validate/subreddit` | POST | Validate subreddit |
| `/v1/reddit/search` | GET | Reddit search |
| `/v1/reddit/feed` | GET | Reddit feed |

**Objective**: Pre-posting validation

---

### Group 7: Usage (DONE)

| Endpoint | Status |
|----------|--------|
| `/v1/usage-stats` | ✅ Done - connected via Settings > Security |

---

## Phase Implementation Order

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: Infrastructure (Foundation)                        │
├─────────────────────────────────────────────────────────────┤
│ • Create catch-all proxy route /api/zernio/[...path]       │
│ • Create Zernio API TypeScript types                        │
│ • Create base TanStack Query hooks (useZernioQuery)         │
│ • Create zernio API client utility                          │
│                                                             │
│ Objective: Any server endpoint callable from web            │
│ Files:                                                      │
│   apps/web/src/app/api/zernio/[...path]/route.ts           │
│   apps/web/src/lib/zernio/types.ts                          │
│   apps/web/src/hooks/use-zernio-query.ts                    │
│   apps/web/src/hooks/use-zernio-mutation.ts                 │
│   apps/web/src/lib/zernio/client.ts                         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: Profiles & Accounts                                │
├─────────────────────────────────────────────────────────────┤
│ • GET /v1/profiles → Profile selector                       │
│ • GET /v1/accounts → Account list (Settings > Connections)  │
│ • GET /v1/accounts/health → Status indicators              │
│ • POST /v1/connect/{platform} → OAuth connect              │
│                                                             │
│ Objective: User can see + connect social accounts           │
│ Pages affected: Settings > Connections                       │
│ Hooks: useProfiles(), useAccounts(), useAccountHealth()     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: Posts (CRUD)                                      │
├─────────────────────────────────────────────────────────────┤
│ • GET /v1/posts → Post list (filter: draft, scheduled)     │
│ • POST /v1/posts → Create post                              │
│ • PUT /v1/posts/{id}/edit → Edit post                       │
│ • GET /v1/queue/slots → Available time slots               │
│                                                             │
│ Objective: Full post management                             │
│ Pages affected: /posts, /posts/create                       │
│ Hooks: usePosts(), useCreatePost(), useEditPost()           │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: Dashboard + Analytics                             │
├─────────────────────────────────────────────────────────────┤
│ • GET /v1/analytics/daily-metrics → Stats cards            │
│ • GET /v1/analytics/post-timeline → Charts                 │
│ • GET /v1/analytics/best-time → Recommendations            │
│ • GET /v1/accounts/follower-stats → Follower growth        │
│                                                             │
│ Objective: Real data on dashboard                           │
│ Pages affected: /dashboard, /analytics                      │
│ Hooks: useAnalytics(), useDailyMetrics(), useBestTime()    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: Queue + Scheduling                                 │
├─────────────────────────────────────────────────────────────┤
│ • GET /v1/queue/preview → Queue visualization               │
│ • GET /v1/queue/next-slot → Next available slot            │
│                                                             │
│ Objective: Visual schedule builder                          │
│ Pages affected: /posts/create (schedule picker)              │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: Inbox                                             │
├─────────────────────────────────────────────────────────────┤
│ • GET /v1/inbox/conversations → Conversations list         │
│ • GET /v1/inbox/comments → Comments                        │
│ • GET /v1/inbox/reviews → Reviews                          │
│                                                             │
│ Objective: Unified inbox                                    │
│ Pages affected: /inbox                                      │
│ Hooks: useConversations(), useComments(), useReviews()      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ PHASE 7: Media + Tools                                      │
├─────────────────────────────────────────────────────────────┤
│ • POST /v1/media/presign → Media upload                    │
│ • POST /v1/tools/validate/* → Content validation          │
│                                                             │
│ Objective: Complete post creation flow                      │
│ Pages affected: /posts/create, /tools, /ai                  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure After Implementation

```
apps/web/src/
├── app/
│   └── api/
│       └── zernio/
│           └── [...path]/
│               └── route.ts          # Catch-all proxy
├── hooks/
│   ├── use-zernio-query.ts           # Base query hook
│   ├── use-zernio-mutation.ts        # Base mutation hook
│   ├── use-profiles.ts
│   ├── use-accounts.ts
│   ├── use-posts.ts
│   ├── use-queue.ts
│   ├── use-analytics.ts
│   ├── use-inbox.ts
│   └── use-media.ts
├── lib/
│   └── zernio/
│       ├── types.ts                  # TypeScript types
│       └── client.ts                 # API client
└── stores/
    └── auth-store.ts                 # Already exists
```

---

## Status

| Phase | Status | Notes |
|-------|--------|-------|
| Usage Stats | ✅ Done | Settings > Security |
| Phase 1: Infrastructure | ⏳ Pending | Foundation needed |
| Phase 2: Profiles & Accounts | 📋 Next | Priority |
| Phase 3: Posts | 📋 | |
| Phase 4: Analytics | 📋 | Dashboard depends on this |
| Phase 5: Queue | 📋 | |
| Phase 6: Inbox | 📋 | |
| Phase 7: Media + Tools | 📋 | |

---

## Immediate Next Step

Start **Phase 1**: Create infrastructure

```
apps/web/src/app/api/zernio/[...path]/route.ts
apps/web/src/lib/zernio/types.ts
apps/web/src/hooks/use-zernio-query.ts
apps/web/src/hooks/use-zernio-mutation.ts
apps/web/src/lib/zernio/client.ts
```

Ready to implement?
