/**
 * Twitter engagement route handlers
 */
import type { Context } from 'hono'
import { createTwitterEngagementRoutes } from '../platform/twitterEngagement'
import { createFetchFromHono } from '../adapters'

export function createTwitterEngagementHandlers() {
	return {
		/** POST /v1/twitter/retweet */
		retweet: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.retweet(body.accountId, body.tweetId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/twitter/retweet */
		undoRetweet: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const tweetId = c.req.query('tweetId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.undoRetweet(accountId, tweetId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/twitter/bookmark */
		bookmark: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.bookmark(body.accountId, body.tweetId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/twitter/bookmark */
		removeBookmark: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const tweetId = c.req.query('tweetId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.removeBookmark(accountId, tweetId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/twitter/follow */
		follow: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.follow(body.accountId, body.targetUserId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/twitter/follow */
		unfollow: async (c: Context) => {
			const accountId = c.req.query('accountId') || ''
			const targetUserId = c.req.query('targetUserId') || ''
			const fetch = createFetchFromHono(c)
			const routes = createTwitterEngagementRoutes(fetch)
			try {
				const result = await routes.unfollow(accountId, targetUserId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}