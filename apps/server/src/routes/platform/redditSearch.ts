/**
 * Reddit Search routes
 * Search Reddit for posts and content
 */
export function createRedditSearchRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * Search Reddit
		 */
		search: (params: { q: string; sort?: string; limit?: number }) => {
			return fetch<any>('/v1/reddit/search', { query: params })
		},

		/**
		 * Get Reddit feed
		 */
		feed: (params: { subreddit: string; sort?: string; limit?: number }) => {
			return fetch<any>('/v1/reddit/feed', { query: params })
		},
	}
}

export type RedditSearchRoutes = ReturnType<typeof createRedditSearchRoutes>