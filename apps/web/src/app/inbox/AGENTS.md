# Inbox - Unified Message Management

Unified inbox for DMs, comments, reviews, and automation across all social platforms.

## Key Components

### InboxContent (`InboxContent.tsx`) - 1576 lines
Main inbox implementation with 3-column CRM-style layout.
- **Left column**: Conversation list with search
- **Center column**: Chat thread view
- **Right column**: Contact details (desktop)
- **Mobile**: Full-screen chat overlay

### InboxAutomation (`InboxAutomation.tsx`) - 465 lines
Comment automation rule management.

## Tabs

| Tab | Description |
|-----|-------------|
| **Messages** | DM conversations across platforms |
| **Comments** | Comment management with platform filter |
| **Reviews** | Review responses (Facebook, Google Business) |
| **Campaigns** | Broadcast/campaign overview with stats |
| **Contacts** | Contact management with tags and search |
| **Automation** | Delegated to InboxAutomation component |

## Platform Config System

14 platforms supported with icon, color, bg, name:
```typescript
const platformConfig = {
  instagram: { icon: "📷", color: "hsl(328 70% 55%)", bg: "...", name: "Instagram" },
  tiktok: { icon: "🎵", color: "hsl(168 70% 45%)", bg: "...", name: "TikTok" },
  // ... more platforms
};
```

## Data Fetching (TanStack Query)

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";

// Conversations
api.listConversations({ platform, limit })
api.listMessages(conversationId, { limit })
api.sendMessage(conversationId, { text, mediaUrl })
api.markAsRead(conversationId)

// Comments, Reviews, Broadcasts, Contacts
// All from @/data/inbox-mock when API unavailable
```

## Mock Data Fallback

```typescript
const shouldUseMockData = !apiKey; // Use mock when no Zernio API key
```

## Customer Labels

Stored locally (not from server):
- **VIP** - High-value customers
- **Lead** - Potential customers
- **Customer** - Existing customers
- **Partner** - Business partners

## Time Formatting

```typescript
import { formatRelativeTime } from "@/lib/utils"; // e.g., "5m ago", "2d ago"
```

## Chat UI Patterns

- **Incoming messages**: Muted background color
- **Outgoing messages**: Primary brand color
- **Avatar**: With online indicator, platform badge, customer label
- **Relative timestamps**: On all messages

## Animation & Navigation

```typescript
import { AnimatedTabs } from "@/components/ui/animated-tabs"; // underline variant

import { DepthButtonGroup, DepthButtonMenu, GroupedDepthButton } from "@/components/ui/depth-button";
```

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Use TanStack Query for all data fetching
3. Platform filter via `PlatformFilterDropdown`
4. Contact labels stored locally, not from server
5. Mobile responsive with full-screen chat overlay