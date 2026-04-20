/**
 * Invites routes
 * Create invite tokens for team邀请
 */
export function createInvitesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Create an invite token
     */
    createToken: (data: { email?: string; role?: string }) => {
      return fetch<any>('/v1/invite/tokens', { method: 'POST', body: data })
    },
  }
}

export type InvitesRoutes = ReturnType<typeof createInvitesRoutes>