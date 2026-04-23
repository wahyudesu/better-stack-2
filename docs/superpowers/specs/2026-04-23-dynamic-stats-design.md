# Dynamic Dashboard Stats - Hybrid Approach Design

**Date:** 2026-04-23
**Status:** Approved

## Overview

Refactor `generateData()` in dashboard to produce more realistic, dynamic stats that vary by day-of-week, time patterns, and use pool guardrails to ensure values stay in realistic ranges.

## Approach: Hybrid (A + B)

Combines **Time-Aware Variability** (A) with **Pool Guardrails** (B) for natural variation without unrealistic values.

### Components

**1. Pool Guardrails**
Per-metric realistic ranges defined in `STATS_POOLS`:
```typescript
STATS_POOLS = {
  impressions: { base: 15000-80000 },
  engagements: { base: 3000-25000 },
  likes: { base: 2000-15000 },
  replies: { base: 200-2000 },
  shares: { base: 100-800 },
  saves: { base: 50-500 }
}
```
Values pulled from pool + Gaussian noise (±15%).

**2. Time Patterns**
- `DAY_OF_WEEK_MULT`: Mon-Fri 0.85-1.0, Sat-Sun 1.2-1.4
- `SPIKE_CHANCE`: 15% per day, spike = 2-4x normal
- `TREND_SLOPE`: slight upward bias across period

**3. Seed Evolution**
- Seed = hash(platform + type + timeRange + day-of-month)
- Changes daily — same filter = different numbers each day
- Previous period comparison still works (generated from halved seed)

### Output Shape
Unchanged. Same `stats` array + `chartData` format. Components don't change.

## Files Touched

- `apps/web/src/app/dashboard/page.tsx` — `generateData()` refactor
- `apps/web/src/lib/data/analytics-data.ts` — add pool constants

## Success Criteria

- Stats differ day-to-day for same filters
- Weekends show 20-40% higher engagements
- Occasional spike days (viral simulation)
- Numbers always stay in realistic ranges
- No breaking changes to component interfaces