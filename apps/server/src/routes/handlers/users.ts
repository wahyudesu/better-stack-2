/**
 * Users route handlers
 */
import type { Context } from 'hono'
import { createUsersRoutes } from '../admin/users'
import { createFetchFromHono } from '../adapters'

export function createUsersHandlers() {
	return {
		/** GET /v1/user */
		get: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createUsersRoutes(fetch)
			try {
				const result = await routes.get()
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/user */
		update: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createUsersRoutes(fetch)
			try {
				const result = await routes.update(body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/users (list all users) */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createUsersRoutes(fetch)
			try {
				const result = await routes.list()
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/users/:userId */
		getById: async (c: Context) => {
			const userId = c.req.param('userId')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/users/${userId}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** PATCH /v1/users/:userId */
		updateById: async (c: Context) => {
			const userId = c.req.param('userId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/users/${userId}`, {
				method: 'PATCH',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},
	}
}