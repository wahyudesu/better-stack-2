/**
 * Ad Campaigns route handlers
 */
import type { Context } from 'hono'
import { createAdCampaignsRoutes } from '../advertising/adCampaigns'
import { createFetchFromHono } from '../adapters'

export function createAdCampaignsHandlers() {
	const getRoutes = (c: Context) => createAdCampaignsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/ads/campaigns */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					accountId: c.req.query('accountId') || undefined,
					platform: c.req.query('platform') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/campaigns/:campaignId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const campaignId = c.req.param('campaignId')!
				const result = await routes.get(campaignId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/campaigns/:campaignId/status */
		updateStatus: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const campaignId = c.req.param('campaignId')!
				const body = await c.req.json()
				const result = await routes.updateStatus(campaignId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/campaigns/:campaignId/duplicate */
		duplicate: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const campaignId = c.req.param('campaignId')!
				const body = await c.req.json()
				const result = await routes.duplicate(campaignId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/campaigns/bulk-status */
		bulkUpdateStatus: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.bulkUpdateStatus(body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}