/**
 * Connect routes
 * OAuth and social account connection
 */
export function createConnectRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get OAuth connect URL for a platform
     */
    getConnectUrl: (data: { platform: string; redirectUri?: string; state?: string }) => {
      return fetch<any>('/v1/connect/url', { method: 'POST', body: data })
    },

    /**
     * Handle OAuth callback
     */
    handleCallback: (data: { platform: string; code: string; state?: string }) => {
      return fetch<any>('/v1/connect/callback', { method: 'POST', body: data })
    },

    /**
     * Connect ads for a platform
     */
    connectAds: (data: { platform: string }) => {
      return fetch<any>('/v1/connect/ads', { method: 'POST', body: data })
    },

    // --- Facebook ---

    /**
     * List Facebook pages
     */
    listFacebookPages: (params?: { accountId?: string }) => {
      return fetch<any>('/v1/connect/facebook/pages', { query: params })
    },

    /**
     * Select Facebook page
     */
    selectFacebookPage: (data: { accountId: string; pageId: string }) => {
      return fetch<any>('/v1/connect/facebook/select-page', { method: 'POST', body: data })
    },

    // --- Google Business ---

    /**
     * List Google Business locations
     */
    listGoogleBusinessLocations: (params?: { accountId?: string }) => {
      return fetch<any>('/v1/connect/googlebusiness/locations', { query: params })
    },

    /**
     * Select Google Business location
     */
    selectGoogleBusinessLocation: (data: { accountId: string; locationId: string }) => {
      return fetch<any>('/v1/connect/googlebusiness/select-location', { method: 'POST', body: data })
    },

    // --- LinkedIn ---

    /**
     * List LinkedIn organizations
     */
    listLinkedInOrganizations: (params?: { accountId?: string }) => {
      return fetch<any>('/v1/connect/linkedin/organizations', { query: params })
    },

    /**
     * Select LinkedIn organization
     */
    selectLinkedInOrganization: (data: { accountId: string; organizationId: string }) => {
      return fetch<any>('/v1/connect/linkedin/select-organization', { method: 'POST', body: data })
    },

    // --- Pinterest ---

    /**
     * List Pinterest boards
     */
    listPinterestBoards: (params?: { accountId?: string }) => {
      return fetch<any>('/v1/connect/pinterest/boards', { query: params })
    },

    /**
     * Select Pinterest board
     */
    selectPinterestBoard: (data: { accountId: string; boardId: string }) => {
      return fetch<any>('/v1/connect/pinterest/select-board', { method: 'POST', body: data })
    },

    // --- Snapchat ---

    /**
     * List Snapchat profiles
     */
    listSnapchatProfiles: (params?: { accountId?: string }) => {
      return fetch<any>('/v1/connect/snapchat/profiles', { query: params })
    },

    /**
     * Select Snapchat profile
     */
    selectSnapchatProfile: (data: { accountId: string; profileId: string }) => {
      return fetch<any>('/v1/connect/snapchat/select-profile', { method: 'POST', body: data })
    },

    // --- Bluesky ---

    /**
     * Connect Bluesky credentials
     */
    connectBluesky: (data: { identifier: string; password: string }) => {
      return fetch<any>('/v1/connect/bluesky/credentials', { method: 'POST', body: data })
    },

    // --- WhatsApp ---

    /**
     * Connect WhatsApp credentials
     */
    connectWhatsApp: (data: { phoneNumber?: string; businessAccountId?: string }) => {
      return fetch<any>('/v1/connect/whatsapp/credentials', { method: 'POST', body: data })
    },

    // --- Telegram ---

    /**
     * Initiate Telegram connection
     */
    initiateTelegram: (data: { phone?: string }) => {
      return fetch<any>('/v1/connect/telegram/initiate', { method: 'POST', body: data })
    },

    /**
     * Complete Telegram connection
     */
    completeTelegram: (data: { code: string }) => {
      return fetch<any>('/v1/connect/telegram/complete', { method: 'POST', body: data })
    },

    /**
     * Get Telegram connect status
     */
    getTelegramStatus: () => {
      return fetch<any>('/v1/connect/telegram/status')
    },

    // --- Pending OAuth ---

    /**
     * Get pending OAuth data
     */
    getPendingData: () => {
      return fetch<any>('/v1/connect/pending-data')
    },
  }
}

export type ConnectRoutes = ReturnType<typeof createConnectRoutes>