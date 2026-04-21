/**
 * Broadcasts routes
 * WhatsApp broadcast campaigns
 */
export function createBroadcastsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List broadcasts
     */
    list: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/broadcasts', { query: { accountId, ...params } })
    },

    /**
     * Create a broadcast
     */
    create: (accountId: string, data: { templateName: string; recipientIds?: string[]; segmentFilter?: object }) => {
      return fetch<any>('/v1/broadcasts', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Get a broadcast
     */
    get: (accountId: string, broadcastId: string) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}`, { query: { accountId } })
    },

    /**
     * Update a broadcast
     */
    update: (accountId: string, broadcastId: string, data: { templateName?: string }) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}`, { method: 'PATCH', body: { accountId, ...data } })
    },

    /**
     * Delete a broadcast
     */
    delete: (accountId: string, broadcastId: string) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Send a broadcast now
     */
    send: (accountId: string, broadcastId: string) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}/send`, { method: 'POST', body: { accountId } })
    },

    /**
     * Schedule a broadcast
     */
    schedule: (accountId: string, broadcastId: string, data: { scheduledAt: string }) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}/schedule`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Cancel a broadcast
     */
    cancel: (accountId: string, broadcastId: string) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}/cancel`, { method: 'POST', body: { accountId } })
    },

    /**
     * List broadcast recipients
     */
    listRecipients: (accountId: string, broadcastId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}/recipients`, { query: { accountId, ...params } })
    },

    /**
     * Add recipients to a broadcast
     */
    addRecipients: (accountId: string, broadcastId: string, data: { recipientIds?: string[]; segmentFilter?: object }) => {
      return fetch<any>(`/v1/broadcasts/${broadcastId}/recipients`, { method: 'POST', body: { accountId, ...data } })
    },
  }
}

export type BroadcastsRoutes = ReturnType<typeof createBroadcastsRoutes>