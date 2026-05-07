# Posts - Content Calendar & Management

Content scheduling and calendar view for social media posts.

## Overview

Posts module manages social media content lifecycle:
```
Create → Schedule → Publish → Analytics
```

## Integration Flow (Server + Zernio)

```
┌─────────┐     ┌──────────┐     ┌────────┐     ┌────────┐
│  User   │ ──▶ │ Convex   │ ──▶ │ Server │ ──▶ │ Zernio │
│ Browser │     │ (DB)     │     │ (Hono) │     │  API   │
└─────────┘     └──────────┘     └────────┘     └────────┘
                    ▲                │
                    │                ▼
                    └────────── (Response)
```

**Data flow:**
1. User creates post in browser
2. Convex stores post metadata (profiles, accounts, scheduledAt)
3. When scheduled time arrives, Convex calls Server endpoint
4. Server calls Zernio API to publish
5. Zernio posts to social platforms

## Objectives

### 1. Post Creation
- User fills content → selects platforms → selects accounts → picks date/time
- Convex stores: `{ profileId, socialAccountIds, content, scheduledAt, media }`
- Status: `draft` → `scheduled`

### 2. Queue Processing (Background)
- Convex scheduler checks every minute for due posts
- Calls `POST /v1/queue` via Server → Zernio
- Updates post status: `scheduled` → `published` or `failed`

### 3. Calendar Display
- Fetch posts from Convex (not from Zernio directly)
- Calendar shows dots per platform color
- Drag-and-drop reschedules via `useUpdatePost`

### 4. Post Actions
- Retry failed posts
- Unpublish (if platform supports)
- Delete
- View logs (Zernio response metadata)

## Key Components

### PostControls (`PostControls.tsx`)
View mode toggle and calendar navigation.
- **Calendar view** (default) - Month/week grid with event dots
- **Cards view** - Card-based post list
- Calendar navigation: month/week sub-views
- Platform filter dropdown (all platforms)
- Post status filter (draft/review/scheduled/published/failed)

### CalendarGrid (`CalendarGrid.tsx`)
Calendar grid rendering with event dots and drag-and-drop.
- Month view: 35-42 cell grid
- Week view: 7-day strip
- Event dots colored by platform
- Click cell → navigate to `/posts/create?date=<dateStr>`

### PostCardsView (`PostCardsView.tsx`)
Card-based list view of all posts.

## Post Status Workflow

```
draft → review → scheduled → published
                    ↓
                 failed
```

Statuses: `draft`, `review`, `scheduled`, `publishing`, `published`, `failed`, `cancelled`

## Drag-and-Drop Reschedule

```tsx
// On drag start
const handleDragStart = (e, postId) => {...}

// On drop - calls useUpdatePost to update scheduledAt
const handleDrop = (date) => {
  useUpdatePost({ id: postId, scheduledAt: date })
}
```

## Modal Dialogs

- **Post Actions dialog**: retry/unpublish/delete/view logs
- **Logs dialog**: view post execution logs
- **AlertDialog confirmations**: delete post, unpublish post

## Filters

```tsx
// Platform filter via centralized filter
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";

// Status filter via useMemo
const filteredEvents = useMemo(() => {
  return events.filter(e =>
    (!selectedPlatform || e.platform === selectedPlatform) &&
    (!postStatus || e.status === postStatus)
  )
}, [events, selectedPlatform, postStatus])
```

## Data Sources

```typescript
import { usePosts } from "@/lib/hooks/use-posts";
import { useUpdatePost, useDeletePost, useRetryPost } from "@/lib/hooks/use-posts";

// Post-to-calendar event mapping
import { postToCalendarEvent } from "@/lib/data/social-data";
```

## API Hooks (via Server → Zernio)

| Hook | Method | Endpoint | Purpose |
|------|--------|----------|---------|
| `usePosts` | GET | `/v1/posts` | List posts for calendar |
| `useCreatePost` | POST | `/v1/posts` | Create draft/scheduled |
| `useUpdatePost` | PATCH | `/v1/posts/:id` | Reschedule |
| `useDeletePost` | DELETE | `/v1/posts/:id` | Remove post |
| `useRetryPost` | POST | `/v1/posts/:id/retry` | Re-publish failed |
| `useUnpublishPost` | POST | `/v1/posts/:id/unpublish` | Unpublish |
| `usePostLogs` | GET | `/v1/posts/:id/logs` | Zernio response |

## Server Integration

Server runs at `http://localhost:8787` (dev) and handles:
- Authentication: `Authorization: Bearer <Zernio_API_Key>`
- Rate limiting per Zernio plan
- Response caching for analytics

### Making Server Calls

```typescript
// Use api client - sends Bearer token from authStore
const { data, error } = await api.getPosts({ profileId, status: 'scheduled' })

// Post creation
await api.createPost({
  profileId: 'xxx',
  content: 'Hello world',
  socialAccountIds: ['acc1', 'acc2'],
  scheduledAt: '2026-05-10T09:00:00Z',
  media: [{ url: 'https://...', type: 'image' }]
})
```

## Layout Pattern

```tsx
// Consistent page wrapper
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

<div className={pageContainerClassName} style={{ maxWidth: pageMaxWidth }}>
  {/* page content */}
</div>
```

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Follow drag-and-drop pattern from existing CalendarGrid
3. Use `sonner` toast for success/error feedback
4. Platform colors from HSL strings mapped per platform
5. When adding new API call: check `src/lib/client.ts` for existing endpoints first
6. Test with `pnpm run dev` (web) + `cd apps/server && pnpm run dev` (server)

## Convex vs Server

| Data | Storage | Reason |
|------|---------|--------|
| Post metadata (content, schedule) | Convex | Fast queries, real-time sync |
| Social account tokens | Convex | Security |
| Published posts/analytics | Server → Zernio | External API |
| Media files | Convex → S3 | Persistent storage |