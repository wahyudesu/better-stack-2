# UI Audit Review: Dashboard Stats Section

**Date:** 2026-03-30
**Component:** `AreaChartCard` (stats section) in `src/components/dashboard/line-chart-card.tsx`
**Usage:** `/dashboard` page - Primary metrics display

---

## Executive Summary

| Pillar | Score | Status |
|--------|-------|--------|
| Copywriting | 3/4 | 🟡 Good |
| Visuals | 2/4 | 🔴 Needs Work |
| Color | 3/4 | 🟡 Good |
| Typography | 2/4 | 🔴 Needs Work |
| Spacing | 2/4 | 🔴 Needs Work |
| Experience Design | 3/4 | 🟡 Good |
| **Overall** | **15/24** | **🔴 63%** |

---

## 1. Copywriting (3/4) ✓ Good

### What's Working
- Clear, concise metric labels: "Impressions", "Engagements", "Likes", "Profile Visits", "Replies", "Shares"
- Percentage change indicators are immediately understandable
- Metric names align with industry-standard social media terminology

### Issues Found

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1.1 | "Profile Visits" terminology inconsistent with actual metric | Minor | Line 154 |
| 1.2 | No tooltip or help text explaining what metrics include | Minor | All stats |

### Recommendations
1. Consider "Views" instead of "Profile Visits" for consistency
2. Add optional tooltips explaining metric composition (e.g., "Engagements = likes + comments + shares")

---

## 2. Visuals (2/4) 🔴 Needs Work

### What's Working
- Clean card-based layout
- Clear visual hierarchy with large value display
- Badge indicators for trend direction

### Critical Issues

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| 2.1 | **Mobile layout broken** - stats stacked in 2-column grid causing very tall section | Critical | Line 145 | Use horizontal scroll or reduce visible stats on mobile |
| 2.2 | **Negative margin hack** `-mx-2` on buttons causes overflow issues | Major | Line 155 | Remove negative margins, use proper spacing |
| 2.3 | Active state only shows underline - weak visual feedback | Moderate | Line 169-171 | Add background highlight or border |

### Mobile-Specific Problems

```
Current (2-column grid):
┌─────────┬─────────┐
│ Stat 1  │ Stat 2  │  ← Takes 50% viewport height
├─────────┼─────────┤
│ Stat 3  │ Stat 4  │
├─────────┼─────────┤
│ Stat 5  │ Stat 6  │
└─────────┴─────────┘

Better (horizontal scroll):
┌───────────────────────────┐
│ ← Stat 1 | Stat 2 | ... → │  ← Single row, scrollable
└───────────────────────────┘
```

### Recommendations
1. **Mobile**: Implement horizontal scroll with snap for stats
2. **Mobile**: Show only 3 key metrics by default, expandable
3. Remove `-mx-2` negative margin - use container padding instead
4. Add pill-shaped background for active metric instead of underline

---

## 3. Color (3/4) 🟡 Good

### What's Working
- Semantic color usage for trends (green = up, red = down, neutral = flat)
- Good contrast ratios on badge text
- Consistent with design system variables

### Issues Found

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| 3.1 | Badge hover inherits `hover:bg-green-500/15` but creates no visible change | Minor | Line 70, 73 | Remove hover from badges or make meaningful |
| 3.2 | Hardcoded badge color values don't use CSS variables | Minor | Line 70-73 | Use `--success`, `--error` variables |

### Recommendations
1. Extract badge colors to CSS variables for theme consistency
2. Ensure disabled states have appropriate color treatment

---

## 4. Typography (2/4) 🔴 Needs Work

### What's Working
- Clear size hierarchy: `text-xs` label → `text-2xl` value
- Bold values draw attention appropriately
- Font medium on labels creates good hierarchy

### Critical Issues

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| 4.1 | **`text-2xl` too large for mobile** - causes line overflow and cramped feel | Critical | Line 176 | Scale down to `text-xl` or `text-lg` on mobile |
| 4.2 | Truncation not applied to long values (e.g., "1,234,567") | Major | Line 176 | Add `truncate` or responsive sizing |
| 4.3 | Active state underline may interfere with text descenders | Minor | Line 170 | Increase `underline-offset-4` |

### Mobile Typography Problems

```css
/* Current */
.text-2xl { font-size: 1.5rem; } /* 24px - too big for narrow columns */

/* Better */
@media (max-width: 640px) {
  .stat-value { font-size: 1.125rem; } /* 18px */
}
```

### Recommendations
1. Add responsive font sizing: `text-xl sm:text-2xl`
2. Use `tabular-nums` class for better number alignment
3. Consider `truncate` class for metric labels on very small screens

---

## 5. Spacing (2/4) 🔴 Needs Work

### What's Working
- Consistent `space-y-2` vertical spacing within stat items
- `p-4` padding provides good touch target size

### Critical Issues

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| 5.1 | **Horizontal divider doesn't work on mobile** - using `divide-x` on flex container but mobile uses grid | Critical | Line 145 | Use conditional borders or background-based separators |
| 5.2 | Negative margin `-mx-2` creates overflow issues | Major | Line 155 | Remove, adjust container padding instead |
| 5.3 | `gap-0` creates tight spacing between stats | Minor | Line 145 | Use `gap-1 sm:gap-0` for mobile breathing room |

### Mobile Spacing Problems

```tsx
// Current: Gap-0 with divide-x (doesn't work on mobile grid)
<div className="grid grid-cols-2 ... gap-0 divide-x divide-border/50">

// Better: Proper mobile spacing
<div className="grid grid-cols-2 gap-2 sm:gap-0 sm:flex sm:divide-x">
```

### Recommendations
1. Add mobile-specific gap: `gap-2 sm:gap-0`
2. Use CSS grid's own border capabilities instead of divide utilities
3. Increase mobile padding: `p-3 sm:p-4`

---

## 6. Experience Design (3/4) 🟡 Good

### What's Working
- **Clickable stats** to change chart metric - excellent affordance
- Hover states provide feedback
- Focus rings for keyboard accessibility
- Active state clearly indicated
- Screen reader summary present

### Issues Found

| # | Issue | Severity | Location | Fix |
|---|-------|----------|----------|-----|
| 6.1 | No loading/skeleton state while metrics fetch | Minor | N/A | Add skeleton UI |
| 6.2 | No error state if metrics fail to load | Minor | N/A | Add error boundary |
| 6.3 | `onClick` uses `e.stopPropagation()` - may interfere with parent interactions | Minor | Line 101 | Document why this is needed |

### Recommendations
1. Add skeleton loader:
   ```tsx
   {!stats ? (
     <div className="grid grid-cols-2 sm:flex gap-2">
       {[...Array(6)].map((_, i) => (
         <div key={i} className="h-20 bg-muted/50 rounded animate-pulse" />
       ))}
     </div>
   ) : (
     // stats render
   )}
   ```
2. Consider adding metric trend sparkline mini-charts

---

## Priority Fixes (Ordered by Impact)

### Must Fix (Before Launch)
1. **[2.1]** Implement horizontal scroll or reduced stat count for mobile
2. **[4.1]** Add responsive font sizing for stat values
3. **[5.1]** Fix mobile spacing/dividers

### Should Fix (Next Sprint)
4. **[2.2]** Remove negative margin `-mx-2`
5. **[4.2]** Add tabular-nums for number alignment
6. **[2.3]** Improve active state visual feedback

### Nice to Have
7. **[1.2]** Add metric tooltips
8. **[6.1]** Add skeleton loading state
9. **[3.2]** Extract badge colors to CSS variables

---

## Mobile Optimization Code

```tsx
// Replace stats section (lines 143-192) with:

{stats && (
  <div className="relative">
    {/* Mobile: Horizontal scroll */}
    <div className="flex overflow-x-auto gap-2 sm:gap-0 scrollbar-hide
                    sm:grid sm:grid-cols-6 sm:divide-x sm:divide-y-0
                    -mx-4 px-4 sm:mx-0 sm:px-0">
      {stats.map((stat) => {
        const direction = getDirection(stat.change);
        const isActive = stat.metricKey === activeMetric;
        return (
          <button
            key={stat.metricKey}
            type="button"
            onClick={(e) => handleStatClick(stat.metricKey, e)}
            className={cn(
              "flex flex-col items-start text-left space-y-1.5",
              "flex-shrink-0 w-32 sm:flex-1 sm:w-auto",
              "p-3 sm:px-6 sm:py-2",
              "transition-all duration-200",
              "hover:bg-muted/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <span className={cn(
              "text-xs font-medium transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}>
              {stat.label}
            </span>
            <span className="text-lg sm:text-2xl font-bold text-foreground tabular-nums">
              {stat.value}
            </span>
            <Badge variant="secondary" className={cn(
              "text-xs px-2 py-0.5 w-fit",
              badgeVariants[direction],
            )}>
              {stat.change}
            </Badge>
          </button>
        );
      })}
    </div>
    {/* Fade indicator for scroll */}
    <div className="absolute right-0 top-0 bottom-0 w-8
                    bg-gradient-to-l from-background to-transparent
                    sm:hidden pointer-events-none" />
  </div>
)}
```

---

## UI REVIEW COMPLETE

**Overall Score:** 15/24 (63%)
**Status:** 🔴 Needs mobile optimization before production

**Next Steps:**
1. Implement mobile horizontal scroll or stat reduction
2. Fix responsive typography
3. Remove negative margins
4. Test on actual mobile devices (320px - 428px width)
