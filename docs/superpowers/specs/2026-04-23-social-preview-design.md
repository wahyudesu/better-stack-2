# Social Media Preview Component

## Overview

Replace the current generic preview panel in `apps/web/src/app/posts/create/page.tsx` with a `SocialPreview` component that renders platform-specific previews. When multiple platforms are selected, tabs appear to switch between them.

## Design Decisions

| Decision | Choice |
|----------|--------|
| Layout | Tabbed — tab per platform when multiple selected, direct render when single |
| Character counter | Per-platform limit from PLATFORM_META (changes per tab) |
| Profile display | Account avatar + name + username only |
| Media preview | Show uploaded media as-is (no filtering) |
| Visual style | Simplified card — platform name, avatar/name, content, media only |
| Platforms | Instagram, Twitter/X, Facebook first (expandable) |

## Component Structure

```
components/features/create-post/
├── SocialPreview.tsx          # Main wrapper — handles tabs/logic
├── preview/
│   ├── InstagramPreview.tsx   # Instagram-specific preview card
│   ├── TwitterPreview.tsx     # Twitter/X-specific preview card
│   └── FacebookPreview.tsx    # Facebook-specific preview card
```

## Props

```typescript
interface SocialPreviewProps {
  content: string;
  media: PostMedia[];
  accounts: SocialMediaProfile[];  // selected accounts
  tags: string[];
}
```

## Logic

1. Extract unique platforms from `accounts`
2. If platforms.length === 0 → show empty state
3. If platforms.length === 1 → render that platform's preview directly
4. If platforms.length > 1 → render tab bar + content area with active tab's preview
5. Active tab's platform metadata → character counter format

## Preview Card Anatomy

Each platform preview card shows:
- Platform name badge with platform color
- Account avatar + display name + username
- Post content (white-space preserved)
- Media grid (if any)
- Tags row (if any)

No timestamps, no engagement metrics, no like/comment/share icons.

## Instagram Preview

- Max chars: 2200
- Media: up to 10 images or 1 video in grid layout
- Layout: Square image thumbnails, content below
- Character format: `X/2200`

## Twitter/X Preview

- Max chars: 280
- Media: single image (up to 4 in grid) or video
- Layout: Content, then media below
- Character format: `X/280`

## Facebook Preview

- Max chars: 63206
- Media: image grid or video
- Layout: Content, then media below
- Character format: `X/63206`

## Empty State

When no accounts selected, show placeholder:
```
Select accounts above to see preview
```

## File Changes

1. `apps/web/src/components/features/create-post/social-preview.tsx` — Main wrapper component
2. `apps/web/src/components/features/create-post/preview/instagram-preview.tsx`
3. `apps/web/src/components/features/create-post/preview/twitter-preview.tsx`
4. `apps/web/src/components/features/create-post/preview/facebook-preview.tsx`
5. Update `page.tsx` — Replace existing preview section with `<SocialPreview>`

## Notes

- Character counter lives in ContentEditor (already modified to `/2200` format). Each preview tab's card shows its platform's limit. When tab switches, content editor's counter should reflect that tab's platform.
- This means ContentEditor needs to know the active platform limit. Pass `maxChars` down from SocialPreview's active tab.
- Tags are extracted from content via `/#+/g` regex + manual tags array.
- Platform-specific layout nuances (grid vs stack, image aspect ratios) handled per component.