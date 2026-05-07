/**
 * Custom Fields route handlers
 */
import type { Context } from 'hono'
import { createCustomFieldsRoutes } from '../inbox/customFields'
import { createFetchFromHono } from '../adapters'

export function createCustomFieldsHandlers() {
	const getRoutes = (c: Context) => createCustomFieldsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/custom-fields */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/custom-fields */
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

		/** GET /v1/custom-fields/:fieldId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const fieldId = c.req.param('fieldId')!
				const result = await routes.get(fieldId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/custom-fields/:fieldId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const fieldId = c.req.param('fieldId')!
				const body = await c.req.json()
				const result = await routes.update(fieldId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/custom-fields/:fieldId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const fieldId = c.req.param('fieldId')!
				const result = await routes.delete(fieldId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}