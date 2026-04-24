/**
 * Tools route handlers - mount tools routes as Hono handlers
 */
import type { Context } from 'hono'
import { createToolsRoutes } from '../content/tools'
import { createFetchFromHono } from '../adapters'

export function createToolsHandlers() {
	return {
		/** GET /v1/tools/youtube/download */
		youtubeDownload: async (c: Context) => {
			const params = {
				url: c.req.query('url') || '',
				action: (c.req.query('action') as 'download' | 'formats') || undefined,
				format: (c.req.query('format') as 'video' | 'audio') || undefined,
				quality: (c.req.query('quality') as 'hd' | 'sd') || undefined,
				formatId: c.req.query('formatId') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.youtubeDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/youtube/transcript */
		youtubeTranscript: async (c: Context) => {
			const params = {
				url: c.req.query('url') || '',
				lang: c.req.query('lang') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.youtubeTranscript(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/instagram/download */
		instagramDownload: async (c: Context) => {
			const params = { url: c.req.query('url') || '' }
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.instagramDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/tools/instagram/hashtag-checker */
		instagramHashtagChecker: async (c: Context) => {
			const { hashtags } = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.instagramHashtagChecker(hashtags)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/tiktok/download */
		tiktokDownload: async (c: Context) => {
			const params = {
				url: c.req.query('url') || '',
				action: (c.req.query('action') as 'download' | 'formats') || undefined,
				formatId: c.req.query('formatId') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.tiktokDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/twitter/download */
		twitterDownload: async (c: Context) => {
			const params = {
				url: c.req.query('url') || '',
				action: (c.req.query('action') as 'download' | 'formats') || undefined,
				formatId: c.req.query('formatId') || undefined,
			}
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.twitterDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/facebook/download */
		facebookDownload: async (c: Context) => {
			const params = { url: c.req.query('url') || '' }
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.facebookDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/linkedin/download */
		linkedinDownload: async (c: Context) => {
			const params = { url: c.req.query('url') || '' }
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.linkedinDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** GET /v1/tools/bluesky/download */
		blueskyDownload: async (c: Context) => {
			const params = { url: c.req.query('url') || '' }
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.blueskyDownload(params)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/tools/validate/post-length */
		validatePostLength: async (c: Context) => {
			const { text } = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.validatePostLength(text)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/tools/validate/post */
		validatePost: async (c: Context) => {
			const data = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.validatePost(data)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/tools/validate/media */
		validateMedia: async (c: Context) => {
			const data = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.validateMedia(data)
				return c.json(result)
			} catch (error) {
				return c.json(
					{ error: error instanceof Error ? error.message : 'Unknown error' },
					500,
				)
			}
		},

		/** POST /v1/tools/validate/subreddit */
		validateSubreddit: async (c: Context) => {
			const data = await c.req.json()
			const fetch = createFetchFromHono(c)
			const routes = createToolsRoutes(fetch)
			try {
				const result = await routes.validateSubreddit(data)
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
