// Static data for analytics page - moved here to reduce bundle size
// and enable better code splitting

export const platformData = [
	{
		platform: "Instagram",
		followers: 45000,
		engagement: 4.2,
		posts: 128,
		growth: 12.5,
	},
	{
		platform: "Twitter/X",
		followers: 28000,
		engagement: 3.8,
		posts: 342,
		growth: 8.3,
	},
	{
		platform: "TikTok",
		followers: 62000,
		engagement: 6.1,
		posts: 89,
		growth: 24.7,
	},
	{
		platform: "LinkedIn",
		followers: 15000,
		engagement: 2.9,
		posts: 67,
		growth: 5.2,
	},
	{
		platform: "YouTube",
		followers: 38000,
		engagement: 5.4,
		posts: 45,
		growth: 15.8,
	},
	{
		platform: "Facebook",
		followers: 22000,
		engagement: 2.1,
		posts: 156,
		growth: 3.1,
	},
] as const;

export const contentTypeData = [
	{ type: "Video", engagement: 6.8, reach: 125000, count: 45 },
	{ type: "Image", engagement: 4.2, reach: 89000, count: 128 },
	{ type: "Carousel", engagement: 5.5, reach: 95000, count: 32 },
	{ type: "Text", engagement: 2.1, reach: 45000, count: 234 },
	{ type: "Story", engagement: 7.2, reach: 67000, count: 89 },
] as const;

export const ageData = [
	{ label: "18-24", value: 28 },
	{ label: "25-34", value: 35 },
	{ label: "35-44", value: 22 },
	{ label: "45-54", value: 10 },
	{ label: "55+", value: 5 },
];

export const genderData = [
	{ label: "Male", value: 45 },
	{ label: "Female", value: 52 },
	{ label: "Other", value: 3 },
];

export const topPosts = [
	{
		id: 1,
		platform: "TikTok",
		content: "Day in the life of a startup founder! #startuplife",
		likes: 45200,
		comments: 1890,
		shares: 3200,
		views: 520000,
		date: "Mar 18, 2024",
	},
	{
		id: 2,
		platform: "Instagram",
		content: "Behind the scenes at our office! Team work makes the dream work",
		likes: 12300,
		comments: 456,
		shares: 234,
		views: 89000,
		date: "Mar 15, 2024",
	},
	{
		id: 3,
		platform: "Twitter/X",
		content: "Excited to announce our new product launch! 🚀",
		likes: 8900,
		comments: 234,
		shares: 1200,
		views: 125000,
		date: "Mar 12, 2024",
	},
	{
		id: 4,
		platform: "LinkedIn",
		content: "We're hiring! Join our growing team and build the future",
		likes: 2100,
		comments: 89,
		shares: 156,
		views: 45000,
		date: "Mar 10, 2024",
	},
] as const;

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

// Stat definitions for overview cards
const STAT_DEFINITIONS = [
	{ key: "engagements", label: "Total Engagements", change: "+18.2%" },
	{ key: "impressions", label: "Impressions", change: "+24.5%" },
	{ key: "followerGrowth", label: "New Followers", change: "+12.8%" },
	{ key: "clicks", label: "Link Clicks", change: "+8.4%" },
	{ key: "shares", label: "Shares", change: "+15.3%" },
	{ key: "saves", label: "Saves", change: "+22.1%" },
] as const;

export { STAT_DEFINITIONS };

// Type exports
export type PlatformDataItem = typeof platformData[number];
export type ContentTypeDataItem = typeof contentTypeData[number];
export type TopPostItem = typeof topPosts[number];
export type StatDefinition = typeof STAT_DEFINITIONS[number];
