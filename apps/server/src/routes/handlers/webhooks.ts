/**
 * Webhooks route handlers
 */
import type { Context } from 'hono'
import { createWebhooksRoutes } from '../webhooks/webhooks'
import { createFetchFromHono } from '../adapters'

export function createWebhooksHandlers() {
	return {
		/** GET /v1/webhooks/settings */
		listSettings: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.listSettings()
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/webhooks/settings */
		createSetting: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.createSetting(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/webhooks/settings/:webhookId */
		getSetting: async (c: Context) => {
			const webhookId = c.req.param('webhookId')!
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const response = await fetch(`${baseUrl}/v1/webhooks/settings/${webhookId}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** PATCH /v1/webhooks/settings/:webhookId */
		updateSetting: async (c: Context) => {
			const webhookId = c.req.param('webhookId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.updateSetting(webhookId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/webhooks/settings/:webhookId */
		deleteSetting: async (c: Context) => {
			const webhookId = c.req.param('webhookId')!
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.deleteSetting(webhookId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/webhooks/test */
		test: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.test(body.webhookId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/webhooks/logs */
		listLogs: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createWebhooksRoutes(fetch)
			try {
				const result = await routes.listLogs({
					webhookId: c.req.query('webhookId') || undefined,
					event: c.req.query('event') || undefined,
					status: c.req.query('status') || undefined,
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