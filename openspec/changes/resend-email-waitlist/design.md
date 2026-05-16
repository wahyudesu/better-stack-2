## Context

Landing page waitlist signup flow:
1. User enters email and selects account type via `WaitlistModal`
2. `POST /api/waitlist` receives the submission
3. Inserts record into `waitlist` Supabase table
4. Returns success with position number

Currently no email is sent after signup. We need to add Resend for transactional email delivery.

## Goals / Non-Goals

**Goals:**
- Send confirmation email to waitlist signup email using Resend
- Email includes waitlist position for personalization
- Graceful handling if Resend fails (signup still succeeds)
- Environment-based configuration (API key via env var)

**Non-Goals:**
- Email template design overhaul (keep simple)
- Resend template management
- Email open/click tracking
- Retry queue for failed emails (future)

## Decisions

### 1. Resend SDK over other providers (SendGrid, AWS SES)

**Decision:** Use `resend` npm package

**Rationale:**
- Simpler API with `{ data, error }` pattern
- No need for separate email templating service
- Works well with React Email components for future enhancement
- Lower complexity for single use case

**Alternative:** SendGrid — more mature but more complex setup

### 2. Fail-open on email delivery

**Decision:** If Resend call fails, still return success to user

**Rationale:**
- Core waitlist signup (Supabase insert) is the primary operation
- Email confirmation is a "nice to have" that doesn't block conversion
- Log errors for monitoring, but don't block user flow

**Alternative:** Fail-closed — reject signup if email fails. Too risky for v1.

### 3. Simple HTML email (no React Email)

**Decision:** Use `html` string parameter over `react` component

**Rationale:**
- Simpler implementation, no additional dependencies
- Sufficient for a welcome confirmation email
- Can migrate to React Email components later if templates grow complex

**Alternative:** React Email components — better maintainability for complex templates

## Risks / Trade-offs

**[Risk] Resend API key missing → email not sent**
→ **Mitigation:** Validate `RESEND_API_KEY` exists at runtime, log warning if missing. No blocking.

**[Risk] Resend rate limit (5 req/s) on high traffic**
→ **Mitigation:** Email is non-blocking; signup succeeds even if email delayed/dropped.

**[Risk] Testing with Resend sandbox**
→ **Mitigation:** Use `delivered@resend.dev` for testing to avoid domain reputation issues.

## Technical Approach

```
POST /api/waitlist
  → Validate input
  → Check duplicate email in Supabase
  → Insert into waitlist table
  → Send email via Resend (fire-and-forget, catch errors)
  → Return success response
```

### Email Content

**Subject:** "You're on the list! 🎉"
**Body:** Simple confirmation with:
- Thank you message
- Waitlist position number
- Expectation: "We'll notify you when you're approved"
- Product name: "Better Stack 2"

### Environment Variables

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Resend API key
```

### From Address

Use `onboarding@resend.dev` for development (test domain).
For production, user should add and verify their own domain per Resend docs.

## Open Questions

1. Should we use a verified domain or `onboarding@resend.dev` for now? → Use env var with fallback to test address for dev.
2. Do we want email open tracking? → Not in v1, add later if needed.
3. Should we store email sending status in Supabase? → No, keep it simple for now.