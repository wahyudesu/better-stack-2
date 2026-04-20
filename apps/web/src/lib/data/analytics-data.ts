/**
 * Static data for dashboard analytics.
 * All analytics aggregate data lives here.
 * Per-post analytics live in social-data.ts.
 */

import type {
	ContentTypeAnalytics,
	DemographicDataItem,
	PlatformAnalytics,
	TopPerformingPost,
} from "@/lib/types";
import { STAT_DEFINITIONS } from "@/lib/types/analytics";

// ============================================================
// PLATFORM ANALYTICS
// ============================================================

export const platformAnalyticsData: readonly PlatformAnalytics[] = [
	{
		platform: "instagram",
		followers: 45000,
		engagement: 4.2,
		posts: 128,
		growth: 12.5,
	},
	{
		platform: "twitter",
		followers: 28000,
		engagement: 3.8,
		posts: 342,
		growth: 8.3,
	},
	{
		platform: "tiktok",
		followers: 62000,
		engagement: 6.1,
		posts: 89,
		growth: 24.7,
	},
	{
		platform: "linkedin",
		followers: 15000,
		engagement: 2.9,
		posts: 67,
		growth: 5.2,
	},
	{
		platform: "youtube",
		followers: 38000,
		engagement: 5.4,
		posts: 45,
		growth: 15.8,
	},
	{
		platform: "facebook",
		followers: 22000,
		engagement: 2.1,
		posts: 156,
		growth: 3.1,
	},
] as const;

// ============================================================
// CONTENT TYPE PERFORMANCE
// ============================================================

export const contentTypeData: readonly ContentTypeAnalytics[] = [
	{ type: "Video", engagement: 6.8, reach: 125000, count: 45 },
	{ type: "Image", engagement: 4.2, reach: 89000, count: 128 },
	{ type: "Carousel", engagement: 5.5, reach: 95000, count: 32 },
	{ type: "Text", engagement: 2.1, reach: 45000, count: 234 },
	{ type: "Story", engagement: 7.2, reach: 67000, count: 89 },
] as const;

// ============================================================
// DEMOGRAPHICS
// ============================================================

export const ageData: readonly DemographicDataItem[] = [
	{ label: "18-24", users: 28 },
	{ label: "25-34", users: 35 },
	{ label: "35-44", users: 22 },
	{ label: "45-54", users: 10 },
	{ label: "55+", users: 5 },
];

export const genderData: readonly DemographicDataItem[] = [
	{ label: "Male", users: 45 },
	{ label: "Female", users: 52 },
	{ label: "Other", users: 3 },
];

export const countryData: readonly DemographicDataItem[] = [
	{ country: "Indonesia", countryCode: "ID", users: 3500 },
	{ country: "United States", countryCode: "US", users: 2800 },
	{ country: "Japan", countryCode: "JP", users: 1900 },
	{ country: "Singapore", countryCode: "SG", users: 1200 },
	{ country: "Malaysia", countryCode: "MY", users: 850 },
	{ country: "Thailand", countryCode: "TH", users: 720 },
	{ country: "Philippines", countryCode: "PH", users: 580 },
	{ country: "Vietnam", countryCode: "VN", users: 450 },
] as const;

export const regionData: readonly DemographicDataItem[] = [
	{ region: "Jakarta", users: 2100 },
	{ region: "Surabaya", users: 1400 },
	{ region: "Bandung", users: 980 },
	{ region: "Bali", users: 720 },
	{ region: "Medan", users: 580 },
	{ region: "Semarang", users: 490 },
	{ region: "Yogyakarta", users: 380 },
	{ region: "Makassar", users: 290 },
] as const;

// ============================================================
// TOP PERFORMING POSTS
// ============================================================

export const topPosts: readonly TopPerformingPost[] = [
	{
		id: "post-1",
		platform: "tiktok",
		content: "Day in the life of a startup founder! #startuplife",
		likes: 45200,
		comments: 1890,
		shares: 3200,
		views: 520000,
		engagementRate: 9.6,
		date: new Date("2026-03-18"),
	},
	{
		id: "post-2",
		platform: "instagram",
		content: "Behind the scenes at our office! Team work makes the dream work",
		likes: 12300,
		comments: 456,
		shares: 234,
		views: 89000,
		engagementRate: 14.4,
		date: new Date("2026-03-15"),
	},
	{
		id: "post-3",
		platform: "twitter",
		content: "Excited to announce our new product launch! 🚀",
		likes: 8900,
		comments: 234,
		shares: 1200,
		views: 125000,
		engagementRate: 8.3,
		date: new Date("2026-03-12"),
	},
	{
		id: "post-4",
		platform: "linkedin",
		content: "We're hiring! Join our growing team and build the future",
		likes: 2100,
		comments: 89,
		shares: 156,
		views: 45000,
		engagementRate: 5.0,
		date: new Date("2026-03-10"),
	},
] as const;

// ============================================================
// FILTER OPTIONS (shared across components)
// ============================================================

export const socialMediaOptions = [
	{ value: "all", label: "All Platforms" },
	{ value: "instagram", label: "Instagram" },
	{ value: "twitter", label: "Twitter/X" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "youtube", label: "YouTube" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "facebook", label: "Facebook" },
] as const;

export const timeOptions = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "14d", label: "Last 14 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
] as const;

// ============================================================
// TYPE EXPORTS
// ============================================================

export type PlatformDataItem = (typeof platformAnalyticsData)[number];
export type ContentTypeDataItem = (typeof contentTypeData)[number];
export type TopPostItem = (typeof topPosts)[number];

// Backward compatibility aliases
export const platformData = platformAnalyticsData;
export { STAT_DEFINITIONS };
