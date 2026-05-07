/**
 * Sequences routes
 * Drip campaign sequences for multi-step messaging
 */
export function createSequencesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List sequences
		 */
		list: (params?: {
			profileId?: string
			status?: string
			limit?: number
			skip?: number
		}) => {
			return fetch<any>('/v1/sequences', { query: params })
		},

		/**
		 * Create a sequence
		 */
		create: (data: {
			profileId: string
			accountId: string
			platform: string
			name: string
			description?: string
			steps: Array<{
				order: number
				delayMinutes: number
				message?: object
				template?: object
			}>
			exitOnReply?: boolean
			exitOnUnsubscribe?: boolean
		}) => {
			return fetch<any>('/v1/sequences', { method: 'POST', body: data })
		},

		/**
		 * Get sequence with steps
		 */
		get: (sequenceId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}`)
		},

		/**
		 * Update a sequence
		 */
		update: (sequenceId: string, data: {
			name?: string
			description?: string
			steps?: Array<{
				order: number
				delayMinutes: number
				message?: object
				template?: object
			}>
			exitOnReply?: boolean
			exitOnUnsubscribe?: boolean
		}) => {
			return fetch<any>(`/v1/sequences/${sequenceId}`, { method: 'PATCH', body: data })
		},

		/**
		 * Delete a sequence
		 */
		delete: (sequenceId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}`, { method: 'DELETE' })
		},

		/**
		 * Activate a sequence
		 */
		activate: (sequenceId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/activate`, { method: 'POST' })
		},

		/**
		 * Pause a sequence
		 */
		pause: (sequenceId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/pause`, { method: 'POST' })
		},

		/**
		 * Enroll contacts in a sequence
		 */
		enroll: (sequenceId: string, data: {
			contactIds?: string[]
			tag?: string
		}) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/enroll`, { method: 'POST', body: data })
		},

		/**
		 * Enroll a specific contact in a sequence
		 */
		enrollContact: (sequenceId: string, contactId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/enroll/${contactId}`, { method: 'POST' })
		},

		/**
		 * Unenroll a contact from a sequence
		 */
		unenroll: (sequenceId: string, contactId: string) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/enroll/${contactId}`, { method: 'DELETE' })
		},

		/**
		 * List enrollments in a sequence
		 */
		listEnrollments: (sequenceId: string, params?: {
			status?: string
			limit?: number
			skip?: number
		}) => {
			return fetch<any>(`/v1/sequences/${sequenceId}/enrollments`, { query: params })
		},
	}
}

export type SequencesRoutes = ReturnType<typeof createSequencesRoutes>