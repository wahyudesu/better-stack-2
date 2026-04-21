import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
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
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
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

// Export for Cloudflare Workers
export default app

// Also export the AppType for client creation
export type AppType = typeof app

// Start Node.js server for development
if (process.env.NODE_ENV !== 'production') {
  import('@hono/node-server').then(({ serve }) => {
    console.log('Starting dev server on http://localhost:8787')
    serve({ fetch: app.fetch, port: 8787 })
  })
}
