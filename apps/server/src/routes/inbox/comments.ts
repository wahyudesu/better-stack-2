/**
 * Comments routes
 * Unified inbox API for managing comments on posts
 */
export function createCommentsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List comments across all posts
		 */
		list: (params?: { accountId?: string; page?: number; limit?: number }) => {
			return fetch<any>('/v1/inbox/comments', { query: params })
		},

		/**
		 * Get comments for a specific post
		 */
		get: (postId: string, params?: { page?: number; limit?: number }) => {
			return fetch<any>(`/v1/inbox/comments/${postId}`, { query: params })
		},

		/**
		 * Hide a comment
		 */
		hide: (postId: string, commentId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/hide`, { method: 'POST', body: { accountId } })
		},

		/**
		 * Unhide a comment
		 */
		unhide: (postId: string, commentId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/hide`, { method: 'DELETE', query: { accountId } })
		},

		/**
		 * Like a comment
		 */
		like: (postId: string, commentId: string, data: { accountId: string; cid?: string }) => {
			return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/like`, { method: 'POST', body: data })
		},

		/**
		 * Unlike a comment
		 */
		unlike: (postId: string, commentId: string, params: { accountId: string; likeUri?: string }) => {
			return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/like`, { method: 'DELETE', query: params })
		},

		/**
		 * Send private reply to a comment (Instagram/Facebook only)
		 */
		privateReply: (postId: string, commentId: string, data: {
			accountId: string
			message: string
			quickReplies?: Array<{ title: string; payload: string; imageUrl?: string }>
			buttons?: Array<{ type: string; title: string; url?: string; payload?: string; phone?: string }>
		}) => {
			return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/private-reply`, { method: 'POST', body: data })
		},

		/**
		 * Delete a comment
		 */
		delete: (postId: string, accountId: string, commentId: string) => {
			return fetch<any>(`/v1/inbox/comments/${postId}`, { method: 'DELETE', query: { accountId, commentId } })
		},
	}
}

export type CommentsRoutes = ReturnType<typeof createCommentsRoutes>