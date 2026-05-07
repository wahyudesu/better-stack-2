/**
 * Reviews routes
 * Unified inbox API for managing reviews on Facebook Pages and Google Business
 */
export function createReviewsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List reviews across all accounts
		 */
		list: (params?: {
			profileId?: string
			platform?: string
			minRating?: number
			maxRating?: number
			hasReply?: boolean
			sortBy?: string
			sortOrder?: string
			limit?: number
			cursor?: string
			accountId?: string
		}) => {
			return fetch<any>('/v1/inbox/reviews', { query: params })
		},

		/**
		 * Reply to a review
		 */
		reply: (reviewId: string, data: { accountId: string; message: string }) => {
			return fetch<any>(`/v1/inbox/reviews/${reviewId}/reply`, { method: 'POST', body: data })
		},

		/**
		 * Delete review reply (Google Business only)
		 */
		deleteReply: (reviewId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/reviews/${reviewId}/reply`, { method: 'DELETE', body: { accountId } })
		},
	}
}

export type ReviewsRoutes = ReturnType<typeof createReviewsRoutes>