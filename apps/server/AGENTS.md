## AI Agent Guidelines for API Server

This document helps AI agents work effectively on the API server.

## Key Context

- **Purpose**: Social media API wrapper/proxy
- **Framework**: Hono (fast, type-safe web framework)
- **Runtime**: Node.js (dev) → Compiled binary (prod)
- **Main App**: This server powers `apps/web` backend needs

## Architecture Principles

- **Stateless**: No session storage in-memory
- **Secure**: Never expose API keys directly to clients
- **Unified Response**: Consistent JSON response format
- **Error Handling**: Proper HTTP status codes + error messages

## Hono Patterns

```typescript
// Route definition
app.get("/api/endpoint", handleEndpoint)

// Request validation with Zod
const schema = z.object({ userId: z.string() })
const data = schema.parse(await req.json())

// Response format
return ctx.json({ success: true, data: {...} }, 200)
```

## Security Rules

- Validate ALL inputs with Zod
- Never log sensitive data (tokens, secrets)
- Use environment variables for API keys
- Implement rate limiting per platform

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "PLATFORM_ERROR",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## Before Making Changes

1. Read `CLAUDE.md` for API endpoint plans
2. Check if platform API has rate limits
3. Add proper TypeScript types
4. Validate with Zod schemas
