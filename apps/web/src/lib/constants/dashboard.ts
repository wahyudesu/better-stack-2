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
	PLATFORMS,
	SOCIAL_MEDIA_OPTIONS,
	PLATFORM_MULTIPLIERS,
	type SocialMediaPlatform,
} from "./platforms";

// Time-related
export { TIME_OPTIONS, DAYS_MAP } from "./time";

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

// Country data for demographics
export const COUNTRY_DATA = [
	{ country: "Indonesia", users: 3500 },
	{ country: "United States", users: 2800 },
	{ country: "Japan", users: 1900 },
	{ country: "Singapore", users: 1200 },
	{ country: "Malaysia", users: 850 },
] as const;

// Region data for demographics
export const REGION_DATA = [
	{ region: "Jakarta", users: 2100 },
	{ region: "Surabaya", users: 1400 },
	{ region: "Bandung", users: 980 },
	{ region: "Bali", users: 720 },
	{ region: "Medan", users: 580 },
] as const;
