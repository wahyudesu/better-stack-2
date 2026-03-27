/**
 * Social Media Profile, Content Post, and Analytics Types
 *
 * Centralized data structure for dashboard and calendar features.
 * Designed to work with Convex backend in the future.
 *
 * @see CLAUDE.md - Data Structure Documentation
 */

// ============================================================
// 1. SOCIAL MEDIA PROFILE
// ============================================================

/**
 * Social media platforms supported for profile connection.
 * Each profile is connected to ONE platform.
 */
export type ProfilePlatform =
	| "instagram"
	| "tiktok"
	| "twitter"
	| "linkedin"
	| "youtube"
	| "facebook"
	| "pinterest";

/**
 * Connection status of a social media profile.
 */
export type ProfileStatus = "active" | "disconnected" | "error" | "pending";

/**
 * Social media profile connected to the app.
 * One user can have multiple profiles (multi-profile support).
 */
export interface SocialMediaProfile {
	/** Unique identifier for the profile */
	id: string;

	/** Platform this profile is connected to */
	platform: ProfilePlatform;

	/** Display name of the account */
	name: string;

	/** Username/handle (e.g., "@username") */
	username: string;

	/** Profile avatar/picture URL */
	avatarUrl?: string;

	/** Current connection status */
	status: ProfileStatus;

	/** When this profile was connected */
	connectedAt: Date;

	/** Last sync/fetch timestamp (for analytics) */
	lastSyncAt?: Date;

	/** Platform-specific user ID (from API) */
	platformUserId?: string;

	/** Error message if status is 'error' */
	errorMessage?: string;
}

// ============================================================
// 2. CONTENT POST
// ============================================================

/**
 * Status workflow for content posts.
 * Flow: draft → review → scheduled → published
 *                              ↓
 *                            failed
 */
export type PostStatus =
	| "draft" // Initial state, editable
	| "review" // Pending approval
	| "scheduled" // Scheduled to publish
	| "publishing" // Currently being published
	| "published" // Successfully published
	| "failed" // Publish failed
	| "cancelled"; // Cancelled before publish

/**
 * Media attachment type.
 */
export type MediaType = "image" | "video";

/**
 * Media attachment for a post.
 */
export interface PostMedia {
	/** URL of the media file */
	url: string;

	/** Media type */
	type: MediaType;

	/** Alt text/caption for accessibility */
	alt?: string;

	/** Optional thumbnail URL (for videos) */
	thumbnailUrl?: string;
}

/**
 * Content post that can be published to multiple platforms.
 * Supports cross-posting to multiple platforms at once.
 */
export interface ContentPost {
	/** Unique identifier for the post */
	id: string;

	/** Post title/subject (for internal reference) */
	title: string;

	/** Main content/caption text */
	content: string;

	/** Media attachments (images, videos) */
	media: PostMedia[];

	/**
	 * Target platforms for this post.
	 * Can be multiple platforms (cross-posting).
	 */
	platforms: ProfilePlatform[];

	/** Reference to the social media profile(s) to use */
	profileIds: string[];

	/** When this post was created */
	createdAt: Date;

	/** When this post was last updated */
	updatedAt: Date;

	/** Current status in the workflow */
	status: PostStatus;

	/** Scheduled publish date (if applicable) */
	scheduledAt?: Date;

	/** Actual published date (if published) */
	publishedAt?: Date;

	/** Error message if status is 'failed' */
	errorMessage?: string;

	/** Hashtags for the post */
	hashtags?: string[];

	/** Call-to-action text */
	cta?: string;

	/** Notes for internal/team reference */
	notes?: string;

	/** Platform-specific published post IDs (mapped by platform) */
	platformPostIds?: Partial<Record<ProfilePlatform, string>>;
}

// ============================================================
// 3. ANALYTICS PER POST PER PLATFORM
// ============================================================

/**
 * Analytics metrics for a single post on a specific platform.
 * One post can have multiple analytics records (one per platform).
 */
export interface PostAnalytics {
	/** Unique identifier for this analytics record */
	id: string;

	/** Reference to the content post */
	postId: string;

	/** Platform this analytics is for */
	platform: ProfilePlatform;

	/** Reference to the social media profile */
	profileId: string;

	/** When this analytics data was fetched */
	fetchedAt: Date;

	// ===== Metrics =====

	/** Views/impressions count */
	views?: number;

	/** Likes count */
	likes?: number;

	/** Comments count */
	comments?: number;

	/** Shares/retweets count */
	shares?: number;

	/** Clicks/link clicks count */
	clicks?: number;

	/** Saves/bookmarks count (platform-specific) */
	saves?: number;

	/** Calculated engagement rate */
	engagementRate?: number;

	/**
	 * Platform-specific additional metrics.
	 * Use this for metrics unique to certain platforms.
	 */
	extraMetrics?: Record<string, number | string>;
}

// ============================================================
// 4. CALENDAR / DASHBOARD VIEW MODELS
// ============================================================

/**
 * Combined view model for calendar display.
 * Combines post with its analytics summary.
 */
export interface CalendarPostItem {
	post: ContentPost;
	/** Analytics summary across all platforms */
	analytics?: PostAnalytics[];
	/** Total engagement across all platforms */
	totalEngagement?: number;
}

/**
 * Combined view model for dashboard display.
 * Shows post performance overview.
 */
export interface DashboardPostItem {
	post: ContentPost;
	/** Best performing platform */
	bestPlatform?: ProfilePlatform;
	/** Total views across all platforms */
	totalViews?: number;
	/** Total engagement across all platforms */
	totalEngagement?: number;
	/** Engagement percentage */
	engagementPercent?: number;
}
