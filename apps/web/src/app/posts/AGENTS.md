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
│  User   │ ──▶ │  Web App │ ──▶ │ Server │ ──▶ │ Zernio │
│ Browser │     │ (Next.js)│     │ (Hono) │     │  API   │
└─────────┘     └──────────┘     └────────┘     └────────┘
                      │                │
                      │                ▼
                      └────────── (Response)
```

**Data flow:**
1. User creates post in browser (Next.js app)
2. Web app stores post metadata in Supabase via API routes
3. When scheduled time arrives, Server calls Zernio API to publish
4. Zernio posts to social platforms
5. Post status updated in Supabase

## Post Status Workflow

```
draft → review → scheduled → published
                    ↓
                 failed
```

Statuses: `draft`, `review`, `scheduled`, `publishing`, `published`, `failed`, `cancelled`

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
Card-based post list view of all posts.

## Drag-and-Drop Reschedule

```tsx
// On drag start
const handleDragStart = (e, postId) => {...}

// On drop - calls API to update scheduledAt
const handleDrop = (date) => {
  mutateUpdatePost({ id: postId, scheduledAt: date })
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
| `usePosts` | GET | `/api/posts` | List posts for calendar |
| `useCreatePost` | POST | `/api/posts` | Create draft/scheduled |
| `useUpdatePost` | PATCH | `/api/posts/:id` | Reschedule |
| `useDeletePost` | DELETE | `/api/posts/:id` | Remove post |
| `useRetryPost` | POST | `/api/posts/:id/retry` | Re-publish failed |
| `useUnpublishPost` | POST | `/api/posts/:id/unpublish` | Unpublish |
| `usePostLogs` | GET | `/api/posts/:id/logs` | Zernio response |

## User Identity Pattern

All API routes MUST use this pattern to access user data:

```typescript
// 1. Get user UUID from Clerk ID
const { data: user } = await supabase
  .from("users")
  .select("id")
  .eq("clerk_id", userId)
  .single();

if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

// 2. Query posts with user_id (NOT clerk_id)
const { data } = await supabase
  .from("posts")
  .select("*")
  .eq("user_id", user.id);
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
5. When adding new API call: check `src/lib/api/` for existing endpoints first
6. Test with `pnpm run dev` (web) + `cd apps/server && pnpm run dev` (server)

## Data Storage

| Data | Storage | Reason |
|------|---------|--------|
| Post metadata (content, schedule) | Supabase | Persistent, queryable |
| Social account tokens | Server (env) | Security |
| Published posts/analytics | Server → Zernio | External API |
