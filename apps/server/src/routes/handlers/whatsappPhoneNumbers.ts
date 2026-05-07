/**
 * WhatsApp Phone Numbers route handlers
 */
import type { Context } from 'hono'
import { createWhatsAppPhoneNumbersRoutes } from '../platform/whatsappPhoneNumbers'
import { createFetchFromHono } from '../adapters'

export function createWhatsAppPhoneNumbersHandlers() {
	const getRoutes = (c: Context) => createWhatsAppPhoneNumbersRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/whatsapp/phone-numbers */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					accountId: c.req.query('accountId') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/phone-numbers/:phoneNumberId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const phoneNumberId = c.req.param('phoneNumberId')!
				const result = await routes.get(phoneNumberId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/phone-numbers/purchase */
		purchase: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.purchase(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/phone-numbers/:phoneNumberId */
		release: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const phoneNumberId = c.req.param('phoneNumberId')!
				const result = await routes.release(phoneNumberId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}