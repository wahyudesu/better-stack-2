/**
 * Reviews route handlers
 */
import type { Context } from 'hono'
import { createReviewsRoutes } from '../inbox/reviews'
import { createFetchFromHono } from '../adapters'

export function createReviewsHandlers() {
	const getRoutes = (c: Context) => createReviewsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/inbox/reviews */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					platform: c.req.query('platform') || undefined,
					minRating: c.req.query('minRating') ? Number(c.req.query('minRating')) : undefined,
					maxRating: c.req.query('maxRating') ? Number(c.req.query('maxRating')) : undefined,
					hasReply: c.req.query('hasReply') === 'true' ? true : c.req.query('hasReply') === 'false' ? false : undefined,
					sortBy: c.req.query('sortBy') || undefined,
					sortOrder: c.req.query('sortOrder') || undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					cursor: c.req.query('cursor') || undefined,
					accountId: c.req.query('accountId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/reviews/:reviewId/reply */
		reply: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const reviewId = c.req.param('reviewId')!
				const body = await c.req.json()
				const result = await routes.reply(reviewId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/reviews/:reviewId/reply */
		deleteReply: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const reviewId = c.req.param('reviewId')!
				const body = await c.req.json()
				const result = await routes.deleteReply(reviewId, body.accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}