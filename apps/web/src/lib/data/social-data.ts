/**
 * Social media data: profiles, posts, analytics.
 * Per-post analytics only. Aggregate analytics in analytics-data.ts.
 */

import type {
	CalendarPostItem,
	ContentPost,
	DashboardPostItem,
	PostAnalytics,
	ProfilePlatform,
	SocialMediaProfile,
} from "@/lib/types";

// ============================================================
// 1. SAMPLE PROFILES
// ============================================================

export const sampleProfiles: SocialMediaProfile[] = [
	{
		id: "profile-1",
		platform: "instagram",
		name: "Startupindo",
		username: "@startupindo",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=startup",
		status: "active",
		connectedAt: new Date("2025-01-15T10:00:00Z"),
		lastSyncAt: new Date("2026-03-26T08:00:00Z"),
		platformUserId: "123456789",
		followerCount: 45000,
	},
	{
		id: "profile-2",
		platform: "tiktok",
		name: "Startup Indonesia",
		username: "@startup.id",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok",
		status: "active",
		connectedAt: new Date("2025-02-01T10:00:00Z"),
		lastSyncAt: new Date("2026-03-26T07:30:00Z"),
		platformUserId: "987654321",
		followerCount: 62000,
	},
	{
		id: "profile-3",
		platform: "linkedin",
		name: "Startup Indonesia Official",
		username: "startup-indonesia",
		avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin",
		status: "active",
		connectedAt: new Date("2025-03-01T10:00:00Z"),
		lastSyncAt: new Date("2026-03-26T06:00:00Z"),
		platformUserId: "linkedin_123456",
		followerCount: 15000,
	},
];

// ============================================================
// 2. HELPER: Date utilities
// ============================================================

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

function createDate(day: number, hour: number = 10, minute: number = 0): Date {
	return new Date(currentYear, currentMonth, day, hour, minute, 0, 0);
}

// ============================================================
// 3. SAMPLE POSTS
// ============================================================

export const samplePosts: ContentPost[] = [
	// Published posts
	{
		id: "post-1",
		title: "Tips Scaling Startup 2025",
		content:
			"5 tips scaling startup di tahun 2025:\n\n1. Fokus di product-market fit\n2. Hiring yang tepat\n3. Cash flow management\n4. Customer feedback loop\n5. Timing yang pas\n\n#startup #indonesia #scaling",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=1",
				type: "image",
				alt: "Startup scaling tips",
			},
		],
		platforms: ["instagram", "linkedin"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 1, 9, 0),
		updatedAt: new Date(currentYear, currentMonth, 1, 9, 0),
		status: "published",
		scheduledAt: createDate(2, 8, 0),
		publishedAt: createDate(2, 8, 5),
		hashtags: ["startup", "indonesia", "scaling"],
		cta: "Share pengalaman kamu di comments!",
		platformPostIds: { instagram: "ig_post_123", linkedin: "li_post_456" },
	},
	{
		id: "post-2",
		title: "Behind the Scene Team",
		content:
			"Behind the scene team kami yang solid! 💪\n\nSetiap hari kami belajar, growing, dan support each other.\n\n#team #culture #startuplife",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=2",
				type: "image",
				alt: "Team photo",
			},
			{
				url: "https://picsum.photos/1080/1080?random=3",
				type: "image",
				alt: "Team working",
			},
		],
		platforms: ["instagram", "tiktok"],
		profileIds: ["profile-1", "profile-2"],
		createdAt: new Date(currentYear, currentMonth, 3, 14, 0),
		updatedAt: new Date(currentYear, currentMonth, 3, 14, 0),
		status: "published",
		scheduledAt: createDate(4, 10, 0),
		publishedAt: createDate(4, 10, 2),
		hashtags: ["team", "culture", "startuplife"],
		cta: "Tag teman kamu!",
		platformPostIds: { instagram: "ig_post_124", tiktok: "tt_post_789" },
	},
	{
		id: "post-3",
		title: "Weekly Recap March Week 1",
		content:
			"Weekly recap minggu ini:\n\n✅ 3 posts published\n✅ 15% growth in engagement\n✅ 500 new followers\n\nThank you all! 🙏\n\n#weekly #recap #grateful",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=6",
				type: "image",
				alt: "Weekly recap",
			},
		],
		platforms: ["instagram", "linkedin"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 5, 16, 0),
		updatedAt: new Date(currentYear, currentMonth, 5, 16, 0),
		status: "published",
		scheduledAt: createDate(6, 17, 0),
		publishedAt: createDate(6, 17, 1),
		hashtags: ["weekly", "recap", "grateful"],
		platformPostIds: { instagram: "ig_post_125", linkedin: "li_post_457" },
	},
	{
		id: "post-4",
		title: "Educational: Cara Riset Competitor",
		content:
			"Cara riset competitor dengan efektif:\n\n1. Identify top 5 competitors\n2. Analyze their content strategy\n3. Check their engagement metrics\n4. Learn from their mistakes\n5. Find gaps in the market\n\nSimpan video ini! 📌\n\n#education #tips #competitor",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=7",
				type: "video",
				alt: "Educational video",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=7-thumb",
			},
		],
		platforms: ["tiktok", "instagram"],
		profileIds: ["profile-2", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 7, 12, 0),
		updatedAt: new Date(currentYear, currentMonth, 7, 12, 0),
		status: "published",
		scheduledAt: createDate(8, 12, 0),
		publishedAt: createDate(8, 12, 3),
		hashtags: ["education", "tips", "competitor"],
		cta: "Follow untuk tips lainnya!",
		platformPostIds: { tiktok: "tt_post_790", instagram: "ig_post_126" },
	},

	// Scheduled posts
	{
		id: "post-5",
		title: "Product Launch Teaser",
		content:
			"Something big is coming... 🚀\n\nStay tuned for our biggest launch yet!\n\n#launch #comingsoon #teaser",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=4",
				type: "image",
				alt: "Launch teaser",
			},
		],
		platforms: ["instagram", "tiktok", "linkedin"],
		profileIds: ["profile-1", "profile-2", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 9, 9, 0),
		updatedAt: new Date(currentYear, currentMonth, 9, 9, 0),
		status: "scheduled",
		scheduledAt: createDate(12, 9, 0),
		hashtags: ["launch", "comingsoon", "teaser"],
		cta: "Turn on notifications!",
	},
	{
		id: "post-6",
		title: "Motivasi Hari Senin",
		content:
			"Monday motivation! 🌟\n\nSetiap senin adalah kesempatan baru untuk memulai.\n\n#motivasi #monday #semangat",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=8",
				type: "image",
				alt: "Monday motivation",
			},
		],
		platforms: ["instagram", "tiktok"],
		profileIds: ["profile-1", "profile-2"],
		createdAt: new Date(currentYear, currentMonth, 10, 8, 0),
		updatedAt: new Date(currentYear, currentMonth, 10, 8, 0),
		status: "scheduled",
		scheduledAt: createDate(13, 8, 0),
		hashtags: ["motivasi", "monday", "semangat"],
		cta: "Share ke teman yang butuh semangat!",
	},
	{
		id: "post-7",
		title: "Thread: 5 Kesalahan Startup",
		content:
			"5 kesalahan fatal yang sering dilakukan startup pemula:\n\n1/ Tidak validasi pasar dulu\n2. Terlalu fokus di produk\n3. Hiring terlalu cepat\n\nThread lanjut 👇",
		media: [],
		platforms: ["twitter", "linkedin"],
		profileIds: ["profile-3"],
		createdAt: new Date(currentYear, currentMonth, 11, 10, 0),
		updatedAt: new Date(currentYear, currentMonth, 11, 10, 0),
		status: "scheduled",
		scheduledAt: createDate(14, 9, 0),
		hashtags: ["startup", "tips", "business"],
		cta: "Retweet jika bermanfaat!",
	},

	// Draft posts
	{
		id: "post-11",
		title: "User Testimonial",
		content:
			"Pengalaman user kami setelah pakai product:\n\n'Sangat membantu!' - Budi, CEO TechStartup\n\n#testimonial #userstory",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=5",
				type: "image",
				alt: "User testimonial",
			},
		],
		platforms: ["instagram"],
		profileIds: ["profile-1"],
		createdAt: new Date(currentYear, currentMonth, 15, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 15, 11, 0),
		status: "draft",
		hashtags: ["testimonial", "userstory"],
		notes: "Need approval from marketing team",
	},
	{
		id: "post-12",
		title: "Workspace Tour",
		content:
			"Office tour! 🏢\n\nLihat workspace kami dan rasakan vibes-nya.\n\n#workspace #office #tour",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=12",
				type: "video",
				alt: "Workspace tour",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=12-thumb",
			},
		],
		platforms: ["tiktok", "instagram"],
		profileIds: ["profile-2", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 16, 10, 0),
		updatedAt: new Date(currentYear, currentMonth, 16, 10, 0),
		status: "draft",
		hashtags: ["workspace", "office", "tour"],
		cta: "Comment workspace goals!",
	},
];

// ============================================================
// 4. SAMPLE ANALYTICS (per post per platform)
// ============================================================

export const sampleAnalytics: PostAnalytics[] = [
	{
		id: "analytics-1",
		postId: "post-1",
		platform: "instagram",
		profileId: "profile-1",
		fetchedAt: new Date(currentYear, currentMonth, 3, 8, 0),
		views: 12500,
		likes: 850,
		comments: 42,
		shares: 28,
		clicks: 120,
		saves: 95,
		engagementRate: 7.6,
	},
	{
		id: "analytics-2",
		postId: "post-1",
		platform: "linkedin",
		profileId: "profile-3",
		fetchedAt: new Date(currentYear, currentMonth, 3, 8, 0),
		views: 5600,
		likes: 180,
		comments: 24,
		shares: 15,
		clicks: 85,
		engagementRate: 3.9,
	},
	{
		id: "analytics-3",
		postId: "post-2",
		platform: "instagram",
		profileId: "profile-1",
		fetchedAt: new Date(currentYear, currentMonth, 5, 7, 30),
		views: 8900,
		likes: 620,
		comments: 38,
		shares: 19,
		clicks: 95,
		saves: 78,
		engagementRate: 7.5,
	},
	{
		id: "analytics-4",
		postId: "post-2",
		platform: "tiktok",
		profileId: "profile-2",
		fetchedAt: new Date(currentYear, currentMonth, 5, 7, 30),
		views: 45000,
		likes: 3200,
		comments: 156,
		shares: 89,
		clicks: 450,
		saves: 520,
		engagementRate: 8.5,
	},
	{
		id: "analytics-5",
		postId: "post-3",
		platform: "instagram",
		profileId: "profile-1",
		fetchedAt: new Date(currentYear, currentMonth, 7, 6, 0),
		views: 9800,
		likes: 720,
		comments: 51,
		shares: 22,
		clicks: 110,
		saves: 88,
		engagementRate: 8.3,
	},
	{
		id: "analytics-6",
		postId: "post-3",
		platform: "linkedin",
		profileId: "profile-3",
		fetchedAt: new Date(currentYear, currentMonth, 7, 6, 0),
		views: 7200,
		likes: 245,
		comments: 31,
		shares: 18,
		clicks: 92,
		engagementRate: 4.2,
	},
	{
		id: "analytics-7",
		postId: "post-4",
		platform: "tiktok",
		profileId: "profile-2",
		fetchedAt: new Date(currentYear, currentMonth, 9, 5, 0),
		views: 68000,
		likes: 5400,
		comments: 287,
		shares: 145,
		clicks: 680,
		saves: 890,
		engagementRate: 9.2,
	},
	{
		id: "analytics-8",
		postId: "post-4",
		platform: "instagram",
		profileId: "profile-1",
		fetchedAt: new Date(currentYear, currentMonth, 9, 5, 0),
		views: 15600,
		likes: 980,
		comments: 67,
		shares: 34,
		clicks: 145,
		saves: 125,
		engagementRate: 7.8,
	},
];

// ============================================================
// 5. HELPER FUNCTIONS
// ============================================================

export function getPostAnalytics(postId: string): PostAnalytics[] {
	return sampleAnalytics.filter((a) => a.postId === postId);
}

export function getPostPlatformAnalytics(
	postId: string,
	platform: ProfilePlatform,
): PostAnalytics | undefined {
	return sampleAnalytics.find(
		(a) => a.postId === postId && a.platform === platform,
	);
}

export function calculateTotalEngagement(postId: string): number {
	const analytics = getPostAnalytics(postId);
	return analytics.reduce(
		(total, a) => total + (a.likes || 0) + (a.comments || 0) + (a.shares || 0),
		0,
	);
}

export function calculateTotalViews(postId: string): number {
	const analytics = getPostAnalytics(postId);
	return analytics.reduce((total, a) => total + (a.views || 0), 0);
}

export function getBestPlatform(postId: string): ProfilePlatform | undefined {
	const analytics = getPostAnalytics(postId);
	if (analytics.length === 0) return undefined;
	return analytics.reduce((best, current) => {
		const bestEng =
			(best?.likes || 0) + (best?.comments || 0) + (best?.shares || 0);
		const currentEng =
			(current.likes || 0) + (current.comments || 0) + (current.shares || 0);
		return currentEng > bestEng ? current : best;
	})?.platform;
}

export function getCalendarItems(): CalendarPostItem[] {
	return samplePosts.map((post) => ({
		post,
		analytics: getPostAnalytics(post.id),
		totalEngagement: calculateTotalEngagement(post.id),
		bestPlatform: getBestPlatform(post.id),
	}));
}

export function getDashboardItems(): DashboardPostItem[] {
	return samplePosts.map((post) => ({
		post,
		bestPlatform: getBestPlatform(post.id),
		totalViews: calculateTotalViews(post.id),
		totalEngagement: calculateTotalEngagement(post.id),
	}));
}

export function getPostsByStatus(status: ContentPost["status"]): ContentPost[] {
	return samplePosts.filter((p) => p.status === status);
}

export function getScheduledPostsInRange(
	startDate: Date,
	endDate: Date,
): ContentPost[] {
	return samplePosts.filter((p) => {
		if (p.status !== "scheduled" || !p.scheduledAt) return false;
		return p.scheduledAt >= startDate && p.scheduledAt <= endDate;
	});
}
