## ADDED Requirements

### Requirement: Email confirmation sent after waitlist signup

The system SHALL send a confirmation email to the user's email address after a successful waitlist signup using Resend.

#### Scenario: Email sent successfully after signup
- **WHEN** user completes waitlist signup with email `user@example.com` and position `42`
- **THEN** system sends confirmation email via Resend with subject "You're on the list! 🎉"
- **AND** email body contains the user's waitlist position

#### Scenario: Email failure does not block signup
- **WHEN** Resend API call fails during waitlist signup
- **THEN** system still returns success response to user
- **AND** system logs the error for monitoring

### Requirement: Email contains waitlist position

The confirmation email SHALL include the user's waitlist position number in the email body.

#### Scenario: Email includes position number
- **WHEN** user joins waitlist at position `100`
- **THEN** confirmation email body contains "Your position: 100"

### Requirement: Email uses configurable sender address

The system SHALL use `RESEND_API_KEY` environment variable for authentication and `onboarding@resend.dev` as the default sender address.

#### Scenario: Resend configured with API key
- **WHEN** `RESEND_API_KEY` is set in environment
- **THEN** system authenticates to Resend using that key
- **AND** sends email from `onboarding@resend.dev`

#### Scenario: Resend API key missing
- **WHEN** `RESEND_API_KEY` is not set
- **THEN** system logs a warning
- **AND** skips email sending without blocking signup