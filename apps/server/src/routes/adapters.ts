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
		// Use apiKey from auth middleware context (set via Clerk JWT validation + Convex lookup)
		// Fall back to env var only for routes that bypass auth middleware
		const apiKey = c.get('userApiKey') || (c.env as any)?.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY
		const baseUrl = (c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api'

		if (!apiKey) {
			throw new Error('API key required. Authenticate via Clerk JWT.')
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

		const response = await fetch(url.toString(), {
			method: options.method || 'GET',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		})

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({ error: response.statusText }))) as {
				error?: string
				message?: string
			}
			const errorMessage =
				errorData?.error || errorData?.message || 'Request failed'
			throw new Error(String(errorMessage))
		}

		return response.json() as Promise<T>
	}
}

export function getApiKeyAndBaseUrl(c: Context): { apiKey: string; baseUrl: string } {
	const apiKey = (c.env as any)?.ZERNIO_API_KEY || process.env.ZERNIO_API_KEY || ''
	const baseUrl =
		(c.env as any)?.API_BASE_URL || process.env.API_BASE_URL || 'https://zernio.com/api'
	return { apiKey, baseUrl }
}
