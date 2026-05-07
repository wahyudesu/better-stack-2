/**
 * Contacts route handlers
 */
import type { Context } from 'hono'
import { createContactsRoutes } from '../inbox/contacts'
import { createFetchFromHono } from '../adapters'

export function createContactsHandlers() {
	const getRoutes = (c: Context) => createContactsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/contacts */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					search: c.req.query('search') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/contacts */
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

		/** GET /v1/contacts/:contactId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const result = await routes.get(contactId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/contacts/:contactId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const body = await c.req.json()
				const result = await routes.update(contactId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/contacts/:contactId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const result = await routes.delete(contactId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/contacts/:contactId/channels */
		getChannels: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const result = await routes.getChannels(contactId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/contacts/bulk */
		bulkCreate: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.bulkCreate(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/contacts/:contactId/fields/:slug */
		setField: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const slug = c.req.param('slug')!
				const body = await c.req.json()
				const result = await routes.setField(contactId, slug, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/contacts/:contactId/fields/:slug */
		clearField: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const contactId = c.req.param('contactId')!
				const slug = c.req.param('slug')!
				const result = await routes.clearField(contactId, slug)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}