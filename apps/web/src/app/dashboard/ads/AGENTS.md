# Ads - Advertising Management

Ad campaign management across multiple ad platforms (Meta, Google, LinkedIn, TikTok, Pinterest, X).

## Key Components

### AdsContent (`AdsContent.tsx`) - "use client"
Tab shell with `AnimatedTabs` and filter dropdowns.
- Tabs: Overview, Campaigns, Ads, Audiences
- `DepthButtonMenu` for platform filter
- `DepthButtonMenu` for status filter (All/Active/Paused)
- Renders appropriate sub-component based on active tab

### AdsOverview (`AdsOverview.tsx`) - async server
Dashboard summary with Promise.all for data fetching.
- **6 stat cards**: Spend, Impressions, Clicks, Conversions, Active Campaigns, Active Ads
- **Platform breakdown card**: Performance by ad network
- **Recent campaigns card**: Latest campaign activity

### AdsCampaigns (`AdsCampaigns.tsx`) - async server
Campaign list with local pause/resume state.
- `useState` for local optimistic status (pause/resume)
- Metrics grid per campaign: Spend, Impr, CTR, ROAS
- Budget display, ad count per campaign
- `CampaignRow` renders status with StatusBadge mapping

### AdsList (`AdsList.tsx`) - async server
Individual ads list with rejection handling.
- Shows thumbnail (or platform initial letter fallback)
- Rejection reason banner for rejected ads
- Per-item pause/resume actions
- Metrics grid per ad

### AdsAudiences (`AdsAudiences.tsx`) - async server
Grid of audience cards (3-column layout).
- AudienceCard shows: user count, retention days, source label, platform badge

## StatusBadge Mapping

```typescript
const statusBadgeMap = {
  active: "published",
  paused: "draft",
  pending_review: "scheduled",
  rejected: "failed",
  error: "failed"
};
```

## Skeleton Loading

```tsx
<Suspense fallback={
  <div className="space-y-4">
    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
  </div>
}>
  <AdsContent />
</Suspense>
```

## Data Sources

```typescript
import { getAdAccounts, getCampaigns, getAds, getAudiences } from "@/lib/api/ads";
import { formatCurrency, formatNumber } from "@/lib/metrics";
```

API functions accept params: `{ platform?, status?, limit?: number }`

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Server components fetch data directly (no TanStack Query on server)
3. Use `AnimatedTabs` with `variant="underline"` for tab navigation
4. Status toggles use local `useState` with optimistic updates