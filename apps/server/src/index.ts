import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import { createClerkClient } from '@clerk/backend'

import { createPostsHandlers } from './routes/handlers/posts'
import { createQueueHandlers } from './routes/handlers/queue'
import { createMediaHandlers } from './routes/handlers/media'
import { createToolsHandlers } from './routes/handlers/tools'
import { createSyncHandlers } from './routes/handlers/sync'

// Clerk client for JWT verification and user metadata lookup
const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

// Cloudflare Worker environment bindings
export interface Env {
  ZERNIO_API_KEY: string
  API_BASE_URL?: string
  ASSETS: { fetch: typeof fetch }
  CLERK_SECRET_KEY?: string
}

// Create Hono app with Worker types
const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}))

// Health check
app.get('/', async (c) => {
  return c.json({
    name: 'Zernio API Client',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// Health check endpoint
app.get('/health', async (c) => {
  return c.json({ status: 'ok' })
})

// Serve the actual yaml file for Scalar
app.get('/zernio-api-openapi.yaml', async (c) => {
  const res = await c.env.ASSETS.fetch(new Request('http://localhost/zernio-api-openapi.yaml'))
  return res
})

// Scalar API docs - point directly to yaml file
app.use('/docs', Scalar({ url: '/zernio-api-openapi.yaml' }))

// ============================================================
// Auth Middleware - Clerk JWT validation + metadata lookup
// Validates Clerk session token and extracts API key from user publicMetadata
// ============================================================
app.use('/v1/*', async (c, next) => {
  // Check for API key in X-API-Key header (direct Zernio API key passthrough)
  const apiKeyHeader = c.req.header('X-API-Key')
  if (apiKeyHeader) {
    c.set('userApiKey', apiKeyHeader)
    await next()
    return
  }

  // Fallback: if Bearer token starts with sk_, treat it as Zernio API key
  const authHeader = c.req.header('Authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (bearerToken?.startsWith('sk_')) {
    c.set('userApiKey', bearerToken)
    await next()
    return
  }

  // Clerk session token - verify JWT and get API key from user metadata
  if (bearerToken) {
    const tokenToVerify = bearerToken

    // Verify Clerk JWT
    const { data, error } = await clerk.verifyToken(tokenToVerify, {
      audience: 'convex' as any,
    })

    if (!error && data) {
      const userId = data.sub

      // Get API key from Clerk user publicMetadata
      try {
        const user = await clerk.users.getUser(userId)
        const apiKey = user.publicMetadata?.apiKey as string | undefined

        if (apiKey) {
          c.set('userApiKey', apiKey)
          c.set('userId', userId)
          await next()
          return
        }
      } catch (err) {
        console.error('Failed to fetch Clerk user metadata:', err)
      }
    }

    return c.json({ error: 'Invalid Clerk token or API key not found in metadata' }, 401)
  }

  await next()
})

// Instantiate route handlers
const postsHandlers = createPostsHandlers()
const queueHandlers = createQueueHandlers()
const mediaHandlers = createMediaHandlers()
const toolsHandlers = createToolsHandlers()
const syncHandlers = createSyncHandlers()

// ============================================================
// Content Routes - Posts
// ============================================================
app.get('/v1/posts', postsHandlers.list)
app.post('/v1/posts', postsHandlers.create)
app.get('/v1/posts/:postId', postsHandlers.get)
app.patch('/v1/posts/:postId', postsHandlers.update)
app.delete('/v1/posts/:postId', postsHandlers.delete)
app.post('/v1/posts/bulk-upload', postsHandlers.bulkUpload)
app.post('/v1/posts/:postId/edit', postsHandlers.edit)
app.patch('/v1/posts/:postId/update-metadata', postsHandlers.updateMetadata)
app.post('/v1/posts/:postId/retry', postsHandlers.retry)
app.post('/v1/posts/:postId/unpublish', postsHandlers.unpublish)
app.get('/v1/posts/:postId/logs', postsHandlers.getLogs)

// ============================================================
// Content Routes - Queue
// ============================================================
app.get('/v1/queue/slots', queueHandlers.listSlots)
app.get('/v1/queue/slots/:slotId', queueHandlers.getSlot)
app.post('/v1/queue/slots', queueHandlers.createSlot)
app.patch('/v1/queue/slots/:slotId', queueHandlers.updateSlot)
app.delete('/v1/queue/slots/:slotId', queueHandlers.deleteSlot)
app.get('/v1/queue/preview', queueHandlers.preview)
app.get('/v1/queue/next-slot', queueHandlers.nextSlot)

// ============================================================
// Content Routes - Media
// ============================================================
app.post('/v1/media/presign', mediaHandlers.presign)
app.get('/v1/media/:mediaId', mediaHandlers.get)
app.post('/v1/media/upload', mediaHandlers.upload)
app.post('/v1/media/upload-direct', mediaHandlers.uploadDirect)

// ============================================================
// Content Routes - Tools
// ============================================================
app.get('/v1/tools/youtube/download', toolsHandlers.youtubeDownload)
app.get('/v1/tools/youtube/transcript', toolsHandlers.youtubeTranscript)
app.get('/v1/tools/instagram/download', toolsHandlers.instagramDownload)
app.post('/v1/tools/instagram/hashtag-checker', toolsHandlers.instagramHashtagChecker)
app.get('/v1/tools/tiktok/download', toolsHandlers.tiktokDownload)
app.get('/v1/tools/twitter/download', toolsHandlers.twitterDownload)
app.get('/v1/tools/facebook/download', toolsHandlers.facebookDownload)
app.get('/v1/tools/linkedin/download', toolsHandlers.linkedinDownload)
app.get('/v1/tools/bluesky/download', toolsHandlers.blueskyDownload)
app.post('/v1/tools/validate/post-length', toolsHandlers.validatePostLength)
app.post('/v1/tools/validate/post', toolsHandlers.validatePost)
app.post('/v1/tools/validate/media', toolsHandlers.validateMedia)
app.post('/v1/tools/validate/subreddit', toolsHandlers.validateSubreddit)

// ============================================================
// Content Routes - Sync (raw data for Convex)
// ============================================================
app.post('/v1/sync/posts', syncHandlers.posts)
app.post('/v1/sync/accounts', syncHandlers.accounts)

// ============================================================
// Profiles & Accounts (needs auth)
// ============================================================
app.get('/v1/profiles', async (c) => {
  const apiKey = c.get('userApiKey')
  if (!apiKey) {
    return c.json({ error: 'API key required' }, 401)
  }
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'
  const response = await fetch(`${baseUrl}/v1/profiles`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })
  const data = await response.json().catch(() => ({}))
  return c.json(data, response.status as any)
})

app.get('/v1/accounts', async (c) => {
  const apiKey = c.get('userApiKey')
  if (!apiKey) {
    return c.json({ error: 'API key required' }, 401)
  }
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'
  const response = await fetch(`${baseUrl}/v1/accounts`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
  })
  const data = await response.json().catch(() => ({}))
  return c.json(data, response.status as any)
})

/**
 * Usage endpoint for validating API key
 * Called by frontend /api/validate-key route
 */
app.get('/v1/usage-stats', async (c) => {
  const apiKey = c.get('userApiKey')
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'

  if (!apiKey) {
    return c.json({ error: 'API key required' }, 401)
  }

  try {
    const targetUrl = new URL('v1/usage-stats', baseUrl.endsWith('/') ? baseUrl : baseUrl + '/')
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return c.json(data, response.status as any)
  } catch (error) {
    return c.json({
      error: 'Failed to fetch usage',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

/**
 * Proxy /v1/* requests to Zernio API
 * Uses API key from X-API-Key header (sent by web app)
 */
app.all('/v1/*', async (c) => {
  const apiKey = c.get('userApiKey')
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'

  if (!apiKey) {
    return c.json({ error: 'API key required. Send via X-API-Key header or Bearer sk_xxx' }, 401)
  }

  const path = c.req.path.replace(/^\/v1/, '')
  const method = c.req.method

  const queryParams = new URLSearchParams()
  for (const [key, value] of Object.entries(c.req.query())) {
    queryParams.append(key, value)
  }

  try {
    const cleanPath = path.replace(/^\//, '')
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
    const targetUrl = new URL(`v1/${cleanPath}`, base)
    if (queryParams.toString()) {
      targetUrl.search = queryParams.toString()
    }

    const connectToken = c.req.header('X-Connect-Token')
    const response = await fetch(targetUrl.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(connectToken && { 'X-Connect-Token': connectToken }),
      },
      body: method !== 'GET' && method !== 'HEAD' ? await c.req.text() : undefined,
    })

    const data = await response.json().catch(() => ({
      error: `Invalid response from server`,
      status: response.status,
    }))

    return c.json(data, response.status as any)
  } catch (error) {
    return c.json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

// Export for Cloudflare Workers
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx)
  },
}

// Also export the AppType for client creation
export type AppType = typeof app
