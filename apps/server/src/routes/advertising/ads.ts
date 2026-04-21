/**
 * Ads routes
 * Facebook/Instagram ad management
 */
export function createAdsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List ad accounts
     */
    listAccounts: (params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/ads/accounts', { query: params })
    },

    /**
     * List ads
     */
    list: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/ads', { query: { accountId, ...params } })
    },

    /**
     * Get ad details
     */
    get: (accountId: string, adId: string) => {
      return fetch<any>(`/v1/ads/${adId}`, { query: { accountId } })
    },

    /**
     * Create standalone ad
     */
    create: (accountId: string, data: { adsetId?: string; creative?: object; name?: string }) => {
      return fetch<any>('/v1/ads/create', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Update ad
     */
    update: (accountId: string, adId: string, data: { status?: string; name?: string }) => {
      return fetch<any>(`/v1/ads/${adId}`, { method: 'PATCH', body: { accountId, ...data } })
    },

    /**
     * Delete ad
     */
    delete: (accountId: string, adId: string) => {
      return fetch<any>(`/v1/ads/${adId}`, { method: 'DELETE', body: { accountId } })
    },

    /**
     * Get ad analytics
     */
    getAnalytics: (accountId: string, adId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>(`/v1/ads/${adId}/analytics`, { query: { accountId, ...params } })
    },

    /**
     * Boost a post as ad
     */
    boost: (accountId: string, data: { postId: string; budget?: number; targetAgeMin?: number; targetAgeMax?: number; targetGender?: string }) => {
      return fetch<any>('/v1/ads/boost', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * Search ad targeting interests
     */
    searchInterests: (accountId: string, params: { q: string; limit?: number }) => {
      return fetch<any>('/v1/ads/interests', { query: { accountId, ...params } })
    },

    /**
     * Send conversion events
     */
    sendConversions: (accountId: string, data: { events: Array<{ eventName: string; data?: object }> }) => {
      return fetch<any>('/v1/ads/conversions', { method: 'POST', body: { accountId, ...data } })
    },

    /**
     * List conversion destinations
     */
    listConversionDestinations: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/accounts/${accountId}/conversion-destinations`, { query: params })
    },

    // Campaigns
    /**
     * List ad campaigns
     */
    listCampaigns: (accountId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>('/v1/ads/campaigns', { query: { accountId, ...params } })
    },

    /**
     * Get campaign tree (campaign -> adsets -> ads)
     */
    getTree: (accountId: string, campaignId: string) => {
      return fetch<any>('/v1/ads/tree', { query: { accountId, campaignId } })
    },

    /**
     * Update campaign status (pause/resume)
     */
    updateCampaignStatus: (accountId: string, campaignId: string, data: { status: string }) => {
      return fetch<any>(`/v1/ads/campaigns/${campaignId}/status`, { method: 'POST', body: { accountId, ...data } })
    },
  }
}

export type AdsRoutes = ReturnType<typeof createAdsRoutes>