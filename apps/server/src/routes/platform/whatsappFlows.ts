/**
 * WhatsApp Flows routes
 * WhatsApp Flow messaging for interactive conversations
 */
export function createWhatsAppFlowsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List WhatsApp flows
     */
    list: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/whatsapp/flows', { query: { accountId, ...params } })
    },

    /**
     * Create WhatsApp flow
     */
    create: (accountId: string, data: { name: string; json?: object }) => {
      return fetch<any>('/v1/whatsapp/flows', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Get WhatsApp flow
     */
    get: (accountId: string, flowId: string) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}`, { query: { accountId } })
    },

    /**
     * Update WhatsApp flow
     */
    update: (accountId: string, flowId: string, data: { name?: string; json?: object }) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Delete WhatsApp flow
     */
    delete: (accountId: string, flowId: string) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Get WhatsApp flow JSON
     */
    getJson: (accountId: string, flowId: string) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}/json`, { query: { accountId } })
    },

    /**
     * Upload WhatsApp flow JSON
     */
    uploadJson: (accountId: string, flowId: string, data: { json: object }) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}/json`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Publish WhatsApp flow
     */
    publish: (accountId: string, flowId: string) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}/publish`, { method: 'POST', body: { accountId } })
    },

    /**
     * Deprecate WhatsApp flow
     */
    deprecate: (accountId: string, flowId: string) => {
      return fetch<any>(`/v1/whatsapp/flows/${flowId}/deprecate`, { method: 'POST', body: { accountId } })
    },

    /**
     * Send WhatsApp flow message
     */
    send: (accountId: string, data: { flowId: string; phoneNumber: string; fields?: object }) => {
      return fetch<any>('/v1/whatsapp/flows/send', { method: 'POST', body: { accountId, ...data } })
    },
  }
}

export type WhatsAppFlowsRoutes = ReturnType<typeof createWhatsAppFlowsRoutes>