/**
 * Broadcasts routes
 * Platform-agnostic broadcast campaigns for messaging
 */
export function createBroadcastsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List broadcasts
		 */
		list: (params?: {
			profileId?: string
			status?: string
			platform?: string
			limit?: number
			skip?: number
		}) => {
			return fetch<any>('/v1/broadcasts', { query: params })
		},

		/**
		 * Create a broadcast draft
		 */
		create: (data: {
			profileId: string
			accountId: string
			platform: string
			name: string
			description?: string
			message?: object
			template?: object
			segmentFilters?: object
		}) => {
			return fetch<any>('/v1/broadcasts', { method: 'POST', body: data })
		},

		/**
		 * Get broadcast details
		 */
		get: (broadcastId: string) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}`)
		},

		/**
		 * Update a broadcast (draft only)
		 */
		update: (broadcastId: string, data: {
			name?: string
			description?: string
			message?: object
			template?: object
			segmentFilters?: object
		}) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}`, { method: 'PATCH', body: data })
		},

		/**
		 * Delete a broadcast (draft only)
		 */
		delete: (broadcastId: string) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}`, { method: 'DELETE' })
		},

		/**
		 * Send broadcast now
		 */
		send: (broadcastId: string) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}/send`, { method: 'POST' })
		},

		/**
		 * Schedule broadcast for later
		 */
		schedule: (broadcastId: string, data: { scheduledAt: string }) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}/schedule`, { method: 'POST', body: data })
		},

		/**
		 * Cancel broadcast
		 */
		cancel: (broadcastId: string) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}/cancel`, { method: 'POST' })
		},

		/**
		 * List broadcast recipients
		 */
		listRecipients: (broadcastId: string, params?: {
			status?: string
			limit?: number
			skip?: number
		}) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}/recipients`, { query: params })
		},

		/**
		 * Add recipients to a broadcast
		 */
		addRecipients: (broadcastId: string, data: {
			contactIds?: string[]
			phones?: string[]
			useSegment?: boolean
		}) => {
			return fetch<any>(`/v1/broadcasts/${broadcastId}/recipients`, { method: 'POST', body: data })
		},
	}
}

export type BroadcastsRoutes = ReturnType<typeof createBroadcastsRoutes>