/**
 * WhatsApp Flows route handlers
 */
import type { Context } from 'hono'
import { createWhatsAppFlowsRoutes } from '../platform/whatsappFlows'
import { createFetchFromHono } from '../adapters'

export function createWhatsAppFlowsHandlers() {
	const getRoutes = (c: Context) => createWhatsAppFlowsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/whatsapp/flows */
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

		/** POST /v1/whatsapp/flows */
		create: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/flows/:flowId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const result = await routes.get(flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/whatsapp/flows/:flowId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const body = await c.req.json()
				const result = await routes.update(flowId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/whatsapp/flows/:flowId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const result = await routes.delete(flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/whatsapp/flows/:flowId/json */
		getJson: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const result = await routes.getJson(flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/json */
		uploadJson: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const body = await c.req.json()
				const result = await routes.uploadJson(flowId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/publish */
		publish: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const result = await routes.publish(flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/:flowId/deprecate */
		deprecate: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const flowId = c.req.param('flowId')!
				const result = await routes.deprecate(flowId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/whatsapp/flows/send */
		send: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const body = await c.req.json()
				const result = await routes.send(body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}