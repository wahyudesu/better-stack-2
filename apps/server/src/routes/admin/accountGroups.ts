/**
 * Account Groups routes
 * Organize accounts into groups for bulk operations
 */
export function createAccountGroupsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List all account groups
     */
    list: (params?: { profileId?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/account-groups', { query: params })
    },

    /**
     * Get a single account group
     */
    get: (groupId: string) => {
      return fetch<any>(`/v1/account-groups/${groupId}`)
    },

    /**
     * Create an account group
     */
    create: (data: { name: string; accountIds?: string[]; profileId?: string }) => {
      return fetch<any>('/v1/account-groups', { method: 'POST', body: data })
    },

    /**
     * Update an account group
     */
    update: (groupId: string, data: { name?: string; accountIds?: string[] }) => {
      return fetch<any>(`/v1/account-groups/${groupId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete an account group
     */
    delete: (groupId: string) => {
      return fetch<any>(`/v1/account-groups/${groupId}`, { method: 'DELETE' })
    },
  }
}

export type AccountGroupsRoutes = ReturnType<typeof createAccountGroupsRoutes>