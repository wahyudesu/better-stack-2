# Tailwind Style System — better-stack-2

## Tailwind Setup Summary

**Stack:** Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)

### Color System
- **Format:** `oklch()` exclusively — perceptually uniform, avoids the "blue/purple mismatch" problem of HSL
- **Primary:** Indigo-tinted (`oklch(0.55 0.22 264)`)
- **Light background:** `oklch(0.98 0.001 260)` — subtle cool off-white, not pure white
- **Dark background:** `oklch(0.19 0 0)` — soft charcoal, not pure black
- **Chart colors:** 5 distinct hues (blue → teal → green → yellow-orange), 10+ chart-specific tokens for grid, tooltip, crosshair, markers, segments

### Architecture
- **`packages/ui/src/styles/globals.css`** — Single source of truth for all design tokens
- **`apps/web/src/app/globals.css`** — App-level tokens (shadcn + chart tokens), imports UI package
- **`apps/landing/src/app/globals.css`** — Imports UI package only

### CSS Layers (in `@packages/ui/globals.css`)
```
@layer reset, theme, base, components, utilities;
```
Well-structured cascade management.

### Custom Components Built in CSS
| Class | Effect |
|---|---|
| `.hover-lift` | `translateY(-1px)` on hover |
| `.hover-scale` | `scale(1.02)` on hover |
| `.press-feedback` | `scale(0.97)` on active |
| `.stagger-item` | Staggered fade+slide animation (10 delay slots, 40ms apart) |
| `.button-pushable` | 3D tactile button with shadow/edge/front layers, bounce easing |
| `.scrollbar-hide` | Hide scrollbar, keep functionality |
| `.depth-shadow-*` | Custom depth button shadows (blue, gray, destructive variants) |

### Easing Presets (CSS vars)
- `--ease-bounce: cubic-bezier(0.3, 0.7, 0.4, 1)`
- `--ease-bounce-responsive` (more exaggerated for hover)
- `--ease-smooth: cubic-bezier(0.23, 1, 0.32, 1)`
- `--ease-instant: 34ms`

### Radius Scale
`0.625rem` base → sm, md, lg, xl, 2xl, 3xl, 4xl via calc

### Accessibility
`prefers-reduced-motion` respected — all animations/transitions disabled, pushable buttons get `scale(0.97)` fallback.

### Key Inconsistencies
1. **`packages/ui/globals.css`** defines its own `--radius-sm/md/lg` (8/12/16px), but `apps/web/globals.css` uses `--radius` from shadcn (0.625rem ≈ 10px). These are different scales.
2. Chart colors in `packages/ui` use `hsl()` format while the rest of the system uses `oklch()`.
3. `secondary-foreground` in `packages/ui` is `oklch(0.55 0.22 264)` (primary color) instead of a muted gray like in `apps/web`.
