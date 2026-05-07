/**
 * Usage stats route handlers
 */
import type { Context } from 'hono'
import { createFetchFromHono } from '../adapters'

export function createUsageHandlers() {
	return {
		/** GET /v1/usage-stats */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			try {
				const result = await fetch<any>('/v1/usage-stats')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}

export type UsageHandlers = ReturnType<typeof createUsageHandlers>