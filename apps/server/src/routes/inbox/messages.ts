/**
 * Messages routes (Conversations & Messages)
 * Unified inbox for managing conversations and direct messages
 */
export function createMessagesRoutes(fetch: <T>(path: string, options?: any) => Promise<T>) {
	return {
		// --- Conversations ---

		/**
		 * List conversations
		 */
		list: (params?: {
			profileId?: string
			platform?: string
			status?: string
			sortOrder?: string
			limit?: number
			cursor?: string
			accountId?: string
		}) => {
			return fetch<any>('/v1/inbox/messages', { query: params })
		},

		/**
		 * Create a new conversation (Twitter/X DM)
		 */
		create: (data: {
			accountId: string
			participantId?: string
			participantUsername?: string
			message?: string
			skipDmCheck?: boolean
		}) => {
			return fetch<any>('/v1/inbox/messages', { method: 'POST', body: data })
		},

		/**
		 * Get a conversation
		 */
		get: (conversationId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}`, { query: { accountId } })
		},

		/**
		 * Update conversation status (archive/activate)
		 */
		update: (conversationId: string, data: { accountId: string; status: string }) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}`, { method: 'PUT', body: data })
		},

		/**
		 * Get messages in a conversation
		 */
		getMessages: (conversationId: string, params?: {
			accountId: string
			limit?: number
			cursor?: string
			sortOrder?: string
		}) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages`, { query: params })
		},

		/**
		 * Send a message in a conversation
		 */
		send: (conversationId: string, data: {
			accountId: string
			message?: string
			attachmentUrl?: string
			attachmentType?: string
			quickReplies?: Array<{ title: string; payload: string; imageUrl?: string }>
			buttons?: Array<{ type: string; title: string; url?: string; payload?: string; phone?: string }>
			template?: object
			interactive?: object
			replyMarkup?: object
			messagingType?: string
			messageTag?: string
			replyTo?: string
		}) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages`, { method: 'POST', body: data })
		},

		/**
		 * Send typing indicator
		 */
		sendTyping: (conversationId: string, data: { accountId: string }) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/typing`, { method: 'POST', body: data })
		},

		/**
		 * Delete a message
		 */
		deleteMessage: (conversationId: string, messageId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages/${messageId}`, { method: 'DELETE', query: { accountId } })
		},

		/**
		 * Edit a message (Telegram only)
		 */
		editMessage: (conversationId: string, messageId: string, data: { accountId: string; text?: string; replyMarkup?: object }) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages/${messageId}`, { method: 'PATCH', body: data })
		},

		/**
		 * Add reaction to a message
		 */
		addReaction: (conversationId: string, messageId: string, data: { accountId: string; emoji: string }) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages/${messageId}/reactions`, { method: 'POST', body: data })
		},

		/**
		 * Remove reaction from a message
		 */
		removeReaction: (conversationId: string, messageId: string, accountId: string) => {
			return fetch<any>(`/v1/inbox/messages/${conversationId}/messages/${messageId}/reactions`, { method: 'DELETE', query: { accountId } })
		},
	}
}

export type MessagesRoutes = ReturnType<typeof createMessagesRoutes>