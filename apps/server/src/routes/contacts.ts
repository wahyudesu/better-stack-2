/**
 * Contacts routes
 * Manage contacts for WhatsApp Business and other platforms
 */
export function createContactsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List contacts
     */
    list: (params?: { page?: number; limit?: number; search?: string }) => {
      return fetch<any>('/v1/contacts', { query: params })
    },

    /**
     * Get a contact
     */
    get: (contactId: string) => {
      return fetch<any>(`/v1/contacts/${contactId}`)
    },

    /**
     * Create a contact
     */
    create: (data: { phone?: string; email?: string; firstName?: string; lastName?: string; tags?: string[] }) => {
      return fetch<any>('/v1/contacts', { method: 'POST', body: data })
    },

    /**
     * Update a contact
     */
    update: (contactId: string, data: { firstName?: string; lastName?: string; tags?: string[] }) => {
      return fetch<any>(`/v1/contacts/${contactId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a contact
     */
    delete: (contactId: string) => {
      return fetch<any>(`/v1/contacts/${contactId}`, { method: 'DELETE' })
    },

    /**
     * Get contact channels
     */
    getChannels: (contactId: string) => {
      return fetch<any>(`/v1/contacts/${contactId}/channels`)
    },

    /**
     * Bulk create contacts
     */
    bulkCreate: (data: { contacts: Array<{ phone?: string; email?: string; firstName?: string; lastName?: string }> }) => {
      return fetch<any>('/v1/contacts/bulk', { method: 'POST', body: data })
    },

    /**
     * Set contact custom field value
     */
    setField: (contactId: string, slug: string, data: { value: string }) => {
      return fetch<any>(`/v1/contacts/${contactId}/fields/${slug}`, { method: 'PUT', body: data })
    },

    /**
     * Clear contact custom field value
     */
    clearField: (contactId: string, slug: string) => {
      return fetch<any>(`/v1/contacts/${contactId}/fields/${slug}`, { method: 'DELETE' })
    },
  }
}

export type ContactsRoutes = ReturnType<typeof createContactsRoutes>