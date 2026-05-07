/**
 * Comment Automations route handlers
 */
import type { Context } from 'hono'
import { createCommentAutomationsRoutes } from '../inbox/commentAutomations'
import { createFetchFromHono } from '../adapters'

export function createCommentAutomationsHandlers() {
	const getRoutes = (c: Context) => createCommentAutomationsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/comment-automations */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					accountId: c.req.query('accountId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/comment-automations */
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

		/** GET /v1/comment-automations/:automationId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const automationId = c.req.param('automationId')!
				const result = await routes.get(automationId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/comment-automations/:automationId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const automationId = c.req.param('automationId')!
				const body = await c.req.json()
				const result = await routes.update(automationId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/comment-automations/:automationId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const automationId = c.req.param('automationId')!
				const result = await routes.delete(automationId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/comment-automations/:automationId/logs */
		getLogs: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const automationId = c.req.param('automationId')!
				const result = await routes.getLogs(automationId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}