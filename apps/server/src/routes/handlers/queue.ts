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
			const profileId = c.req.query('profileId')
			const params = {
				startDate: c.req.query('startDate') || undefined,
				endDate: c.req.query('endDate') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.listSlots(profileId || '', params)
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

		/** PATCH /v1/queue/slots/:slotId */
		updateSlot: async (c: Context) => {
			const slotId = c.req.param('slotId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.updateSlot(slotId, body)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** DELETE /v1/queue/slots/:slotId */
		deleteSlot: async (c: Context) => {
			const slotId = c.req.param('slotId')!
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				await routes.deleteSlot(slotId)
				return c.json({ success: true })
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/queue/preview */
		preview: async (c: Context) => {
			const profileId = c.req.query('profileId')
			const params = {
				startDate: c.req.query('startDate') || undefined,
				endDate: c.req.query('endDate') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.preview(profileId || '', params)
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
			const profileId = c.req.query('profileId')
			const fetch = createFetchFromHono(c)
			const routes = createQueueRoutes(fetch)
			try {
				const result = await routes.nextSlot(profileId || '')
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
