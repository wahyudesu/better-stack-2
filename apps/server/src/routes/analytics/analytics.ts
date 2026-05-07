/**
 * Analytics routes
 * Get account and content analytics
 */
export function createAnalyticsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Get analytics for an account
     */
    get: (params: {
      accountId?: string
      postId?: string
      platform?: string
      profileId?: string
      source?: string
      fromDate?: string
      toDate?: string
      limit?: number
      page?: number
      sortBy?: string
      order?: string
    }) => {
      return fetch<any>('/v1/analytics', { query: params })
    },

    /**
     * Get YouTube channel-level insights
     */
    youtubeChannelInsights: (accountId: string, params?: {
      metrics?: string
      since?: string
      until?: string
      metricType?: string
    }) => {
      return fetch<any>('/v1/analytics/youtube/channel-insights', { query: { accountId, ...params } })
    },

    /**
     * Get YouTube daily views
     */
    youtubeDailyViews: (accountId: string, params: {
      videoId: string
      startDate?: string
      endDate?: string
    }) => {
      return fetch<any>('/v1/analytics/youtube/daily-views', { query: { accountId, ...params } })
    },

    /**
     * Get YouTube demographics
     */
    youtubeDemographics: (accountId: string, params?: { since?: string; until?: string }) => {
      return fetch<any>('/v1/analytics/youtube/demographics', { query: { accountId, ...params } })
    },

    /**
     * Get Facebook Page insights
     */
    facebookPageInsights: (accountId: string, params?: {
      metrics?: string
      since?: string
      until?: string
      metricType?: string
    }) => {
      return fetch<any>('/v1/analytics/facebook/page-insights', { query: { accountId, ...params } })
    },

    /**
     * Get Instagram account insights
     */
    instagramAccountInsights: (accountId: string, params?: {
      metrics?: string
      since?: string
      until?: string
      metricType?: string
      breakdown?: string
    }) => {
      return fetch<any>('/v1/analytics/instagram/account-insights', { query: { accountId, ...params } })
    },

    /**
     * Get Instagram follower history
     */
    instagramFollowerHistory: (accountId: string, params?: { since?: string; until?: string }) => {
      return fetch<any>('/v1/analytics/instagram/follower-history', { query: { accountId, ...params } })
    },

    /**
     * Get Instagram demographics
     */
    instagramDemographics: (accountId: string, params?: {
      metric?: string
      timeframe?: string
    }) => {
      return fetch<any>('/v1/analytics/instagram/demographics', { query: { accountId, ...params } })
    },

    /**
     * Get LinkedIn organization page aggregate analytics
     */
    linkedinOrgAggregateAnalytics: (accountId: string, params?: {
      metrics?: string
      since?: string
      until?: string
      metricType?: string
    }) => {
      return fetch<any>('/v1/analytics/linkedin/org-aggregate-analytics', { query: { accountId, ...params } })
    },

    /**
     * Get TikTok account-level insights
     */
    tiktokAccountInsights: (accountId: string, params?: {
      metrics?: string
      since?: string
      until?: string
      metricType?: string
    }) => {
      return fetch<any>('/v1/analytics/tiktok/account-insights', { query: { accountId, ...params } })
    },

    /**
     * Get daily metrics
     */
    dailyMetrics: (accountId: string, params?: {
      startDate?: string
      endDate?: string
      metric?: string
    }) => {
      return fetch<any>('/v1/analytics/daily-metrics', { query: { accountId, ...params } })
    },

    /**
     * Get best time to post
     */
    bestTime: (accountId: string, params?: { platform?: string }) => {
      return fetch<any>('/v1/analytics/best-time', { query: { accountId, ...params } })
    },

    /**
     * Get content performance decay
     */
    contentDecay: (accountId: string, params?: { platform?: string }) => {
      return fetch<any>('/v1/analytics/content-decay', { query: { accountId, ...params } })
    },

    /**
     * Get posting frequency vs engagement
     */
    postingFrequency: (accountId: string, params?: { platform?: string }) => {
      return fetch<any>('/v1/analytics/posting-frequency', { query: { accountId, ...params } })
    },

    /**
     * Get post analytics timeline
     */
    postTimeline: (accountId: string, params?: {
      postId?: string
      startDate?: string
      endDate?: string
    }) => {
      return fetch<any>('/v1/analytics/post-timeline', { query: { accountId, ...params } })
    },

    /**
     * Get Google Business performance metrics
     */
    googlebusinessPerformance: (accountId: string, params?: {
      locationId?: string
      startDate?: string
      endDate?: string
    }) => {
      return fetch<any>('/v1/analytics/googlebusiness/performance', { query: { accountId, ...params } })
    },

    /**
     * Get Google Business search keywords
     */
    googlebusinessSearchKeywords: (accountId: string, params?: {
      locationId?: string
      startDate?: string
      endDate?: string
    }) => {
      return fetch<any>('/v1/analytics/googlebusiness/search-keywords', { query: { accountId, ...params } })
    },
  }
}

export type AnalyticsRoutes = ReturnType<typeof createAnalyticsRoutes>