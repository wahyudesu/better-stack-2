/**
 * Account Groups route handlers
 */
import type { Context } from 'hono'
import { createAccountGroupsRoutes } from '../admin/accountGroups'
import { createFetchFromHono } from '../adapters'

export function createAccountGroupsHandlers() {
	return {
		/** GET /v1/account-groups */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createAccountGroupsRoutes(fetch)
			try {
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/account-groups/:groupId */
		get: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountGroupsRoutes(fetch)
			try {
				const result = await routes.get(groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/account-groups */
		create: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountGroupsRoutes(fetch)
			try {
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/account-groups/:groupId */
		update: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountGroupsRoutes(fetch)
			try {
				const result = await routes.update(groupId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/account-groups/:groupId */
		delete: async (c: Context) => {
			const groupId = c.req.param('groupId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountGroupsRoutes(fetch)
			try {
				const result = await routes.delete(groupId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}