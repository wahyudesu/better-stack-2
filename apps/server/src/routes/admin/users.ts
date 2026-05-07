/**
 * Users routes
 * GET /v1/user — current user
 * GET /v1/users — list all users in workspace
 * GET /v1/users/:userId — specific user
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

    /**
     * List all users in workspace
     * Returns currentUserId + array of all users with roles
     */
    list: () => {
      return fetch<any>('/v1/users')
    },

    /**
     * Get specific user by ID
     */
    getById: (userId: string) => {
      return fetch<any>(`/v1/users/${userId}`)
    },

    /**
     * Update specific user
     */
    updateById: (userId: string, data: { name?: string; email?: string }) => {
      return fetch<any>(`/v1/users/${userId}`, { method: 'PATCH', body: data })
    },
  }
}

export type UsersRoutes = ReturnType<typeof createUsersRoutes>
