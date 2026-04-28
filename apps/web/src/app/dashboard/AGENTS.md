# Dashboard - Main Analytics Dashboard

Main analytics dashboard with stats cards, audience insights, and chart visualizations.

## Quick Stats (Large Cards)

Row of large metric cards:
- **Impressions** - Total views across platforms
- **Engagements** - Total interactions (likes, comments, shares)
- **Likes** - Total likes
- **Profile Visits** - Profile view count
- **Replies** - Comment/reply count
- **Shares** - Share/save count

## Audience Cards

### Audience Overview (Small)
Follower count and viewer metrics overview.

### Sentiment Analysis (Small)
Sentiment breakdown of engagements (positive/neutral/negative).

## Demographic Cards

### Demographics (Medium)
Breakdown by:
- **Country**: Indonesia, Malaysia, USA, etc.
- **Region**: Jakarta, Surabaya, Bandung, Bali

### Follower/Viewer Card (Medium)
Follower and viewer counts with trend indicators.

## Other Components

- **RecentPostsCard** - Latest published posts with engagement stats
- **FilterBar** - Platform filtering (Instagram, TikTok, Twitter, etc.)
- **AreaChartCard** - Trend visualization for selected metric
- **LineChartCard** - Time-series data display

## Chart Patterns

Charts use `@visx` library with composable children pattern:
```tsx
<LineChart data={data}>
  <Line />
  <XAxis />
  <ChartMarkers />
  <ChartTooltip />
  <SegmentBackground />
</LineChart>
```

## Data Sources

- Analytics from Zernio API via `apps/server`
- Social media metrics from connected profiles
- Mock data from `/lib/data/analytics-data.ts`
- Format utilities from `/lib/metrics.ts`

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Check existing dashboard components for patterns
3. Ensure metric formatting via `formatCurrency`, `formatNumber`
4. Test responsive behavior (mobile + desktop)
