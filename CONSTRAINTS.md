# ZenPost - Code Constraints

## Core Stack

| Layer | Technology | Constraint |
|-------|-------------|------------|
| Frontend | Next.js 16.2 + React 19 | App Router only |
| Backend | Convex | Read `convex/_generated/ai/guidelines.md` first |
| Server | Hono + Cloudflare Workers | `wrangler.jsonc` for config |
| Auth | Clerk (`@clerk/nextjs`) | Don't use Clerk for API key storage |
| UI Primitives | @base-ui/react | **NOT Radix** |
| Styling | Tailwind CSS + Biome | Lint with `pnpm run lint` |
| Desktop | Tauri | Cross-platform builds |

## Import Rules

```typescript
// ❌ Don't - barrel import causes tree-shaking issues
import { StatsCards } from "@/components/dashboard";

// ✅ Do - direct import
import { StatsCards } from "@/components/dashboard/stats-cards";
```

```typescript
// ❌ Don't - type keyword required with verbatimModuleSyntax
import { Profile } from "@/lib/types";

// ✅ Do
import type { Profile } from "@/lib/types";
```

## Component Patterns

### Select onChange
```tsx
// Select passes string | null, use ?? for default
onValueChange={(v) => setValue(v ?? "default")}
```

### Platform Filter
```tsx
import { PlatformFilterDropdown, PLATFORM_OPTIONS } from "@/components/ui/platform-filter";
```

### Metric Persistence
```tsx
import { useMetricPreference } from "@/lib/hooks/use-metric-pref";
```

### Dashboard Depth Button
```tsx
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
```

### Hugeicons (Lazy Load)
```tsx
const Icon = lazy(() => import("@hugeicons/react").then(m => ({ default: m.SomeIcon })));
```

## API Client (client.ts)

### Response Format
```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
```

### API Base URL
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
```

### Auth Store Integration
```typescript
import { useAuthStore } from "@/stores";
const apiKey = useAuthStore.getState().apiKey;
```

### Error Handling Pattern
```typescript
const { data, error } = await api.someMethod();
if (error) {
  console.error(error);
  return;
}
// use data
```

## Environment Variables

### apps/web/.env.local (dev)
```bash
NEXT_PUBLIC_CONVEX_URL=https://first-cobra-587.convex.cloud
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787
```

### apps/server/.env
```bash
PORT=8787
ZERNIO_API_KEY=sk_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

## Production Configuration

| App | File | Key Setting |
|-----|------|------------|
| Web | `packages/infra/alchemy.run.ts` | `NEXT_PUBLIC_SERVER_URL: ""` (empty for relative) |
| Server | `wrangler.jsonc` | No `vars.CORS_ORIGIN` needed |
| Server secrets | `wrangler secret` | `ZERNIO_API_KEY`, `CLERK_SECRET_KEY` |

## API Route Structure

### Proxy Routes
```
/api/zernio/[...path]  → proxy to Zernio via server worker
/api/validate-key      → POST to validate user's API key
```

### Server Endpoints
```
/v1/*                  → proxy to zernio.com/api
/v1/usage-stats        → usage stats with user/server key
/health               → health check
/openapi.json         → OpenAPI spec
/docs                 → Scalar API docs
```

## Next.js Build

```bash
# Standard dev
pnpm run dev

# Cloudflare build
pnpm run build:cf

# Deploy to Cloudflare
pnpm run deploy:cf
```

## Biome / Linting

```bash
pnpm run lint        # Check
pnpm run lint:fix   # Auto-fix
pnpm run format      # Format
pnpm run check       # Check + fix
```

## TypeScript

- `verbatimModuleSyntax: true` → must use `import type` for type-only imports
- Build fails if `.next` stale → `rm -rf .next`

## React Compiler

`babel-plugin-react-compiler` active → hooks must follow Rules of React strictly

## State Management

| Store | Library | Purpose |
|-------|---------|---------|
| Auth | Zustand (`useAuthStore`) | API key storage |
| UI | Zustand | UI state |
| Data | Convex | Server-side data |

## File Deletion

When deleting pages/routes:
1. Remove directory
2. Remove any feature-specific components in `src/components/features/`
3. Update any nav links referencing the page
4. Biome may need cleanup

## Package Workspace

```
apps/
  web/        → "web" in package.json
  landing/    → "landing" in package.json
  server/     → "server" in package.json
packages/
  ui/         → "@zenpost/ui"
  env/        → "@zenpost/env"
  config/     → "@zenpost/config"
  infra/      → "@zenpost/infra"
```

## Convex Guidelines

Read before modifying Convex code:
```
convex/_generated/ai/guidelines.md
```

## Browser Support

- Clerk extension can intercept `fetch` calls in browser devtools
- Production API calls use relative URLs or proper production URLs
