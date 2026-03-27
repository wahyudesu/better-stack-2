/**
 * Dashboard constants shared across pages.
 *
 * This file now re-exports constants from their new locations:
 * - Platform constants: @/lib/constants/platforms
 * - Time constants: @/lib/constants/time
 */

// ============================================================
// RE-EXPORTS FROM NEW LOCATIONS
// ============================================================

// Platform-related
export {
	PLATFORM_MULTIPLIERS,
	PLATFORMS,
	SOCIAL_MEDIA_OPTIONS,
	type SocialMediaPlatform,
} from "./platforms";

// Time-related
export { DAYS_MAP, TIME_OPTIONS } from "./time";

// ============================================================
// DASHBOARD-SPECIFIC CONSTANTS (kept here)
// ============================================================

// Report type multipliers for metric calculations
export const TYPE_MULTIPLIERS: Record<
	string,
	{
		engagements: number;
		followers: number;
		impressions: number;
		likes: number;
		visits: number;
		replies: number;
	}
> = {
	overview: {
		engagements: 1,
		followers: 1,
		impressions: 1,
		likes: 1,
		visits: 1,
		replies: 1,
	},
	engagement: {
		engagements: 1.5,
		followers: 0.8,
		impressions: 0.7,
		likes: 1.3,
		visits: 0.9,
		replies: 1.8,
	},
	reach: {
		engagements: 0.6,
		followers: 1.5,
		impressions: 1.8,
		likes: 0.7,
		visits: 1.3,
		replies: 0.5,
	},
	impressions: {
		engagements: 0.5,
		followers: 0.7,
		impressions: 2.0,
		likes: 0.5,
		visits: 0.8,
		replies: 0.3,
	},
} as const;

// Sample post content for markers
export const POST_CONTENTS = [
	{ title: "New Product Launch", description: "Check out our latest product!" },
	{ title: "Behind the Scenes", description: "A sneak peek into our office" },
	{
		title: "Customer Spotlight",
		description: "Featuring our amazing customers",
	},
	{ title: "Industry Tips", description: "5 tips for better engagement" },
	{ title: "Team Friday", description: "Meet the amazing team" },
	{
		title: "Product Tutorial",
		description: "How to get started with our product",
	},
	{ title: "Success Story", description: "How we helped a customer succeed" },
	{ title: "Event Announcement", description: "Join us at our upcoming event" },
] as const;

// ============================================================
// RE-EXPORTS FROM DATA FILES
// ============================================================

// Demographics data
export {
	COUNTRY_DATA,
	type DemographicDataItem,
	REGION_DATA,
} from "@/lib/data/demographics";

// Social media data (profiles, posts, analytics)
export {
	getCalendarItems,
	getDashboardItems,
	getPostAnalytics,
	getPostsByStatus,
	getScheduledPostsInRange,
	sampleAnalytics,
	samplePosts,
	sampleProfiles,
} from "@/lib/data/social-data";
