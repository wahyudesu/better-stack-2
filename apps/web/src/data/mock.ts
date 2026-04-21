export const teamMembers = [
	{
		id: "1",
		name: "Sarah Chen",
		role: "Product Lead",
		email: "sarah@acme.com",
		avatar: "https://i.pravatar.cc/150?u=sarah",
		online: true,
		tasksCompleted: 24,
	},
	{
		id: "2",
		name: "James Wilson",
		role: "Frontend Dev",
		email: "james@acme.com",
		avatar: "https://i.pravatar.cc/150?u=james",
		online: true,
		tasksCompleted: 31,
	},
	{
		id: "3",
		name: "Maria Garcia",
		role: "Designer",
		email: "maria@acme.com",
		avatar: "https://i.pravatar.cc/150?u=maria",
		online: false,
		tasksCompleted: 18,
	},
	{
		id: "4",
		name: "Alex Kim",
		role: "Backend Dev",
		email: "alex@acme.com",
		avatar: "https://i.pravatar.cc/150?u=alex",
		online: true,
		tasksCompleted: 27,
	},
	{
		id: "5",
		name: "Lisa Park",
		role: "QA Engineer",
		email: "lisa@acme.com",
		avatar: "https://i.pravatar.cc/150?u=lisa",
		online: false,
		tasksCompleted: 15,
	},
	{
		id: "6",
		name: "Tom Brown",
		role: "DevOps",
		email: "tom@acme.com",
		avatar: "https://i.pravatar.cc/150?u=tom",
		online: true,
		tasksCompleted: 22,
	},
];

export const projects = [
	{
		id: "1",
		name: "Website Redesign",
		progress: 72,
		tasks: 24,
		completed: 17,
		color: "hsl(220, 65%, 54%)",
	},
	{
		id: "2",
		name: "Mobile App v2",
		progress: 45,
		tasks: 32,
		completed: 14,
		color: "hsl(152, 60%, 42%)",
	},
	{
		id: "3",
		name: "API Migration",
		progress: 88,
		tasks: 16,
		completed: 14,
		color: "hsl(38, 92%, 50%)",
	},
];

export const recentTasks = [
	{
		id: "1",
		title: "Update landing page hero section",
		status: "in-progress" as const,
		assignee: "Sarah Chen",
		project: "Website Redesign",
	},
	{
		id: "2",
		title: "Fix authentication flow on mobile",
		status: "completed" as const,
		assignee: "James Wilson",
		project: "Mobile App v2",
	},
	{
		id: "3",
		title: "Write API documentation",
		status: "todo" as const,
		assignee: "Alex Kim",
		project: "API Migration",
	},
	{
		id: "4",
		title: "Design settings page mockup",
		status: "in-progress" as const,
		assignee: "Maria Garcia",
		project: "Website Redesign",
	},
	{
		id: "5",
		title: "Set up CI/CD pipeline",
		status: "completed" as const,
		assignee: "Tom Brown",
		project: "API Migration",
	},
];

export const activities = [
	{
		id: "1",
		user: "Sarah Chen",
		avatar: "https://i.pravatar.cc/150?u=sarah",
		action: "completed task",
		target: "Update landing page hero section",
		project: "Website Redesign",
		time: "2 min ago",
	},
	{
		id: "2",
		user: "James Wilson",
		avatar: "https://i.pravatar.cc/150?u=james",
		action: "pushed 3 commits to",
		target: "feature/auth-flow",
		project: "Mobile App v2",
		time: "15 min ago",
	},
	{
		id: "3",
		user: "Maria Garcia",
		avatar: "https://i.pravatar.cc/150?u=maria",
		action: "uploaded design files for",
		target: "Settings page",
		project: "Website Redesign",
		time: "1 hour ago",
	},
	{
		id: "4",
		user: "Alex Kim",
		avatar: "https://i.pravatar.cc/150?u=alex",
		action: "created new endpoint",
		target: "/api/v2/users",
		project: "API Migration",
		time: "2 hours ago",
	},
	{
		id: "5",
		user: "Tom Brown",
		avatar: "https://i.pravatar.cc/150?u=tom",
		action: "deployed to staging",
		target: "v2.1.0-rc1",
		project: "API Migration",
		time: "3 hours ago",
	},
	{
		id: "6",
		user: "Lisa Park",
		avatar: "https://i.pravatar.cc/150?u=lisa",
		action: "reported bug in",
		target: "User profile modal",
		project: "Mobile App v2",
		time: "4 hours ago",
	},
	{
		id: "7",
		user: "Sarah Chen",
		avatar: "https://i.pravatar.cc/150?u=sarah",
		action: "updated project timeline for",
		target: "Q1 Sprint",
		project: "Website Redesign",
		time: "5 hours ago",
	},
	{
		id: "8",
		user: "James Wilson",
		avatar: "https://i.pravatar.cc/150?u=james",
		action: "reviewed PR #142 on",
		target: "Mobile App v2",
		project: "Mobile App v2",
		time: "Yesterday",
	},
];

export const weeklyStats = [
	{ day: "Mon", completed: 5, created: 8 },
	{ day: "Tue", completed: 7, created: 4 },
	{ day: "Wed", completed: 3, created: 6 },
	{ day: "Thu", completed: 9, created: 5 },
	{ day: "Fri", completed: 6, created: 7 },
	{ day: "Sat", completed: 2, created: 1 },
	{ day: "Sun", completed: 1, created: 2 },
];

// Social media dashboard data
export type Platform = "instagram" | "tiktok" | "twitter" | "youtube";

export interface SocialAccount {
	platform: Platform;
	handle: string;
	followers: number;
	followersChange: number;
	engagement: number;
	engagementChange: number;
	posts: number;
	impressions: number;
	impressionsChange: number;
	color: string;
}

export const socialAccounts: SocialAccount[] = [
	{
		platform: "instagram",
		handle: "@acme.studio",
		followers: 48200,
		followersChange: 3.2,
		engagement: 4.7,
		engagementChange: 0.3,
		posts: 342,
		impressions: 128000,
		impressionsChange: 12.5,
		color: "328 70% 55%",
	},
	{
		platform: "tiktok",
		handle: "@acmestudio",
		followers: 125800,
		followersChange: 8.7,
		engagement: 6.2,
		engagementChange: 1.1,
		posts: 89,
		impressions: 2400000,
		impressionsChange: 24.3,
		color: "349 70% 56%",
	},
	{
		platform: "twitter",
		handle: "@AcmeStudio",
		followers: 31400,
		followersChange: -0.8,
		engagement: 2.1,
		engagementChange: -0.2,
		posts: 1204,
		impressions: 89000,
		impressionsChange: -3.1,
		color: "203 89% 53%",
	},
	{
		platform: "youtube",
		handle: "Acme Studio",
		followers: 72100,
		followersChange: 5.4,
		engagement: 3.8,
		engagementChange: 0.6,
		posts: 156,
		impressions: 1850000,
		impressionsChange: 18.2,
		color: "0 72% 51%",
	},
];

export interface WeeklyGrowth {
	day: string;
	instagram: number;
	tiktok: number;
	twitter: number;
	youtube: number;
}

export const weeklyGrowth: WeeklyGrowth[] = [
	{ day: "Mon", instagram: 120, tiktok: 340, twitter: 45, youtube: 210 },
	{ day: "Tue", instagram: 85, tiktok: 520, twitter: 32, youtube: 180 },
	{ day: "Wed", instagram: 200, tiktok: 410, twitter: 68, youtube: 290 },
	{ day: "Thu", instagram: 150, tiktok: 680, twitter: 51, youtube: 340 },
	{ day: "Fri", instagram: 310, tiktok: 450, twitter: 89, youtube: 260 },
	{ day: "Sat", instagram: 95, tiktok: 280, twitter: 22, youtube: 150 },
	{ day: "Sun", instagram: 70, tiktok: 190, twitter: 15, youtube: 120 },
];

export interface RecentPost {
	id: string;
	platform: Platform;
	title: string;
	likes: number;
	comments: number;
	shares: number;
	time: string;
	thumbnail?: string;
}

export const recentPosts: RecentPost[] = [
	{
		id: "1",
		platform: "tiktok",
		title: "Behind the scenes of our new campaign 🎬",
		likes: 24500,
		comments: 890,
		shares: 3200,
		time: "2h ago",
	},
	{
		id: "2",
		platform: "instagram",
		title: "Product launch announcement ✨",
		likes: 8700,
		comments: 342,
		shares: 520,
		time: "5h ago",
	},
	{
		id: "3",
		platform: "youtube",
		title: "How We Built Our Brand in 6 Months",
		likes: 4200,
		comments: 287,
		shares: 890,
		time: "1d ago",
	},
	{
		id: "4",
		platform: "twitter",
		title: "Thread: 10 lessons from scaling to 100k followers",
		likes: 2100,
		comments: 156,
		shares: 780,
		time: "1d ago",
	},
	{
		id: "5",
		platform: "instagram",
		title: "Team photo from our offsite 🏔️",
		likes: 6300,
		comments: 198,
		shares: 120,
		time: "2d ago",
	},
];

// ============================================================
// RE-EXPORTS FROM CENTRALIZED DATA
// ============================================================

// Import from centralized social media data
export {
	sampleAnalytics,
	samplePosts,
	sampleProfiles,
} from "@/lib/data/social-data";
export type {
	ContentPost,
	PostAnalytics,
	PostStatus,
	ProfilePlatform,
	ProfileStatus,
	SocialMediaProfile,
} from "@/lib/types/social";

// ============================================================
// CALENDAR EVENTS (Adapter from ContentPost to CalendarEvent)
// ============================================================

/**
 * Platform type for calendar display.
 * Extended to support content types.
 */
export type CalendarPlatform = Platform | "linkedin" | "facebook" | "pinterest";

/**
 * Calendar event interface.
 * This is an adapter layer that converts ContentPost to CalendarEvent format.
 * New code should use ContentPost directly from @/lib/data/social-data.ts.
 */
export interface CalendarEvent {
	id: string;
	title: string;
	date: string; // YYYY-MM-DD
	platform: CalendarPlatform;
	platforms?: CalendarPlatform[]; // For multi-platform posts
	type: "post" | "story" | "reel" | "video" | "tweet" | "live";
	time?: string;
	description?: string;
	status:
		| "scheduled"
		| "published"
		| "draft"
		| "review"
		| "publishing"
		| "failed"
		| "cancelled";
	color: string;
	thumbnail?: string;
	mediaType?: "image" | "video";
	postUrl?: string;
}

/**
 * Platform colors for calendar display.
 */
const PLATFORM_COLORS: Record<CalendarPlatform, string> = {
	instagram: "328 70% 55%",
	tiktok: "349 70% 56%",
	twitter: "203 89% 53%",
	youtube: "0 72% 51%",
	linkedin: "217 91% 60%",
	facebook: "220 44% 41%",
	pinterest: "340 82% 52%",
};

/**
 * Convert ContentPost to CalendarEvent format.
 * This adapter maintains backward compatibility with existing calendar components.
 */
function postToCalendarEvent(post: ContentPost): CalendarEvent {
	const primaryPlatform = post.platforms[0] as CalendarPlatform;
	const hasVideo = post.media.some((m) => m.type === "video");
	const hasMultipleMedia = post.media.length > 1;

	// Determine content type
	let type: CalendarEvent["type"] = "post";
	if (hasVideo) {
		type =
			primaryPlatform === "tiktok" || primaryPlatform === "youtube"
				? "video"
				: "reel";
	} else if (hasMultipleMedia) {
		type = "post";
	}

	// Format date
	const targetDate = post.scheduledAt || post.publishedAt || post.createdAt;
	const date = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;

	// Format time
	const time = `${String(targetDate.getHours()).padStart(2, "0")}:${String(targetDate.getMinutes()).padStart(2, "0")}`;

	return {
		id: post.id,
		title: post.title,
		date,
		platform: primaryPlatform,
		platforms: post.platforms as CalendarPlatform[],
		type,
		time,
		description: post.content,
		status: post.status,
		color: PLATFORM_COLORS[primaryPlatform],
		thumbnail: post.media[0]?.url,
		mediaType: (post.media[0]?.type === "image" || post.media[0]?.type === "video"
			? post.media[0]?.type
			: undefined) as "image" | "video" | undefined,
	};
}

/**
 * Generate calendar events from ContentPost data.
 * Uses the centralized data from @/lib/data/social-data.ts.
 */
import { samplePosts } from "@/lib/data/social-data";
import type { ContentPost } from "@/lib/types/social";

export const calendarEvents: CalendarEvent[] =
	samplePosts.map(postToCalendarEvent);
