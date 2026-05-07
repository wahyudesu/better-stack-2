/**
 * Ad Audiences routes
 * Custom audiences for ad targeting
 */
export function createAdAudiencesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List ad audiences
     */
    list: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/ads/audiences', { query: { accountId, ...params } })
    },

    /**
     * Create a custom audience
     */
    create: (data: { accountId?: string; name: string; source?: string; description?: string; retentionDays?: number }) => {
      return fetch<any>('/v1/ads/audiences', { method: 'POST', body: data })
    },

    /**
     * Get audience details
     */
    get: (accountId: string, audienceId: string) => {
      return fetch<any>(`/v1/ads/audiences/${audienceId}`, { query: { accountId } })
    },

    /**
     * Update audience
     */
    update: (accountId: string, audienceId: string, data: { name?: string }) => {
      return fetch<any>(`/v1/ads/audiences/${audienceId}`, { method: 'PATCH', body: { accountId, ...data } })
    },

    /**
     * Delete audience
     */
    delete: (accountId: string, audienceId: string) => {
      return fetch<any>(`/v1/ads/audiences/${audienceId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Add users to audience
     */
    addUsers: (audienceId: string, data: { accountId?: string; users?: Array<{ identifier: string; type: string }> }) => {
      return fetch<any>(`/v1/ads/audiences/${audienceId}/users`, { method: 'POST', body: data })
    },

    /**
     * List users in audience
     */
    listUsers: (audienceId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/ads/audiences/${audienceId}/users`, { query: params })
    },
  }
}

export type AdAudiencesRoutes = ReturnType<typeof createAdAudiencesRoutes>