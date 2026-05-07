/**
 * Profiles route handlers
 */
import type { Context } from 'hono'
import { createProfilesRoutes } from '../core/profiles'
import { createFetchFromHono } from '../adapters'

export function createProfilesHandlers() {
	return {
		/** GET /v1/profiles */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createProfilesRoutes(fetch)
			try {
				const result = await routes.list()
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/profiles/:profileId */
		get: async (c: Context) => {
			const profileId = c.req.param('profileId')!
			const fetch = createFetchFromHono(c)
			const routes = createProfilesRoutes(fetch)
			try {
				const result = await routes.get(profileId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/profiles */
		create: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createProfilesRoutes(fetch)
			try {
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/profiles/:profileId */
		update: async (c: Context) => {
			const profileId = c.req.param('profileId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createProfilesRoutes(fetch)
			try {
				const result = await routes.update(profileId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/profiles/:profileId */
		delete: async (c: Context) => {
			const profileId = c.req.param('profileId')!
			const fetch = createFetchFromHono(c)
			const routes = createProfilesRoutes(fetch)
			try {
				const result = await routes.delete(profileId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}