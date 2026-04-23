/**
 * Analytics types for dashboard.
 * Separated from social.ts to enable different analytics views.
 */

import type { ProfilePlatform } from "./core/platform";

// ============================================================
// ANALYTICS AGGREGATE (for dashboard overview)
// ============================================================

/**
 * Aggregate analytics per platform.
 * Used for dashboard overview cards.
 */
export interface PlatformAnalytics {
	platform: ProfilePlatform;
	followers: number;
	engagement: number;
	posts: number;
	growth: number;
	/** Calculated fields */
	engagementRate?: number;
	avgLikesPerPost?: number;
	avgCommentsPerPost?: number;
}

/**
 * Content type performance analytics.
 */
export interface ContentTypeAnalytics {
	type: "Video" | "Image" | "Carousel" | "Text" | "Story";
	engagement: number;
	reach: number;
	count: number;
}

/**
 * Demographic data structure.
 */
export interface DemographicDataItem {
	country?: string;
	countryCode?: string; // ISO 3166-1 alpha-2
	region?: string;
	label?: string;
	users: number;
}

/**
 * API response type for demographics.
 * API: GET /v1/analytics/instagram/demographics
 * Response: { demographics: { age/gender: [{ dimension, value }] } }
 */
export interface DemographicApiItem {
	dimension: string;
	value: number;
}

// ============================================================
// API RESPONSE TYPES (mirror server response)
// ============================================================

/**
 * API response: GET /v1/analytics/daily-metrics
 * Response: { dailyData: [{ date, metrics: {...} }], platformBreakdown: [...] }
 */
export interface DailyMetricsApiResponse {
	dailyData: Array<{
		date: string;
		postCount: number;
		platforms: string[];
		metrics: {
			impressions: number;
			reach: number;
			likes: number;
			comments: number;
			shares: number;
			saves: number;
			clicks: number;
			views: number;
		};
	}>;
	platformBreakdown: Array<{
		platform: string;
		postCount: number;
		metrics: {
			impressions: number;
			reach: number;
			likes: number;
			comments: number;
			shares: number;
			saves: number;
			clicks: number;
			views: number;
		};
	}>;
}

/**
 * API response: GET /v1/analytics/best-time
 * Response: { slots: [{ day_of_week, hour, avg_engagement, post_count }] }
 */
export interface BestTimeSlot {
	day_of_week: string;
	hour: number;
	avg_engagement: number;
	post_count: number;
}

export interface BestTimeApiResponse {
	slots: BestTimeSlot[];
}

/**
 * API response: GET /v1/analytics (single post analytics)
 * Response: { postId, analytics: {...}, platformAnalytics: [...] }
 */
export interface PostAnalyticsApiResponse {
	postId: string;
	latePostId: string | null;
	status: string;
	content: string;
	scheduledFor: string;
	publishedAt: string;
	analytics: {
		impressions: number;
		reach: number;
		likes: number;
		comments: number;
		shares: number;
		saves: number;
		clicks: number;
		views: number;
		engagementRate: number;
	};
	platformAnalytics: Array<{
		platform: string;
		status: string;
		platformPostId: string;
		accountId: string;
		accountUsername: string;
		analytics: {
			impressions: number;
			reach: number;
			likes: number;
			comments: number;
			shares: number;
			saves: number;
			clicks: number;
			views: number;
			engagementRate: number;
		};
		syncStatus: string;
		platformPostUrl: string;
		errorMessage: string | null;
	}>;
	platform: string;
	platformPostUrl: string;
}

// ============================================================
// ANALYTICS TIME SERIES
// ============================================================

/**
 * Time series data point for charts.
 */
export interface TimeSeriesDataPoint {
	date: Date;
	value: number;
}

export interface EngagementTimeSeries {
	date: Date;
	likes: number;
	comments: number;
	shares: number;
	clicks: number;
	saves: number;
}

export interface FollowerTimeSeries {
	date: Date;
	followers: number;
	gained: number;
	lost: number;
}

// ============================================================
// ANALYTICS QUERY PARAMS
// ============================================================

export type TimeRange = "7d" | "14d" | "30d" | "90d" | "custom";

export type ReportType =
	| "overview"
	| "engagement"
	| "reach"
	| "impressions"
	| "demographics";

export interface AnalyticsQuery {
	platforms: ProfilePlatform[];
	timeRange: TimeRange;
	startDate?: Date;
	endDate?: Date;
	profileIds?: string[];
}

export interface AnalyticsResponse<T> {
	data: T;
	query: AnalyticsQuery;
	fetchedAt: Date;
}

// ============================================================
// TOP PERFORMING CONTENT
// ============================================================

/**
 * Top performing post for dashboard.
 */
export interface TopPerformingPost {
	id: string;
	platform: ProfilePlatform;
	content: string;
	likes: number;
	comments: number;
	shares: number;
	views: number;
	engagementRate: number;
	date: Date;
	/** Post analytics ID for drill-down */
	analyticsId?: string;
}

/**
 * Recent post item for analytics grid.
 * Matches API response shape from GET /v1/posts
 */
export interface RecentPostItem {
	id: string;
	platform: ProfilePlatform;
	content: string;
	date: Date;
	likes: number;
	comments: number;
	shares: number;
	views: number;
	engagementRate: number;
}

// ============================================================
// STAT CARDS (overview page)
// ============================================================

export interface StatCard {
	key: string;
	label: string;
	value: string | number;
	change: string;
	changeDirection: "up" | "down" | "neutral";
}

export const STAT_DEFINITIONS = [
	{ key: "impressions", label: "Impressions", change: "+0%" },
	{ key: "engagements", label: "Engagements", change: "+0%" },
	{ key: "likes", label: "Likes", change: "+0%" },
	{ key: "replies", label: "Replies", change: "+0%" },
	{ key: "shares", label: "Shares", change: "+0%" },
	{ key: "saves", label: "Saves", change: "+0%" },
] as const;

export type StatKey = (typeof STAT_DEFINITIONS)[number]["key"];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate total engagements from metrics.
 * Engagements = likes + comments + shares
 */
export function calculateEngagements(
	likes: number,
	comments: number,
	shares: number,
): number {
	return likes + comments + shares;
}

/**
 * Calculate percent change between current and previous period.
 * Returns positive for increase, negative for decrease.
 */
export function calculatePercentChange(
	current: number,
	previous: number,
): number {
	if (previous === 0) return current > 0 ? 100 : 0;
	return ((current - previous) / previous) * 100;
}

/**
 * Format percent change for display.
 */
export function formatPercentChange(percentChange: number): string {
	const sign = percentChange >= 0 ? "+" : "";
	return `${sign}${percentChange.toFixed(1)}%`;
}

/**
 * Format large numbers (e.g., 12500 -> "12.5K").
 */
export function formatMetric(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}
	return value.toString();
}
