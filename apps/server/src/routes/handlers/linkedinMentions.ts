/**
 * LinkedIn Mentions route handlers
 */
import type { Context } from 'hono'
import { createLinkedInMentionsRoutes } from '../platform/linkedinMentions'
import { createFetchFromHono } from '../adapters'

export function createLinkedInMentionsHandlers() {
	const getRoutes = (c: Context) => createLinkedInMentionsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/accounts/:accountId/linkedin-mentions */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const accountId = c.req.param('accountId')!
				const result = await routes.list(accountId, {
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					cursor: c.req.query('cursor') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}