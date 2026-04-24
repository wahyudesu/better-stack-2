/**
 * Media route handlers - mount media routes as Hono handlers
 * Note: media.ts uses baseUrl/apiKey directly (not generic fetch), so we handle it separately
 */
import type { Context } from 'hono'
import { getApiKeyAndBaseUrl } from '../adapters'

export function createMediaHandlers() {
	return {
		/** POST /v1/media/presign */
		presign: async (c: Context) => {
			const body = await c.req.json()
			const { apiKey, baseUrl } = getApiKeyAndBaseUrl(c)

			const response = await fetch(`${baseUrl}/v1/media/presign`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** GET /v1/media/:mediaId */
		get: async (c: Context) => {
			const mediaId = c.req.param('mediaId')
			const { apiKey, baseUrl } = getApiKeyAndBaseUrl(c)

			const response = await fetch(`${baseUrl}/v1/media/${mediaId}`, {
				headers: { Authorization: `Bearer ${apiKey}` },
			})

			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/media/upload */
		upload: async (c: Context) => {
			// For presigned URL flow - the client uploads directly to presigned URL
			// This endpoint returns the presigned URL for direct upload
			const body = await c.req.json()
			const { apiKey, baseUrl } = getApiKeyAndBaseUrl(c)

			const response = await fetch(`${baseUrl}/v1/media/presign`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})

			const data = await response.json()
			return c.json(data, response.status as any)
		},

		/** POST /v1/media/upload-direct */
		uploadDirect: async (c: Context) => {
			// Handle multipart form data for direct upload
			const body = await c.req.parseBody()
			const { apiKey, baseUrl } = getApiKeyAndBaseUrl(c)

			const formData = new FormData()
			for (const [key, value] of Object.entries(body)) {
				if (value instanceof File) {
					formData.append(key, value)
				} else if (typeof value === 'string') {
					formData.append(key, value)
				}
			}

			const response = await fetch(`${baseUrl}/v1/media/upload-direct`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${apiKey}` },
				body: formData,
			})

			const data = await response.json()
			return c.json(data, response.status as any)
		},
	}
}
