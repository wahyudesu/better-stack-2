/**
 * Google Business Profile routes
 * GMB account-specific endpoints for locations, reviews, menus, services, etc.
 */
export function createGoogleBusinessRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * Get GMB locations
		 */
		getLocations: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-locations`)
		},

		/**
		 * Get GMB reviews
		 */
		getReviews: (accountId: string, params?: { page?: number; limit?: number }) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-reviews`, { query: params })
		},

		/**
		 * Batch reply to GMB reviews
		 */
		batchReply: (accountId: string, data: { reviews: Array<{ reviewId: string; message: string }> }) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-reviews/batch`, { method: 'POST', body: data })
		},

		/**
		 * Get food menus
		 */
		getFoodMenus: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-food-menus`)
		},

		/**
		 * Update food menus
		 */
		updateFoodMenus: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-food-menus`, { method: 'PUT', body: data })
		},

		/**
		 * Get location details
		 */
		getLocationDetails: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-location-details`)
		},

		/**
		 * Update location details
		 */
		updateLocationDetails: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-location-details`, { method: 'PUT', body: data })
		},

		/**
		 * Get GMB media
		 */
		getMedia: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-media`)
		},

		/**
		 * Create GMB media
		 */
		createMedia: (accountId: string, data: { mediaUrl: string; category?: string }) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-media`, { method: 'POST', body: data })
		},

		/**
		 * Delete GMB media
		 */
		deleteMedia: (accountId: string, data: { mediaName: string }) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-media`, { method: 'DELETE', body: data })
		},

		/**
		 * Get GMB attributes
		 */
		getAttributes: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-attributes`)
		},

		/**
		 * Update GMB attributes
		 */
		updateAttributes: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-attributes`, { method: 'PUT', body: data })
		},

		/**
		 * Get place actions
		 */
		getPlaceActions: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`)
		},

		/**
		 * Create place action
		 */
		createPlaceAction: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'POST', body: data })
		},

		/**
		 * Update place action
		 */
		updatePlaceAction: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'PUT', body: data })
		},

		/**
		 * Delete place action
		 */
		deletePlaceAction: (accountId: string, data: { placeActionId: string }) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'DELETE', body: data })
		},

		/**
		 * Get services
		 */
		getServices: (accountId: string) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-services`)
		},

		/**
		 * Update services
		 */
		updateServices: (accountId: string, data: object) => {
			return fetch<any>(`/v1/accounts/${accountId}/gmb-services`, { method: 'PUT', body: data })
		},
	}
}

export type GoogleBusinessRoutes = ReturnType<typeof createGoogleBusinessRoutes>