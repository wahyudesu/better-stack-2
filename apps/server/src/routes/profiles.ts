/**
 * Profiles routes
 * Manage profiles (containers for social accounts)
 */
export function createProfilesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List all profiles
     */
    list: () => {
      return fetch<any>('/v1/profiles')
    },

    /**
     * Get a single profile by ID
     */
    get: (profileId: string) => {
      return fetch<any>(`/v1/profiles/${profileId}`)
    },

    /**
     * Create a new profile
     */
    create: (data: { name: string; description?: string }) => {
      return fetch<any>('/v1/profiles', { method: 'POST', body: data })
    },

    /**
     * Update a profile
     */
    update: (profileId: string, data: { name?: string; description?: string }) => {
      return fetch<any>(`/v1/profiles/${profileId}`, { method: 'PATCH', body: data })
    },
  }
}

export type ProfilesRoutes = ReturnType<typeof createProfilesRoutes>
