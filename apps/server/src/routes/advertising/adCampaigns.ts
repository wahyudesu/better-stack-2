/**
 * Ad Campaigns routes
 * Campaign-level operations for ads
 */
export function createAdCampaignsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		/**
		 * List campaigns with aggregate metrics
		 */
		list: (params?: { accountId?: string; platform?: string }) => {
			return fetch<any>('/v1/ads/campaigns', { query: params })
		},

		/**
		 * Get campaign details
		 */
		get: (campaignId: string) => {
			return fetch<any>(`/v1/ads/campaigns/${campaignId}`)
		},

		/**
		 * Pause or resume all ads in a campaign
		 */
		updateStatus: (campaignId: string, data: { status: 'paused' | 'active' }) => {
			return fetch<any>(`/v1/ads/campaigns/${campaignId}/status`, { method: 'POST', body: data })
		},

		/**
		 * Duplicate a campaign
		 */
		duplicate: (campaignId: string, data?: { name?: string }) => {
			return fetch<any>(`/v1/ads/campaigns/${campaignId}/duplicate`, { method: 'POST', body: data })
		},

		/**
		 * Bulk update campaign statuses
		 */
		bulkUpdateStatus: (data: { campaignIds: string[]; status: 'paused' | 'active' }) => {
			return fetch<any>('/v1/ads/campaigns/bulk-status', { method: 'POST', body: data })
		},
	}
}

export type AdCampaignsRoutes = ReturnType<typeof createAdCampaignsRoutes>