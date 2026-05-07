/**
 * Queue route handlers - mount queue routes as Hono handlers
 */
import type { Context } from 'hono'
import { createQueueRoutes } from '../content/queue'
import { createFetchFromHono } from '../adapters'

export function createQueueHandlers() {
	return {
		/** GET /v1/queue/slots */
		listSlots: async (c: Context) => {
			const params = {
				profileId: c.req.query('profileId') || undefined,
				queueId: c.req.query('queueId') || undefined,
				all: c.req.query('all') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.listSlots(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/queue/slots/:slotId */
		getSlot: async (c: Context) => {
			const slotId = c.req.param('slotId')!
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.getSlot(slotId)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/queue/slots */
		createSlot: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.createSlot(body)
				return c.json(result, 201 as any)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** PUT /v1/queue/slots */
		updateSlot: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.updateSlot(body)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** DELETE /v1/queue/slots */
		deleteSlot: async (c: Context) => {
			const params = {
				profileId: c.req.query('profileId') || undefined,
				queueId: c.req.query('queueId') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.deleteSlot(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/queue/preview */
		preview: async (c: Context) => {
			const params = {
				profileId: c.req.query('profileId') || undefined,
				queueId: c.req.query('queueId') || undefined,
				count: c.req.query('count') ? Number(c.req.query('count')) : undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.preview(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/queue/next-slot */
		nextSlot: async (c: Context) => {
			const params = {
				profileId: c.req.query('profileId') || undefined,
				queueId: c.req.query('queueId') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.nextSlot(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},
	}
}
