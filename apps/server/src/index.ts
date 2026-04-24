import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'

import { createPostsHandlers } from './routes/handlers/posts'
import { createQueueHandlers } from './routes/handlers/queue'
import { createMediaHandlers } from './routes/handlers/media'
import { createToolsHandlers } from './routes/handlers/tools'

// Cloudflare Worker environment bindings
export interface Env {
  ZERNIO_API_KEY: string
  API_BASE_URL?: string
  ASSETS: { fetch: typeof fetch }
}

// Create Hono app with Worker types
const app = new Hono<{ Bindings: Env }>()

// CORS middleware
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
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

// Instantiate route handlers
const postsHandlers = createPostsHandlers()
const queueHandlers = createQueueHandlers()
const mediaHandlers = createMediaHandlers()
const toolsHandlers = createToolsHandlers()

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

/**
 * Extract API key from Authorization header
 * Format: "Bearer sk_xxx"
 */
function extractApiKey(c: any): string | null {
  const auth = c.req.header('Authorization')
  if (!auth) return null
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7)
  }
  return auth
}

/**
 * Usage endpoint for validating API key
 * Called by frontend /api/validate-key route
 * NOTE: This must be defined BEFORE the /v1/* wildcard route
 */
app.get('/v1/usage-stats', async (c) => {
  const apiKey = extractApiKey(c)
  const key = apiKey || process.env.ZERNIO_API_KEY
  const baseUrl = process.env.API_BASE_URL || 'https://zernio.com/api'

  if (!key) {
    return c.json({ error: 'API key required' }, 401)
  }

  try {
    const targetUrl = new URL('v1/usage-stats', baseUrl.endsWith('/') ? baseUrl : baseUrl + '/')
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${key}`,
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
 * Uses user's API key from Authorization header if provided,
 * otherwise falls back to server's ZERNIO_API_KEY
 */
app.all('/v1/*', async (c) => {
  const userApiKey = extractApiKey(c)
  const apiKey = userApiKey || c.env.ZERNIO_API_KEY
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'

  if (!apiKey) {
    return c.json({ error: 'API key required. Set ZERNIO_API_KEY or provide Authorization header.' }, 401)
  }

  // Get the path after /v1
  const path = c.req.path.replace(/^\/v1/, '')
  const method = c.req.method

  // Build query parameters
  const queryParams = new URLSearchParams()
  for (const [key, value] of Object.entries(c.req.query())) {
    queryParams.append(key, value)
  }

  try {
    // Build target URL - ensure path is properly joined with baseUrl
    const cleanPath = path.replace(/^\//, '')
    const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'
    const targetUrl = new URL(`v1/${cleanPath}`, base)
    if (queryParams.toString()) {
      targetUrl.search = queryParams.toString()
    }

    // Make the request with user's API key
    // Forward X-Connect-Token for headless OAuth selection endpoints
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

    // Safely parse JSON response
    const data = await response.json().catch(() => ({
      error: `Invalid response from server`,
      status: response.status,
    }))

    // Return response with proper status code
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
