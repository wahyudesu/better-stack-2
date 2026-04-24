/**
 * Posts route handlers - mount posts routes as Hono handlers
 */
import type { Context } from 'hono'
import { createPostsRoutes } from '../content/posts'
import { createFetchFromHono } from '../adapters'

export function createPostsHandlers() {
	return {
		/** GET /v1/posts */
		list: async (c: Context) => {
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			const params = {
				page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
				limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
				profileId: c.req.query('profileId') || undefined,
				status: c.req.query('status') || undefined,
			}
			try {
				const result = await routes.list(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/posts/:postId */
		get: async (c: Context) => {
			const postId = c.req.param('postId')!
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.get(postId)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/posts */
		create: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.create(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** PATCH /v1/posts/:postId */
		update: async (c: Context) => {
			const postId = c.req.param('postId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.update(postId, body)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** DELETE /v1/posts/:postId */
		delete: async (c: Context) => {
			const postId = c.req.param('postId')!
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				await routes.delete(postId)
				return c.json({ success: true })
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/posts/bulk-upload */
		bulkUpload: async (c: Context) => {
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.bulkUpload(body)
				return c.json(result, 201)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/posts/:postId/edit */
		edit: async (c: Context) => {
			const postId = c.req.param('postId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.edit(postId, body)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** PATCH /v1/posts/:postId/update-metadata */
		updateMetadata: async (c: Context) => {
			const postId = c.req.param('postId')!
			const body = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.updateMetadata(postId, body)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/posts/:postId/retry */
		retry: async (c: Context) => {
			const postId = c.req.param('postId')!
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.retry(postId)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/posts/:postId/unpublish */
		unpublish: async (c: Context) => {
			const postId = c.req.param('postId')!
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.unpublish(postId)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/posts/:postId/logs */
		getLogs: async (c: Context) => {
			const postId = c.req.param('postId')!
			const params = {
				page: c.req.query('page') ? Number(c.req.query('page')) : undefined,
				limit: c.req.query('limit') ? Number(c.req.query('limit')) : undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createPostsRoutes(fetch)
			try {
				const result = await routes.getLogs(postId, params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},
	}
}
