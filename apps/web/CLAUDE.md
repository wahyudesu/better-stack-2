<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

OPENNEXT_DISABLE_MONOREPO=1 pnpm dlx @opennextjs/cloudflare build --skipWranglerConfigCheck && pnpm exec wrangler deploy .open-next

OPENNEXT_DISABLE_MONOREPO=1 pnpm dlx @opennextjs/cloudflare build --skipWranglerConfigCheck && pnpm exec wrangler deploy --config wrangler.jsonc

OPENNEXT_DISABLE_MONOREPO=1 pnpm dlx @opennextjs/cloudflare build --skipWranglerConfigCheck && pnpm exec wrangler deploy --config wrangler.jsonc