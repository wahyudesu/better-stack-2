# AI - AI Content Generator

AI-powered social media post generation with templates and tools.

## Key Components

### Composer (`@/components/ui/composer.tsx`)
Rich text input with toolbar and context menus.
- **Toolbar**: Bold, italic, link, list, emoji
- **Tone selection**: Professional, Casual, Humorous, Inspirational, Educational
- **Platform selection**: Filter content types per platform
- **Template management**: Save/load content templates
- **Slash commands**: Quick access to AI tools via `/`
- **Auto-resizing textarea**
- Primary color: `#00bbff` (GAIA brand)

### GeneratedPostCard (`@/components/features/post/generated-post-card.tsx`)
Display AI-generated post with actions.
- Shows: platform badge, tone badge, character count
- Truncated content with expand/collapse
- **Actions**:
  - **Plan**: Save to drafts
  - **Post**: Publish directly
  - **Delete**: Remove generated post
  - **Copy**: Copy content to clipboard
- Async handlers with per-action loading states

### TemplateManagerDialog (`@/components/ui/template-manager-dialog.tsx`)
Modal for content template management.
- Save current config as template
- Duplicate, delete, load template
- Template fields: platform, format, purpose, tone, persona, framework

## AI Tools

8 predefined tools in categories:

**Content Generation:**
- `generate_post` - Generate single post
- `generate_thread` - Create threaded posts

**Optimization:**
- `rewrite_content` - Rewrite with different tone
- `add_hashtags` - Generate relevant hashtags
- `suggest_cta` - Suggest call-to-action

**Analysis:**
- `analyze_sentiment` - Analyze content sentiment

**Research:**
- `research_trends` - Research trending topics

## Auth Gating

All actions wrapped with `useAuthGate()`:
```tsx
const handleAction = useAuthGate(async () => {
  // action code
});
```

## Mock AI Generation

```typescript
import { generatePost } from "@/lib/constants/platforms";

// Returns: { content, hashtags, cta }
// 1.5s simulated delay
```

## Data Sources

```typescript
import { platforms, contentTypes, tones, goals } from "@/lib/constants/platforms";
import { getTemplateManager } from "@/lib/types/content/template";
```

## Layout Pattern

```tsx
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
```

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Lazy-load Hugeicons for performance
3. Use `useState` for local post list, attached files, dialog state
4. File handling via hidden `<input type="file">` with `URL.createObjectURL()` for previews