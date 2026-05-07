/**
 * Analytics route handlers
 */
import type { Context } from 'hono'
import { createAnalyticsRoutes } from '../analytics/analytics'
import { createFetchFromHono } from '../adapters'

export function createAnalyticsHandlers() {
	return {
		/** GET /v1/analytics */
		get: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.get({
					accountId: c.req.query('accountId') || undefined,
					postId: c.req.query('postId') || undefined,
					platform: c.req.query('platform') || undefined,
					profileId: c.req.query('profileId') || undefined,
					source: c.req.query('source') || undefined,
					fromDate: c.req.query('fromDate') || undefined,
					toDate: c.req.query('toDate') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					sortBy: c.req.query('sortBy') || undefined,
					order: c.req.query('order') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/youtube/channel-insights */
		youtubeChannelInsights: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.youtubeChannelInsights(accountId, {
					metrics: c.req.query('metrics') || undefined,
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
					metricType: c.req.query('metricType') as 'time_series' | 'total_value' | undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/youtube/daily-views */
		youtubeDailyViews: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const videoId = c.req.query('videoId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.youtubeDailyViews(accountId, {
					videoId,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/youtube/demographics */
		youtubeDemographics: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.youtubeDemographics(accountId, {
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/facebook/page-insights */
		facebookPageInsights: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.facebookPageInsights(accountId, {
					metrics: c.req.query('metrics') || undefined,
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
					metricType: c.req.query('metricType') as 'time_series' | 'total_value' | undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/instagram/account-insights */
		instagramAccountInsights: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.instagramAccountInsights(accountId, {
					metrics: c.req.query('metrics') || undefined,
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
					metricType: c.req.query('metricType') as 'time_series' | 'total_value' | undefined,
					breakdown: c.req.query('breakdown') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/instagram/follower-history */
		instagramFollowerHistory: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.instagramFollowerHistory(accountId, {
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/instagram/demographics */
		instagramDemographics: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.instagramDemographics(accountId, {
					metric: c.req.query('metric') as 'follower_demographics' | 'engaged_audience_demographics' | undefined,
					timeframe: c.req.query('timeframe') as 'this_week' | 'this_month' | undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/linkedin/org-aggregate-analytics */
		linkedinOrgAggregateAnalytics: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.linkedinOrgAggregateAnalytics(accountId, {
					metrics: c.req.query('metrics') || undefined,
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
					metricType: c.req.query('metricType') as 'time_series' | 'total_value' | undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/tiktok/account-insights */
		tiktokAccountInsights: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.tiktokAccountInsights(accountId, {
					metrics: c.req.query('metrics') || undefined,
					since: c.req.query('since') || undefined,
					until: c.req.query('until') || undefined,
					metricType: c.req.query('metricType') as 'time_series' | 'total_value' | undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/daily-metrics */
		dailyMetrics: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.dailyMetrics(accountId, {
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
					metric: c.req.query('metric') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/best-time */
		bestTime: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.bestTime(accountId, {
					platform: c.req.query('platform') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/content-decay */
		contentDecay: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.contentDecay(accountId, {
					platform: c.req.query('platform') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/posting-frequency */
		postingFrequency: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.postingFrequency(accountId, {
					platform: c.req.query('platform') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/post-timeline */
		postTimeline: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.postTimeline(accountId, {
					postId: c.req.query('postId') || undefined,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/googlebusiness/performance */
		googlebusinessPerformance: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.googlebusinessPerformance(accountId, {
					locationId: c.req.query('locationId') || undefined,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/analytics/googlebusiness/search-keywords */
		googlebusinessSearchKeywords: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createAnalyticsRoutes(fetch)
			try {
				const result = await routes.googlebusinessSearchKeywords(accountId, {
					locationId: c.req.query('locationId') || undefined,
					startDate: c.req.query('startDate') || undefined,
					endDate: c.req.query('endDate') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}