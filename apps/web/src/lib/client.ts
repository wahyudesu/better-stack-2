import { useAuthStore } from "@/stores";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

interface ApiResponse<T> {
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

		const data = await response.json() as { error?: string };

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
	get: <T>(path: string) => fetchApi<T>(path),
	post: <T>(path: string, body: unknown) =>
		fetchApi<T>(path, { method: "POST", body: JSON.stringify(body) }),
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
	text: string;
	profileId: string;
	socialAccountIds: string[];
	scheduledAt?: string;
	publishedAt?: string;
	media?: Array<{ url: string; type?: string; altText?: string }>;
	thread?: Array<{ text: string; media?: Array<{ url: string }> }>;
	status: "draft" | "scheduled" | "published" | "failed" | "cancelled";
	platformPostIds?: Record<string, string>;
	createdAt: string;
	updatedAt: string;
}

export interface QueueItem {
	_id: string;
	post: Post;
	scheduledAt: string;
	status: "pending" | "processing" | "completed" | "failed";
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

export interface CreatePostBody {
	profileId: string;
	text: string;
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
	getAccountsHealth: (profileId?: string) => {
		const params = profileId ? `?profileId=${profileId}` : "";
		return http.get<any[]>(`/v1/accounts/health${params}`);
	},
	deleteAccount: (accountId: string) =>
		http.delete(`/v1/accounts/${accountId}`),
	getConnectUrl: (
		platform: string,
		profileId: string,
		redirectUrl: string,
		headless = true,
	) => {
		const params = new URLSearchParams({
			profileId,
			redirect_url: redirectUrl,
			headless: String(headless),
		});
		return http.get<{ url: string }>(`/v1/connect/${platform}?${params}`);
	},

	// Posts
	getPosts: (params?: {
		page?: number;
		limit?: number;
		profileId?: string;
	}) => {
		const searchParams = new URLSearchParams();
		if (params?.page) searchParams.set("page", String(params.page));
		if (params?.limit) searchParams.set("limit", String(params.limit));
		if (params?.profileId) searchParams.set("profileId", params.profileId);
		const query = searchParams.toString();
		return http.get<{ posts: Post[] }>(`/v1/posts${query ? `?${query}` : ""}`);
	},
	getPost: (postId: string) => http.get<Post>(`/v1/posts/${postId}`),
	createPost: (body: CreatePostBody) => http.post<Post>("/v1/posts", body),
	updatePost: (postId: string, body: Partial<Post>) =>
		http.patch<Post>(`/v1/posts/${postId}`, body),
	deletePost: (postId: string) => http.delete(`/v1/posts/${postId}`),
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
};
