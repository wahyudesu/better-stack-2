/**
 * Sample data for social media profiles, posts, and analytics.
 * Used for development and testing before Convex integration.
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
	},
];

// ============================================================
// 2. SAMPLE POSTS (Extended for calendar view)
// ============================================================

// Helper to create date string for current month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

function createDate(day: number, hour: number = 10, minute: number = 0): Date {
	return new Date(currentYear, currentMonth, day, hour, minute, 0, 0);
}

export const samplePosts: ContentPost[] = [
	// Published posts (early month)
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
		platformPostIds: {
			instagram: "ig_post_123",
			linkedin: "li_post_456",
		},
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
		platformPostIds: {
			instagram: "ig_post_124",
			tiktok: "tt_post_789",
		},
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
		platformPostIds: {
			instagram: "ig_post_125",
			linkedin: "li_post_457",
		},
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
		platformPostIds: {
			tiktok: "tt_post_790",
			instagram: "ig_post_126",
		},
	},

	// Scheduled posts (mid month)
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
			"Monday motivation! 🌟\n\nSetiap senin adalah kesempatan baru untuk memulai. Jangan menunggu waktu yang tepat, karena waktu yang tepat adalah sekarang.\n\n#motivasi #monday #semangat",
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
			"5 kesalahan fatal yang sering dilakukan startup pemula:\n\n1/ Tidak validasi pasar dulu\n2. Terlalu fokus di produk, bukan masalah\n3. Hiring terlalu cepat\n4. Tidak track metrics yang penting\n5. Lupa cash flow\n\nThread lanjut 👇",
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
	{
		id: "post-8",
		title: "Live Q&A Announcement",
		content:
			"🔴 LIVE Q&A this Friday!\n\nKami akan adakan live session untuk jawab pertanyaan seputar startup dan bisnis.\n\nTulis pertanyaan kamu di comments!\n\n#live #qa #startup",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=9",
				type: "video",
				alt: "Live Q&A announcement",
				thumbnailUrl: "https://picsum.photos/1080/1080?random=9-thumb",
			},
		],
		platforms: ["instagram", "tiktok", "youtube"],
		profileIds: ["profile-1", "profile-2"],
		createdAt: new Date(currentYear, currentMonth, 12, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 12, 11, 0),
		status: "scheduled",
		scheduledAt: createDate(15, 19, 0),
		hashtags: ["live", "qa", "startup"],
		cta: "Set reminder!",
	},
	{
		id: "post-9",
		title: "Infographic: Startup Funding Stages",
		content:
			" tahapan funding startup:\n\n💰 Pre-Seed: Idea stage\n💰 Seed: MVP & early traction\n💰 Series A: Product-market fit\n💰 Series B: Scaling\n💰 Series C+: Expansion\n\nKamu di tahap mana?\n\n#funding #startup #business",
		media: [
			{
				url: "https://picsum.photos/1080/1350?random=10",
				type: "image",
				alt: "Funding stages infographic",
			},
		],
		platforms: ["instagram", "linkedin", "pinterest"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 13, 14, 0),
		updatedAt: new Date(currentYear, currentMonth, 13, 14, 0),
		status: "scheduled",
		scheduledAt: createDate(16, 10, 0),
		hashtags: ["funding", "startup", "business"],
		cta: "Save untuk referensi!",
	},
	{
		id: "post-10",
		title: "Case Study: From 0 to 10k Users",
		content:
			"Case study: Bagaimana kami dapat 10k users dalam 3 bulan.\n\nPart 1 akan membahas:\n- Strategy awal\n- Channels yang dipakai\n- Results\n\nStay tuned for Part 2!\n\n#casestudy #growth #marketing",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=11",
				type: "video",
				alt: "Case study video",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=11-thumb",
			},
		],
		platforms: ["tiktok", "youtube", "linkedin"],
		profileIds: ["profile-2", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 14, 13, 0),
		updatedAt: new Date(currentYear, currentMonth, 14, 13, 0),
		status: "scheduled",
		scheduledAt: createDate(17, 14, 0),
		hashtags: ["casestudy", "growth", "marketing"],
		cta: "Follow untuk Part 2!",
	},

	// Draft posts (late month)
	{
		id: "post-11",
		title: "User Testimonial",
		content:
			"Pengalaman user kami setelah pakai product:\n\n'Sangat membantu untuk manage social media!' - Budi, CEO TechStartup\n\n#testimonial #userstory",
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
			{
				url: "https://picsum.photos/1080/1920?random=13",
				type: "video",
				alt: "Workspace tour 2",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=13-thumb",
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
	{
		id: "post-13",
		title: "Poll: Tech Stack Favorit",
		content:
			"Poll time! 🔥\n\nTech stack favorit untuk startup?\n\n1. React + Node\n2. Next.js + Supabase\n3. Vue + Firebase\n4. Lainnya\n\nVote di comments!\n\n#poll #tech #startup",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=14",
				type: "image",
				alt: "Tech stack poll",
			},
		],
		platforms: ["twitter", "instagram"],
		profileIds: ["profile-3", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 17, 9, 0),
		updatedAt: new Date(currentYear, currentMonth, 17, 9, 0),
		status: "draft",
		hashtags: ["poll", "tech", "startup"],
		cta: "Vote now!",
	},
	{
		id: "post-14",
		title: "Meme: Startup Life 😂",
		content:
			"POV: Kamu pikir startup itu kaya-kaya...\n\nRealita: Indomie tiap malam 🍜\n\nTag co-founder kamu!\n\n#meme #startup #realtalk",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=15",
				type: "image",
				alt: "Startup meme",
			},
		],
		platforms: ["instagram", "twitter"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 18, 12, 0),
		updatedAt: new Date(currentYear, currentMonth, 18, 12, 0),
		status: "draft",
		hashtags: ["meme", "startup", "realtalk"],
		cta: "Share kalau relate!",
	},
	{
		id: "post-15",
		title: "Tutorial: Setup TikTok Ads",
		content:
			"Tutorial lengkap setup TikTok Ads untuk pemula:\n\n1. Buat Business Account\n2. Setup Pixel\n3. Create first campaign\n4. Set targeting\n5. Launch & optimize\n\nFull video di atas! 🎬\n\n#tutorial #ads #tiktok",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=16",
				type: "video",
				alt: "TikTok ads tutorial",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=16-thumb",
			},
		],
		platforms: ["tiktok", "youtube"],
		profileIds: ["profile-2"],
		createdAt: new Date(currentYear, currentMonth, 19, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 19, 11, 0),
		status: "draft",
		hashtags: ["tutorial", "ads", "tiktok"],
		cta: "Follow for more tutorials!",
	},

	// Additional scheduled posts for more calendar content
	{
		id: "post-16",
		title: "Friday Throwback",
		content:
			"Throwback to day 1! 🎯\n\nDari garasi ke office sekarang. Perjalanan panjang tapi worth it!\n\n#throwback #friday #journey",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=17",
				type: "image",
				alt: "Throwback photo",
			},
		],
		platforms: ["instagram", "linkedin"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 20, 10, 0),
		updatedAt: new Date(currentYear, currentMonth, 20, 10, 0),
		status: "scheduled",
		scheduledAt: createDate(21, 16, 0),
		hashtags: ["throwback", "friday", "journey"],
		cta: "Share your journey!",
	},
	{
		id: "post-17",
		title: "Community Shoutout",
		content:
			"Shoutout to komunitas @KomunitasStartupIndo! 🙌\n\nTerima kasih sudah support kami dari awal.\n\n#community #shoutout #indonesia",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=18",
				type: "image",
				alt: "Community shoutout",
			},
		],
		platforms: ["instagram", "twitter"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 21, 9, 0),
		updatedAt: new Date(currentYear, currentMonth, 21, 9, 0),
		status: "scheduled",
		scheduledAt: createDate(22, 11, 0),
		hashtags: ["community", "shoutout", "indonesia"],
		cta: "Follow them!",
	},
	{
		id: "post-18",
		title: "Weekend Vibes",
		content:
			"Weekend vibes! ☕\n\nJangan lupa recharge biar ready untuk Monday!\n\n#weekend #vibes #selfcare",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=19",
				type: "image",
				alt: "Weekend vibes",
			},
		],
		platforms: ["instagram"],
		profileIds: ["profile-1"],
		createdAt: new Date(currentYear, currentMonth, 22, 8, 0),
		updatedAt: new Date(currentYear, currentMonth, 22, 8, 0),
		status: "scheduled",
		scheduledAt: createDate(23, 9, 0),
		hashtags: ["weekend", "vibes", "selfcare"],
		cta: "Enjoy your weekend!",
	},
	{
		id: "post-19",
		title: "New Feature Announcement",
		content:
			"NEW FEATURE ALERT! 🎉\n\nKamu bisa sekarang schedule posts untuk semua platform dalam satu click!\n\nCoba sekarang! Link di bio.\n\n#newfeature #announcement #update",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=20",
				type: "video",
				alt: "New feature demo",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=20-thumb",
			},
		],
		platforms: ["instagram", "tiktok", "linkedin", "twitter"],
		profileIds: ["profile-1", "profile-2", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 23, 14, 0),
		updatedAt: new Date(currentYear, currentMonth, 23, 14, 0),
		status: "scheduled",
		scheduledAt: createDate(24, 10, 0),
		hashtags: ["newfeature", "announcement", "update"],
		cta: "Link in bio!",
	},
	{
		id: "post-20",
		title: "Mini Series: Part 1",
		content:
			"MINI SERIES 📺\n\nPart 1: How to find your niche.\n\nFinding your niche is crucial for standing out. Here's how:\n\n1. List your interests\n2. Identify problems\n3. Combine both\n\nPart 2 coming tomorrow!\n\n#series #niche #tips",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=21",
				type: "video",
				alt: "Mini series part 1",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=21-thumb",
			},
		],
		platforms: ["tiktok", "instagram"],
		profileIds: ["profile-2", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 24, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 24, 11, 0),
		status: "scheduled",
		scheduledAt: createDate(25, 12, 0),
		hashtags: ["series", "niche", "tips"],
		cta: "Turn on notifications for Part 2!",
	},
	{
		id: "post-21",
		title: "Mini Series: Part 2",
		content:
			"MINI SERIES 📺\n\nPart 2: How to validate your niche.\n\nNow that you found your niche, validate it:\n\n1. Check demand\n2. Analyze competition\n3. Test with content\n\nFinal part tomorrow!\n\n#series #niche #validation",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=22",
				type: "video",
				alt: "Mini series part 2",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=22-thumb",
			},
		],
		platforms: ["tiktok", "instagram"],
		profileIds: ["profile-2", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 25, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 25, 11, 0),
		status: "scheduled",
		scheduledAt: createDate(26, 12, 0),
		hashtags: ["series", "niche", "validation"],
		cta: "Save this series!",
	},
	{
		id: "post-22",
		title: "Mini Series: Part 3 (Final)",
		content:
			"MINI SERIES 📺 - FINALE\n\nPart 3: How to dominate your niche.\n\nTo stand out:\n\n1. Be unique\n2. Stay consistent\n3. Engage with audience\n4. Keep learning\n\nThat's a wrap! Hope this helped! 🙏\n\n#series #niche #growth",
		media: [
			{
				url: "https://picsum.photos/1080/1920?random=23",
				type: "video",
				alt: "Mini series part 3",
				thumbnailUrl: "https://picsum.photos/1080/1920?random=23-thumb",
			},
		],
		platforms: ["tiktok", "instagram", "youtube"],
		profileIds: ["profile-2", "profile-1"],
		createdAt: new Date(currentYear, currentMonth, 26, 11, 0),
		updatedAt: new Date(currentYear, currentMonth, 26, 11, 0),
		status: "scheduled",
		scheduledAt: createDate(27, 12, 0),
		hashtags: ["series", "niche", "growth"],
		cta: "Share this with someone who needs it!",
	},
	{
		id: "post-23",
		title: "End of Month Reflection",
		content:
			"March recap! 📊\n\n✨ 23 posts created\n✨ 15% growth\n✨ 1k new followers\n✨ Countless connections\n\nThank you for being part of this journey!\n\n#recap #grateful #community",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=24",
				type: "image",
				alt: "End of month recap",
			},
		],
		platforms: ["instagram", "linkedin", "twitter"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 27, 10, 0),
		updatedAt: new Date(currentYear, currentMonth, 27, 10, 0),
		status: "scheduled",
		scheduledAt: createDate(28, 18, 0),
		hashtags: ["recap", "grateful", "community"],
		cta: "Drop your March highlights!",
	},
	{
		id: "post-24",
		title: "April Goals",
		content:
			"April goals! 🎯\n\n1. Hit 50k followers\n2. Launch 2 new features\n3. Collaborate with 5 creators\n4. Grow team by 2\n\nWhat are YOUR goals for April?\n\n#goals #april #planning",
		media: [
			{
				url: "https://picsum.photos/1080/1080?random=25",
				type: "image",
				alt: "April goals",
			},
		],
		platforms: ["instagram", "linkedin"],
		profileIds: ["profile-1", "profile-3"],
		createdAt: new Date(currentYear, currentMonth, 28, 9, 0),
		updatedAt: new Date(currentYear, currentMonth, 28, 9, 0),
		status: "scheduled",
		scheduledAt: createDate(30, 10, 0),
		hashtags: ["goals", "april", "planning"],
		cta: "Comment your goals!",
	},
];

// ============================================================
// 3. SAMPLE ANALYTICS (per post per platform)
// ============================================================

export const sampleAnalytics: PostAnalytics[] = [
	// Post 1 - Instagram (Published)
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
	// Post 1 - LinkedIn (Published)
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
	// Post 2 - Instagram (Published)
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
	// Post 2 - TikTok (Published)
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
	// Post 3 - Instagram (Published)
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
	// Post 3 - LinkedIn (Published)
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
	// Post 4 - TikTok (Published)
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
	// Post 4 - Instagram (Published)
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
// 4. HELPER FUNCTIONS
// ============================================================

/**
 * Get analytics for a specific post.
 */
export function getPostAnalytics(postId: string): PostAnalytics[] {
	return sampleAnalytics.filter((a) => a.postId === postId);
}

/**
 * Get analytics for a specific post and platform.
 */
export function getPostPlatformAnalytics(
	postId: string,
	platform: ProfilePlatform,
): PostAnalytics | undefined {
	return sampleAnalytics.find(
		(a) => a.postId === postId && a.platform === platform,
	);
}

/**
 * Calculate total engagement across all platforms for a post.
 */
export function calculateTotalEngagement(postId: string): number {
	const analytics = getPostAnalytics(postId);
	return analytics.reduce(
		(total, a) => total + (a.likes || 0) + (a.comments || 0) + (a.shares || 0),
		0,
	);
}

/**
 * Calculate total views across all platforms for a post.
 */
export function calculateTotalViews(postId: string): number {
	const analytics = getPostAnalytics(postId);
	return analytics.reduce((total, a) => total + (a.views || 0), 0);
}

/**
 * Get best performing platform for a post.
 */
export function getBestPlatform(postId: string): ProfilePlatform | undefined {
	const analytics = getPostAnalytics(postId);
	if (analytics.length === 0) return undefined;

	return analytics.reduce((best, current) => {
		const bestEngagement =
			(best?.likes || 0) + (best?.comments || 0) + (best?.shares || 0);
		const currentEngagement =
			(current.likes || 0) + (current.comments || 0) + (current.shares || 0);
		return currentEngagement > bestEngagement ? current : best;
	})?.platform;
}

/**
 * Get calendar items (posts with analytics summary).
 */
export function getCalendarItems(): CalendarPostItem[] {
	return samplePosts.map((post) => ({
		post,
		analytics: getPostAnalytics(post.id),
		totalEngagement: calculateTotalEngagement(post.id),
	}));
}

/**
 * Get dashboard items (posts with performance overview).
 */
export function getDashboardItems(): DashboardPostItem[] {
	return samplePosts.map((post) => ({
		post,
		bestPlatform: getBestPlatform(post.id),
		totalViews: calculateTotalViews(post.id),
		totalEngagement: calculateTotalEngagement(post.id),
	}));
}

/**
 * Get posts by status.
 */
export function getPostsByStatus(status: ContentPost["status"]): ContentPost[] {
	return samplePosts.filter((p) => p.status === status);
}

/**
 * Get scheduled posts for a specific date range.
 */
export function getScheduledPostsInRange(
	startDate: Date,
	endDate: Date,
): ContentPost[] {
	return samplePosts.filter((p) => {
		if (p.status !== "scheduled" || !p.scheduledAt) return false;
		return p.scheduledAt >= startDate && p.scheduledAt <= endDate;
	});
}
