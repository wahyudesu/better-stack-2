# Dashboard - Agent Guidelines

Dashboard page components and patterns.

## Quick Stats Cards

- **Large card**: impression, engagements, likes, profiles visits, replies, shares
- **Small card**: audience overview
- **Small card**: sentiment analysis

## Audience Cards

- **Medium card**: demographic breakdown
  - By country: Indonesia, Malaysia, USA, etc.
  - By region: Jakarta, Surabaya, Bandung, Bali

- **Medium card**: follower + viewer counts

## Component Patterns

- Use stats cards for metric display
- Audience cards show demographic breakdown
- All cards responsive (mobile + desktop)

## Data Sources

- Analytics from Zernio API (via `apps/server`)
- Social media metrics from connected profiles
- Demographic data from platform insights

## Before Making Changes

1. Read `apps/web/AGENTS.md` for general guidelines
2. Check existing dashboard components for patterns
3. Ensure metrics display correctly
4. Test responsive behavior