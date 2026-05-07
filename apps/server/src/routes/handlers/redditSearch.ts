/**
 * Reddit Search route handlers
 */
import type { Context } from 'hono'
import { createRedditSearchRoutes } from '../platform/redditSearch'
import { createFetchFromHono } from '../adapters'

export function createRedditSearchHandlers() {
	const getRoutes = (c: Context) => createRedditSearchRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/reddit/search */
		search: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.search({
					q: c.req.query('q') || '',
					sort: c.req.query('sort') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/reddit/feed */
		feed: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.feed({
					subreddit: c.req.query('subreddit') || '',
					sort: c.req.query('sort') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}