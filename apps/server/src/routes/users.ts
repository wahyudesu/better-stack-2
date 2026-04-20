/**
 * Users routes
 * Manage current user
 */
export function createUsersRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get current user info
     */
    get: () => {
      return fetch<any>('/v1/user')
    },

    /**
     * Update current user
     */
    update: (data: { name?: string; email?: string }) => {
      return fetch<any>('/v1/user', { method: 'PATCH', body: data })
    },
  }
}

export type UsersRoutes = ReturnType<typeof createUsersRoutes>
