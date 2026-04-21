/**
 * Logs routes
 * Publishing and webhook logs
 */
export function createLogsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List webhook logs
     */
    listWebhookLogs: (params?: { webhookId?: string; event?: string; status?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/webhooks/logs', { query: params })
    },

    /**
     * List post logs
     */
    listPostLogs: (params?: { postId?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/posts/logs', { query: params })
    },

    /**
     * Get logs for a specific post
     */
    getPostLogs: (postId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/posts/${postId}/logs`, { query: params })
    },

    /**
     * List connection logs
     */
    listConnectionLogs: (params?: { accountId?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/connections/logs', { query: params })
    },
  }
}

export type LogsRoutes = ReturnType<typeof createLogsRoutes>