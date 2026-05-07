/**
 * Connect route handlers - OAuth flows and social account connection
 */
import type { Context } from 'hono'
import { createConnectRoutes } from '../core/connect'
import { createFetchFromHono } from '../adapters'

export function createConnectHandlers() {
	return {
		/** GET /v1/connect/:platform */
		connect: async (c: Context) => {
			const platform = c.req.param('platform')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const params = new URLSearchParams()
			if (c.req.query('profileId')) params.set('profileId', c.req.query('profileId')!)
			if (c.req.query('redirect_url')) params.set('redirect_url', c.req.query('redirect_url')!)
			if (c.req.query('headless')) params.set('headless', c.req.query('headless')!)

			const url = `${baseUrl}/v1/connect/${platform}${params.toString() ? '?' + params.toString() : ''}`
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/connect/:platform/ads */
		connectAds: async (c: Context) => {
			const platform = c.req.param('platform')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const params = new URLSearchParams()
			if (c.req.query('profileId')) params.set('profileId', c.req.query('profileId')!)
			if (c.req.query('redirect_url')) params.set('redirect_url', c.req.query('redirect_url')!)

			const url = `${baseUrl}/v1/connect/${platform}/ads${params.toString() ? '?' + params.toString() : ''}`
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/connect/facebook/select-page */
		selectFacebookPage: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.selectFacebookPage({
					connectToken: body.connectToken,
					pageId: body.pageId,
					accountId: body.accountId,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/googlebusiness/locations */
		listGoogleBusinessLocations: async (c: Context) => {
			const connectToken = c.req.header('X-Connect-Token') || ''
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.listGoogleBusinessLocations({ connectToken })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/googlebusiness/select-location */
		selectGoogleBusinessLocation: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.selectGoogleBusinessLocation({
					connectToken: body.connectToken,
					locationId: body.locationId,
					accountId: body.accountId,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/linkedin/organizations */
		listLinkedInOrganizations: async (c: Context) => {
			const connectToken = c.req.header('X-Connect-Token') || ''
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.listLinkedInOrganizations({ connectToken })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/linkedin/select-organization */
		selectLinkedInOrganization: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.selectLinkedInOrganization({
					connectToken: body.connectToken,
					organizationId: body.organizationId,
					accountId: body.accountId,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/pinterest/boards */
		listPinterestBoards: async (c: Context) => {
			const connectToken = c.req.header('X-Connect-Token') || ''
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.listPinterestBoards({ connectToken })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/pinterest/select-board */
		selectPinterestBoard: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.selectPinterestBoard({
					connectToken: body.connectToken,
					boardId: body.boardId,
					accountId: body.accountId,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/snapchat/profiles */
		listSnapchatProfiles: async (c: Context) => {
			const connectToken = c.req.header('X-Connect-Token') || ''
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.listSnapchatProfiles({ connectToken })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/snapchat/select-profile */
		selectSnapchatProfile: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.selectSnapchatProfile({
					connectToken: body.connectToken,
					profileId: body.profileId,
					accountId: body.accountId,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/bluesky/credentials */
		connectBluesky: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.connectBluesky(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/connect/whatsapp/credentials */
		connectWhatsApp: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.connectWhatsApp(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/whatsapp/select-phone-number */
		selectWhatsAppPhoneNumber: async (c: Context) => {
			const connectToken = c.req.header('X-Connect-Token') || ''
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const params = new URLSearchParams()
			if (connectToken) params.set('connectToken', connectToken)
			if (c.req.query('accountId')) params.set('accountId', c.req.query('accountId')!)

			const response = await fetch(`${baseUrl}/v1/connect/whatsapp/select-phone-number?${params.toString()}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/connect/telegram */
		initiateTelegram: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.initiateTelegram(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/telegram */
		getTelegramStatus: async (c: Context) => {
			const profileId = c.req.query('profileId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.getTelegramStatus({ profileId })
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/connect/tiktok-ads */
		connectTiktokAds: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const params = new URLSearchParams()
			if (c.req.query('profileId')) params.set('profileId', c.req.query('profileId')!)
			if (c.req.query('redirect_url')) params.set('redirect_url', c.req.query('redirect_url')!)

			const response = await fetch(`${baseUrl}/v1/connect/tiktok-ads?${params.toString()}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/connect/pending-data */
		getPendingData: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createConnectRoutes(fetch)
			try {
				const result = await routes.getPendingData()
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}