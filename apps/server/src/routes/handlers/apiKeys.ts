/**
 * API Keys route handlers
 */
import type { Context } from 'hono'
import { createApiKeysRoutes } from '../core/apiKeys'
import { createFetchFromHono } from '../adapters'

export function createApiKeysHandlers() {
	return {
		/** GET /v1/api-keys */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createApiKeysRoutes(fetch)
			try {
				const result = await routes.list({
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/api-keys */
		create: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createApiKeysRoutes(fetch)
			try {
				const result = await routes.create({
					name: body.name,
					expiresAt: body.expiresAt,
				})
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/api-keys/:keyId */
		delete: async (c: Context) => {
			const keyId = c.req.param('keyId')!
			const fetch = createFetchFromHono(c)
			const routes = createApiKeysRoutes(fetch)
			try {
				const result = await routes.delete(keyId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}