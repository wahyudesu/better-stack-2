# Analytics - Insights & Performance Metrics

Deep analytics with charts for demographic breakdown, content performance, and platform comparison.

## Chart Library

Uses `@visx` for custom charts. Charts are composable via children pattern.

### LineChart (`@/components/charts/line-chart.tsx`)
Time-series visualization with markers, tooltips, and segments.
```tsx
<LineChart data={timeSeriesData}>
  <Line />
  <XAxis />
  <ChartMarkers />
  <ChartTooltip />
  <SegmentBackground />
</LineChart>
```

### BarChart (`@/components/charts/bar-chart.tsx`)
Vertical and horizontal bar charts with stacking support.
```tsx
<BarChart stacked>
  <Bar />
</BarChart>
```

### PieChart (`@/components/charts/pie-chart.tsx`)
Donut-style chart with `innerRadius` prop.
```tsx
<PieChart>
  <PieSlice />
  <PieCenter />
</PieChart>
```

## Chart Context Pattern

All charts use provider context for state sharing:
- `ChartProvider` for LineChart/BarChart
- `PieProvider` for PieChart

Children render pattern extracts configs synchronously.

## Data Generation

Deterministic mock data for SSR/CSR hydration:
```typescript
import { seededRandom, generateDetailedData, generateHourlyData, generateWeeklyData } from "@/lib/data/analytics-data";
```

## Metrics & Filtering

Metric dropdown to switch between:
- Engagements
- Impressions
- Followers
- Clicks

Platform and time range filters via Select dropdowns.

## Data Sources

```typescript
import { platformData, contentTypeData, ageData, genderData, recentPosts } from "@/lib/data/analytics-data";
import { STAT_DEFINITIONS } from "@/lib/types/analytics";
import { formatMetricValue } from "@/lib/metrics";
```

## Types

```typescript
import type { ContentPost, PostAnalytics } from "@/lib/types";
```

## Layout Pattern

```tsx
// Stats grid - responsive columns
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

// Chart pairs - two column layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
```

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Use `useMemo` for expensive chart data calculations
3. Platform icons use emoji (🎵 TikTok, 📷 Instagram, 𝕏 Twitter)
4. Export/Share buttons in header with Lucide icons
5. All chart data memoized with `useMemo`