/**
 * Comments route handlers
 */
import type { Context } from 'hono'
import { createCommentsRoutes } from '../inbox/comments'
import { createFetchFromHono } from '../adapters'

export function createCommentsHandlers() {
	const getRoutes = (c: Context) => createCommentsRoutes(createFetchFromHono(c))

	return {
		/** GET /v1/inbox/comments */
		list: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const result = await routes.list({
					accountId: c.req.query('accountId') || undefined,
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** GET /v1/inbox/comments/:postId */
		get: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const result = await routes.get(postId, {
					page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
					limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/comments/:postId/:commentId/hide */
		hide: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const commentId = c.req.param('commentId')!
				const body = await c.req.json()
				const result = await routes.hide(postId, commentId, body.accountId)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/comments/:postId/:commentId/hide */
		unhide: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const commentId = c.req.param('commentId')!
				const result = await routes.unhide(postId, commentId, c.req.query('accountId') || '')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/comments/:postId/:commentId/like */
		like: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const commentId = c.req.param('commentId')!
				const body = await c.req.json()
				const result = await routes.like(postId, commentId, body)
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/comments/:postId/:commentId/like */
		unlike: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const commentId = c.req.param('commentId')!
				const result = await routes.unlike(postId, commentId, {
					accountId: c.req.query('accountId') || '',
					likeUri: c.req.query('likeUri') || undefined,
				})
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** POST /v1/inbox/comments/:postId/:commentId/private-reply */
		privateReply: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const commentId = c.req.param('commentId')!
				const body = await c.req.json()
				const result = await routes.privateReply(postId, commentId, body)
				return c.json(result, 201)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},

		/** DELETE /v1/inbox/comments/:postId */
		delete: async (c: Context) => {
			try {
				const routes = getRoutes(c)
				const postId = c.req.param('postId')!
				const result = await routes.delete(postId, c.req.query('accountId') || '', c.req.query('commentId') || '')
				return c.json(result)
			} catch (error) {
				return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500)
			}
		},
	}
}