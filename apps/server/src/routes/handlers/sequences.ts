/**
 * Sequences route handlers
 */
import type { Context } from 'hono'
import { createSequencesRoutes } from '../inbox/sequences'
import { createFetchFromHono } from '../adapters'

export function createSequencesHandlers() {
	const getRoutes = (c: Context) => createSequencesRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/sequences */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					status: c.req.query('status') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					skip: c.req.query('skip') ? Number(c.req.query('skip')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/sequences */
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

		/** GET /v1/sequences/:sequenceId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const result = await routes.get(sequenceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/sequences/:sequenceId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const body = await c.req.json()
				const result = await routes.update(sequenceId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/sequences/:sequenceId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const result = await routes.delete(sequenceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/sequences/:sequenceId/activate */
		activate: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const result = await routes.activate(sequenceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/sequences/:sequenceId/pause */
		pause: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const result = await routes.pause(sequenceId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/sequences/:sequenceId/enroll */
		enroll: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const body = await c.req.json()
				const result = await routes.enroll(sequenceId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/sequences/:sequenceId/enroll/:contactId */
		enrollContact: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const contactId = c.req.param('contactId')!
				const result = await routes.enrollContact(sequenceId, contactId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/sequences/:sequenceId/enroll/:contactId */
		unenroll: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const contactId = c.req.param('contactId')!
				const result = await routes.unenroll(sequenceId, contactId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/sequences/:sequenceId/enrollments */
		listEnrollments: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const sequenceId = c.req.param('sequenceId')!
				const result = await routes.listEnrollments(sequenceId, {
					status: c.req.query('status') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					skip: c.req.query('skip') ? Number(c.req.query('skip')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}