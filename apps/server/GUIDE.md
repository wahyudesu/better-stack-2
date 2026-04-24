# Overview

> Complete guide to all social media platforms supported by Zernio API

Source: Zernio API Documentation (https://docs.zernio.com)
API Base URL: https://zernio.com/api/v1

---

# Overview

Complete guide to all social media platforms supported by Zernio API

import { Callout } from 'fumadocs-ui/components/callout';

Zernio supports 15 major social media platforms. Each platform page includes quick start examples, media requirements, and platform-specific features.

## Platform Quick Reference

<PlatformOverviewTable />

## Getting Started

### 1. Connect an Account

Each platform uses OAuth or platform-specific authentication. Start by connecting an account:

```bash
curl "https://zernio.com/api/v1/connect/{platform}?profileId=YOUR_PROFILE_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Replace `{platform}` with: `twitter`, `instagram`, `facebook`, `linkedin`, `tiktok`, `youtube`, `pinterest`, `reddit`, `bluesky`, `threads`, `googlebusiness`, `telegram`, `snapchat`, `whatsapp`, or `discord`.

### 2. Create a Post

Once connected, create posts targeting specific platforms:

```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from Zernio API!",
    "platforms": [
      {"platform": "twitter", "accountId": "YOUR_ACCOUNT_ID"}
    ],
    "publishNow": true
  }'
```

### 3. Cross-Post to Multiple Platforms

Post to multiple platforms simultaneously:

```bash
curl -X POST https://zernio.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Cross-posting to all platforms!",
    "platforms": [
      {"platform": "twitter", "accountId": "acc_twitter"},
      {"platform": "linkedin", "accountId": "acc_linkedin"},
      {"platform": "bluesky", "accountId": "acc_bluesky"}
    ],
    "publishNow": true
  }'
```

## Platform-Specific Features

Each platform has unique capabilities:

- **Twitter/X** - Threads, polls, scheduled spaces
- **Instagram** - Stories, Reels, Carousels, Collaborators
- **Facebook** - Reels, Stories, Page posts
- **LinkedIn** - Documents (PDFs), Company pages, Personal profiles
- **TikTok** - Privacy settings, duet/stitch controls
- **YouTube** - Shorts, playlists, visibility settings
- **Pinterest** - Boards, Rich pins
- **Reddit** - Subreddits, flairs, NSFW tags, native video uploads (with videogif and custom poster support)
- **Bluesky** - Custom feeds, app passwords
- **Threads** - Reply controls
- **Google Business** - Location posts, offers, events, performance metrics, search keywords
- **Telegram** - Channels, groups, silent messages, protected content
- **Snapchat** - Stories, Saved Stories, Spotlight, Public Profiles
- **WhatsApp** - Template messages, broadcasts, contacts, conversations, Flows (interactive forms)
- **Discord** - Messages, embeds, native polls, forum posts, threads, crosspost

## Analytics KPIs Matrix

Which metrics does the [Analytics API](/analytics/get-analytics) return for each platform?

| Platform | Impressions | Reach | Likes | Comments | Shares | Saves | Clicks | Views |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Instagram | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Facebook | ✅ | - | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| Twitter/X | ✅ | - | ✅ | ✅ | ✅ | - | ✅ | ✅ |
| LinkedIn | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ | ✅\* |
| TikTok | - | - | ✅ | ✅ | ✅ | - | - | ✅ |
| YouTube | - | - | ✅ | ✅ | ✅\*\* | - | - | ✅ |
| Threads | ✅ | - | ✅ | ✅ | ✅ | - | - | ✅ |
| Bluesky | - | - | ✅ | ✅ | ✅ | - | - | - |
| Reddit | - | - | ✅ | ✅ | - | - | - | - |
| Pinterest | ✅ | - | - | - | - | ✅ | ✅ | - |
| Snapchat | - | ✅ | - | - | ✅ | - | - | ✅ |
| Telegram | - | - | - | - | - | - | - | - |
| WhatsApp | - | - | - | - | - | - | - | - |
| Google Business | ✅ | - | - | - | - | - | ✅ | ✅ |

\* LinkedIn views only for video posts

\*\* YouTube shares only available via daily Analytics API, not basic Data API

YouTube also supports [audience demographics](/analytics/get-youtube-demographics) (age, gender, country breakdowns) via a dedicated endpoint.

Google Business also supports [daily performance metrics](/analytics/get-google-business-performance) (impressions, clicks, calls, directions, bookings) and [search keywords](/analytics/get-google-business-search-keywords) via dedicated endpoints.

## Inbox Feature Matrix

> **Requires [Inbox add-on](/pricing)** — Build: +$10/mo · Accelerate: +$50/unit · Unlimited: +$1,000/mo

The Inbox API provides a unified interface for managing DMs, comments, and reviews across all platforms.

### DMs Support

| Platform | List | Fetch | Send Text | Attachments | Quick Replies | Buttons | Edit | Archive |
|----------|------|-------|-----------|-------------|---------------|---------|------|---------|
| Facebook | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Instagram | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ |
| Twitter/X | ✅ | ✅ | ✅ | ✅ | - | - | - | ❌ |
| Bluesky | ✅ | ✅ | ✅ | ❌ | - | - | - | ✅ |
| Reddit | ✅ | ✅ | ✅ | ❌ | - | - | - | ✅ |
| Telegram | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| WhatsApp | ✅ | ✅ | ✅ | ✅ | - | - | - | ✅ |

### Comments Support

| Platform | List | Post | Reply | Delete | Like | Hide |
|----------|------|------|-------|--------|------|------|
| Facebook | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Instagram | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Twitter/X | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bluesky | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Threads | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Reddit | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| YouTube | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| LinkedIn | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| TikTok | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Reviews Support

| Platform | List | Reply | Delete Reply |
|----------|------|-------|--------------|
| Facebook | ✅ | ✅ | ❌ |
| Google Business | ✅ | ✅ | ✅ |

### Webhooks

Base message + comment events:

| Platform | `comment.received` | `message.received` | `message.sent` |
|----------|:---:|:---:|:---:|
| Instagram | ✅ | ✅ | ✅ |
| Facebook | ✅ | ✅ | ✅ |
| Twitter/X | ✅ | - | - |
| YouTube | ✅ | - | - |
| LinkedIn | ✅ | - | - |
| Bluesky | ✅ | ✅ | ✅ |
| Reddit | ✅ | ✅ | ✅ |
| Telegram | - | ✅ | ✅ |
| WhatsApp | - | ✅ | ✅ |

Message lifecycle events (edits, unsends, delivery status):

| Platform | `message.edited` | `message.deleted` | `message.delivered` | `message.read` | `message.failed` |
|----------|:---:|:---:|:---:|:---:|:---:|
| Instagram | ✅ | ✅ | — | ✅ | — |
| Facebook | ✅ | — | ✅ | ✅ | — |
| WhatsApp | — | ✅ (business-side) | ✅ | ✅ | ✅ |
| Telegram | ✅ | — | — | — | — |
| Twitter/X | — | — | — | — | — |
| Bluesky | — | — | — | — | — |
| Reddit | — | — | — | — | — |

Dashes indicate the underlying platform API does not expose that event; the gap is a platform limitation, not a Zernio one.

### Account Settings

| Platform | Feature | Endpoint |
|----------|---------|----------|
| Facebook | Persistent menu | `/v1/accounts/{accountId}/messenger-menu` |
| Instagram | Ice breakers | `/v1/accounts/{accountId}/instagram-ice-breakers` |
| Telegram | Bot commands | `/v1/accounts/{accountId}/telegram-commands` |

See [Account Settings](/account-settings/get-messenger-menu) for full endpoint documentation.

### No Support

| Platform | Status | Notes |
|----------|--------|-------|
| Pinterest | No API | No inbox features available |
| Snapchat | No API | No inbox features available |
| TikTok | Not supported | No inbox features available |

### Platform Limitations

| Platform | Limitation |
|----------|------------|
| Instagram | Reply-only comments, no comment likes (deprecated 2018) |
| Twitter/X | DMs require `dm.read` and `dm.write` scopes, no archive/unarchive, reply search cached (2-min TTL) |
| Bluesky | No DM attachments, like requires CID |
| Threads | No DMs, no comment likes, reply-only comments (no top-level), supports hide/unhide |
| Reddit | No DM attachments |
| Telegram | Bot-based, media limits (photos 10MB, videos 50MB) |
| YouTube | No DMs, no comment likes |
| LinkedIn | Org accounts only, no comment likes |
| WhatsApp | Template messages required outside 24h window, no comment support |

See [Messages](/messages/list-inbox-conversations), [Comments](/comments/list-inbox-comments), and [Reviews](/reviews/list-inbox-reviews) API Reference for full endpoint documentation.

## Ad Platforms

<Callout type="info">
**Requires the Ads add-on.** Build: $10/mo, Accelerate: $50/unit, Unlimited: $1,000/mo. Enable in your billing settings.
</Callout>

Zernio also supports paid advertising across 6 ad networks via the `/v1/ads` endpoints. Create standalone campaigns, boost organic posts, manage audiences, and pull analytics from one REST API.

| Platform | Key | Create | Boost | Audiences | Analytics |
|----------|-----|--------|-------|-----------|-----------|
| [Meta Ads](/platforms/meta-ads) (Facebook + Instagram) | `metaads` | Yes | Yes | Custom + Lookalike | Yes |
| [Google Ads](/platforms/google-ads) | `googleads` | Search + Display | No | No | Yes |
| [LinkedIn Ads](/platforms/linkedin-ads) | `linkedinads` | Yes | Yes | Read-only | Yes |
| [TikTok Ads](/platforms/tiktok-ads) | `tiktokads` | Yes | Spark Ads | Custom + Lookalike | Yes |
| [Pinterest Ads](/platforms/pinterest-ads) | `pinterestads` | Yes | Yes | Basic | Yes |
| [X Ads](/platforms/x-ads) | `xads` | Yes | Yes | No | Yes |

### Ad Hierarchy

| Platform | Top Level | Middle | Bottom |
|----------|-----------|--------|--------|
| Meta Ads | Campaign | Ad Set | Ad |
| Google Ads | Campaign | Ad Group | Ad |
| LinkedIn Ads | Campaign Group | Campaign | Creative |
| TikTok Ads | Campaign | Ad Group | Ad |
| Pinterest Ads | Campaign | Ad Group | Pin |
| X Ads | Campaign | Line Item | Promoted Tweet |

See each platform's page for Quick Start code examples (Node.js, Python, curl) and full endpoint docs.

## API Reference

- [Connect Account](/guides/connecting-accounts) - OAuth flow for all platforms
- [Create Post](/posts/create-post) - Post creation and scheduling
- [Upload Media](/guides/media-uploads) - Image and video uploads
- [Analytics](/analytics/get-analytics) - Post performance metrics
- [Ads](/ads/list-ads) - Ad management, boost, and analytics
- [Messages](/messages/list-inbox-conversations), [Comments](/comments/list-inbox-comments), and [Reviews](/reviews/list-inbox-reviews)
- [Account Settings](/account-settings/get-messenger-menu) - Platform-specific messaging settings
