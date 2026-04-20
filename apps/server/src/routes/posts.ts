/**
 * Posts routes
 * Create, list, update, delete, retry, unpublish posts
 */
export function createPostsRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    /**
     * List posts with pagination
     */
    list: (params: { page?: number; limit?: number; profileId?: string; status?: string } = {}) => {
      return fetch<any>('/v1/posts', { query: params })
    },

    /**
     * Get a single post by ID
     */
    get: (postId: string) => {
      return fetch<any>(`/v1/posts/${postId}`)
    },

    /**
     * Create a new post
     */
    create: (data: {
      profileId: string
      text: string
      socialAccountIds: string[]
      scheduledAt?: string
      media?: Array<{ url: string; type?: string; altText?: string }>
      thread?: Array<{ text: string; media?: Array<{ url: string }> }>
    }) => {
      return fetch<any>('/v1/posts', { method: 'POST', body: data })
    },

    /**
     * Update a post
     */
    update: (postId: string, data: {
      text?: string
      scheduledAt?: string
      media?: Array<{ url: string; type?: string; altText?: string }>
    }) => {
      return fetch<any>(`/v1/posts/${postId}`, { method: 'PATCH', body: data })
    },

    /**
     * Delete a post
     */
    delete: (postId: string) => {
      return fetch<any>(`/v1/posts/${postId}`, { method: 'DELETE' })
    },

    /**
     * Bulk upload posts from CSV URL
     */
    bulkUpload: (data: { csvUrl: string; profileId?: string }) => {
      return fetch<any>('/v1/posts/bulk-upload', { method: 'POST', body: data })
    },

    /**
     * Edit a published post
     */
    edit: (postId: string, data: { text?: string; media?: Array<{ url: string; type?: string }> }) => {
      return fetch<any>(`/v1/posts/${postId}/edit`, { method: 'POST', body: data })
    },

    /**
     * Update post metadata
     */
    updateMetadata: (postId: string, data: { metadata?: object }) => {
      return fetch<any>(`/v1/posts/${postId}/update-metadata`, { method: 'PATCH', body: data })
    },

    /**
     * Retry a failed post
     */
    retry: (postId: string) => {
      return fetch<any>(`/v1/posts/${postId}/retry`, { method: 'POST' })
    },

    /**
     * Unpublish a published post
     */
    unpublish: (postId: string) => {
      return fetch<any>(`/v1/posts/${postId}/unpublish`, { method: 'POST' })
    },

    /**
     * Get logs for a post
     */
    getLogs: (postId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/posts/${postId}/logs`, { query: params })
    },
  }
}

export type PostsRoutes = ReturnType<typeof createPostsRoutes>