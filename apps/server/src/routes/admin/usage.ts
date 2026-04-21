/**
 * Usage routes
 * Get API usage statistics
 */
export function createUsageRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get current usage stats
     */
    get: () => {
      return fetch<any>('/v1/usage')
    },
  }
}

export type UsageRoutes = ReturnType<typeof createUsageRoutes>
