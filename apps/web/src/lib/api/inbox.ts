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
	messages?: InboxMessage[];
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
	 * Update conversation status (e.g., mark as read, archive)
	 */
	async updateConversation(
		conversationId: string,
		body: { accountId: string; status?: "active" | "archived" },
	): Promise<ApiResponse<{ success: boolean }>> {
		return fetchApi(`/api/inbox/conversations/${conversationId}`, {
			method: "PATCH",
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
				messages: result.data.messages ?? [],
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
};
