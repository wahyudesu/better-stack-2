/**
 * Social media types: profiles, posts, analytics.
 * This is the main data structure for the app.
 */

import type { PostMedia } from "./content/media";
import type { PostStatus } from "./content/post-status";
import type { ProfilePlatform } from "./core/platform";

export interface ContentPost {
	id: string;
	title: string;
	content: string;
	media: PostMedia[];
	platforms: ProfilePlatform[];
	profileIds: string[];
	createdAt: Date;
	updatedAt: Date;
	status: PostStatus;
	scheduledAt?: Date;
	publishedAt?: Date;
	errorMessage?: string;
	hashtags?: string[];
	tags?: string[];
	cta?: string;
	notes?: string;
	platformPostIds?: Partial<Record<ProfilePlatform, string>>;
}

// ============================================================
// 3. ANALYTICS PER POST PER PLATFORM
// ============================================================

export interface PostAnalytics {
	id: string;
	postId: string;
	platform: ProfilePlatform;
	profileId: string;
	fetchedAt: Date;
	views?: number;
	likes?: number;
	comments?: number;
	shares?: number;
	clicks?: number;
	saves?: number;
	engagementRate?: number;
	extraMetrics?: Record<string, number | string>;
}
