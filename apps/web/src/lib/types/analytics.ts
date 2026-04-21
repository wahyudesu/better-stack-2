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
	{ key: "engagements", label: "Total Engagements", change: "+18.2%" },
	{ key: "impressions", label: "Impressions", change: "+24.5%" },
	{ key: "followerGrowth", label: "New Followers", change: "+12.8%" },
	{ key: "clicks", label: "Link Clicks", change: "+8.4%" },
	{ key: "shares", label: "Shares", change: "+15.3%" },
	{ key: "saves", label: "Saves", change: "+22.1%" },
] as const;

export type StatKey = (typeof STAT_DEFINITIONS)[number]["key"];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate engagement rate from metrics.
 */
export function calculateEngagementRate(
	likes: number,
	comments: number,
	shares: number,
	views: number,
): number {
	if (views === 0) return 0;
	return ((likes + comments + shares) / views) * 100;
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
