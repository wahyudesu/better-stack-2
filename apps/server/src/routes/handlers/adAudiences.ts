/**
 * Ad Audiences route handlers
 */
import type { Context } from 'hono'
import { createAdAudiencesRoutes } from '../advertising/adAudiences'
import { createFetchFromHono } from '../adapters'

export function createAdAudiencesHandlers() {
	const getRoutes = (c: Context) => createAdAudiencesRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/ads/audiences */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					accountId: c.req.query('accountId') || undefined,
					platform: c.req.query('platform') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/audiences */
		create: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/audiences/:audienceId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const audienceId = c.req.param('audienceId')!
				const result = await routes.get(audienceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/ads/audiences/:audienceId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const audienceId = c.req.param('audienceId')!
				const result = await routes.delete(audienceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/audiences/:audienceId/users */
		listUsers: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const audienceId = c.req.param('audienceId')!
				const result = await routes.listUsers(audienceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/audiences/:audienceId/users */
		addUsers: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const audienceId = c.req.param('audienceId')!
				const body = await c.req.json()
				const result = await routes.addUsers(audienceId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}