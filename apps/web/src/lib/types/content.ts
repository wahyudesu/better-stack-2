/**
 * Content and post-related types.
 */

import type { GeneratedPost, Platform, ContentType, Tone, ScriptGoal } from "./platform";

// Re-export AI post types
export type {
	GeneratedPost,
	Platform,
	ContentType,
	Tone,
	ScriptGoal,
} from "./platform";

/**
 * Content status types.
 */
export type ContentStatus = "published" | "scheduled" | "draft" | "pending";

/**
 * Base content item interface.
 */
export interface ContentItem {
	id: string;
	title: string;
	description: string;
	status: ContentStatus;
	platform: string;
	scheduledAt?: Date;
	createdAt: Date;
}
