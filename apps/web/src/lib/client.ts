/**
 * @deprecated Import types from @/lib/types/social instead
 * API calls should use @/hooks/use-zernio with Zernio SDK
 * This file kept for backward compat with code that imports { api } from @/lib/client
 */

export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
}

/**
 * @deprecated Use useZernio() hook and zernio.profiles.*, zernio.posts.*, etc.
 */
export const api = {
	getProfiles: () => ({ data: null, error: "Use SDK instead" }),
	getAccounts: () => ({ data: null, error: "Use SDK instead" }),
	getPosts: () => ({ data: null, error: "Use SDK instead" }),
	createPost: () => ({ data: null, error: "Use SDK instead" }),
	updatePost: () => ({ data: null, error: "Use SDK instead" }),
	deletePost: () => ({ data: null, error: "Use SDK instead" }),
	getPostAnalytics: () => ({ data: null, error: "Use SDK instead" }),
	listInboxConversations: () => ({ data: null, error: "Use SDK instead" }),
	getQueue: () => ({ data: null, error: "Use SDK instead" }),
	getUsageStats: () => ({ data: null, error: "Use SDK instead" }),
	listUsers: () => ({ data: null, error: "Use SDK instead" }),
	listSequences: () => ({ data: null, error: "Use SDK instead" }),
	listBroadcasts: () => ({ data: null, error: "Use SDK instead" }),
	getConnectUrl: () => ({ data: null, error: "Use SDK instead" }),
	listWebhooks: () => ({ data: null, error: "Use SDK instead" }),
	getAnalytics: () => ({ data: null, error: "Use SDK instead" }),
	listInboxComments: () => ({ data: null, error: "Use SDK instead" }),
	listInboxReviews: () => ({ data: null, error: "Use SDK instead" }),
	hideComment: () => ({ data: null, error: "Use SDK instead" }),
	privateReply: () => ({ data: null, error: "Use SDK instead" }),
	getQueueSlots: () => ({ data: null, error: "Use SDK instead" }),
	getWebhookSettings: () => ({ data: null, error: "Use SDK instead" }),
	listCommentAutomations: () => ({ data: null, error: "Use SDK instead" }),
	listContacts: () => ({ data: null, error: "Use SDK instead" }),
	getUsage: () => ({ data: null, error: "Use SDK instead" }),
} as any;

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
	profilePicture?: string | null;
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
	limits: { uploads: number; profiles: number };
	usage: { uploads: number; profiles: number };
}

export interface CommentAutomation {
	_id: string;
	profileId?: string;
	name: string;
	accountId: string;
	accountUsername?: string;
	platformPostId?: string;
	postId?: string;
	postTitle?: string;
	keywords?: string[];
	matchMode?: "contains" | "exact";
	dmMessage?: string;
	commentReply?: string;
	isActive: boolean;
	stats?: {
		triggered?: number;
		dmsSent?: number;
		dmsFailed?: number;
		uniqueContacts?: number;
	};
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
