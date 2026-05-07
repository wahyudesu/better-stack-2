/**
 * Twitter Engagement routes
 * Retweet, bookmark, follow, unfollow
 */
export function createTwitterEngagementRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * Retweet a tweet
     */
    retweet: (accountId: string, tweetId: string) => {
      return fetch<any>('/v1/twitter/retweet', {
        method: 'POST',
        body: { accountId, tweetId },
      })
    },

    /**
     * Undo a retweet
     */
    undoRetweet: (accountId: string, tweetId: string) => {
      return fetch<any>('/v1/twitter/retweet', {
        method: 'DELETE',
        query: { accountId, tweetId },
      })
    },

    /**
     * Bookmark a tweet
     */
    bookmark: (accountId: string, tweetId: string) => {
      return fetch<any>('/v1/twitter/bookmark', {
        method: 'POST',
        body: { accountId, tweetId },
      })
    },

    /**
     * Remove a bookmark
     */
    removeBookmark: (accountId: string, tweetId: string) => {
      return fetch<any>('/v1/twitter/bookmark', {
        method: 'DELETE',
        query: { accountId, tweetId },
      })
    },

    /**
     * Follow a user
     */
    follow: (accountId: string, targetUserId: string) => {
      return fetch<any>('/v1/twitter/follow', {
        method: 'POST',
        body: { accountId, targetUserId },
      })
    },

    /**
     * Unfollow a user
     */
    unfollow: (accountId: string, targetUserId: string) => {
      return fetch<any>('/v1/twitter/follow', {
        method: 'DELETE',
        query: { accountId, targetUserId },
      })
    },
  }
}

export type TwitterEngagementRoutes = ReturnType<typeof createTwitterEngagementRoutes>