/**
 * Google Business route handlers
 */
import type { Context } from 'hono'
import { createGoogleBusinessRoutes } from '../platform/googleBusiness'
import { createFetchFromHono } from '../adapters'

export function createGoogleBusinessHandlers() {
	const getRoutes = (c: Context) => createGoogleBusinessRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/accounts/:accountId/gmb-locations */
		getLocations: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getLocations(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-reviews */
		getReviews: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getReviews(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-reviews/batch */
		batchReply: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.batchReply(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-food-menus */
		getFoodMenus: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getFoodMenus(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-food-menus */
		updateFoodMenus: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updateFoodMenus(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-location-details */
		getLocationDetails: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getLocationDetails(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-location-details */
		updateLocationDetails: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updateLocationDetails(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-media */
		getMedia: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getMedia(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-media */
		createMedia: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.createMedia(accountId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/gmb-media */
		deleteMedia: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.deleteMedia(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-attributes */
		getAttributes: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getAttributes(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-attributes */
		updateAttributes: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updateAttributes(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-place-actions */
		getPlaceActions: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getPlaceActions(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-place-actions */
		createPlaceAction: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.createPlaceAction(accountId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-place-actions */
		updatePlaceAction: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updatePlaceAction(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/gmb-place-actions */
		deletePlaceAction: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.deletePlaceAction(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-services */
		getServices: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.getServices(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-services */
		updateServices: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const body = await c.req.json()
				const result = await routes.updateServices(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}