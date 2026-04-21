// Zernio API types extracted from OpenAPI spec

export interface Profile {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Account {
	_id: string;
	profileId: string;
	platform: Platform;
	platformAccountId: string;
	username: string;
	displayName: string;
	avatarUrl?: string;
	status: "active" | "disconnected" | "error";
	connectedAt: string;
	lastSyncAt?: string;
	errorMessage?: string;
}

export type Platform =
	| "instagram"
	| "tiktok"
	| "twitter"
	| "facebook"
	| "youtube"
	| "linkedin"
	| "pinterest"
	| "reddit"
	| "bluesky"
	| "threads"
	| "telegram"
	| "whatsapp"
	| "discord"
	| "googlebusiness"
	| "snapchat";

export interface Post {
	_id: string;
	profileId: string;
	text: string;
	media?: PostMedia[];
	socialAccountIds: string[];
	status: PostStatus;
	scheduledAt?: string;
	publishedAt?: string;
	errorMessage?: string;
	platformPostIds?: Record<Platform, string>;
	createdAt: string;
	updatedAt: string;
}

export type PostStatus =
	| "draft"
	| "review"
	| "scheduled"
	| "publishing"
	| "published"
	| "failed"
	| "cancelled";

export interface PostMedia {
	url: string;
	type: "image" | "video";
	thumbnailUrl?: string;
	alt?: string;
}

export interface QueueSlot {
	slotId: string;
	datetime: string;
	duration: number;
	available: boolean;
}

export interface Analytics {
	summary: AnalyticsSummary;
	dailyMetrics?: DailyMetric[];
	bestTimes?: BestTime[];
	followerStats?: FollowerStats;
}

export interface AnalyticsSummary {
	totalViews: number;
	totalLikes: number;
	totalComments: number;
	totalShares: number;
	totalClicks: number;
	engagementRate: number;
}

export interface DailyMetric {
	date: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	clicks: number;
}

export interface BestTime {
	dayOfWeek: number; // 0-6
	hour: number; // 0-23
	engagementScore: number;
}

export interface FollowerStats {
	platform: Platform;
	followers: number;
	change: number;
	changePercent: number;
}

export interface InboxConversation {
	_id: string;
	accountId: string;
	platform: Platform;
	type: "dm" | "comment" | "review";
	participant: {
		id: string;
		username: string;
		displayName: string;
		avatarUrl?: string;
	};
	lastMessage?: {
		text: string;
		timestamp: string;
		isFromMe: boolean;
	};
	unreadCount: number;
}

export interface InboxMessage {
	_id: string;
	conversationId: string;
	text: string;
	media?: PostMedia[];
	timestamp: string;
	isFromMe: boolean;
	platformMessageId?: string;
}

export interface InboxComment {
	_id: string;
	accountId: string;
	postId: string;
	postPlatformPostId?: string;
	platform: Platform;
	author: {
		id: string;
		username: string;
		displayName: string;
		avatarUrl?: string;
	};
	text: string;
	media?: PostMedia[];
	timestamp: string;
	status: "new" | "read" | "replied" | "hidden";
}

export interface InboxReview {
	_id: string;
	accountId: string;
	platform: Platform;
	author: {
		id: string;
		name: string;
		avatarUrl?: string;
	};
	rating: number;
	text: string;
	timestamp: string;
	status: "new" | "read" | "replied";
}

export interface UsageStats {
	planName: string;
	billingPeriod: "monthly" | "yearly";
	signupDate: string;
	billingAnchorDay: number;
	limits: {
		uploads: number;
		profiles: number;
		accounts?: number;
		posts?: number;
	};
	usage: {
		uploads: number;
		profiles: number;
		accounts?: number;
		posts?: number;
		lastReset: string;
	};
	hasAccess: boolean;
	suspendedAt?: string;
	isInvitedUser: boolean;
	isRestrictedUser: boolean;
	isAppSumo: boolean;
	autoUpgradeEnabled: boolean;
}

export interface MediaUpload {
	url: string;
	mediaId: string;
}

export interface ValidationResult {
	valid: boolean;
	errors?: string[];
	warnings?: string[];
}
