/**
 * Platform-related types.
 * Merges platform types from dashboard.ts and ai-post.ts
 */

// ============================================================
// SOCIAL MEDIA PLATFORMS (from types/dashboard.ts)
// ============================================================

/**
 * Social media platforms supported by the application.
 */
export type SocialMediaPlatform =
	| "all"
	| "facebook"
	| "instagram"
	| "twitter"
	| "tiktok"
	| "youtube"
	| "linkedin"
	| "pinterest";

/**
 * Report types for analytics.
 */
export type ReportType = "overview" | "engagement" | "reach" | "impressions";

/**
 * Time range options for filtering data.
 */
export type TimeRange = "7d" | "14d" | "30d" | "90d" | "custom";

/**
 * Dashboard configuration state.
 */
export interface DashboardConfig {
	socialMedia: SocialMediaPlatform;
	type: ReportType;
	timeRange: TimeRange;
}

/**
 * Platform multiplier for metric calculations.
 */
export interface PlatformMultiplier {
	engagements: number;
	followers: number;
	impressions: number;
	likes: number;
	visits: number;
	replies: number;
}

/**
 * Stat item for dashboard cards.
 */
export interface StatItem {
	label: string;
	value: string;
	change: string;
}

/**
 * Chart data point.
 */
export interface ChartDataPoint {
	date: Date;
	engagements: number;
	followers: number;
}

/**
 * Geographic view type for demographics.
 */
export type GeoView = "country" | "region";

/**
 * Demographic view type.
 */
export type DemoView = "follower" | "viewer";

// ============================================================
// AI POST PLATFORMS (from types/ai-post.ts)
// ============================================================

export type Platform = "threads" | "linkedin" | "twitter" | "instagram" | "tiktok";
export type ContentType = "single" | "thread" | "carousel" | "video";
export type Tone = "professional" | "casual" | "inspirational" | "educational" | "friendly" | "storytelling";
export type ScriptGoal = "engagement" | "sales" | "branding" | "education" | "entertainment";

export interface ToneOption {
  value: Tone;
  label: string;
  color: string;
  shortDesc: string;
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  contentType: ContentType;
  tone: Tone;
  goal: ScriptGoal;
  content: string;
  hashtags: string[];
  cta: string;
  createdAt: Date;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
  maxChars: number;
  supports: ContentType[];
}
