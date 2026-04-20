/**
 * Comment Automations routes
 * Auto-reply to comments on posts
 */
export function createCommentAutomationsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List comment automations
     */
    list: (params?: { page?: number; limit?: number; accountId?: string }) => {
      return fetch<any>('/v1/comment-automations', { query: params })
    },

    /**
     * Create a comment automation
     */
    create: (data: { name: string; accountId: string; keywords?: string[]; autoReply?: string; assignTo?: string }) => {
      return fetch<any>('/v1/comment-automations', { method: 'POST', body: data })
    },

    /**
     * Get a comment automation
     */
    get: (automationId: string) => {
      return fetch<any>(`/v1/comment-automations/${automationId}`)
    },

    /**
     * Update a comment automation
     */
    update: (automationId: string, data: { name?: string; keywords?: string[]; autoReply?: string; assignTo?: string; isActive?: boolean }) => {
      return fetch<any>(`/v1/comment-automations/${automationId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a comment automation
     */
    delete: (automationId: string) => {
      return fetch<any>(`/v1/comment-automations/${automationId}`, { method: 'DELETE' })
    },

    /**
     * Get comment automation logs
     */
    getLogs: (automationId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/comment-automations/${automationId}/logs`, { query: params })
    },
  }
}

export type CommentAutomationsRoutes = ReturnType<typeof createCommentAutomationsRoutes>