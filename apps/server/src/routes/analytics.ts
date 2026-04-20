/**
 * Analytics routes
 * Get account and content analytics
 */
export function createAnalyticsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get analytics for an account
     */
    get: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>(`/v1/analytics`, { query: { accountId, ...params } })
    },

    /**
     * Get YouTube daily views
     */
    youtubeDailyViews: (accountId: string, params: { videoId: string; startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/youtube/daily-views', { query: { accountId, ...params } })
    },

    /**
     * Get Instagram account insights
     */
    instagramAccountInsights: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/instagram/account-insights', { query: { accountId, ...params } })
    },

    /**
     * Get Instagram demographics
     */
    instagramDemographics: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/instagram/demographics', { query: { accountId, ...params } })
    },

    /**
     * Get YouTube demographics
     */
    youtubeDemographics: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/youtube/demographics', { query: { accountId, ...params } })
    },

    /**
     * Get daily metrics
     */
    dailyMetrics: (accountId: string, params?: { startDate?: string; endDate?: string; metric?: string }) => {
      return fetch<any>('/v1/analytics/daily-metrics', { query: { accountId, ...params } })
    },

    /**
     * Get best time to post
     */
    bestTime: (accountId: string) => {
      return fetch<any>('/v1/analytics/best-time', { query: { accountId } })
    },

    /**
     * Get content performance decay
     */
    contentDecay: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/content-decay', { query: { accountId, ...params } })
    },

    /**
     * Get posting frequency vs engagement
     */
    postingFrequency: (accountId: string, params?: { startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/posting-frequency', { query: { accountId, ...params } })
    },

    /**
     * Get post analytics timeline
     */
    postTimeline: (accountId: string, params?: { postId?: string; startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/post-timeline', { query: { accountId, ...params } })
    },

    /**
     * Get Google Business performance metrics
     */
    googlebusinessPerformance: (accountId: string, params?: { locationId?: string; startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/googlebusiness/performance', { query: { accountId, ...params } })
    },

    /**
     * Get Google Business search keywords
     */
    googlebusinessSearchKeywords: (accountId: string, params?: { locationId?: string; startDate?: string; endDate?: string }) => {
      return fetch<any>('/v1/analytics/googlebusiness/search-keywords', { query: { accountId, ...params } })
    },
  }
}

export type AnalyticsRoutes = ReturnType<typeof createAnalyticsRoutes>