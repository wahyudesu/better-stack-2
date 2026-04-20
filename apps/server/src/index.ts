import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import { ZernioClient } from './client'

// Cloudflare Worker environment bindings
export interface Env {
  ZERNIO_API_KEY: string
  API_BASE_URL?: string
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
app.get('/', (c) => {
  return c.json({
    name: 'Zernio API Client',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// Serve OpenAPI spec as JSON
app.get('/openapi.json', (c) => {
  const specPath = join(process.cwd(), 'zernio-api-openapi.yaml')
  const spec = readFileSync(specPath, 'utf-8')
  return c.json(parse(spec))
})

// Scalar API docs
app.get('/docs', Scalar({ url: '/openapi.json' }))

/**
 * Proxy all /api/* requests to Zernio API
 * This allows the Worker to act as a middleware/proxy
 */
app.all('/api/*', async (c) => {
  const apiKey = c.env.ZERNIO_API_KEY
  const baseUrl = c.env.API_BASE_URL || 'https://zernio.com/api'

  if (!apiKey) {
    return c.json({ error: 'ZERNIO_API_KEY not configured' }, 500)
  }

  // Get the path after /api
  const path = c.req.path.replace(/^\/api/, '')
  const method = c.req.method

  // Build query parameters
  const queryParams = new URLSearchParams()
  for (const [key, value] of Object.entries(c.req.query())) {
    queryParams.append(key, value)
  }

  try {
    // Build target URL
    const targetUrl = new URL(path, baseUrl)
    if (queryParams.toString()) {
      targetUrl.search = queryParams.toString()
    }

    // Make the request
    const response = await fetch(targetUrl.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' && method !== 'HEAD' ? await c.req.text() : undefined,
    })

    // Safely parse JSON response
    const data = await response.json().catch(() => ({
      error: `Invalid response from server`,
      status: response.status,
    }))

    // Return response with proper status code
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return c.json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

// Example: Direct usage of ZernioClient
app.get('/example/posts', async (c) => {
  const apiKey = c.env.ZERNIO_API_KEY

  if (!apiKey) {
    return c.json({ error: 'ZERNIO_API_KEY not configured' }, 500)
  }

  const client = new ZernioClient({ apiKey })

  try {
    const posts = await client.posts.list({ limit: 10 })
    return c.json(posts)
  } catch (error) {
    return c.json({
      error: 'Failed to fetch posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

// Example: Create a post
app.post('/example/posts', async (c) => {
  const apiKey = c.env.ZERNIO_API_KEY

  if (!apiKey) {
    return c.json({ error: 'ZERNIO_API_KEY not configured' }, 500)
  }

  const body = await c.req.json()
  const client = new ZernioClient({ apiKey })

  try {
    const post = await client.posts.create(body)
    return c.json(post)
  } catch (error) {
    return c.json({
      error: 'Failed to create post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500)
  }
})

// Export for Cloudflare Workers
export default app

// Also export the AppType for client creation
export type AppType = typeof app

// Start Node.js server for development
if (process.env.NODE_ENV !== 'production') {
  import('@hono/node-server').then(({ serve }) => {
    console.log('Starting dev server on http://localhost:3000')
    serve({ fetch: app.fetch, port: 3000 })
  })
}
