/**
 * Custom Fields routes
 * Define and manage custom contact fields
 */
export function createCustomFieldsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List custom fields
     */
    list: (params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/custom-fields', { query: params })
    },

    /**
     * Create a custom field
     */
    create: (data: { slug: string; label: string; type?: string; options?: string[] }) => {
      return fetch<any>('/v1/custom-fields', { method: 'POST', body: data })
    },

    /**
     * Update a custom field
     */
    update: (fieldId: string, data: { label?: string; options?: string[] }) => {
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