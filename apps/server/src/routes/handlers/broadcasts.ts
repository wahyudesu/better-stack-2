/**
 * Broadcasts route handlers
 */
import type { Context } from 'hono'
import { createBroadcastsRoutes } from '../inbox/broadcasts'
import { createFetchFromHono } from '../adapters'

export function createBroadcastsHandlers() {
	const getRoutes = (c: Context) => createBroadcastsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/broadcasts */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					status: c.req.query('status') || undefined,
					platform: c.req.query('platform') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					skip: c.req.query('skip') ? Number(c.req.query('skip')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/broadcasts */
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

		/** GET /v1/broadcasts/:broadcastId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const result = await routes.get(broadcastId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/broadcasts/:broadcastId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const body = await c.req.json()
				const result = await routes.update(broadcastId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/broadcasts/:broadcastId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const result = await routes.delete(broadcastId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/broadcasts/:broadcastId/send */
		send: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const result = await routes.send(broadcastId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/broadcasts/:broadcastId/schedule */
		schedule: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const body = await c.req.json()
				const result = await routes.schedule(broadcastId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/broadcasts/:broadcastId/cancel */
		cancel: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const result = await routes.cancel(broadcastId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/broadcasts/:broadcastId/recipients */
		listRecipients: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const result = await routes.listRecipients(broadcastId, {
					status: c.req.query('status') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					skip: c.req.query('skip') ? Number(c.req.query('skip')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/broadcasts/:broadcastId/recipients */
		addRecipients: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const broadcastId = c.req.param('broadcastId')!
				const body = await c.req.json()
				const result = await routes.addRecipients(broadcastId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}