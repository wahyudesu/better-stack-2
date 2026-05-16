## Why

When users join the waitlist, they currently only get a success message on screen. We need to send a confirmation email so users have a record of their signup and feel more confident about their registration.

## What Changes

- Add Resend SDK for transactional email delivery
- Send a welcome/confirmation email after successful waitlist signup
- Email includes their waitlist position for engagement
- Supabase `waitlist` table stores the signup (already implemented)

## Capabilities

### New Capabilities

- `waitlist-email-confirmation`: Send confirmation email via Resend after successful waitlist signup. Email includes waitlist position and sets expectation for next steps.

## Impact

- **New dependency**: `resend` npm package in landing app
- **Environment variable**: `RESEND_API_KEY` needed
- **API change**: `/api/waitlist` POST handler calls Resend after Supabase insert
- **No breaking changes** to existing behavior