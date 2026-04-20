/**
 * Unified Platform enum for all social media platforms.
 * Consolidates: ProfilePlatform, SocialMediaPlatform, Platform (AI)
 *
 * @see social.ts - for profile-specific platform type
 * @see platform.ts - for AI content generation platform config
 */

export const PLATFORMS = [
	"instagram",
	"tiktok",
	"twitter",
	"linkedin",
	"youtube",
	"facebook",
	"pinterest",
	"threads",
] as const;

export type UnifiedPlatform = (typeof PLATFORMS)[number];

/**
 * All platforms supported for content publishing.
 * Includes threads as AI-generated content target.
 */
export type ContentPlatform = Extract<
	UnifiedPlatform,
	| "instagram"
	| "tiktok"
	| "twitter"
	| "linkedin"
	| "youtube"
	| "facebook"
	| "pinterest"
>;

/**
 * All platforms supported for profile connection.
 * Excludes threads (not a profile-based platform).
 */
export type ProfilePlatform = Extract<
	UnifiedPlatform,
	| "instagram"
	| "tiktok"
	| "twitter"
	| "linkedin"
	| "youtube"
	| "facebook"
	| "pinterest"
>;

/**
 * Platforms that support stories/ephemeral content.
 */
export const STORY_PLATFORMS: ProfilePlatform[] = ["instagram", "facebook"];

/**
 * Platforms that support carousels.
 */
export const CAROUSEL_PLATFORMS: ProfilePlatform[] = [
	"instagram",
	"facebook",
	"linkedin",
	"pinterest",
];

/**
 * Platforms that support video content.
 */
export const VIDEO_PLATFORMS: ProfilePlatform[] = [
	"tiktok",
	"youtube",
	"instagram",
	"facebook",
];

/**
 * Platform display metadata.
 */
export interface PlatformMeta {
	id: ProfilePlatform;
	name: string;
	icon: string;
	color: string;
	maxChars: number;
	supportsVideo: boolean;
	supportsCarousel: boolean;
	supportsStories: boolean;
}

export const PLATFORM_META: Record<ProfilePlatform, PlatformMeta> = {
	instagram: {
		id: "instagram",
		name: "Instagram",
		icon: "instagram",
		color: "#E1306C",
		maxChars: 2200,
		supportsVideo: true,
		supportsCarousel: true,
		supportsStories: true,
	},
	tiktok: {
		id: "tiktok",
		name: "TikTok",
		icon: "tiktok",
		color: "#000000",
		maxChars: 2200,
		supportsVideo: true,
		supportsCarousel: false,
		supportsStories: false,
	},
	twitter: {
		id: "twitter",
		name: "X (Twitter)",
		icon: "twitter",
		color: "#1DA1F2",
		maxChars: 280,
		supportsVideo: true,
		supportsCarousel: false,
		supportsStories: false,
	},
	linkedin: {
		id: "linkedin",
		name: "LinkedIn",
		icon: "linkedin",
		color: "#0A66C2",
		maxChars: 3000,
		supportsVideo: true,
		supportsCarousel: true,
		supportsStories: false,
	},
	youtube: {
		id: "youtube",
		name: "YouTube",
		icon: "youtube",
		color: "#FF0000",
		maxChars: 5000,
		supportsVideo: true,
		supportsCarousel: false,
		supportsStories: false,
	},
	facebook: {
		id: "facebook",
		name: "Facebook",
		icon: "facebook",
		color: "#1877F2",
		maxChars: 63206,
		supportsVideo: true,
		supportsCarousel: true,
		supportsStories: true,
	},
	pinterest: {
		id: "pinterest",
		name: "Pinterest",
		icon: "pinterest",
		color: "#E60023",
		maxChars: 500,
		supportsVideo: true,
		supportsCarousel: true,
		supportsStories: false,
	},
};
