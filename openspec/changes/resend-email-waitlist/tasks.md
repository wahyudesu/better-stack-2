## 1. Setup

- [x] 1.1 Install `resend` npm package in landing app
- [x] 1.2 Add `RESEND_API_KEY` to `.env.example`

## 2. Core Implementation

- [x] 2.1 Create `src/lib/resend.ts` client singleton
- [x] 2.2 Create `src/emails/waitlist-confirmation.ts` email template
- [x] 2.3 Update `POST /api/waitlist` to send email via Resend after Supabase insert

## 3. Testing

- [x] 3.1 Test email sent with valid RESEND_API_KEY
- [x] 3.2 Test signup succeeds when RESEND_API_KEY is missing
- [x] 3.3 Verify email contains correct waitlist position