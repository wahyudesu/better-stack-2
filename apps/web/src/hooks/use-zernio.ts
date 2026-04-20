import { useMemo } from 'react'
import { api, Profile, SocialAccount, Post, QueueItem, PostAnalytics } from '@/lib/client'
import { useAuthStore } from '@/stores'

// Wrapper client that matches Zernio SDK interface
// but uses our API client instead
export interface ZernioClient {
	profiles: {
		listProfiles: () => Promise<{ data: { profiles: Profile[] }; error: any }>
		getProfile: (params: { path: { profileId: string } }) => Promise<{ data: Profile; error: any }>
		createProfile: (params: { body: { name: string; description?: string } }) => Promise<{ data: Profile; error: any }>
		updateProfile: (params: { path: { profileId: string }; body: { name?: string; timezone?: string } }) => Promise<{ data: Profile; error: any }>
	}
	accounts: {
		listAccounts: (params: { query: { profileId?: string } }) => Promise<{ data: { accounts: SocialAccount[] }; error: any }>
		getAllAccountsHealth: (params: { query: { profileId?: string } }) => Promise<{ data: any[]; error: any }>
		deleteAccount: (params: { path: { accountId: string } }) => Promise<{ error: any }>
	}
	posts: {
		listPosts: (params: { query?: { page?: number; limit?: number; profileId?: string } }) => Promise<{ data: { posts: Post[] }; error: any }>
		getPost: (params: { path: { postId: string } }) => Promise<{ data: Post; error: any }>
		createPost: (params: { body: CreatePostBody }) => Promise<{ data: Post; error: any }>
		updatePost: (params: { path: { postId: string }; body: Partial<Post> }) => Promise<{ data: Post; error: any }>
		deletePost: (params: { path: { postId: string } }) => Promise<{ error: any }>
		retryPost: (params: { path: { postId: string } }) => Promise<{ data: Post; error: any }>
		unpublishPost: (params: { path: { postId: string } }) => Promise<{ data: Post; error: any }>
	}
	queue: {
		getUpcoming: (params: { query?: { profileId?: string; limit?: number } }) => Promise<{ data: { items: QueueItem[] }; error: any }>
	}
	analytics: {
		getPostAnalytics: (params: { query: { postId: string } }) => Promise<{ data: { analytics: PostAnalytics[] }; error: any }>
	}
	usage: {
		getUsageStats: () => Promise<{ data: { usage: { uploads: number; profiles: number }; limits: { uploads: number; profiles: number }; planName: string }; error: any }>
	}
	connect: {
		getConnectUrl: (params: { path: { platform: string }; query: { profileId: string; redirect_url: string; headless?: boolean } }) => Promise<{ data: { url: string }; error: any }>
	}
}

export interface CreatePostBody {
	profileId: string
	text: string
	socialAccountIds: string[]
	scheduledAt?: string
	media?: Array<{ url: string; type?: string; altText?: string }>
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>
}

function createZernioClient(): ZernioClient {
	return {
		profiles: {
			listProfiles: async () => {
				return api.get<{ profiles: Profile[] }>('/v1/profiles')
			},
			getProfile: async ({ path }) => {
				return api.get<Profile>(`/v1/profiles/${path.profileId}`)
			},
			createProfile: async ({ body }) => {
				return api.post<Profile>('/v1/profiles', body)
			},
			updateProfile: async ({ path, body }) => {
				return api.patch<Profile>(`/v1/profiles/${path.profileId}`, body)
			},
		},
		accounts: {
			listAccounts: async ({ query }) => {
				const params = new URLSearchParams()
				if (query.profileId) params.set('profileId', query.profileId)
				const queryStr = params.toString()
				return api.get<{ accounts: SocialAccount[] }>(`/v1/accounts${queryStr ? `?${queryStr}` : ''}`)
			},
			getAllAccountsHealth: async ({ query }) => {
				const params = new URLSearchParams()
				if (query.profileId) params.set('profileId', query.profileId)
				const queryStr = params.toString()
				return api.get<any[]>(`/v1/accounts/health${queryStr ? `?${queryStr}` : ''}`)
			},
			deleteAccount: async ({ path }) => {
				return api.delete(`/v1/accounts/${path.accountId}`)
			},
		},
		posts: {
			listPosts: async ({ query } = {}) => {
				const params = new URLSearchParams()
				if (query?.page) params.set('page', String(query.page))
				if (query?.limit) params.set('limit', String(query.limit))
				if (query?.profileId) params.set('profileId', query.profileId)
				const queryStr = params.toString()
				return api.get<{ posts: Post[] }>(`/v1/posts${queryStr ? `?${queryStr}` : ''}`)
			},
			getPost: async ({ path }) => {
				return api.get<Post>(`/v1/posts/${path.postId}`)
			},
			createPost: async ({ body }) => {
				return api.post<Post>('/v1/posts', body)
			},
			updatePost: async ({ path, body }) => {
				return api.patch<Post>(`/v1/posts/${path.postId}`, body)
			},
			deletePost: async ({ path }) => {
				return api.delete(`/v1/posts/${path.postId}`)
			},
			retryPost: async ({ path }) => {
				return api.post<Post>(`/v1/posts/${path.postId}/retry`, {})
			},
			unpublishPost: async ({ path }) => {
				return api.post<Post>(`/v1/posts/${path.postId}/unpublish`, {})
			},
		},
		queue: {
			getUpcoming: async ({ query } = {}) => {
				const params = new URLSearchParams()
				if (query?.profileId) params.set('profileId', query.profileId)
				if (query?.limit) params.set('limit', String(query.limit))
				const queryStr = params.toString()
				return api.get<{ items: QueueItem[] }>(`/v1/queue${queryStr ? `?${queryStr}` : ''}`)
			},
		},
		analytics: {
			getPostAnalytics: async ({ query }) => {
				const params = new URLSearchParams()
				params.set('postId', query.postId)
				return api.get<{ analytics: PostAnalytics[] }>(`/v1/analytics?${params}`)
			},
		},
		usage: {
			getUsageStats: async () => {
				return api.get<{ usage: { uploads: number; profiles: number }; limits: { uploads: number; profiles: number }; planName: string }>('/v1/usage')
			},
		},
		connect: {
			getConnectUrl: async ({ path, query }) => {
				const params = new URLSearchParams()
				params.set('profileId', query.profileId)
				params.set('redirect_url', query.redirect_url)
				if (query.headless !== undefined) params.set('headless', String(query.headless))
				return api.get<{ url: string }>(`/v1/connect/${path.platform}?${params}`)
			},
		},
	}
}

// Singleton client instance
let clientInstance: ZernioClient | null = null

export function getZernioClient(): ZernioClient {
	if (!clientInstance) {
		clientInstance = createZernioClient()
	}
	return clientInstance
}

/**
 * Hook to get Zernio client instance.
 * Returns null if not authenticated (no API key).
 */
export function useZernio(): ZernioClient | null {
	const { apiKey } = useAuthStore()

	const client = useMemo(() => {
		if (!apiKey) return null
		return createZernioClient()
	}, [apiKey])

	return client
}

/**
 * Hook that throws if client not available.
 * Use in authenticated pages where API key is expected to exist.
 */
export function useZernioClient(): ZernioClient {
	const client = useZernio()
	if (!client) {
		throw new Error('Not authenticated. Please connect your API key.')
	}
	return client
}
