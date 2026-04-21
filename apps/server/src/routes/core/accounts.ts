/**
 * Accounts routes
 * Manage social media accounts
 */
export function createAccountsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List all social accounts
     */
    list: (params?: { profileId?: string }) => {
      return fetch<any>('/v1/accounts', { query: params })
    },

    /**
     * Get a single account by ID
     */
    get: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}`)
    },

    /**
     * Get follower statistics for an account
     */
    followerStats: (accountId: string, params?: { days?: number }) => {
      return fetch<any>(`/v1/accounts/${accountId}/followers/stats`, { query: params })
    },

    /**
     * Check account health/connection status
     */
    health: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/health`)
    },

    // --- Platform-specific endpoints ---

    /**
     * Get TikTok creator info
     */
    tiktokCreatorInfo: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/tiktok/creator-info`)
    },

    /**
     * Get Facebook page for an account
     */
    getFacebookPage: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/facebook-page`)
    },

    /**
     * Get LinkedIn organizations
     */
    linkedinOrganizations: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-organizations`)
    },

    /**
     * Get LinkedIn aggregate analytics
     */
    linkedinAggregateAnalytics: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-aggregate-analytics`, { query: params })
    },

    /**
     * Get LinkedIn post analytics
     */
    linkedinPostAnalytics: (accountId: string, params?: { postId?: string; startDate?: string; endDate?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-post-analytics`, { query: params })
    },

    /**
     * Get LinkedIn post reactions
     */
    linkedinPostReactions: (accountId: string, postId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-post-reactions`, { query: { postId } })
    },

    /**
     * Get LinkedIn organization info
     */
    linkedinOrganization: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-organization`)
    },

    /**
     * Get LinkedIn mentions
     */
    linkedinMentions: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/linkedin-mentions`)
    },

    /**
     * Get Pinterest boards
     */
    pinterestBoards: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/pinterest-boards`)
    },

    /**
     * Get YouTube playlists
     */
    youtubePlaylists: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/youtube-playlists`)
    },

    /**
     * Get Google Business locations
     */
    gmbLocations: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-locations`)
    },

    /**
     * Get Reddit subreddits
     */
    redditSubreddits: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/reddit-subreddits`)
    },

    /**
     * Get Reddit flairs
     */
    redditFlairs: (accountId: string, params?: { subreddit?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/reddit-flairs`, { query: params })
    },

    // --- GMB endpoints ---

    /**
     * Get Google Business reviews
     */
    gmbReviews: (accountId: string, params?: { locationId?: string; startDate?: string; endDate?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-reviews`, { query: params })
    },

    /**
     * Batch get Google Business reviews
     */
    gmbReviewsBatch: (accountId: string, data: { locationIds: string[] }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-reviews/batch`, { method: 'POST', body: data })
    },

    /**
     * Get Google Business food menus
     */
    gmbFoodMenus: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-food-menus`, { query: params })
    },

    /**
     * Update Google Business food menus
     */
    updateGmbFoodMenus: (accountId: string, data: { menus: object[]; locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-food-menus`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Get Google Business location details
     */
    gmbLocationDetails: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-location-details`, { query: params })
    },

    /**
     * Update Google Business location details
     */
    updateGmbLocationDetails: (accountId: string, data: { locationId?: string; location?: object }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-location-details`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * List Google Business media
     */
    gmbMedia: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-media`, { query: params })
    },

    /**
     * Upload Google Business media
     */
    createGmbMedia: (accountId: string, data: { locationId?: string; mediaUrl?: string; category?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-media`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Delete Google Business media
     */
    deleteGmbMedia: (accountId: string, data: { mediaKey: string; locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-media`, { method: 'DELETE', body: { accountId, ...data } })
    },

    /**
     * Get Google Business attributes
     */
    gmbAttributes: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-attributes`, { query: params })
    },

    /**
     * Update Google Business attributes
     */
    updateGmbAttributes: (accountId: string, data: { locationId?: string; attributes?: object }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-attributes`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * List Google Business place actions
     */
    gmbPlaceActions: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { query: params })
    },

    /**
     * Create Google Business place action
     */
    createGmbPlaceAction: (accountId: string, data: { locationId?: string; actionType?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Update Google Business place action
     */
    updateGmbPlaceAction: (accountId: string, data: { actionId?: string; locationId?: string; actionType?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'PUT', body: { accountId, ...data } })
    },

    /**
     * Delete Google Business place action
     */
    deleteGmbPlaceAction: (accountId: string, data: { actionId?: string; locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-place-actions`, { method: 'DELETE', body: { accountId, ...data } })
    },

    /**
     * Get Google Business services
     */
    gmbServices: (accountId: string, params?: { locationId?: string }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-services`, { query: params })
    },

    /**
     * Update Google Business services
     */
    updateGmbServices: (accountId: string, data: { locationId?: string; services?: object[] }) => {
      return fetch<any>(`/v1/accounts/${accountId}/gmb-services`, { method: 'PUT', body: { accountId, ...data } })
    },

    // --- Account Settings ---

    /**
     * Get Facebook Messenger menu
     */
    getMessengerMenu: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`)
    },

    /**
     * Set Facebook Messenger menu
     */
    setMessengerMenu: (accountId: string, data: { menu: object[] }) => {
      return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`, { method: 'PUT', body: data })
    },

    /**
     * Delete Facebook Messenger menu
     */
    deleteMessengerMenu: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/messenger-menu`, { method: 'DELETE' })
    },

    /**
     * Get Instagram ice breakers
     */
    getInstagramIceBreakers: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`)
    },

    /**
     * Set Instagram ice breakers
     */
    setInstagramIceBreakers: (accountId: string, data: { iceBreakers: object[] }) => {
      return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`, { method: 'PUT', body: data })
    },

    /**
     * Delete Instagram ice breakers
     */
    deleteInstagramIceBreakers: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/instagram-ice-breakers`, { method: 'DELETE' })
    },

    /**
     * Get Telegram bot commands
     */
    getTelegramCommands: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`)
    },

    /**
     * Set Telegram bot commands
     */
    setTelegramCommands: (accountId: string, data: { commands: object[] }) => {
      return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`, { method: 'PUT', body: data })
    },

    /**
     * Delete Telegram bot commands
     */
    deleteTelegramCommands: (accountId: string) => {
      return fetch<any>(`/v1/accounts/${accountId}/telegram-commands`, { method: 'DELETE' })
    },

    // --- Conversion Destinations ---

    /**
     * List conversion destinations
     */
    listConversionDestinations: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/accounts/${accountId}/conversion-destinations`, { query: params })
    },
  }
}

export type AccountsRoutes = ReturnType<typeof createAccountsRoutes>