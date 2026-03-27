/**
 * Content and post-related types.
 */

import type {
	ContentType,
	GeneratedPost,
	Platform,
	ScriptGoal,
	Tone,
} from "./platform";

// Re-export AI post types
export type {
	ContentType,
	GeneratedPost,
	Platform,
	ScriptGoal,
	Tone,
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
