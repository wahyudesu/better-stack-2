/**
 * API Keys routes
 * Manage API keys for programmatic access
 */
export function createApiKeysRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List all API keys
     */
    list: (params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/api-keys', { query: params })
    },

    /**
     * Create a new API key
     */
    create: (data: { name?: string; expiresAt?: string }) => {
      return fetch<any>('/v1/api-keys', { method: 'POST', body: data })
    },

    /**
     * Delete an API key
     */
    delete: (keyId: string) => {
      return fetch<any>(`/v1/api-keys/${keyId}`, { method: 'DELETE' })
    },
  }
}

export type ApiKeysRoutes = ReturnType<typeof createApiKeysRoutes>