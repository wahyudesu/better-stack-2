/**
 * Ads route handlers
 */
import type { Context } from 'hono'
import { createAdsRoutes } from '../advertising/ads'
import { createAdAudiencesRoutes } from '../advertising/adAudiences'
import { createFetchFromHono } from '../adapters'

export function createAdsHandlers() {
	return {
		// ============ ADS ACCOUNTS ============

		/** GET /v1/ads/accounts */
		listAccounts: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.listAccounts({
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ ADS ============

		/** GET /v1/ads */
		list: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.list(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/:adId */
		get: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const adId = c.req.param('adId')!
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.get(accountId, adId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/create */
		create: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.create(body.accountId || '', {
					adsetId: body.adsetId,
					creative: body.creative,
					name: body.name,
				})
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/ads/:adId */
		update: async (c: Context) => {
			const adId = c.req.param('adId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.update(body.accountId || '', adId, {
					status: body.status,
					name: body.name,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/ads/:adId */
		delete: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const adId = c.req.param('adId')!
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.delete(accountId, adId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/:adId/comments */
		getAdComments: async (c: Context) => {
			const adId = c.req.param('adId')!
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.getAdComments(adId, {
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					cursor: c.req.query('cursor') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/:adId/analytics */
		getAnalytics: async (c: Context) => {
			const adId = c.req.param('adId')!
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.getAnalytics(accountId, adId, {
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/boost */
		boost: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.boost(body.accountId || '', body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/interests */
		searchInterests: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const q = c.req.query('q') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.searchInterests(accountId, { q, limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/conversions */
		sendConversions: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.sendConversions(body.accountId || '', { events: body.events || [] })
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ CAMPAIGNS ============

		/** GET /v1/ads/campaigns */
		listCampaigns: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.listCampaigns(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/campaigns/:campaignId */
		getCampaign: async (c: Context) => {
			const campaignId = c.req.param('campaignId')!
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.get(campaignId, accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/tree */
		getTree: async (c: Context) => {
			const campaignId = c.req.query('campaignId') || ''
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.getTree(accountId, campaignId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/campaigns/:campaignId/status */
		updateCampaignStatus: async (c: Context) => {
			const campaignId = c.req.param('campaignId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.updateCampaignStatus(body.accountId || '', campaignId, { status: body.status })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/campaigns/bulk-status */
		bulkUpdateCampaignStatus: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/campaigns/bulk-status`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/ads/campaigns/:campaignId/duplicate */
		duplicateCampaign: async (c: Context) => {
			const campaignId = c.req.param('campaignId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdsRoutes(fetch)
			try {
				const result = await routes.duplicateCampaign(campaignId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ AD SETS ============

		/** GET /v1/ads/ad-sets/:adSetId */
		getAdSet: async (c: Context) => {
			const adSetId = c.req.param('adSetId')!
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/ad-sets/${adSetId}?accountId=${accountId}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/ads/ad-sets/:adSetId/status */
		updateAdSetStatus: async (c: Context) => {
			const adSetId = c.req.param('adSetId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/ad-sets/${adSetId}/status`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		// ============ AUDIENCES ============

		/** GET /v1/ads/audiences */
		listAudiences: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.list(accountId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/audiences */
		createAudience: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/audiences/:audienceId */
		getAudience: async (c: Context) => {
			const audienceId = c.req.param('audienceId')!
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.get(audienceId, accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/ads/audiences/:audienceId */
		deleteAudience: async (c: Context) => {
			const audienceId = c.req.param('audienceId')!
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.delete(audienceId, accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/ads/audiences/:audienceId/users */
		listAudienceUsers: async (c: Context) => {
			const audienceId = c.req.param('audienceId')!
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.listUsers(audienceId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/ads/audiences/:audienceId/users */
		addAudienceUsers: async (c: Context) => {
			const audienceId = c.req.param('audienceId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAdAudiencesRoutes(fetch)
			try {
				const result = await routes.addUsers(audienceId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		// ============ TARGETING ============

		/** GET /v1/ads/targeting/search */
		searchTargeting: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const q = c.req.query('q') || ''
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/targeting/search?q=${encodeURIComponent(q)}&accountId=${encodeURIComponent(accountId)}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/ads/ctwa */
		getCTWA: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/ctwa?accountId=${encodeURIComponent(accountId)}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/ads/business-centers */
		listBusinessCenters: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/ads/business-centers?accountId=${encodeURIComponent(accountId)}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},
	}
}