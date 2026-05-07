/**
 * Fetch adapter - bridges Hono Context to route factory fetch signature
 */
import type { Context } from 'hono'

type FetchOptions = {
	method?: string
	query?: Record<string, string | string[] | undefined | number | boolean>
	body?: unknown
}

export function createFetchFromHono(c: Context) {
	return async function fetchFromHono<T>(path: string, options: FetchOptions = {}): Promise<T> {
		// Use apiKey from auth middleware context (set via Clerk JWT validation + metadata lookup)
		// Fall back to env var only for routes that bypass auth middleware
		const apiKey = c.get('userApiKey') || (c.env as any)?.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY
		const baseUrl = (c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api'

		if (!apiKey) {
			throw new Error('API key required. Authenticate via Clerk JWT with API key in publicMetadata.')
		}

		const url = new URL(path, baseUrl.endsWith('/') ? baseUrl : baseUrl + '/')

		if (options.query) {
			Object.entries(options.query).forEach(([key, value]) => {
				if (value === undefined) return
				if (Array.isArray(value)) {
					value.forEach((v) => url.searchParams.append(key, String(v)))
				} else {
					url.searchParams.set(key, String(value))
				}
			})
		}

		console.log(`[fetchFromHono] ${options.method || 'GET'} ${url.toString()}`)

		const response = await fetch(url.toString(), {
			method: options.method || 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		})

		console.log(`[fetchFromHono] response status: ${response.status}, content-type: ${response.headers.get('content-type')}`)

		if (!response.ok) {
			const contentType = response.headers.get('content-type')
			let errorData: { error?: string; message?: string } = {}
			if (contentType?.includes('application/json')) {
				try {
					errorData = (await response.json()) as { error?: string; message?: string }
				} catch {
					// ignore JSON parse failure
				}
			} else {
				// Try to extract error from text/HTML response
				const text = await response.text().catch(() => '')
				console.log(`[fetchFromHono] non-JSON error body: ${text.slice(0, 200)}`)
				errorData.message = text.slice(0, 200)
			}
			const errorMessage =
				errorData?.error || errorData?.message || `Request failed with status ${response.status}`
			throw new Error(errorMessage)
		}

		const contentType = response.headers.get('content-type')
		if (!contentType?.includes('application/json')) {
			const text = await response.text().catch(() => '')
			console.log(`[fetchFromHono] non-JSON success body: ${text.slice(0, 200)}`)
			throw new Error(`Expected JSON but got ${contentType}: ${text.slice(0, 200)}`)
		}

		return response.json() as Promise<T>
	}
}

export function getApiKeyAndBaseUrl(c: Context): { apiKey: string; baseUrl: string } {
	const apiKey = (c.env as any)?.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY || ''
	const baseUrl =
		(c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api/v1'
	return { apiKey, baseUrl }
}
