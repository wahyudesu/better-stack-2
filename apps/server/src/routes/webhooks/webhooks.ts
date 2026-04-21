/**
 * Webhooks routes
 * Configure and manage webhooks for real-time notifications
 */
export function createWebhooksRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List webhook settings
     */
    listSettings: () => {
      return fetch<any>('/v1/webhooks/settings')
    },

    /**
     * Create a webhook
     */
    createSetting: (data: {
      name: string
      url: string
      events: string[]
      secret?: string
      customHeaders?: Record<string, string>
    }) => {
      return fetch<any>('/v1/webhooks/settings', { method: 'POST', body: data })
    },

    /**
     * Update a webhook
     */
    updateSetting: (webhookId: string, data: {
      name?: string
      url?: string
      events?: string[]
      isActive?: boolean
      customHeaders?: Record<string, string>
    }) => {
      return fetch<any>(`/v1/webhooks/settings/${webhookId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a webhook
     */
    deleteSetting: (webhookId: string) => {
      return fetch<any>(`/v1/webhooks/settings/${webhookId}`, { method: 'DELETE' })
    },

    /**
     * Test a webhook
     */
    test: (webhookId: string) => {
      return fetch<any>('/v1/webhooks/test', { method: 'POST', body: { webhookId } })
    },

    /**
     * List webhook logs
     */
    listLogs: (params?: { webhookId?: string; event?: string; status?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/webhooks/logs', { query: params })
    },
  }
}

export type WebhooksRoutes = ReturnType<typeof createWebhooksRoutes>