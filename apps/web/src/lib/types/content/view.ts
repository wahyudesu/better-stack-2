/**
 * Calendar and Dashboard view models.
 * Combines posts with analytics for display.
 */

import type { ProfilePlatform } from "../core/platform";
import type { ContentPost, PostAnalytics } from "../social";

// ============================================================
// CALENDAR VIEW
// ============================================================

/**
 * Combined view model for calendar display.
 */
export interface CalendarPostItem {
	post: ContentPost;
	/** Analytics summary across all platforms */
	analytics?: PostAnalytics[];
	/** Total engagement across all platforms */
	totalEngagement?: number;
	/** Best performing platform */
	bestPlatform?: ProfilePlatform;
}

// ============================================================
// DASHBOARD VIEW
// ============================================================

/**
 * Combined view model for dashboard display.
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

// ============================================================
// QUEUE VIEW
// ============================================================

/**
 * Queue item for scheduler view.
 */
export interface QueueItem {
	post: ContentPost;
	/** Scheduled time formatted for display */
	scheduledTime: string;
	/** Status label for display */
	statusLabel: string;
	/** Platforms formatted for display */
	platformLabels: string[];
	/** Whether it's overdue */
	isOverdue: boolean;
}

// ============================================================
// BULK ACTIONS
// ============================================================

export interface BulkActionResult {
	success: string[];
	failed: Array<{ id: string; error: string }>;
}

/**
 * Result of publishing multiple posts.
 */
export interface PublishResult {
	postId: string;
	platform: ProfilePlatform;
	success: boolean;
	platformPostId?: string;
	error?: string;
}
