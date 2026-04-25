import { useAuthStore } from "@/stores";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

async function fetchApi<T>(
	path: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> {
	const apiKey = useAuthStore.getState().apiKey;

	if (!apiKey) {
		return { data: null, error: "Not authenticated" };
	}

	try {
		const response = await fetch(`${API_BASE_URL}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
				...options.headers,
			},
		});

		const data = (await response.json()) as { error?: string };

		if (!response.ok) {
			return {
				data: null,
				error: data.error || `Request failed with status ${response.status}`,
			};
		}

		return { data: data as T, error: null };
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

// Generic HTTP methods
const http = {
	get: <T>(
		path: string,
		opts?: {
			query?: Record<string, string | number | boolean | undefined>;
			headers?: Record<string, string>;
		},
	) => {
		let finalPath = path;
		if (opts?.query) {
			const searchParams = new URLSearchParams();
			for (const [key, value] of Object.entries(opts.query)) {
				if (value !== undefined) searchParams.set(key, String(value));
			}
			const qs = searchParams.toString();
			if (qs) finalPath = `${path}?${qs}`;
		}
		return fetchApi<T>(
			finalPath,
			opts?.headers ? { headers: opts.headers } : {},
		);
	},
	post: <T>(
		path: string,
		body: unknown,
		options?: { headers?: Record<string, string> },
	) =>
		fetchApi<T>(path, {
			method: "POST",
			body: JSON.stringify(body),
			headers: options?.headers,
		}),
	patch: <T>(path: string, body: unknown) =>
		fetchApi<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
	delete: <T>(path: string) => fetchApi<T>(path, { method: "DELETE" }),
};

// Type definitions matching Zernio API
export interface Profile {
	_id: string;
	name: string;
	description?: string;
	createdAt: string;
	updatedAt: string;
}

export interface SocialAccount {
	_id: string;
	platform: string;
	username: string;
	displayName?: string;
	isActive: boolean;
	profilePicture?: string;
	profileId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Post {
	_id: string;
	title?: string;
	text?: string;
	content?: string;
	profileId: string;
	socialAccountIds: string[];
	scheduledAt?: string;
	publishedAt?: string;
	media?: Array<{ url: string; type?: string; altText?: string }>;
	mediaItems?: Array<{ url: string; type?: string }>;
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>;
	status: "draft" | "scheduled" | "published" | "failed" | "cancelled";
	platformPostIds?: Record<string, string>;
	platforms?: Array<{
		platform: string;
		status: string;
		platformPostId?: string;
		platformPostUrl?: string;
	}>;
	createdAt: string;
	updatedAt: string;
}

export interface QueueItem {
	_id: string;
	post: Post;
	scheduledAt: string;
	status: "pending" | "processing" | "completed" | "failed";
}

export interface QueueSlot {
	_id: string;
	profileId: string;
	dayOfWeek: number;
	time: string;
	repeatEnabled: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface MediaItem {
	_id: string;
	url: string;
	type: "image" | "video";
	filename?: string;
	mimeType?: string;
	size?: number;
	width?: number;
	height?: number;
	createdAt: string;
}

export interface PresignedUrl {
	uploadUrl: string;
	fileUrl: string;
	fields?: Record<string, string>;
}

export interface PostAnalytics {
	postId: string;
	platform: string;
	likes: number;
	comments: number;
	shares: number;
	impressions: number;
	engagement: number;
}

export interface AccountHealth {
	accountId: string;
	isHealthy: boolean;
	error?: string;
}

export interface UsageStats {
	planName: string;
	limits: {
		uploads: number;
		profiles: number;
	};
	usage: {
		uploads: number;
		profiles: number;
	};
}

export interface CommentAutomation {
	_id: string;
	name: string;
	accountId: string;
	accountUsername?: string;
	keywords?: string[];
	autoReply?: string;
	assignTo?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
}

export interface CreatePostBody {
	profileId: string;
	content: string;
	socialAccountIds: string[];
	scheduledAt?: string;
	media?: Array<{ url: string; type?: string; altText?: string }>;
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>;
}

// Typed API methods - replaces use-zernio wrapper
export const api = {
	// Profiles
	getProfiles: () => http.get<{ profiles: Profile[] }>("/v1/profiles"),
	getProfile: (profileId: string) =>
		http.get<Profile>(`/v1/profiles/${profileId}`),
	createProfile: (body: { name: string; description?: string }) =>
		http.post<Profile>("/v1/profiles", body),
	updateProfile: (
		profileId: string,
		body: { name?: string; timezone?: string },
	) => http.patch<Profile>(`/v1/profiles/${profileId}`, body),

	// Accounts
	getAccounts: (profileId?: string) => {
		const params = profileId ? `?profileId=${profileId}` : "";
		return http.get<{ accounts: SocialAccount[] }>(`/v1/accounts${params}`);
	},
	getAccountHealth: (accountId: string) => {
		return http.get<AccountHealth>(`/v1/accounts/${accountId}/health`);
	},
	deleteAccount: (accountId: string) =>
		http.delete(`/v1/accounts/${accountId}`),

	// Connect — OAuth platforms
	// GET /v1/connect/{platform}?profileId=... -> returns { authUrl }
	// Platform list: twitter, instagram, facebook, linkedin, tiktok, youtube, pinterest,
	//                reddit, bluesky, threads, googlebusiness, telegram, snapchat, whatsapp, discord
	getConnectUrl: (data: { platform: string; profileId: string }) => {
		return http.get<{ authUrl: string }>(
			`/v1/connect/${data.platform}?profileId=${data.profileId}`,
		);
	},

	// OAuth callback — handled by redirect, no explicit frontend call needed
	// The server handles the callback and redirects back to redirectUrl

	// Headless mode selection (after OAuth completes, use connectToken)
	listFacebookPages: (data: { connectToken: string; accountId?: string }) => {
		const q = data.accountId ? `?accountId=${data.accountId}` : "";
		return http.get<any>(`/v1/connect/facebook/pages${q}`, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	selectFacebookPage: (data: {
		connectToken: string;
		pageId: string;
		accountId?: string;
	}) => {
		return http.post<any>("/v1/connect/facebook/select-page", data, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	listGoogleBusinessLocations: (data: {
		connectToken: string;
		accountId?: string;
	}) => {
		const q = data.accountId ? `?accountId=${data.accountId}` : "";
		return http.get<any>(`/v1/connect/googlebusiness/locations${q}`, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	selectGoogleBusinessLocation: (data: {
		connectToken: string;
		locationId: string;
		accountId?: string;
	}) => {
		return http.post<any>("/v1/connect/googlebusiness/select-location", data, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	listLinkedInOrganizations: (data: {
		connectToken: string;
		accountId?: string;
	}) => {
		const q = data.accountId ? `?accountId=${data.accountId}` : "";
		return http.get<any>(`/v1/connect/linkedin/organizations${q}`, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	selectLinkedInOrganization: (data: {
		connectToken: string;
		organizationId: string;
		accountId?: string;
	}) => {
		return http.post<any>("/v1/connect/linkedin/select-organization", data, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	listPinterestBoards: (data: { connectToken: string; accountId?: string }) => {
		const q = data.accountId ? `?accountId=${data.accountId}` : "";
		return http.get<any>(`/v1/connect/pinterest/boards${q}`, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	selectPinterestBoard: (data: {
		connectToken: string;
		boardId: string;
		accountId?: string;
	}) => {
		return http.post<any>("/v1/connect/pinterest/select-board", data, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	listSnapchatProfiles: (data: {
		connectToken: string;
		accountId?: string;
	}) => {
		const q = data.accountId ? `?accountId=${data.accountId}` : "";
		return http.get<any>(`/v1/connect/snapchat/profiles${q}`, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},
	selectSnapchatProfile: (data: {
		connectToken: string;
		profileId: string;
		accountId?: string;
	}) => {
		return http.post<any>("/v1/connect/snapchat/select-profile", data, {
			headers: { "X-Connect-Token": data.connectToken },
		});
	},

	// Non-OAuth platforms
	connectBluesky: (data: {
		profileId: string;
		identifier: string;
		password: string;
	}) => {
		return http.post<any>("/v1/connect/bluesky/credentials", data);
	},
	connectWhatsApp: (data: {
		profileId: string;
		phoneNumber?: string;
		businessAccountId?: string;
	}) => {
		return http.post<any>("/v1/connect/whatsapp/credentials", data);
	},
	initiateTelegram: (data: { profileId: string; phone: string }) => {
		return http.post<any>("/v1/connect/telegram/initiate", data);
	},
	getTelegramStatus: (data: { profileId: string }) => {
		return http.get<any>(
			`/v1/connect/telegram/status?profileId=${data.profileId}`,
		);
	},
	connectAds: (data: { platform: string; profileId: string }) => {
		return http.post<any>("/v1/connect/ads", data);
	},
	getPendingData: () => {
		return http.get<any>("/v1/connect/pending-data");
	},

	// Posts
	getPosts: (params?: {
		page?: number;
		limit?: number;
		profileId?: string;
		status?: "draft" | "scheduled" | "published" | "failed" | "cancelled";
		sortBy?:
			| "scheduled-desc"
			| "scheduled-asc"
			| "created-desc"
			| "created-asc";
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.profileId) searchParams.set("profileId", params.profileId);
		if (params?.status) searchParams.set("status", params.status);
		if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
		const query = searchParams.toString();
		return http.get<{ posts: Post[] }>(`/v1/posts${query ? `?${query}` : ""}`);
	},
	getPost: (postId: string) => http.get<Post>(`/v1/posts/${postId}`),
	createPost: (body: CreatePostBody) => http.post<Post>("/v1/posts", body),
	updatePost: (postId: string, body: Partial<Post>) =>
		http.patch<Post>(`/v1/posts/${postId}`, body),
	deletePost: (postId: string) => http.delete(`/v1/posts/${postId}`),
	queuePost: (body: CreatePostBody) => http.post<Post>("/v1/queue", body),
	bulkUploadPost: (body: { csvUrl: string; profileId?: string }) =>
		http.post<any>("/v1/posts/bulk-upload", body),
	editPost: (
		postId: string,
		body: { text?: string; media?: Array<{ url: string; type?: string }> },
	) => http.post<Post>(`/v1/posts/${postId}/edit`, body),
	updatePostMetadata: (postId: string, body: { metadata?: object }) =>
		http.patch<Post>(`/v1/posts/${postId}/update-metadata`, body),
	retryPost: (postId: string) =>
		http.post<Post>(`/v1/posts/${postId}/retry`, {}),
	unpublishPost: (postId: string) =>
		http.post<Post>(`/v1/posts/${postId}/unpublish`, {}),
	getPostLogs: (postId: string) => http.get<any>(`/v1/posts/${postId}/logs`),

	// Queue
	getQueue: (profileId?: string, limit?: number) => {
		const params = new URLSearchParams();
		if (profileId) params.set("profileId", profileId);
		if (limit) params.set("limit", String(limit));
		const query = params.toString();
		return http.get<{ items: QueueItem[] }>(
			`/v1/queue${query ? `?${query}` : ""}`,
		);
	},

	// Analytics
	getPostAnalytics: (postId: string) =>
		http.get<{ analytics: PostAnalytics[] }>(`/v1/analytics?postId=${postId}`),
	getAccountAnalytics: (params: {
		accountId: string;
		startDate?: string;
		endDate?: string;
	}) => {
		const searchParams = new URLSearchParams({ accountId: params.accountId });
		if (params.startDate) searchParams.set("startDate", params.startDate);
		if (params.endDate) searchParams.set("endDate", params.endDate);
		return http.get<any>(`/v1/analytics?${searchParams}`);
	},
	getDailyMetrics: (params: {
		accountId: string;
		metric?: string;
		startDate?: string;
		endDate?: string;
	}) => {
		const searchParams = new URLSearchParams({ accountId: params.accountId });
		if (params.metric) searchParams.set("metric", params.metric);
		if (params.startDate) searchParams.set("startDate", params.startDate);
		if (params.endDate) searchParams.set("endDate", params.endDate);
		return http.get<{ metrics: any[] }>(`/v1/analytics/daily?${searchParams}`);
	},
	getInstagramInsights: (params: {
		accountId: string;
		startDate?: string;
		endDate?: string;
	}) => {
		const searchParams = new URLSearchParams({ accountId: params.accountId });
		if (params.startDate) searchParams.set("startDate", params.startDate);
		if (params.endDate) searchParams.set("endDate", params.endDate);
		return http.get<any>(`/v1/analytics/instagram/insights?${searchParams}`);
	},
	getInstagramDemographics: (accountId: string) =>
		http.get<any>(
			`/v1/analytics/instagram/demographics?accountId=${accountId}`,
		),
	getYoutubeDailyViews: (params: {
		accountId: string;
		videoId: string;
		startDate?: string;
		endDate?: string;
	}) => {
		const searchParams = new URLSearchParams({
			accountId: params.accountId,
			videoId: params.videoId,
		});
		if (params.startDate) searchParams.set("startDate", params.startDate);
		if (params.endDate) searchParams.set("endDate", params.endDate);
		return http.get<any>(`/v1/analytics/youtube/daily?${searchParams}`);
	},
	getBestTime: (accountId: string) =>
		http.get<any>(`/v1/analytics/best-time?accountId=${accountId}`),
	getContentDecay: (accountId: string) =>
		http.get<any>(`/v1/analytics/content-decay?accountId=${accountId}`),
	getPostTimeline: (params: {
		accountId: string;
		postId?: string;
		startDate?: string;
		endDate?: string;
	}) => {
		const searchParams = new URLSearchParams({ accountId: params.accountId });
		if (params.postId) searchParams.set("postId", params.postId);
		if (params.startDate) searchParams.set("startDate", params.startDate);
		if (params.endDate) searchParams.set("endDate", params.endDate);
		return http.get<any>(`/v1/analytics/timeline?${searchParams}`);
	},

	// Usage
	getUsageStats: () =>
		http.get<{
			usage: { uploads: number; profiles: number };
			limits: { uploads: number; profiles: number };
			planName: string;
		}>("/v1/usage"),

	// Webhooks
	getWebhookSettings: () =>
		http.get<{ settings: any[] }>("/v1/webhooks/settings"),
	createWebhook: (data: {
		name: string;
		url: string;
		events: string[];
		secret?: string;
		customHeaders?: Record<string, string>;
	}) => http.post<any>("/v1/webhooks/settings", data),
	updateWebhook: (
		webhookId: string,
		data: {
			name?: string;
			url?: string;
			events?: string[];
			isActive?: boolean;
			customHeaders?: Record<string, string>;
		},
	) => http.patch<any>(`/v1/webhooks/settings/${webhookId}`, data),
	deleteWebhook: (webhookId: string) =>
		http.delete(`/v1/webhooks/settings/${webhookId}`),
	testWebhook: (webhookId: string) =>
		http.post<any>("/v1/webhooks/test", { webhookId }),
	getWebhookLogs: (params?: {
		webhookId?: string;
		event?: string;
		status?: string;
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.webhookId) searchParams.set("webhookId", params.webhookId);
		if (params?.event) searchParams.set("event", params.event);
		if (params?.status) searchParams.set("status", params.status);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ logs: any[] }>(
			`/v1/webhooks/logs${query ? `?${query}` : ""}`,
		);
	},

	// Inbox
	listConversations: (params?: {
		accountId?: string;
		platform?: string;
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.platform) searchParams.set("platform", params.platform);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ conversations: any[] }>(
			`/v1/inbox/conversations${query ? `?${query}` : ""}`,
		);
	},
	getConversation: (conversationId: string) =>
		http.get<any>(`/v1/inbox/conversations/${conversationId}`),
	listMessages: (
		conversationId: string,
		params?: { page?: number; limit?: number },
	) => {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ messages: any[] }>(
			`/v1/inbox/conversations/${conversationId}/messages${query ? `?${query}` : ""}`,
		);
	},
	sendMessage: (
		conversationId: string,
		body: { text: string; mediaUrl?: string },
	) =>
		http.post<any>(`/v1/inbox/conversations/${conversationId}/messages`, body),
	markAsRead: (conversationId: string) =>
		http.post(`/v1/inbox/conversations/${conversationId}/read`, {}),
	listComments: (params?: {
		accountId?: string;
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ comments: any[] }>(
			`/v1/inbox/comments${query ? `?${query}` : ""}`,
		);
	},
	hideComment: (postId: string, commentId: string) =>
		http.delete(`/v1/inbox/posts/${postId}/comments/${commentId}`),
	privateReply: (postId: string, commentId: string, body: { text: string }) =>
		http.post<any>(
			`/v1/inbox/posts/${postId}/comments/${commentId}/reply`,
			body,
		),
	listReviews: (params?: {
		accountId?: string;
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ reviews: any[] }>(
			`/v1/inbox/reviews${query ? `?${query}` : ""}`,
		);
	},
	replyToReview: (reviewId: string, body: { text: string }) =>
		http.post<any>(`/v1/inbox/reviews/${reviewId}/reply`, body),

	// Comment Automations
	listCommentAutomations: (params?: {
		accountId?: string;
		page?: number;
		limit?: number;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.accountId) searchParams.set("accountId", params.accountId);
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		const query = searchParams.toString();
		return http.get<{ automations: CommentAutomation[] }>(
			`/v1/comment-automations${query ? `?${query}` : ""}`,
		);
	},
	createCommentAutomation: (body: {
		name: string;
		accountId: string;
		keywords?: string[];
		autoReply?: string;
		assignTo?: string;
	}) => http.post<CommentAutomation>("/v1/comment-automations", body),
	updateCommentAutomation: (
		automationId: string,
		body: {
			name?: string;
			keywords?: string[];
			autoReply?: string;
			assignTo?: string;
			isActive?: boolean;
		},
	) =>
		http.patch<CommentAutomation>(
			`/v1/comment-automations/${automationId}`,
			body,
		),
	deleteCommentAutomation: (automationId: string) =>
		http.delete(`/v1/comment-automations/${automationId}`),

	// Sequences
	listSequences: (params?: {
		page?: number;
		limit?: number;
		status?: string;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.status) searchParams.set("status", params.status);
		const query = searchParams.toString();
		return http.get<{ sequences: any[] }>(
			`/v1/sequences${query ? `?${query}` : ""}`,
		);
	},
	createSequence: (body: {
		name: string;
		steps: Array<{ delay?: number; action?: string; templateId?: string }>;
	}) => http.post<any>("/v1/sequences", body),
	updateSequence: (
		sequenceId: string,
		body: { name?: string; steps?: any[] },
	) => http.patch<any>(`/v1/sequences/${sequenceId}`, body),
	deleteSequence: (sequenceId: string) =>
		http.delete(`/v1/sequences/${sequenceId}`),
	activateSequence: (sequenceId: string) =>
		http.post<any>(`/v1/sequences/${sequenceId}/activate`, {}),
	pauseSequence: (sequenceId: string) =>
		http.post<any>(`/v1/sequences/${sequenceId}/pause`, {}),

	// Broadcasts
	listBroadcasts: (
		accountId: string,
		params?: { page?: number; limit?: number },
	) => {
		const searchParams = new URLSearchParams({ accountId });
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		return http.get<{ broadcasts: any[] }>(`/v1/broadcasts?${searchParams}`);
	},
	createBroadcast: (body: {
		accountId: string;
		templateName: string;
		recipientIds?: string[];
		segmentFilter?: object;
	}) => http.post<any>("/v1/broadcasts", body),
	sendBroadcast: (broadcastId: string, accountId: string) =>
		http.post<any>(`/v1/broadcasts/${broadcastId}/send`, { accountId }),

	// Queue Slots
	listQueueSlots: (
		profileId: string,
		params?: { startDate?: string; endDate?: string },
	) => {
		const searchParams = new URLSearchParams({ profileId });
		if (params?.startDate) searchParams.set("startDate", params.startDate);
		if (params?.endDate) searchParams.set("endDate", params.endDate);
		return http.get<{ slots: QueueSlot[] }>(`/v1/queue/slots?${searchParams}`);
	},
	getQueueSlot: (slotId: string) =>
		http.get<QueueSlot>(`/v1/queue/slots/${slotId}`),
	createQueueSlot: (body: {
		profileId: string;
		dayOfWeek?: number;
		time?: string;
		repeatEnabled?: boolean;
	}) => http.post<QueueSlot>("/v1/queue/slots", body),
	updateQueueSlot: (
		slotId: string,
		body: { dayOfWeek?: number; time?: string; repeatEnabled?: boolean },
	) => http.patch<QueueSlot>(`/v1/queue/slots/${slotId}`, body),
	deleteQueueSlot: (slotId: string) => http.delete(`/v1/queue/slots/${slotId}`),
	previewQueue: (
		profileId: string,
		params?: { startDate?: string; endDate?: string },
	) => {
		const searchParams = new URLSearchParams({ profileId });
		if (params?.startDate) searchParams.set("startDate", params.startDate);
		if (params?.endDate) searchParams.set("endDate", params.endDate);
		return http.get<any>(`/v1/queue/preview?${searchParams}`);
	},
	nextQueueSlot: (profileId: string) =>
		http.get<{ slot: QueueSlot }>(`/v1/queue/next-slot?profileId=${profileId}`),

	// Media
	getPresignedUrl: (body: { filename: string; contentType: string }) =>
		http.post<PresignedUrl>("/v1/media/presign", body),
	getMedia: (mediaId: string) => http.get<MediaItem>(`/v1/media/${mediaId}`),

	// Tools - YouTube
	youtubeDownload: (params: {
		url: string;
		action?: "download" | "formats";
		format?: "video" | "audio";
		quality?: "hd" | "sd";
		formatId?: string;
	}) => http.get<any>(`/v1/tools/youtube/download`, { query: params }),
	youtubeTranscript: (params: { url: string; lang?: string }) =>
		http.get<any>(`/v1/tools/youtube/transcript`, { query: params }),

	// Tools - Instagram
	instagramDownload: (params: { url: string }) =>
		http.get<any>(`/v1/tools/instagram/download`, { query: params }),
	instagramHashtagChecker: (hashtags: string[]) =>
		http.post<any>("/v1/tools/instagram/hashtag-checker", { hashtags }),

	// Tools - TikTok
	tiktokDownload: (params: {
		url: string;
		action?: "download" | "formats";
		formatId?: string;
	}) => http.get<any>(`/v1/tools/tiktok/download`, { query: params }),

	// Tools - Twitter/X
	twitterDownload: (params: {
		url: string;
		action?: "download" | "formats";
		formatId?: string;
	}) => http.get<any>(`/v1/tools/twitter/download`, { query: params }),

	// Tools - Facebook
	facebookDownload: (params: { url: string }) =>
		http.get<any>(`/v1/tools/facebook/download`, { query: params }),

	// Tools - LinkedIn
	linkedinDownload: (params: { url: string }) =>
		http.get<any>(`/v1/tools/linkedin/download`, { query: params }),

	// Tools - Bluesky
	blueskyDownload: (params: { url: string }) =>
		http.get<any>(`/v1/tools/bluesky/download`, { query: params }),

	// Tools - Validation
	validatePostLength: (text: string) =>
		http.post<any>("/v1/tools/validate/post-length", { text }),
	validatePost: (data: {
		content?: string;
		platforms: Array<{ platform: string; customContent?: string }>;
	}) => http.post<any>("/v1/tools/validate/post", data),
	validateMedia: (data: { url: string; type?: string }) =>
		http.post<any>("/v1/tools/validate/media", data),
	validateSubreddit: (data: { subreddit: string }) =>
		http.post<any>("/v1/tools/validate/subreddit", data),
};
