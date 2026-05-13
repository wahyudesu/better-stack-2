<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the ZenPost landing page. The project already had `posthog-js` and `posthog-node` installed and a server-side client configured. The integration was extended with client-side initialization via `instrumentation-client.ts`, a reverse proxy via Next.js rewrites, new event captures across key conversion touchpoints, and environment variable configuration.

**Changes made:**

- **`instrumentation-client.ts`** — Updated `api_host` from direct PostHog URL to `/ingest` (reverse proxy) for better reliability and ad-blocker resistance.
- **`next.config.ts`** — Added `/ingest/static/*`, `/ingest/array/*`, and `/ingest/*` rewrites routing through Next.js to PostHog.
- **`apps/landing/.env.local`** — Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`src/app/(home)/components/hero-waitlist-form.tsx`** — Captures `waitlist_cta_clicked` with `location: "hero"` when the Join Waitlist button is clicked.
- **`src/app/(home)/components/cta-section.tsx`** — Captures `waitlist_cta_clicked` with `location: "cta_section"` when the bottom CTA button is clicked.
- **`src/app/(home)/components/hero.tsx`** — Captures `hero_tab_selected` with `tab` property when a feature preview tab is clicked (Agents, Analytics, Inbox, Scheduler, Channels, Ads).
- **`src/app/(home)/components/pricing.tsx`** — Captures `pricing_plan_contact_clicked` with `plan` and `price` properties when a pricing plan CTA is clicked.
- **`src/app/contact/contact-options.tsx`** — New client component that captures `contact_option_clicked` with `option` property (docs, telegram, email).
- **`src/app/contact/page.tsx`** — Replaced inline contact options with the new `ContactOptions` client component.

| Event | Description | File |
|---|---|---|
| `waitlist_cta_clicked` | User clicks "Join Waitlist" in the hero form | `src/app/(home)/components/hero-waitlist-form.tsx` |
| `waitlist_cta_clicked` | User clicks "Join Waitlist" in the CTA section | `src/app/(home)/components/cta-section.tsx` |
| `waitlist_join_success` | User successfully joins the waitlist via Clerk | `src/components/waitlist-modal.tsx` (existing) |
| `waitlist_signup_success` | Server confirms waitlist signup to Loops.so | `src/app/api/waitlist/route.ts` (existing) |
| `waitlist_signup_error` | Server-side error during waitlist signup | `src/app/api/waitlist/route.ts` (existing) |
| `hero_tab_selected` | User clicks a feature tab in the hero | `src/app/(home)/components/hero.tsx` |
| `pricing_plan_contact_clicked` | User clicks "Contact Us" on a pricing plan | `src/app/(home)/components/pricing.tsx` |
| `contact_option_clicked` | User clicks a contact option (docs/telegram/email) | `src/app/contact/contact-options.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1580323)
- [Waitlist Conversion Funnel](/insights/5iK6OFaA) — drop-off from CTA click to successful join
- [Waitlist CTA Clicks by Location](/insights/9M8r3ep3) — hero vs CTA section comparison
- [Hero Feature Tab Interest](/insights/NSTm4dHZ) — which product features attract most attention
- [Pricing Plan Interest](/insights/vfqh7u09) — which plan gets the most contact clicks
- [Waitlist Signups vs Errors](/insights/0xepvyEG) — server-side health monitoring

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
