/**
 * Accounts route handlers - platform-specific account data
 */
import type { Context } from 'hono'
import { createAccountsRoutes } from '../core/accounts'
import { createFetchFromHono } from '../adapters'

export function createAccountsHandlers() {
	return {
		/** GET /v1/accounts */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					platform: c.req.query('platform') || undefined,
					includeOverLimit: c.req.query('includeOverLimit') === 'true' ? true : undefined,
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId */
		get: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.get(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/health */
		health: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.health(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/follower-stats */
		followerStats: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.followerStats(accountId, {
					days: c.req.query('days') ? Number(c.req.query('days')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/tiktok/creator-info */
		tiktokCreatorInfo: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.tiktokCreatorInfo(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/facebook-page */
		getFacebookPage: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.getFacebookPage(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-organizations */
		linkedinOrganizations: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinOrganizations(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-aggregate-analytics */
		linkedinAggregateAnalytics: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinAggregateAnalytics(accountId, {
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-post-analytics */
		linkedinPostAnalytics: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinPostAnalytics(accountId, {
					postId: c.req.query('postId') || undefined,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-post-reactions */
		linkedinPostReactions: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const postId = c.req.query('postId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinPostReactions(accountId, postId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-organization */
		linkedinOrganization: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinOrganization(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/linkedin-mentions */
		linkedinMentions: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.linkedinMentions(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/pinterest-boards */
		pinterestBoards: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.pinterestBoards(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/youtube-playlists */
		youtubePlaylists: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.youtubePlaylists(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-locations */
		gmbLocations: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbLocations(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-reviews */
		gmbReviews: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbReviews(accountId, {
					locationId: c.req.query('locationId') || undefined,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-reviews/batch */
		gmbReviewsBatch: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbReviewsBatch(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-food-menus */
		gmbFoodMenus: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbFoodMenus(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-food-menus */
		updateGmbFoodMenus: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.updateGmbFoodMenus(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-location-details */
		gmbLocationDetails: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbLocationDetails(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-location-details */
		updateGmbLocationDetails: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.updateGmbLocationDetails(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-media */
		gmbMedia: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbMedia(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-media */
		createGmbMedia: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.createGmbMedia(accountId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/gmb-media */
		deleteGmbMedia: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.deleteGmbMedia(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-attributes */
		gmbAttributes: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbAttributes(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-attributes */
		updateGmbAttributes: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.updateGmbAttributes(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-place-actions */
		gmbPlaceActions: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbPlaceActions(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/accounts/:accountId/gmb-place-actions */
		createGmbPlaceAction: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.createGmbPlaceAction(accountId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-place-actions */
		updateGmbPlaceAction: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.updateGmbPlaceAction(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/gmb-place-actions */
		deleteGmbPlaceAction: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.deleteGmbPlaceAction(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/gmb-services */
		gmbServices: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.gmbServices(accountId, {
					locationId: c.req.query('locationId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/gmb-services */
		updateGmbServices: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.updateGmbServices(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/reddit-subreddits */
		redditSubreddits: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.redditSubreddits(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/reddit-flairs */
		redditFlairs: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.redditFlairs(accountId, {
					subreddit: c.req.query('subreddit') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/messenger-menu */
		getMessengerMenu: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.getMessengerMenu(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/messenger-menu */
		setMessengerMenu: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.setMessengerMenu(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/messenger-menu */
		deleteMessengerMenu: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.deleteMessengerMenu(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/instagram-ice-breakers */
		getInstagramIceBreakers: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.getInstagramIceBreakers(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/instagram-ice-breakers */
		setInstagramIceBreakers: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.setInstagramIceBreakers(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/instagram-ice-breakers */
		deleteInstagramIceBreakers: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.deleteInstagramIceBreakers(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/telegram-commands */
		getTelegramCommands: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.getTelegramCommands(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/accounts/:accountId/telegram-commands */
		setTelegramCommands: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.setTelegramCommands(accountId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/accounts/:accountId/telegram-commands */
		deleteTelegramCommands: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.deleteTelegramCommands(accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/accounts/:accountId/discord-settings */
		getDiscordSettings: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/discord-settings`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** PUT /v1/accounts/:accountId/discord-settings */
		updateDiscordSettings: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/discord-settings`, {
				method: 'PUT',
				headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/accounts/:accountId/discord-channels */
		getDiscordChannels: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/accounts/${accountId}/discord-channels`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/accounts/:accountId/conversion-destinations */
		listConversionDestinations: async (c: Context) => {
			const accountId = c.req.param('accountId')!
			const fetch = createFetchFromHono(c)
			const routes = createAccountsRoutes(fetch)
			try {
				const result = await routes.listConversionDestinations(accountId, {
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