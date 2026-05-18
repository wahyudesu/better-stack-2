/**
 * Inbox API client - wraps Zernio SDK API routes
 */

export interface InboxConversation {
	id: string;
	platform: string;
	accountId: string;
	accountUsername: string;
	participantId: string;
	participantName: string;
	participantPicture: string | null;
	participantVerifiedType: "blue" | "government" | "business" | "none" | null;
	participantUsername?: string | null;
	lastMessage: string;
	updatedTime: string;
	status: "active" | "archived";
	unreadCount: number | null;
	url: string | null;
	instagramProfile?: {
		isFollower: boolean | null;
		isFollowing: boolean | null;
		followerCount: number | null;
		isVerified: boolean | null;
		fetchedAt: string | null;
	};
}

export interface InboxMessage {
	id: string;
	conversationId: string;
	accountId: string;
	platform: string;
	message: string;
	senderId: string;
	senderName: string | null;
	senderVerifiedType: "blue" | "government" | "business" | "none" | null;
	direction: "incoming" | "outgoing";
	createdAt: string;
	attachments: Array<{
		id: string;
		type: "image" | "video" | "audio" | "file" | "sticker" | "share";
		url: string;
		filename: string | null;
		previewUrl: string | null;
	}>;
	subject?: string | null;
	storyReply?: boolean | null;
	isStoryMention?: boolean | null;
	isEdited?: boolean;
	editedAt?: string | null;
	deliveryStatus?: "sent" | "delivered" | "read" | "failed" | "deleted" | null;
}

interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

interface ZernioListResponse<T> {
	data?: T[];
	pagination?: {
		hasMore: boolean;
		nextCursor: string | null;
	};
	meta?: {
		accountsQueried: number;
		accountsFailed: number;
		failedAccounts: Array<{
			accountId: string;
			accountUsername: string | null;
			platform: string;
			error: string;
			code: string | null;
			retryAfter: number | null;
		}>;
		lastUpdated: string;
	};
}

interface ZernioMessagesResponse {
	messages?: Array<Record<string, unknown>>;
	pagination?: {
		hasMore: boolean;
		nextCursor: string | null;
	};
	sortOrderApplied?: "asc" | "desc";
	lastUpdated?: string;
}

async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit,
): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(endpoint, {
			headers: {
				"Content-Type": "application/json",
			},
			...options,
		});

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as {
				error?: string;
			};
			return {
				data: null,
				error: errorData.error || `HTTP ${response.status}`,
			};
		}

		const data = (await response.json()) as T;
		return { data, error: null };
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Network error",
		};
	}
}

export const inboxApi = {
	/**
	 * List inbox conversations
	 * Zernio SDK returns: { data: [...conversations], pagination, meta }
	 */
	async listConversations(params?: {
		accountId?: string;
		platform?: string;
		profileId?: string;
		status?: "active" | "archived";
		limit?: number;
		cursor?: string;
		sortOrder?: "asc" | "desc";
	}): Promise<
		ApiResponse<{
			conversations: InboxConversation[];
			pagination?: { hasMore: boolean; nextCursor: string | null };
		}>
	> {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.platform) searchParams.set("platform", params.platform);
		if (params?.profileId) searchParams.set("profileId", params.profileId);
		if (params?.status) searchParams.set("status", params.status);
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.cursor) searchParams.set("cursor", params.cursor);
		if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

		const endpoint = `/api/inbox/conversations${
			searchParams.toString() ? `?${searchParams.toString()}` : ""
		}`;

		const result = await fetchApi<{
			conversations: InboxConversation[];
			pagination?: { hasMore: boolean; nextCursor: string | null };
			meta?: Record<string, unknown>;
		}>(endpoint);

		if (result.error || !result.data) {
			return { data: null, error: result.error };
		}

		return {
			data: {
				conversations: result.data.conversations ?? [],
				pagination: result.data.pagination,
			},
			error: null,
		};
	},

	/**
	 * Create a new conversation (DM)
	 * Currently supported platforms: Twitter/X only
	 */
	async createConversation(params: {
		accountId: string;
		recipientId: string;
		message?: string;
		skipDmCheck?: boolean;
	}): Promise<ApiResponse<{ conversationId: string }>> {
		return fetchApi("/api/inbox/conversations", {
			method: "POST",
			body: JSON.stringify({
				accountId: params.accountId,
				recipientId: params.recipientId,
				message: params.message,
				skipDmCheck: params.skipDmCheck,
			}),
		});
	},

	/**
	 * Get a single conversation
	 */
	async getConversation(
		conversationId: string,
		accountId: string,
	): Promise<ApiResponse<InboxConversation>> {
		const endpoint = `/api/inbox/conversations/${conversationId}?accountId=${encodeURIComponent(accountId)}`;
		return fetchApi(endpoint);
	},

	/**
	 * Update conversation status (e.g., archive, activate)
	 * Uses PUT method as per Zernio API
	 */
	async updateConversation(
		conversationId: string,
		body: { accountId: string; status?: "active" | "archived" },
	): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(`/api/inbox/conversations/${conversationId}`, {
			method: "PUT",
			body: JSON.stringify(body),
		});
	},

	/**
	 * List messages in a conversation
	 * Zernio SDK returns: { messages: [...], pagination, sortOrderApplied }
	 */
	async listMessages(params: {
		conversationId: string;
		accountId: string;
		limit?: number;
		cursor?: string;
		sortOrder?: "asc" | "desc";
	}): Promise<
		ApiResponse<{
			messages: InboxMessage[];
			pagination?: { hasMore: boolean; nextCursor: string | null };
			sortOrderApplied?: "asc" | "desc";
		}>
	> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.cursor) searchParams.set("cursor", params.cursor);
		if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

		const endpoint = `/api/inbox/messages/${params.conversationId}?${searchParams.toString()}`;

		const result = await fetchApi<ZernioMessagesResponse>(endpoint);

		if (result.error || !result.data) {
			return { data: null, error: result.error };
		}

		return {
			data: {
				messages: (result.data.messages ?? []) as unknown as InboxMessage[],
				pagination: result.data.pagination,
				sortOrderApplied: result.data.sortOrderApplied,
			},
			error: null,
		};
	},

	/**
	 * Send a message in a conversation
	 */
	async sendMessage(params: {
		conversationId: string;
		accountId: string;
		message?: string;
		attachmentUrl?: string;
		skipDmCheck?: boolean;
	}): Promise<ApiResponse<{ messageId: string }>> {
		return fetchApi(`/api/inbox/messages/${params.conversationId}`, {
			method: "POST",
			body: JSON.stringify({
				accountId: params.accountId,
				message: params.message,
				attachmentUrl: params.attachmentUrl,
				skipDmCheck: params.skipDmCheck,
			}),
		});
	},

	/**
	 * Delete a message
	 * Platform support: Telegram, Twitter/X, Bluesky, Reddit. Not supported for Facebook, Instagram, WhatsApp.
	 */
	async deleteMessage(params: {
		conversationId: string;
		messageId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const endpoint = `/api/inbox/messages/${params.conversationId}/${params.messageId}?accountId=${encodeURIComponent(params.accountId)}`;
		return fetchApi(endpoint, { method: "DELETE" });
	},

	/**
	 * Add reaction to a message
	 * Platform support: Telegram, WhatsApp
	 */
	async addReaction(params: {
		conversationId: string;
		messageId: string;
		accountId: string;
		emoji: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(
			`/api/inbox/messages/${params.conversationId}/${params.messageId}/reactions`,
			{
				method: "POST",
				body: JSON.stringify({
					accountId: params.accountId,
					emoji: params.emoji,
				}),
			},
		);
	},

	/**
	 * Remove reaction from a message
	 * Platform support: Telegram, WhatsApp
	 */
	async removeReaction(params: {
		conversationId: string;
		messageId: string;
		accountId: string;
		emoji?: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const endpoint = `/api/inbox/messages/${params.conversationId}/${params.messageId}/reactions?accountId=${encodeURIComponent(params.accountId)}${
			params.emoji ? `&emoji=${encodeURIComponent(params.emoji)}` : ""
		}`;
		return fetchApi(endpoint, { method: "DELETE" });
	},

	/**
	 * Send typing indicator
	 * Platform support: Facebook Messenger, Telegram, WhatsApp
	 */
	async sendTypingIndicator(params: {
		conversationId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(
			`/api/inbox/conversations/${params.conversationId}/typing`,
			{
				method: "POST",
				body: JSON.stringify({ accountId: params.accountId }),
			},
		);
	},

	/**
	 * Upload media file
	 * Returns a publicly accessible URL for use in messages
	 */
	async uploadMedia(file: File): Promise<
		ApiResponse<{
			url: string;
			filename: string;
			mimeType: string;
			size: number;
		}>
	> {
		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await fetch("/api/inbox/media/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = (await response.json().catch(() => ({}))) as {
					error?: string;
				};
				return {
					data: null,
					error: errorData.error || `HTTP ${response.status}`,
				};
			}

			const data = (await response.json()) as {
				url: string;
				filename: string;
				mimeType: string;
				size: number;
			};
			return { data, error: null };
		} catch (error) {
			return {
				data: null,
				error: error instanceof Error ? error.message : "Network error",
			};
		}
	},

	/**
	 * List commented posts (posts with comments)
	 */
	async listCommentedPosts(params?: {
		accountId?: string;
		platform?: string;
		profileId?: string;
		limit?: number;
		cursor?: string;
	}): Promise<
		ApiResponse<{
			posts: Array<Record<string, unknown>>;
			pagination?: { hasMore: boolean; nextCursor: string | null };
		}>
	> {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.platform) searchParams.set("platform", params.platform);
		if (params?.profileId) searchParams.set("profileId", params.profileId);
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.cursor) searchParams.set("cursor", params.cursor);

		const endpoint = `/api/inbox/comments${
			searchParams.toString() ? `?${searchParams.toString()}` : ""
		}`;

		const result = await fetchApi<{
			posts: Array<Record<string, unknown>>;
			pagination?: { hasMore: boolean; nextCursor: string | null };
		}>(endpoint);

		if (result.error || !result.data) {
			return { data: null, error: result.error };
		}

		return {
			data: {
				posts: result.data.posts ?? [],
				pagination: result.data.pagination,
			},
			error: null,
		};
	},

	/**
	 * Get comments for a specific post
	 */
	async getPostComments(params: {
		postId: string;
		accountId: string;
		limit?: number;
		cursor?: string;
	}): Promise<
		ApiResponse<{
			comments: Array<Record<string, unknown>>;
			pagination?: { hasMore: boolean; nextCursor: string | null };
		}>
	> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.cursor) searchParams.set("cursor", params.cursor);

		const endpoint = `/api/inbox/comments/${params.postId}?${searchParams.toString()}`;

		const result = await fetchApi<{
			comments: Array<Record<string, unknown>>;
			pagination?: { hasMore: boolean; nextCursor: string | null };
		}>(endpoint);

		if (result.error || !result.data) {
			return { data: null, error: result.error };
		}

		return {
			data: {
				comments: result.data.comments ?? [],
				pagination: result.data.pagination,
			},
			error: null,
		};
	},

	/**
	 * Reply to a comment
	 */
	async replyToComment(params: {
		postId: string;
		accountId: string;
		message: string;
		commentId?: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(`/api/inbox/comments/${params.postId}`, {
			method: "POST",
			body: JSON.stringify({
				accountId: params.accountId,
				message: params.message,
				...(params.commentId && { commentId: params.commentId }),
			}),
		});
	},

	/**
	 * Delete a comment
	 */
	async deleteComment(params: {
		postId: string;
		accountId: string;
		commentId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);
		searchParams.set("commentId", params.commentId);

		return fetchApi(
			`/api/inbox/comments/${params.postId}?${searchParams.toString()}`,
			{ method: "DELETE" },
		);
	},

	/**
	 * Hide a comment
	 */
	async hideComment(params: {
		postId: string;
		commentId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);

		return fetchApi(
			`/api/inbox/comments/${params.postId}/${params.commentId}/hide?${searchParams.toString()}`,
			{ method: "POST" },
		);
	},

	/**
	 * Unhide a comment
	 */
	async unhideComment(params: {
		postId: string;
		commentId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);

		return fetchApi(
			`/api/inbox/comments/${params.postId}/${params.commentId}/hide?${searchParams.toString()}`,
			{ method: "DELETE" },
		);
	},

	/**
	 * Like a comment
	 */
	async likeComment(params: {
		postId: string;
		commentId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);

		return fetchApi(
			`/api/inbox/comments/${params.postId}/${params.commentId}/like?${searchParams.toString()}`,
			{ method: "POST" },
		);
	},

	/**
	 * Unlike a comment
	 */
	async unlikeComment(params: {
		postId: string;
		commentId: string;
		accountId: string;
	}): Promise<ApiResponse<{ success: boolean }>> {
		const searchParams = new URLSearchParams();
		searchParams.set("accountId", params.accountId);

		return fetchApi(
			`/api/inbox/comments/${params.postId}/${params.commentId}/like?${searchParams.toString()}`,
			{ method: "DELETE" },
		);
	},

	/**
	 * Send private reply to comment author
	 */
	async sendPrivateReply(params: {
		postId: string;
		commentId: string;
		accountId: string;
		message: string;
		quickReplies?: string[];
		buttons?: Array<{
			type: "postback" | "url";
			title: string;
			payload?: string;
			url?: string;
		}>;
	}): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(
			`/api/inbox/comments/${params.postId}/${params.commentId}/private-reply`,
			{
				method: "POST",
				body: JSON.stringify({
					accountId: params.accountId,
					message: params.message,
					...(params.quickReplies && { quickReplies: params.quickReplies }),
					...(params.buttons && { buttons: params.buttons }),
				}),
			},
		);
	},
};
