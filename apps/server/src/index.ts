import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Scalar } from '@scalar/hono-api-reference'

// Cloudflare Worker environment bindings
export interface Env {
  ZERNIO_API_KEY: string
  API_BASE_URL?: string
  ASSETS: { fetch: typeof fetch }
}

// Inline minimal OpenAPI spec for testing
const specData = {
  openapi: '3.1.0',
  info: { title: 'Zernio API', version: '1.0.1' },
  paths: {
    '/v1/usage-stats': {
      get: {
        summary: 'Usage Stats',
        responses: { '200': { description: 'OK' } }
      }
    }
  }
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
    return c.json(data, response.status)
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
    return c.json(data, response.status)
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
