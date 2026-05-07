/**
 * Logs route handlers
 */
import type { Context } from 'hono'
import { createLogsRoutes } from '../core/logs'
import { createFetchFromHono } from '../adapters'

export function createLogsHandlers() {
	return {
		/** GET /v1/logs */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const apiKey = c.get('userApiKey') || ''
			const baseUrl = (c.env as any)?.API_BASE_URL || 'https://zernio.com/api'

			const params = new URLSearchParams()
			if (c.req.query('postId')) params.set('postId', c.req.query('postId')!)
			if (c.req.query('accountId')) params.set('accountId', c.req.query('accountId')!)
			if (c.req.query('webhookId')) params.set('webhookId', c.req.query('webhookId')!)
			if (c.req.query('event')) params.set('event', c.req.query('event')!)
			if (c.req.query('status')) params.set('status', c.req.query('status')!)
			if (c.req.query('page')) params.set('page', c.req.query('page')!)
			if (c.req.query('limit')) params.set('limit', c.req.query('limit')!)

			const url = `${baseUrl}/v1/logs${params.toString() ? '?' + params.toString() : ''}`
			const response = await fetch(url, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})
			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/posts/:postId/logs */
		getPostLogs: async (c: Context) => {
			const postId = c.req.param('postId')!
			const fetch = createFetchFromHono(c)
			const routes = createLogsRoutes(fetch)
			try {
				const result = await routes.getPostLogs(postId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/webhooks/logs */
		listWebhookLogs: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createLogsRoutes(fetch)
			try {
				const result = await routes.listWebhookLogs({
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