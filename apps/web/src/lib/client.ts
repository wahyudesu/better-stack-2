import { useAuthStore } from '@/stores'

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'

interface ApiResponse<T> {
	data: T | null
	error: string | null
}

async function fetchApi<T>(
	path: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	const apiKey = useAuthStore.getState().apiKey

	if (!apiKey) {
		return { data: null, error: 'Not authenticated' }
	}

	try {
		const response = await fetch(`${API_BASE_URL}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				...options.headers,
			},
		})

		const data = await response.json()

		if (!response.ok) {
			return {
				data: null,
				error: data.error || `Request failed with status ${response.status}`,
			}
		}

		return { data, error: null }
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

export const api = {
	get: <T>(path: string) => fetchApi<T>(path),

	post: <T>(path: string, body: unknown) =>
		fetchApi<T>(path, {
			method: 'POST',
			body: JSON.stringify(body),
		}),

	patch: <T>(path: string, body: unknown) =>
		fetchApi<T>(path, {
			method: 'PATCH',
			body: JSON.stringify(body),
		}),

	delete: <T>(path: string) =>
		fetchApi<T>(path, { method: 'DELETE' }),
}

// Type definitions matching Zernio API
export interface Profile {
	_id: string
	name: string
	description?: string
	createdAt: string
	updatedAt: string
}

export interface SocialAccount {
	_id: string
	platform: string
	username: string
	displayName?: string
	isActive: boolean
	profilePicture?: string
	profileId: string
	createdAt: string
	updatedAt: string
}

export interface Post {
	_id: string
	text: string
	profileId: string
	socialAccountIds: string[]
	scheduledAt?: string
	publishedAt?: string
	media?: Array<{ url: string; type?: string; altText?: string }>
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>
	status: 'draft' | 'scheduled' | 'published' | 'failed' | 'cancelled'
	platformPostIds?: Record<string, string>
	createdAt: string
	updatedAt: string
}

export interface QueueItem {
	_id: string
	post: Post
	scheduledAt: string
	status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface PostAnalytics {
	postId: string
	platform: string
	likes: number
	comments: number
	shares: number
	impressions: number
	engagement: number
}

export interface UsageStats {
	planName: string
	limits: {
		uploads: number
		profiles: number
	}
	usage: {
		uploads: number
		profiles: number
	}
}
