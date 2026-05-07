/**
 * Invites route handlers
 */
import type { Context } from 'hono'
import { createInvitesRoutes } from '../admin/invites'
import { createFetchFromHono } from '../adapters'

export function createInvitesHandlers() {
	return {
		/** POST /v1/invite/tokens */
		createToken: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createInvitesRoutes(fetch)
			try {
				const result = await routes.createToken({
					email: body.email,
					role: body.role,
				})
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/invite/tokens */
		listTokens: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/invite/tokens`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},
	}
}