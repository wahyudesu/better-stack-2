# Analytics Data Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace mock seed-based data in analytics page with real server data. Implement caching + periodic sync so analytics dashboard loads fast and stays fresh without hammering the API on every visit.

**Architecture:**
1. Extend `ZernioClient` in `use-zernio.ts` with analytics methods matching server routes
2. Create `useAnalyticsData` hook that manages fetch + TanStack Query caching + stale-while-revalidate + background sync via `refetchInterval`
3. Replace mock data generators in `page.tsx` with hook consumers
4. Add staleTime + cacheTime configured per analytics data type (different TTLs for totals vs breakdowns)

**Tech Stack:** TanStack Query v5, React Query, existing ZernioClient pattern

---

## File Map

| File | Role |
|------|------|
| `apps/web/src/hooks/use-zernio.ts` | ZernioClient SDK wrapper (add analytics methods) |
| `apps/web/src/hooks/use-analytics-data.ts` | **NEW** - analytics fetch + caching + sync hook |
| `apps/web/src/app/analytics/page.tsx` | Analytics page (replace mock with hook) |
| `apps/web/src/lib/data/analytics-data.ts` | Static filter options (keep) + STAT_DEFINITIONS import |
| `apps/server/src/routes/analytics/analytics.ts` | Server routes (reference for API shape) |

---

## Task 1: Extend ZernioClient with Analytics Methods

**Files:**
- Modify: `apps/web/src/hooks/use-zernio.ts:178-186` (analytics section)

- [ ] **Step 1: Add analytics methods to ZernioClient interface**

In the `analytics` section of `ZernioClient` interface (around line 68-72), add these methods:

```typescript
analytics: {
    getPostAnalytics: (params: {
        query: { postId: string };
    }) => Promise<{ data: { analytics: PostAnalytics[] }; error: any }>;
    // ADD THESE:
    getAccountAnalytics: (params: {
        query: { accountId: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
    getDailyMetrics: (params: {
        query: { accountId: string; metric?: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: { metrics: any[] }; error: any }>;
    getInstagramInsights: (params: {
        query: { accountId: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
    getInstagramDemographics: (params: {
        query: { accountId: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
    getYoutubeDailyViews: (params: {
        query: { accountId: string; videoId: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
    getBestTime: (params: {
        query: { accountId: string };
    }) => Promise<{ data: any; error: any }>;
    getContentDecay: (params: {
        query: { accountId: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
    getPostTimeline: (params: {
        query: { accountId: string; postId?: string; startDate?: string; endDate?: string };
    }) => Promise<{ data: any; error: any }>;
};
```

- [ ] **Step 2: Implement analytics methods in createZernioClient**

In the `analytics` section of `createZernioClient()` function (around line 178-185), add implementations:

```typescript
analytics: {
    getPostAnalytics: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("postId", query.postId);
        return api.get<{ analytics: PostAnalytics[] }>(
            `/v1/analytics?${params}`,
        );
    },
    // ADD THESE:
    getAccountAnalytics: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics?${params}`);
    },
    getDailyMetrics: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.metric) params.set("metric", query.metric);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<{ metrics: any[] }>(`/v1/analytics/daily-metrics?${params}`);
    },
    getInstagramInsights: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics/instagram/account-insights?${params}`);
    },
    getInstagramDemographics: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics/instagram/demographics?${params}`);
    },
    getYoutubeDailyViews: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        params.set("videoId", query.videoId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics/youtube/daily-views?${params}`);
    },
    getBestTime: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        return api.get<any>(`/v1/analytics/best-time?${params}`);
    },
    getContentDecay: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics/content-decay?${params}`);
    },
    getPostTimeline: async ({ query }) => {
        const params = new URLSearchParams();
        params.set("accountId", query.accountId);
        if (query.postId) params.set("postId", query.postId);
        if (query.startDate) params.set("startDate", query.startDate);
        if (query.endDate) params.set("endDate", query.endDate);
        return api.get<any>(`/v1/analytics/post-timeline?${params}`);
    },
},
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-zernio.ts
git commit -m "feat: extend ZernioClient with full analytics methods"
```

---

## Task 2: Create useAnalyticsData Hook

**Files:**
- Create: `apps/web/src/hooks/use-analytics-data.ts`

- [ ] **Step 1: Write the hook with TanStack Query caching + background sync**

Create `apps/web/src/hooks/use-analytics-data.ts`:

```typescript
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useZernioClient } from "./use-zernio";

export interface AnalyticsFilters {
  accountId: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  metric?: string;
}

// Cache keys factory
export const analyticsDataKeys = {
  overview: (filters: AnalyticsFilters) =>
    ["analytics", "overview", filters.accountId, filters.platform, filters.startDate, filters.endDate] as const,
  dailyMetrics: (filters: AnalyticsFilters) =>
    ["analytics", "daily", filters.accountId, filters.metric, filters.startDate, filters.endDate] as const,
  demographics: (accountId: string, platform: string) =>
    ["analytics", "demographics", accountId, platform] as const,
  hourlyEngagement: (accountId: string) =>
    ["analytics", "hourly", accountId] as const,
  weeklyPerformance: (accountId: string) =>
    ["analytics", "weekly", accountId] as const,
  platformPerformance: (accountId: string) =>
    ["analytics", "platform", accountId] as const,
  contentTypes: (accountId: string) =>
    ["analytics", "content-types", accountId] as const,
  topPosts: (filters: AnalyticsFilters) =>
    ["analytics", "top-posts", filters.accountId, filters.startDate, filters.endDate] as const,
};

// Stale times per data type (ms)
const STALE_TIMES = {
  overview: 5 * 60 * 1000,        // 5 min - totals change frequently
  dailyMetrics: 5 * 60 * 1000,
  demographics: 30 * 60 * 1000,  // 30 min - demographics change slowly
  hourlyEngagement: 15 * 60 * 1000,
  weeklyPerformance: 15 * 60 * 1000,
  platformPerformance: 10 * 60 * 1000,
  contentTypes: 15 * 60 * 1000,
  topPosts: 5 * 60 * 1000,
} as const;

// Background sync intervals (ms) - disabled when tab not visible
const SYNC_INTERVALS = {
  overview: 5 * 60 * 1000,       // refetch every 5 min in background
  dailyMetrics: 5 * 60 * 1000,
  demographics: 0,               // no background sync - slow changing
  hourlyEngagement: 0,
  weeklyPerformance: 0,
  platformPerformance: 0,
  contentTypes: 0,
  topPosts: 5 * 60 * 1000,
} as const;

interface UseAnalyticsOptions {
  /** Disable all background refetching */
  staleOnly?: boolean;
}

/**
 * Hook for fetching analytics overview totals.
 * Uses stale-while-revalidate: returns cached data immediately,
 * refetches in background when stale.
 */
export function useAnalyticsOverview(
  filters: AnalyticsFilters,
  options: UseAnalyticsOptions = {},
) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.overview(filters),
    queryFn: async () => {
      const { data, error } = await client.analytics.getAccountAnalytics({
        query: {
          accountId: filters.accountId,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.overview,
    refetchInterval: options.staleOnly ? undefined : SYNC_INTERVALS.overview,
    enabled: !!client && !!filters.accountId,
  });
}

/**
 * Hook for daily metrics time series.
 */
export function useDailyMetrics(
  filters: AnalyticsFilters,
  options: UseAnalyticsOptions = {},
) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.dailyMetrics(filters),
    queryFn: async () => {
      const { data, error } = await client.analytics.getDailyMetrics({
        query: {
          accountId: filters.accountId,
          metric: filters.metric,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });
      if (error) throw error;
      return data?.metrics ?? [];
    },
    staleTime: STALE_TIMES.dailyMetrics,
    refetchInterval: options.staleOnly ? undefined : SYNC_INTERVALS.dailyMetrics,
    enabled: !!client && !!filters.accountId,
  });
}

/**
 * Hook for Instagram demographics.
 */
export function useInstagramDemographics(accountId: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.demographics(accountId, "instagram"),
    queryFn: async () => {
      const { data, error } = await client.analytics.getInstagramDemographics({
        query: { accountId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.demographics,
    refetchInterval: SYNC_INTERVALS.demographics,
    enabled: !!client && !!accountId,
  });
}

/**
 * Hook for best time to post.
 */
export function useBestTime(accountId: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.hourlyEngagement(accountId),
    queryFn: async () => {
      const { data, error } = await client.analytics.getBestTime({
        query: { accountId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.hourlyEngagement,
    refetchInterval: SYNC_INTERVALS.hourlyEngagement,
    enabled: !!client && !!accountId,
  });
}

/**
 * Hook for content decay / top posts.
 */
export function useTopPosts(
  filters: AnalyticsFilters,
  options: UseAnalyticsOptions = {},
) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.topPosts(filters),
    queryFn: async () => {
      const { data, error } = await client.analytics.getPostTimeline({
        query: {
          accountId: filters.accountId,
          startDate: filters.startDate,
          endDate: filters.endDate,
        },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.topPosts,
    refetchInterval: options.staleOnly ? undefined : SYNC_INTERVALS.topPosts,
    enabled: !!client && !!filters.accountId,
  });
}

/**
 * Hook for content type performance.
 */
export function useContentTypePerformance(accountId: string) {
  const client = useZernioClient();

  return useQuery({
    queryKey: analyticsDataKeys.contentTypes(accountId),
    queryFn: async () => {
      const { data, error } = await client.analytics.getContentDecay({
        query: { accountId },
      });
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.contentTypes,
    refetchInterval: SYNC_INTERVALS.contentTypes,
    enabled: !!client && !!accountId,
  });
}

/**
 * Prefetch analytics data for a given account.
 * Call this on page mount or when user selects an account.
 */
export function usePrefetchAnalytics(client: ReturnType<typeof useZernioClient>, accountId: string) {
  const queryClient = useQueryClient();

  // Prefetch key set
  const prefetchKeys = [
    analyticsDataKeys.overview({ accountId }),
    analyticsDataKeys.platformPerformance(accountId),
    analyticsDataKeys.topPosts({ accountId }),
  ];

  // Could be called via useEffect in page component
  return prefetchKeys;
}
```

- [ ] **Step 2: Export from hooks/index.ts**

Add to `apps/web/src/hooks/index.ts`:

```typescript
export {
  analyticsDataKeys,
  useAnalyticsOverview,
  useDailyMetrics,
  useInstagramDemographics,
  useBestTime,
  useTopPosts,
  useContentTypePerformance,
  usePrefetchAnalytics,
  type AnalyticsFilters,
} from "./use-analytics-data";
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/hooks/use-analytics-data.ts apps/web/src/hooks/index.ts
git commit -m "feat: add useAnalyticsData hook with caching and background sync"
```

---

## Task 3: Refactor Analytics Page to Use Hooks

**Files:**
- Modify: `apps/web/src/app/analytics/page.tsx`

- [ ] **Step 1: Replace mock imports and add hook imports**

Change imports (keep existing UI component imports, remove mock data generators):

Remove:
```typescript
import { Bar } from "@/components/charts/bar";
// ... (seededRandom, generateDetailedData, generateHourlyData, generateWeeklyData)

// Remove data imports that are now from server:
// ageData, contentTypeData, genderData, platformData, STAT_DEFINITIONS, topPosts
```

Add:
```typescript
import {
  useAnalyticsOverview,
  useDailyMetrics,
  useTopPosts,
  useContentTypePerformance,
  analyticsDataKeys,
  type AnalyticsFilters,
} from "@/hooks";
import { useAuthStore } from "@/stores";
```

- [ ] **Step 2: Replace state + mock data with hooks**

Replace the mock data generation + state (around line 209-251):

```typescript
// OLD (mock data):
const [selectedPlatform, setSelectedPlatform] = useState("all");
const [selectedTime, setSelectedTime] = useState("30d");
const [activeMetric, setActiveMetric] = useState("engagements");
const [compareMetric, _setCompareMetric] = useState<string | null>(null);

const {
  chartData,
  markers,
  days: _unusedDays,
} = useMemo(
  () => generateDetailedData(selectedTime, selectedPlatform),
  [selectedTime, selectedPlatform],
);

const hourlyData = useMemo(() => generateHourlyData(), []);
const weeklyData = useMemo(() => generateWeeklyData(), []);

// NEW (from server):
const [selectedPlatform, setSelectedPlatform] = useState("all");
const [selectedTime, setSelectedTime] = useState("30d");
const [activeMetric, setActiveMetric] = useState("engagements");
const [compareMetric, _setCompareMetric] = useState<string | null>(null);

// Get current accountId from auth store (first account or selected)
const { accounts } = useAuthStore.getState();
const currentAccountId = accounts?.[0]?._id ?? "";

// Compute date range from selectedTime
const dateRange = useMemo(() => {
  const end = new Date();
  const start = new Date();
  const daysMap = { "7d": 7, "14d": 14, "30d": 30, "90d": 90 };
  start.setDate(start.getDate() - (daysMap[selectedTime] ?? 30));
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
}, [selectedTime]);

const filters: AnalyticsFilters = useMemo(
  () => ({
    accountId: currentAccountId,
    platform: selectedPlatform,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    metric: activeMetric,
  }),
  [currentAccountId, selectedPlatform, dateRange, activeMetric],
);

// Fetch data from server
const { data: overviewData, isLoading: overviewLoading } = useAnalyticsOverview(filters);
const { data: dailyData, isLoading: dailyLoading } = useDailyMetrics(filters);
const { data: topPostsData, isLoading: topPostsLoading } = useTopPosts(filters);
const { data: contentTypeData, isLoading: contentTypeLoading } = useContentTypePerformance(currentAccountId);
```

- [ ] **Step 3: Replace totals calculation with server data**

Replace the `totals` useMemo (around line 228-251):

```typescript
// OLD (mock):
const totals = useMemo(() => {
  const totalEngagements = chartData.reduce((sum, d) => sum + d.engagements, 0);
  // ... more mock calculations
}, [chartData]);

// NEW (from server):
const totals = useMemo(() => {
  if (!overviewData) {
    return {
      engagements: 0,
      impressions: 0,
      clicks: 0,
      shares: 0,
      saves: 0,
      followerGrowth: 0,
    };
  }
  // Server returns aggregated totals directly
  return {
    engagements: overviewData.engagements ?? 0,
    impressions: overviewData.impressions ?? 0,
    clicks: overviewData.clicks ?? 0,
    shares: overviewData.shares ?? 0,
    saves: overviewData.saves ?? 0,
    followerGrowth: overviewData.followerGrowth ?? 0,
  };
}, [overviewData]);

// chartData from daily metrics
const chartData = dailyData?.map((d: any) => ({
  date: new Date(d.date),
  engagements: d.engagements ?? 0,
  impressions: d.impressions ?? 0,
  clicks: d.clicks ?? 0,
  shares: d.shares ?? 0,
  saves: d.saves ?? 0,
  followers: d.followers ?? 0,
})) ?? [];

// Mock markers still needed for chart visualization (remove if server provides)
const markers = [];
```

- [ ] **Step 4: Add loading skeletons**

Wrap each chart section with loading state:

```typescript
{overviewLoading ? (
  <div className="border rounded-lg p-4 animate-pulse">
    <div className="h-4 w-32 bg-muted rounded mb-4" />
    <div className="h-64 bg-muted rounded" />
  </div>
) : (
  <LineChart data={chartData} ...>
    {/* existing chart content */}
  </LineChart>
)}
```

Apply same pattern for other sections (hourly, weekly, platform performance).

- [ ] **Step 5: Replace static data with server data**

For Platform Performance table:
- `platformData.map(...)` → `overviewData?.platformBreakdown?.map(...) ?? platformData.map(...)`
- Fall back to static data while loading

For Content Type Performance:
- `contentTypeData.map(...)` → `contentTypeData?.types?.map(...) ?? []`

For Top Posts:
- `topPosts.map(...)` → `topPostsData?.posts?.map(...) ?? []`

For Demographics (age/gender):
- Keep using static `ageData` / `genderData` from `analytics-data.ts` initially
- These require separate demographics API calls (defer for now)

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/analytics/page.tsx
git commit -m "refactor(analytics): replace mock data with server hooks"
```

---

## Task 4: Add Error Boundaries + Empty States

**Files:**
- Modify: `apps/web/src/app/analytics/page.tsx`

- [ ] **Step 1: Add error + empty state handling**

After each `useQuery` call, handle error/empty states:

```typescript
// After each hook, handle error state:
const { data: overviewData, error: overviewError } = useAnalyticsOverview(filters);

// In JSX, before the chart:
{overviewError ? (
  <div className="border rounded-lg p-4 text-center text-muted-foreground">
    <p>Failed to load analytics data.</p>
    <button
      onClick={() => queryClient.invalidateQueries({ queryKey: analyticsDataKeys.overview(filters) })}
      className="text-primary underline mt-2"
    >
      Retry
    </button>
  </div>
) : overviewLoading ? (
  <Skeleton className="h-64" />
) : chartData.length === 0 ? (
  <div className="border rounded-lg p-8 text-center text-muted-foreground">
    <p>No analytics data for this period.</p>
    <p className="text-sm mt-1">Connect a social account to start tracking.</p>
  </div>
) : (
  <LineChart data={chartData} ... />
)}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/analytics/page.tsx
git commit -m "fix(analytics): add error and empty state handling"
```

---

## Verification Checklist

After all tasks:

- [ ] `use-zernio.ts` exports full `ZernioClient` with all analytics methods
- [ ] `use-analytics-data.ts` exports 6 hook functions + query key factories
- [ ] `analytics/page.tsx` imports hooks, no mock data generators called
- [ ] TanStack Query `staleTime` per data type (5min / 15min / 30min)
- [ ] `refetchInterval` set for overview + daily + top posts (5 min), none for demographics
- [ ] Loading skeletons present in all chart sections
- [ ] Error + empty states handle API failures gracefully
- [ ] Static `analytics-data.ts` still used for filter options + demographics (deferred)
- [ ] All tests pass (run `pnpm run check` in apps/web)

---

**Plan complete.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?