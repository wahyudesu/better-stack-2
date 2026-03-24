<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm run dev          # Start dev server (port 3000)
pnpm run build        # Production build
pnpm run lint         # Run linter (if configured)
```

## Project Structure

This is a **pnpm workspace monorepo**:
- `apps/web` - Next.js 16 app (this directory)
- `packages/ui` - Shared UI components package

Key directories:
- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utilities and shared code

## Deployment

**Cloudflare Workers (OpenNext):**
```bash
pnpm run build:cf      # Build for Cloudflare
pnpm run deploy:cf     # Deploy to Cloudflare Workers
```

Note: Uses `@opennextjs/cloudflare` adapter. Set `OPENNEXT_DISABLE_MONOREPO=1` for workspace.

## Gotchas

- **Select onChange**: Use `selectHandler(setValue, "default")` helper - Select components pass `string | null` but `useState` doesn't accept null
- **@base-ui/react**: Tabs component uses `Tabs.Root`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel` (not Radix-style names)
- **Dialog**: DialogContent requires `DialogContentProps` interface to be exported for type compatibility
- **Type imports**: Some components require `type` keyword for imports due to `verbatimModuleSyntax`
- **Build cache**: Run `rm -rf .next` if build has stale type errors after file deletions
