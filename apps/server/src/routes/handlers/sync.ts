/**
 * Sync route handlers - fetch raw data from Zernio for Convex side to process
 */
import type { Context } from 'hono'

export function createSyncHandlers() {
	return {
		/** POST /v1/sync/posts - Fetch posts from Zernio for sync */
		posts: async (c: Context) => {
			const apiKey = c.get('userApiKey')
			if (!apiKey) {
				return c.json({ error: 'API key required' }, 401)
			}

			const body = await c.req.json().catch(() => ({}))
			const { profileId, since } = body as { profileId?: string; since?: string }

			const baseUrl = (c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api'

			const queryParams = new URLSearchParams()
			queryParams.set('limit', '50')
			queryParams.set('sortBy', 'created-desc')
			if (profileId) queryParams.set('profileId', profileId)
			if (since) queryParams.set('since', since)

			try {
				const response = await fetch(`${baseUrl}/v1/posts?${queryParams.toString()}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${apiKey}` },
				})
				const data = await response.json() as { posts?: any[]; data?: any[] }

				// Zernio returns { posts: [...] } or { data: [...] }
				const posts = data?.posts || data?.data || []
				return c.json({ posts })
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/sync/accounts - Fetch accounts from Zernio for sync */
		accounts: async (c: Context) => {
			const apiKey = c.get('userApiKey')
			if (!apiKey) {
				return c.json({ error: 'API key required' }, 401)
			}

			const body = await c.req.json().catch(() => ({}))
			const { profileId } = body as { profileId?: string }

			const baseUrl = (c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api'

			const queryParams = new URLSearchParams()
			if (profileId) queryParams.set('profileId', profileId)

			try {
				const response = await fetch(`${baseUrl}/v1/accounts?${queryParams.toString()}`, {
					method: 'GET',
					headers: { Authorization: `Bearer ${apiKey}` },
				})
				const data = await response.json() as { accounts?: any[]; data?: any[] }

				// Zernio returns { accounts: [...] } or { data: [...] }
				const accounts = data?.accounts || data?.data || []
				return c.json({ accounts })
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},
	}
}