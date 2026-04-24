/**
 * Connect routes
 * OAuth and social account connection
 *
 * Reference: Zernio API Documentation
 * API Base URL: https://zernio.com/api/v1
 */
export function createConnectRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    // --- OAuth Flow (Most Platforms) ---
    // These are documented here but actually proxied via /v1/* wildcard in index.ts
    // Zernio endpoint: GET /v1/connect/{platform}?profileId=...&redirect_url=...&headless=...
    // Returns { authUrl } for standard OAuth, or { connectToken } for headless
    // After OAuth completes, user is redirected back to redirect_url

    // --- Secondary Selection Endpoints ---
    // These are used in headless mode after OAuth completes.
    // The connectToken from OAuth is passed via X-Connect-Token header.

    /**
     * List Facebook pages (headless)
     */
    listFacebookPages: (data: { connectToken: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/facebook/pages', {
        query: { accountId: data.accountId },
        headers: { 'X-Connect-Token': data.connectToken }
      })
    },

    /**
     * Select Facebook page (headless)
     */
    selectFacebookPage: (data: { connectToken: string; pageId: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/facebook/select-page', {
        method: 'POST',
        headers: { 'X-Connect-Token': data.connectToken },
        body: { pageId: data.pageId, accountId: data.accountId }
      })
    },

    /**
     * List Google Business locations (headless)
     */
    listGoogleBusinessLocations: (data: { connectToken: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/googlebusiness/locations', {
        query: { accountId: data.accountId },
        headers: { 'X-Connect-Token': data.connectToken }
      })
    },

    /**
     * Select Google Business location (headless)
     */
    selectGoogleBusinessLocation: (data: { connectToken: string; locationId: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/googlebusiness/select-location', {
        method: 'POST',
        headers: { 'X-Connect-Token': data.connectToken },
        body: { locationId: data.locationId, accountId: data.accountId }
      })
    },

    /**
     * List LinkedIn organizations (headless)
     */
    listLinkedInOrganizations: (data: { connectToken: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/linkedin/organizations', {
        query: { accountId: data.accountId },
        headers: { 'X-Connect-Token': data.connectToken }
      })
    },

    /**
     * Select LinkedIn organization (headless)
     */
    selectLinkedInOrganization: (data: { connectToken: string; organizationId: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/linkedin/select-organization', {
        method: 'POST',
        headers: { 'X-Connect-Token': data.connectToken },
        body: { organizationId: data.organizationId, accountId: data.accountId }
      })
    },

    /**
     * List Pinterest boards (headless)
     */
    listPinterestBoards: (data: { connectToken: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/pinterest/boards', {
        query: { accountId: data.accountId },
        headers: { 'X-Connect-Token': data.connectToken }
      })
    },

    /**
     * Select Pinterest board (headless)
     */
    selectPinterestBoard: (data: { connectToken: string; boardId: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/pinterest/select-board', {
        method: 'POST',
        headers: { 'X-Connect-Token': data.connectToken },
        body: { boardId: data.boardId, accountId: data.accountId }
      })
    },

    /**
     * List Snapchat profiles (headless)
     */
    listSnapchatProfiles: (data: { connectToken: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/snapchat/profiles', {
        query: { accountId: data.accountId },
        headers: { 'X-Connect-Token': data.connectToken }
      })
    },

    /**
     * Select Snapchat profile (headless)
     */
    selectSnapchatProfile: (data: { connectToken: string; profileId: string; accountId?: string }) => {
      return fetch<any>('/v1/connect/snapchat/select-profile', {
        method: 'POST',
        headers: { 'X-Connect-Token': data.connectToken },
        body: { profileId: data.profileId, accountId: data.accountId }
      })
    },

    // --- Non-OAuth Platforms ---

    /**
     * Connect Bluesky with app password
     * Bluesky uses app passwords, not OAuth
     */
    connectBluesky: (data: { profileId: string; identifier: string; password: string }) => {
      return fetch<any>('/v1/connect/bluesky/credentials', {
        method: 'POST',
        body: data
      })
    },

    /**
     * Connect WhatsApp Business account
     */
    connectWhatsApp: (data: { profileId: string; phoneNumber?: string; businessAccountId?: string }) => {
      return fetch<any>('/v1/connect/whatsapp/credentials', {
        method: 'POST',
        body: data
      })
    },

    /**
     * Initiate Telegram connection
     * Sends an access code to the Zernio Telegram bot
     */
    initiateTelegram: (data: { profileId: string; phone: string }) => {
      return fetch<any>('/v1/connect/telegram/initiate', {
        method: 'POST',
        body: data
      })
    },

    /**
     * Get Telegram connect status (poll after initiate)
     */
    getTelegramStatus: (data: { profileId: string }) => {
      return fetch<any>('/v1/connect/telegram/status', {
        query: { profileId: data.profileId }
      })
    },

    /**
     * Connect ads for a platform
     */
    connectAds: (data: { platform: string; profileId: string }) => {
      return fetch<any>('/v1/connect/ads', { method: 'POST', body: data })
    },

    /**
     * Get pending OAuth data
     */
    getPendingData: () => {
      return fetch<any>('/v1/connect/pending-data')
    },
  }
}

export type ConnectRoutes = ReturnType<typeof createConnectRoutes>
