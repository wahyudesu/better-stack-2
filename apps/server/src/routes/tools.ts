/**
 * Tools routes
 * Media download and utility tools
 */
export function createToolsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Download YouTube video
     */
    youtubeDownload: (params: {
      url: string
      action?: 'download' | 'formats'
      format?: 'video' | 'audio'
      quality?: 'hd' | 'sd'
      formatId?: string
    }) => {
      return fetch<any>('/v1/tools/youtube/download', { query: params })
    },

    /**
     * Get YouTube transcript
     */
    youtubeTranscript: (params: { url: string; lang?: string }) => {
      return fetch<any>('/v1/tools/youtube/transcript', { query: params })
    },

    /**
     * Download Instagram media
     */
    instagramDownload: (params: { url: string }) => {
      return fetch<any>('/v1/tools/instagram/download', { query: params })
    },

    /**
     * Check Instagram hashtags
     */
    instagramHashtagChecker: (hashtags: string[]) => {
      return fetch<any>('/v1/tools/instagram/hashtag-checker', {
        method: 'POST',
        body: { hashtags },
      })
    },

    /**
     * Download TikTok video
     */
    tiktokDownload: (params: { url: string; action?: 'download' | 'formats'; formatId?: string }) => {
      return fetch<any>('/v1/tools/tiktok/download', { query: params })
    },

    /**
     * Download Twitter/X media
     */
    twitterDownload: (params: { url: string; action?: 'download' | 'formats'; formatId?: string }) => {
      return fetch<any>('/v1/tools/twitter/download', { query: params })
    },

    /**
     * Download Facebook video
     */
    facebookDownload: (params: { url: string }) => {
      return fetch<any>('/v1/tools/facebook/download', { query: params })
    },

    /**
     * Download LinkedIn video
     */
    linkedinDownload: (params: { url: string }) => {
      return fetch<any>('/v1/tools/linkedin/download', { query: params })
    },

    /**
     * Download Bluesky media
     */
    blueskyDownload: (params: { url: string }) => {
      return fetch<any>('/v1/tools/bluesky/download', { query: params })
    },

    /**
     * Validate post length
     */
    validatePostLength: (text: string) => {
      return fetch<any>('/v1/tools/validate/post-length', {
        method: 'POST',
        body: { text },
      })
    },

    /**
     * Validate post content
     */
    validatePost: (data: {
      content?: string
      platforms: Array<{ platform: string; customContent?: string }>
    }) => {
      return fetch<any>('/v1/tools/validate/post', {
        method: 'POST',
        body: data,
      })
    },

    /**
     * Validate media URL
     */
    validateMedia: (data: { url: string; type?: string }) => {
      return fetch<any>('/v1/tools/validate/media', {
        method: 'POST',
        body: data,
      })
    },

    /**
     * Validate subreddit existence
     */
    validateSubreddit: (data: { subreddit: string }) => {
      return fetch<any>('/v1/tools/validate/subreddit', {
        method: 'POST',
        body: data,
      })
    },
  }
}

export type ToolsRoutes = ReturnType<typeof createToolsRoutes>