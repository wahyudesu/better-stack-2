/**
 * Discord routes
 * Discord channel and settings management
 */
export function createDiscordRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get Discord settings for an account
     */
    getSettings: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/discord-settings`)
    },

    /**
     * Update Discord settings
     */
    updateSettings: (accountId: string, data: { channelId?: string; enabled?: boolean }) => {
      return fetch<any>(`/v1/accounts/${accountId}/discord-settings`, { method: 'PUT', body: data })
    },

    /**
     * Get Discord channels for an account
     */
    getChannels: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/discord-channels`)
    },
  }
}

export type DiscordRoutes = ReturnType<typeof createDiscordRoutes>