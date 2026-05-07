/**
 * Billing route handlers
 */
import type { Context } from 'hono'
import { createFetchFromHono } from '../adapters'

export function createBillingHandlers() {
	return {
		/** GET /v1/billing/x-pricing */
		getPricing: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			try {
				const result = await fetch<any>('/v1/billing/x-pricing')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}

export type BillingHandlers = ReturnType<typeof createBillingHandlers>