/**
 * Custom Fields routes
 * Define and manage custom contact fields
 */
export function createCustomFieldsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List custom fields
		 */
		list: (params?: { profileId?: string }) => {
			return fetch<any>('/v1/custom-fields', { query: params })
		},

		/**
		 * Create a custom field
		 */
		create: (data: { profileId: string; name: string; slug?: string; type: string; options?: string[] }) => {
			return fetch<any>('/v1/custom-fields', { method: 'POST', body: data })
		},

		/**
		 * Get a custom field
		 */
		get: (fieldId: string) => {
			return fetch<any>(`/v1/custom-fields/${fieldId}`)
		},

		/**
		 * Update a custom field
		 */
		update: (fieldId: string, data: { name?: string; options?: string[] }) => {
			return fetch<any>(`/v1/custom-fields/${fieldId}`, { method: 'PATCH', body: data })
		},

		/**
		 * Delete a custom field
		 */
		delete: (fieldId: string) => {
			return fetch<any>(`/v1/custom-fields/${fieldId}`, { method: 'DELETE' })
		},
	}
}

export type CustomFieldsRoutes = ReturnType<typeof createCustomFieldsRoutes>