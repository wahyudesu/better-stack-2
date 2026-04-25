# Settings - User Preferences & Configuration

User settings with tabbed interface for account, connections, billing, preferences, team, and webhooks.

## Layout

SettingsLayout with vertical sidebar navigation (130px width).
```tsx
// settingsTabs defines all tabs
const settingsTabs = [
  { id: "account", label: "Account", icon: User, component: AccountTab },
  { id: "connections", label: "Connections", icon: Link2, component: ConnectionsTab },
  { id: "billing", label: "Billing", icon: CreditCard, component: BillingTab },
  { id: "preferences", label: "Preferences", icon: Settings2, component: PreferencesTab },
  { id: "user", label: "Team", icon: Users, component: UserTab },
  { id: "webhooks", label: "Webhooks", icon: Webhook, component: WebhooksTab },
];
```

Max-width 1024px, centered with `px-5 py-4`.

## Tab Components

### AccountTab
- Avatar upload UI
- Password change form
- **Zernio API key connection** with validation endpoint
- Danger zone (delete account)

### ConnectionsTab
- Social account management
- **Platform categories**: Social, Communication, Ads
- `useAccounts()` hook for connected accounts
- Connect/disconnect OAuth flow
- LinkedIn organization toggle

### BillingTab
- Current plan display
- Usage stats with progress bars:
  - Uploads usage
  - Profiles usage
- Payment method card
- Billing history table

### PreferencesTab
- Theme selector: Light / Dark / System
- Accent color picker
- Timezone selector
- First day of week (Mon/Sun)
- Time format: 12h / 24h
- Animated dock toggle
- Public stats toggle

### UserTab (Team Management)
- User table with roles: Owner, Admin, Member, Viewer
- Status indicators per user
- Invite/add team member actions
- Mock data for team members

### WebhooksTab
- Webhook list with enable/disable
- Event selection (6 event types):
  - post.published, post.failed
  - message.received, comment.received
  - follower.new, review.new
- Test/delete/edit actions
- Logs slide-over panel

## API Key Gate

When Zernio API key not configured, show alert:
```tsx
{!apiKey && (
  <AlertCard icon={AlertCircle} message="Connect your Zernio API key to enable inbox features" />
)}
```

## Data Hooks

```typescript
import { useAuthStore } from "@/lib/stores/auth-store"; // apiKey, usage stats
import { useAccounts, useAccountsHealth } from "@/lib/hooks/use-accounts";
import { useConnectAccount, useDeleteAccount } from "@/lib/hooks/use-accounts";
import { useWebhookSettings, useWebhookLogs } from "@/lib/hooks/use-webhooks";
import { useUsageStats } from "@/lib/hooks/use-usage";
```

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. All tab components use `"use client"` directive
3. Card-based UI with `Card` / `CardContent` components
4. Loading states use `Loader2` spinner with `animate-spin`
5. Form validation with inline error messages
6. Confirmation dialogs via `AlertDialog` component