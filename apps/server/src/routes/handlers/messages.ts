/**
 * Messages route handlers (Conversations & Messages)
 */
import type { Context } from 'hono'
import { createMessagesRoutes } from '../inbox/messages'
import { createFetchFromHono } from '../adapters'

export function createMessagesHandlers() {
	const getRoutes = (c: Context) => createMessagesRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/inbox/messages */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					profileId: c.req.query('profileId') || undefined,
					platform: c.req.query('platform') || undefined,
					status: c.req.query('status') || undefined,
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

		/** POST /v1/inbox/messages */
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

		/** GET /v1/inbox/messages/:conversationId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const result = await routes.get(conversationId, c.req.query('accountId') || '')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PUT /v1/inbox/messages/:conversationId */
		update: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const body = await c.req.json()
				const result = await routes.update(conversationId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/inbox/messages/:conversationId/messages */
		getMessages: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const result = await routes.getMessages(conversationId, {
					accountId: c.req.query('accountId') || '',
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
					cursor: c.req.query('cursor') || undefined,
					sortOrder: c.req.query('sortOrder') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/messages/:conversationId/messages */
		send: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const body = await c.req.json()
				const result = await routes.send(conversationId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/messages/:conversationId/typing */
		sendTyping: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const body = await c.req.json()
				const result = await routes.sendTyping(conversationId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/messages/:conversationId/messages/:messageId */
		deleteMessage: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const messageId = c.req.param('messageId')!
				const result = await routes.deleteMessage(conversationId, messageId, c.req.query('accountId') || '')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** PATCH /v1/inbox/messages/:conversationId/messages/:messageId */
		editMessage: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const messageId = c.req.param('messageId')!
				const body = await c.req.json()
				const result = await routes.editMessage(conversationId, messageId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/messages/:conversationId/messages/:messageId/reactions */
		addReaction: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const messageId = c.req.param('messageId')!
				const body = await c.req.json()
				const result = await routes.addReaction(conversationId, messageId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/messages/:conversationId/messages/:messageId/reactions */
		removeReaction: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const conversationId = c.req.param('conversationId')!
				const messageId = c.req.param('messageId')!
				const result = await routes.removeReaction(conversationId, messageId, c.req.query('accountId') || '')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}