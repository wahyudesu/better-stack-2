<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Better Stack 2 landing page. The integration covers both client-side and server-side tracking, user identification, exception capture, and a PostHog reverse proxy via Next.js rewrites.

**Changes made:**

- `instrumentation-client.ts` (new) — Initializes `posthog-js` on the client using Next.js 15.3+ `instrumentation-client.ts` pattern. Enables session replay, exception capture, and automatic pageview tracking via `/ingest` proxy.
- `src/lib/posthog-server.ts` (new) — Singleton `posthog-node` client for server-side event capture, with `flushAt: 1` and `flushInterval: 0` for edge-safe flushing.
- `next.config.ts` — Added `/ingest` rewrites to proxy PostHog requests through the Next.js app (improves ad-blocker resilience) and `skipTrailingSlashRedirect: true`.
- `src/components/waitlist-form.tsx` — Captures `waitlist_signup_submitted` before the API call, passes `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate client/server events, calls `posthog.identify()` on success, and `posthog.captureException()` on error.
- `src/components/header.tsx` — Captures `header_cta_clicked` with a `cta` property (`sign_in` or `get_started`) on each header button click.
- `src/app/api/waitlist/route.ts` — Captures `waitlist_signup_success` (with user ID and email), `waitlist_signup_error` (with error type), and calls `posthog.identify()` server-side using the client's distinct ID passed via request headers.
- `.env.local` — Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `waitlist_signup_submitted` | User submits the waitlist form with their email | `src/components/waitlist-form.tsx` |
| `waitlist_signup_success` | Waitlist user successfully created (server-side) | `src/app/api/waitlist/route.ts` |
| `waitlist_signup_error` | Signup failed — duplicate email or server error (server-side) | `src/app/api/waitlist/route.ts` |
| `header_cta_clicked` | User clicked Sign In or Get Started in the header | `src/components/header.tsx` |

## Next steps

We've built a dashboard and 5 insights for you to monitor user behavior:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/289543/dashboard/1469488)
- **Waitlist signups over time**: [OOAfe4Id](https://us.posthog.com/project/289543/insights/OOAfe4Id)
- **Waitlist signup conversion funnel**: [kLveoRsS](https://us.posthog.com/project/289543/insights/kLveoRsS)
- **Total waitlist signups**: [ysy5KI3O](https://us.posthog.com/project/289543/insights/ysy5KI3O)
- **Header CTA clicks by type**: [4dWtPlhH](https://us.posthog.com/project/289543/insights/4dWtPlhH)
- **Waitlist signup errors**: [i12LIOAN](https://us.posthog.com/project/289543/insights/i12LIOAN)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
