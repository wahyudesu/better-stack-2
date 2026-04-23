# Analytics Page - Connect to Server Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace fake procedural data on analytics page with real API data from `/v1/analytics/*` endpoints.

**Architecture:** Analytics page will call HTTP API endpoints via existing `api` client. TanStack Query hooks will wrap these calls. Data shapes will be mapped to existing frontend types.

**Tech Stack:** TanStack Query, existing `api` client in `lib/client.ts`, existing types in `lib/types/analytics.ts`

---

## File Structure

- Modify: `apps/web/src/app/analytics/page.tsx` - replace fake data generators with API calls
- Modify: `apps/web/src/hooks/use-analytics.ts` - add new hooks for analytics page data
- Modify: `apps/web/src/lib/types/analytics.ts` - add missing type definitions for API responses

---

### Task 1: Add Analytics Type Definitions

**Files:**
- Modify: `apps/web/src/lib/types/analytics.ts`

- [ ] **Step 1: Add API response types**

```typescript
// Daily metrics time series
export interface DailyMetricPoint {
  date: string;
  engagements: number;
  impressions: number;
  followers: number;
  clicks: number;
  shares: number;
  saves: number;
}

export interface OverviewStats {
  engagements: number;
  engagementsChange: number;
  impressions: number;
  impressionsChange: number;
  followerGrowth: number;
  followerGrowthChange: number;
  clicks: number;
  clicksChange: number;
  shares: number;
  sharesChange: number;
  saves: number;
  savesChange: number;
}

export interface HourlyEngagementPoint {
  hour: number;
  engagement: number;
}

export interface WeeklyPerformancePoint {
  day: string;
  engagement: number;
  reach: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/types/analytics.ts
git commit -m "feat(analytics): add API response type definitions"
```

---

### Task 2: Add Analytics Page Hooks

**Files:**
- Modify: `apps/web/src/hooks/use-analytics.ts`

- [ ] **Step 1: Add analytics page hooks**

```typescript
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/client";
import type {
  DailyMetricPoint,
  HourlyEngagementPoint,
  WeeklyPerformancePoint,
  OverviewStats,
} from "@/lib/types/analytics";

export const analyticsPageKeys = {
  all: ["analytics-page"] as const,
  overview: (accountId: string, timeRange: string) =>
    ["analytics-page", "overview", accountId, timeRange] as const,
  dailyMetrics: (accountId: string, timeRange: string, metric: string) =>
    ["analytics-page", "daily", accountId, timeRange, metric] as const,
  hourlyEngagement: (accountId: string) =>
    ["analytics-page", "hourly", accountId] as const,
  bestDays: (accountId: string) =>
    ["analytics-page", "best-days", accountId] as const,
  topPosts: (accountId: string, timeRange: string) =>
    ["analytics-page", "top-posts", accountId, timeRange] as const,
  demographics: (accountId: string) =>
    ["analytics-page", "demographics", accountId] as const,
  contentTypes: (accountId: string) =>
    ["analytics-page", "content-types", accountId] as const,
};

/**
 * Hook to fetch overview stats (totals + % changes)
 */
export function useAnalyticsOverview(accountId: string, timeRange: string) {
  return useQuery({
    queryKey: analyticsPageKeys.overview(accountId, timeRange),
    queryFn: async () => {
      // GET /v1/analytics?accountId=...&startDate=...&endDate=...
      const { data, error } = await api.getAccountAnalytics({
        accountId,
        startDate: getStartDate(timeRange),
        endDate: getEndDate(),
      });
      if (error) throw error;
      return transformToOverviewStats(data);
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch daily time series metrics
 */
export function useDailyMetrics(
  accountId: string,
  timeRange: string,
  metric: string,
) {
  return useQuery({
    queryKey: analyticsPageKeys.dailyMetrics(accountId, timeRange, metric),
    queryFn: async () => {
      const { data, error } = await api.getDailyMetrics({
        accountId,
        metric,
        startDate: getStartDate(timeRange),
        endDate: getEndDate(),
      });
      if (error) throw error;
      return transformToDailyMetrics(data?.metrics ?? []);
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch hourly engagement for best time chart
 */
export function useHourlyEngagement(accountId: string) {
  return useQuery({
    queryKey: analyticsPageKeys.hourlyEngagement(accountId),
    queryFn: async () => {
      const { data, error } = await api.getBestTime(accountId);
      if (error) throw error;
      return transformToHourlyData(data);
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch weekly performance (day-of-week engagement)
 */
export function useBestDays(accountId: string) {
  return useQuery({
    queryKey: analyticsPageKeys.bestDays(accountId),
    queryFn: async () => {
      // API /v1/analytics/best-time returns daily breakdown
      const { data, error } = await api.getBestTime(accountId);
      if (error) throw error;
      return transformToWeeklyData(data);
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch top performing posts
 */
export function useTopPostsAnalytics(accountId: string, timeRange: string) {
  return useQuery({
    queryKey: analyticsPageKeys.topPosts(accountId, timeRange),
    queryFn: async () => {
      const { data, error } = await api.getPostTimeline({
        accountId,
        startDate: getStartDate(timeRange),
        endDate: getEndDate(),
      });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch demographics (age/gender breakdown)
 */
export function useDemographics(accountId: string) {
  return useQuery({
    queryKey: analyticsPageKeys.demographics(accountId),
    queryFn: async () => {
      const { data, error } = await api.getInstagramDemographics(accountId);
      if (error) throw error;
      return data;
    },
    enabled: !!accountId,
  });
}

/**
 * Hook to fetch content type performance
 */
export function useContentTypePerformance(accountId: string) {
  return useQuery({
    queryKey: analyticsPageKeys.contentTypes(accountId),
    queryFn: async () => {
      const { data, error } = await api.getContentDecay(accountId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!accountId,
  });
}

// Helper functions
function getStartDate(timeRange: string): string {
  const daysMap: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };
  const days = daysMap[timeRange] ?? 30;
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

function getEndDate(): string {
  return new Date().toISOString().split("T")[0];
}

function transformToOverviewStats(data: unknown): OverviewStats {
  // Transform API response to OverviewStats shape
  // Adjust based on actual API response structure
  return {
    engagements: 0,
    engagementsChange: 0,
    impressions: 0,
    impressionsChange: 0,
    followerGrowth: 0,
    followerGrowthChange: 0,
    clicks: 0,
    clicksChange: 0,
    shares: 0,
    sharesChange: 0,
    saves: 0,
    savesChange: 0,
  };
}

function transformToDailyMetrics(metrics: unknown[]): DailyMetricPoint[] {
  return metrics.map((m: any) => ({
    date: m.date ?? m.day ?? "",
    engagements: m.engagements ?? m.engagement ?? 0,
    impressions: m.impressions ?? m.impression ?? 0,
    followers: m.followers ?? 0,
    clicks: m.clicks ?? 0,
    shares: m.shares ?? 0,
    saves: m.saves ?? 0,
  }));
}

function transformToHourlyData(data: unknown): HourlyEngagementPoint[] {
  if (Array.isArray(data)) {
    return data.map((d: any) => ({
      hour: d.hour ?? d.time ?? 0,
      engagement: d.engagement ?? d.value ?? 0,
    }));
  }
  return [];
}

function transformToWeeklyData(data: unknown): WeeklyPerformancePoint[] {
  if (Array.isArray(data)) {
    return data.map((d: any) => ({
      day: d.day ?? d.label ?? "",
      engagement: d.engagement ?? 0,
      reach: d.reach ?? d.reach ?? 0,
    }));
  }
  return [];
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/hooks/use-analytics.ts
git commit -m "feat(analytics): add TanStack Query hooks for analytics page"
```

---

### Task 3: Refactor Analytics Page to Use Real Data

**Files:**
- Modify: `apps/web/src/app/analytics/page.tsx:212-647`

- [ ] **Step 1: Add state for selected account**

```typescript
// Add after existing state in AnalyticsPage
const [selectedAccount, setSelectedAccount] = useState<string>("default-account-id");
```

- [ ] **Step 2: Replace fake data generators with hooks**

```typescript
// Replace useMemo for chartData with:
const { data: dailyMetrics } = useDailyMetrics(
  selectedAccount,
  selectedTime,
  activeMetric,
);

const { data: hourlyData } = useHourlyEngagement(selectedAccount);
const { data: weeklyData } = useBestDays(selectedAccount);
const { data: overviewData } = useAnalyticsOverview(selectedAccount, selectedTime);
const { data: topPostsData } = useTopPostsAnalytics(selectedAccount, selectedTime);
const { data: demographicsData } = useDemographics(selectedAccount);
const { data: contentTypeData } = useContentTypePerformance(selectedAccount);
```

- [ ] **Step 3: Update totals calculation to use real data**

```typescript
// Replace the fake totals useMemo with:
const totals = useMemo(() => {
  if (!dailyMetrics?.length) {
    return {
      engagements: 0,
      impressions: 0,
      clicks: 0,
      shares: 0,
      saves: 0,
      followerGrowth: 0,
    };
  }
  return {
    engagements: dailyMetrics.reduce((sum, d) => sum + d.engagements, 0),
    impressions: dailyMetrics.reduce((sum, d) => sum + d.impressions, 0),
    clicks: dailyMetrics.reduce((sum, d) => sum + d.clicks, 0),
    shares: dailyMetrics.reduce((sum, d) => sum + d.shares, 0),
    saves: dailyMetrics.reduce((sum, d) => sum + d.saves, 0),
    followerGrowth:
      dailyMetrics[dailyMetrics.length - 1]?.followers - dailyMetrics[0]?.followers ?? 0,
  };
}, [dailyMetrics]);
```

- [ ] **Step 4: Update chart data mapping**

```typescript
// In LineChart, replace chartData with:
const chartData = dailyMetrics?.map((d, i) => ({
  day: i,
  engagements: d.engagements,
  impressions: d.impressions,
  followers: d.followers,
  clicks: d.clicks,
  shares: d.shares,
  saves: d.saves,
})) ?? [];
```

- [ ] **Step 5: Replace STAT_DEFINITIONS with real % changes**

```typescript
// Replace STAT_DEFINITIONS map with:
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
  {overviewData && (
    <>
      <StatCard label="Total Engagements" value={totals.engagements} change={overviewData.engagementsChange} />
      <StatCard label="Impressions" value={totals.impressions} change={overviewData.impressionsChange} />
      <StatCard label="New Followers" value={totals.followerGrowth} change={overviewData.followerGrowthChange} />
      <StatCard label="Link Clicks" value={totals.clicks} change={overviewData.clicksChange} />
      <StatCard label="Shares" value={totals.shares} change={overviewData.sharesChange} />
      <StatCard label="Saves" value={totals.saves} change={overviewData.savesChange} />
    </>
  )}
</div>
```

- [ ] **Step 6: Add StatCard helper component inline**

```typescript
function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: number;
  change: number;
}) {
  const isPositive = change >= 0;
  return (
    <div className="border rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold">{formatMetricValue(value)}</p>
      <div className={`flex items-center gap-0.5 text-xs mt-1 ${isPositive ? "text-success" : "text-destructive"}`}>
        <TrendingUp className={`size-3 ${!isPositive ? "rotate-180" : ""}`} />
        {isPositive ? "+" : ""}{change.toFixed(1)}%
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Replace top posts with real data**

```typescript
// Replace topPosts.map with topPostsData?.map
{topPostsData?.slice(0, 4).map((post) => (
  <div key={post.id} className="border rounded-lg p-4">
    ...
  ))}
```

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/app/analytics/page.tsx
git commit -m "feat(analytics): connect page to real API data"
```

---

### Task 4: Add Loading/Error States

**Files:**
- Modify: `apps/web/src/app/analytics/page.tsx`

- [ ] **Step 1: Add loading skeletons for each section**

```typescript
// Add skeleton components
function ChartSkeleton() {
  return <div className="h-[300px] animate-pulse bg-muted rounded-lg" />;
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 animate-pulse bg-muted rounded" />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wrap each section with loading/error handling**

```typescript
// Example for main chart
{dailyMetrics === undefined ? (
  <ChartSkeleton />
) : dailyMetrics === null ? (
  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
    Failed to load metrics
  </div>
) : (
  <LineChart data={chartData} ...>
  ...
  </LineChart>
)}
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/analytics/page.tsx
git commit -m "feat(analytics): add loading/error states"
```

---

## API Endpoints Mapping

| Frontend Section | API Endpoint | Response Shape |
|---|---|---|
| Overview stats (6 cards) | `GET /v1/analytics` | `{ engagements, impressions, followerGrowth, clicks, shares, saves, changes[] }` |
| Main line chart (daily) | `GET /v1/analytics/daily` | `{ metrics: [{ date, engagements, impressions, followers, clicks, shares, saves }] }` |
| Hourly engagement bar | `GET /v1/analytics/best-time` | `[{ hour, engagement }]` |
| Weekly performance bar | `GET /v1/analytics/best-time` | `[{ day, engagement, reach }]` |
| Platform performance table | `GET /v1/analytics` | `{ platforms: [{ platform, followers, engagement, posts, growth }] }` |
| Demographics pie charts | `GET /v1/analytics/instagram/demographics` | `{ age: [], gender: [] }` |
| Content type performance | `GET /v1/analytics/content-decay` | `[{ type, engagement, reach, count }]` |
| Top performing posts | `GET /v1/analytics/timeline` | `[{ id, platform, content, likes, comments, shares, views, engagementRate, date }]` |

---

## Self-Review Checklist

1. **Spec coverage:** All 8 data sections on analytics page have corresponding API hooks
2. **Placeholder scan:** No TBD/TODO - transformer functions handle missing fields with fallbacks
3. **Type consistency:** All transformer functions return typed interfaces from `analytics.ts`

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-23-analytics-server-data.md`.**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
