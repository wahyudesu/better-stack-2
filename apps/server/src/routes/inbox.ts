/**
 * Inbox routes
 * Unified inbox for conversations, messages, comments, and reviews
 */
export function createInboxRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
  return {
    // --- Conversations ---

    /**
     * List conversations
     */
    conversations: (params?: { accountId?: string; platform?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/inbox/conversations', { query: params })
    },

    /**
     * Get a conversation
     */
    getConversation: (conversationId: string) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}`)
    },

    /**
     * Get messages in a conversation
     */
    messages: (conversationId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages`, { query: params })
    },

    /**
     * Send a message in a conversation
     */
    sendMessage: (conversationId: string, data: { text: string; mediaUrl?: string }) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages`, { method: 'POST', body: data })
    },

    /**
     * Send typing indicator
     */
    sendTyping: (conversationId: string) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/typing`, { method: 'POST' })
    },

    /**
     * Delete a message
     */
    deleteMessage: (conversationId: string, messageId: string) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages/${messageId}`, { method: 'DELETE' })
    },

    /**
     * Edit a message
     */
    editMessage: (conversationId: string, messageId: string, data: { text: string }) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages/${messageId}`, { method: 'PATCH', body: data })
    },

    /**
     * Add reaction to a message
     */
    addReaction: (conversationId: string, messageId: string, data: { reaction: string }) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages/${messageId}/reactions`, { method: 'POST', body: data })
    },

    /**
     * Remove reaction from a message
     */
    removeReaction: (conversationId: string, messageId: string, data: { reaction: string }) => {
      return fetch<any>(`/v1/inbox/conversations/${conversationId}/messages/${messageId}/reactions`, { method: 'DELETE', body: data })
    },

    // --- Comments ---

    /**
     * List comments
     */
    comments: (params?: { accountId?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/inbox/comments', { query: params })
    },

    /**
     * Get comments for a post
     */
    getPostComments: (postId: string, params?: { page?: number; limit?: number }) => {
      return fetch<any>(`/v1/inbox/comments/${postId}`, { query: params })
    },

    /**
     * Hide a comment
     */
    hideComment: (postId: string, commentId: string) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/hide`, { method: 'POST' })
    },

    /**
     * Unhide a comment
     */
    unhideComment: (postId: string, commentId: string) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/hide`, { method: 'DELETE' })
    },

    /**
     * Like a comment
     */
    likeComment: (postId: string, commentId: string) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/like`, { method: 'POST' })
    },

    /**
     * Unlike a comment
     */
    unlikeComment: (postId: string, commentId: string) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/like`, { method: 'DELETE' })
    },

    /**
     * Reply to a comment (public reply)
     */
    replyToComment: (postId: string, commentId: string, data: { text: string }) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/private-reply`, { method: 'POST', body: { text: data.text, public: true } })
    },

    /**
     * Send private reply to a comment
     */
    privateReply: (postId: string, commentId: string, data: { text: string }) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}/private-reply`, { method: 'POST', body: { text: data.text, public: false } })
    },

    /**
     * Delete a comment
     */
    deleteComment: (postId: string, commentId: string) => {
      return fetch<any>(`/v1/inbox/comments/${postId}/${commentId}`, { method: 'DELETE' })
    },

    // --- Reviews ---

    /**
     * List reviews
     */
    reviews: (params?: { accountId?: string; page?: number; limit?: number }) => {
      return fetch<any>('/v1/inbox/reviews', { query: params })
    },

    /**
     * Reply to a review
     */
    replyToReview: (reviewId: string, data: { text: string }) => {
      return fetch<any>(`/v1/inbox/reviews/${reviewId}/reply`, { method: 'POST', body: data })
    },

    /**
     * Delete a review reply
     */
    deleteReviewReply: (reviewId: string) => {
      return fetch<any>(`/v1/inbox/reviews/${reviewId}/reply`, { method: 'DELETE' })
    },
  }
}

export type InboxRoutes = ReturnType<typeof createInboxRoutes>