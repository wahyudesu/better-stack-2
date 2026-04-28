# ZenPost

Social media dashboard for creators and businesses in Indonesia.

## Features

- **TypeScript** - Type safety across web, landing, and shared packages
- **Next.js 16** - App Router frontend (`apps/web`) + marketing site (`apps/landing`)
- **Convex** - Real-time backend with type-safe queries and mutations
- **Clerk** - Authentication and user management
- **Tailwind CSS v4** - Utility-first CSS with oklch color system
- **Shared UI package** - `@base-ui/react` primitives in `packages/ui`
- **@visx + Recharts** - Custom and standard chart visualizations
- **Tauri** - Native desktop app packaging
- **Cloudflare Workers** - Edge deployment via OpenNext

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the web application.

## UI Customization

React web apps in this stack share UI primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`

### Add app-specific components

Run shadcn CLI from the app directory to add components locally:

```bash
cd apps/web
npx shadcn@latest add button card dialog
```

## Deployment

**Web app** (Cloudflare Workers via OpenNext):
```bash
cd apps/web && pnpm run build:cf && pnpm run deploy:cf
```

**Landing page** (Cloudflare Pages via OpenNext):
```bash
cd apps/landing && pnpm run deploy
```

**Desktop app**:
```bash
cd apps/web && pnpm run desktop:build
```

## Project Structure

```
zenpost/
├── apps/
│   ├── web/         # Main dashboard app (Next.js 16, App Router)
│   └── landing/    # Marketing site (zenpost.in)
├── packages/
│   └── ui/          # Shared @base-ui/react components and Tailwind styles
└── convex/          # Convex backend schema and functions
```

## Available Scripts

- `pnpm run dev` - Start all apps
- `pnpm run dev:web` - Start only the web app
- `pnpm run dev:landing` - Start only the landing page
- `pnpm run build` - Build all apps
- `pnpm run build:cf` - Build web app for Cloudflare Workers
- `pnpm run check` - Run Biome linting and type checking
- `cd apps/web && pnpm run desktop:dev` - Start Tauri desktop app in development
- `cd apps/web && pnpm run desktop:build` - Build Tauri desktop app

```
pnpm dlx @opennextjs/cloudflare build && npx convex deploy && pnpm dlx @opennextjs/cloudflare deploy
```
```
pnpm dlx @opennextjs/cloudflare build && pnpm dlx @opennextjs/cloudflare deploy
```

CONVEX_DEPLOYMENT=
CONVEX_DEPLOY_KEY=dev:first-cobra-587|eyJ2MiI6IjQzNjRjZjYxYjVhNDQ1MjE5NWQxMzZiNTYyNDBjYTI0In0=