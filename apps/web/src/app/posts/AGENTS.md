# Posts - Content Calendar & Management

Content scheduling and calendar view for social media posts.

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

## API Hooks

- `usePosts(profileId)` - get posts for calendar
- `useUpdatePost()` - reschedule post
- `useDeletePost()` - delete post
- `useUnpublishPost()` - unpublish post
- `useRetryPost()` - retry failed post
- `api.getPostLogs(postId)` - fetch post logs

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