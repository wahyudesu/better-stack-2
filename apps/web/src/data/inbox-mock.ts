/**
 * Mock inbox data for development/testing
 * Matches Zernio API response shapes exactly
 * Covers: conversations, messages, comments, reviews, contacts, broadcasts, sequences
 */

import type {
	ServerConversation,
	ServerMessage,
} from "@/app/inbox/InboxContent";

// ============================================================
// Helper functions for timestamps
// ============================================================

function hoursAgo(hours: number): string {
	const date = new Date();
	date.setHours(date.getHours() - hours);
	return date.toISOString();
}

function daysAgo(days: number): string {
	const date = new Date();
	date.setDate(date.getDate() - days);
	return date.toISOString();
}

function minutesAgo(minutes: number): string {
	const date = new Date();
	date.setMinutes(date.getMinutes() - minutes);
	return date.toISOString();
}

// ============================================================
// CONVERSATIONS & MESSAGES (already in InboxContent.tsx)
// ============================================================

export const mockConversations: ServerConversation[] = [
	{
		id: "conv_ig_001",
		platform: "instagram",
		accountId: "acc_001",
		accountUsername: "acme.studio",
		participantId: "ig_user_12345",
		participantName: "Sarah Chen",
		participantPicture: "https://i.pravatar.cc/150?u=sarah_chen",
		participantVerifiedType: null,
		lastMessage: "Hey! Love your latest post about brand design 🎨",
		updatedTime: minutesAgo(15),
		status: "active",
		unreadCount: 2,
		url: "https://instagram.com/direct/t/123",
		instagramProfile: {
			isFollower: true,
			isFollowing: true,
			followerCount: 12500,
			isVerified: false,
			fetchedAt: hoursAgo(2),
		},
	},
	{
		id: "conv_tw_002",
		platform: "twitter",
		accountId: "acc_002",
		accountUsername: "AcmeStudio",
		participantId: "tw_user_67890",
		participantName: "James Wilson",
		participantPicture: "https://i.pravatar.cc/150?u=james_wilson",
		participantVerifiedType: "blue",
		lastMessage: "Would love to collab on the upcoming campaign!",
		updatedTime: hoursAgo(3),
		status: "active",
		unreadCount: 0,
		url: "https://twitter.com/messages/456",
	},
	{
		id: "conv_ig_003",
		platform: "instagram",
		accountId: "acc_001",
		accountUsername: "acme.studio",
		participantId: "ig_user_99999",
		participantName: "Maria Garcia",
		participantPicture: "https://i.pravatar.cc/150?u=maria_garcia",
		participantVerifiedType: null,
		lastMessage:
			"The product photos look amazing! When can we schedule the next shoot?",
		updatedTime: hoursAgo(8),
		status: "active",
		unreadCount: 1,
		url: "https://instagram.com/direct/t/789",
	},
	{
		id: "conv_fb_004",
		platform: "facebook",
		accountId: "acc_003",
		accountUsername: "AcmeStudioOfficial",
		participantId: "fb_user_11111",
		participantName: "Alex Kim",
		participantPicture: "https://i.pravatar.cc/150?u=alex_kim",
		participantVerifiedType: null,
		lastMessage: "Thanks for the update! The analytics look promising 📈",
		updatedTime: daysAgo(1),
		status: "active",
		unreadCount: 0,
		url: "https://facebook.com/messages/t/abc123",
	},
	{
		id: "conv_tg_005",
		platform: "telegram",
		accountId: "acc_004",
		accountUsername: "acme_bot",
		participantId: "tg_user_77777",
		participantName: "Tom Brown",
		participantPicture: "https://i.pravatar.cc/150?u=tom_brown",
		participantVerifiedType: null,
		lastMessage:
			"The broadcast message was sent successfully to all subscribers",
		updatedTime: daysAgo(3),
		status: "active",
		unreadCount: 5,
		url: null,
	},
	{
		id: "conv_rd_006",
		platform: "reddit",
		accountId: "acc_005",
		accountUsername: "AcmeStudio_Reddit",
		participantId: "rd_user_33333",
		participantName: "u/design_enthusiast",
		participantPicture: null,
		participantVerifiedType: null,
		lastMessage:
			"Great insights on the brand strategy post! Could you elaborate on the target audience section?",
		updatedTime: daysAgo(4),
		status: "active",
		unreadCount: 1,
		url: "https://reddit.com/message/messages/456",
	},
	{
		id: "conv_bs_007",
		platform: "bluesky",
		accountId: "acc_006",
		accountUsername: "acme.studio.bsky",
		participantId: "bsky_user_88888",
		participantName: "Jordan Lee",
		participantPicture: "https://i.pravatar.cc/150?u=jordan_lee",
		participantVerifiedType: null,
		lastMessage: "Loved the thread on social media trends! 🔥",
		updatedTime: daysAgo(5),
		status: "active",
		unreadCount: 0,
		url: "https://bsky.app/profile/acme.studio.bsky.app",
	},
];

export const mockMessages: Record<string, ServerMessage[]> = {
	conv_ig_001: [
		{
			id: "msg_ig_001_1",
			conversationId: "conv_ig_001",
			accountId: "acc_001",
			platform: "instagram",
			message: "Hey! Love your latest post about brand design 🎨",
			senderId: "ig_user_12345",
			senderName: "Sarah Chen",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: minutesAgo(15),
			attachments: [],
		},
		{
			id: "msg_ig_001_2",
			conversationId: "conv_ig_001",
			accountId: "acc_001",
			platform: "instagram",
			message: "Would be great to chat about a potential collaboration!",
			senderId: "ig_user_12345",
			senderName: "Sarah Chen",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: minutesAgo(14),
			attachments: [],
		},
		{
			id: "msg_ig_001_3",
			conversationId: "conv_ig_001",
			accountId: "acc_001",
			platform: "instagram",
			message:
				"Thanks Sarah! I'd love to explore that. What kind of collaboration did you have in mind?",
			senderId: "acc_001",
			senderName: "Acme Studio",
			senderVerifiedType: null,
			direction: "outgoing",
			createdAt: minutesAgo(10),
			attachments: [],
			deliveryStatus: "read",
		},
		{
			id: "msg_ig_001_4",
			conversationId: "conv_ig_001",
			accountId: "acc_001",
			platform: "instagram",
			message:
				"We're planning a summer campaign and your aesthetic would be perfect!",
			senderId: "ig_user_12345",
			senderName: "Sarah Chen",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: minutesAgo(5),
			attachments: [],
		},
		{
			id: "msg_ig_001_5",
			conversationId: "conv_ig_001",
			accountId: "acc_001",
			platform: "instagram",
			message: "That sounds exciting! Can you send me the brief?",
			senderId: "acc_001",
			senderName: "Acme Studio",
			senderVerifiedType: null,
			direction: "outgoing",
			createdAt: minutesAgo(3),
			attachments: [],
			deliveryStatus: "delivered",
		},
	],
	conv_tw_002: [
		{
			id: "msg_tw_002_1",
			conversationId: "conv_tw_002",
			accountId: "acc_002",
			platform: "twitter",
			message:
				"Hey! Just saw your thread on content strategy 📊 Really impressive work!",
			senderId: "tw_user_67890",
			senderName: "James Wilson",
			senderVerifiedType: "blue",
			direction: "incoming",
			createdAt: hoursAgo(5),
			attachments: [],
		},
		{
			id: "msg_tw_002_2",
			conversationId: "conv_tw_002",
			accountId: "acc_002",
			platform: "twitter",
			message: "Thank you! We've been focusing on data-driven content lately",
			senderId: "acc_002",
			senderName: "AcmeStudio",
			senderVerifiedType: null,
			direction: "outgoing",
			createdAt: hoursAgo(4),
			attachments: [],
			deliveryStatus: "read",
		},
		{
			id: "msg_tw_002_3",
			conversationId: "conv_tw_002",
			accountId: "acc_002",
			platform: "twitter",
			message: "Would love to collab on the upcoming campaign!",
			senderId: "tw_user_67890",
			senderName: "James Wilson",
			senderVerifiedType: "blue",
			direction: "incoming",
			createdAt: hoursAgo(3),
			attachments: [],
		},
	],
	conv_ig_003: [
		{
			id: "msg_ig_003_1",
			conversationId: "conv_ig_003",
			accountId: "acc_001",
			platform: "instagram",
			message: "Hi! I saw the product photography in your recent posts 📸",
			senderId: "ig_user_99999",
			senderName: "Maria Garcia",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: hoursAgo(10),
			attachments: [],
		},
		{
			id: "msg_ig_003_2",
			conversationId: "conv_ig_003",
			accountId: "acc_001",
			platform: "instagram",
			message:
				"The product photos look amazing! When can we schedule the next shoot?",
			senderId: "ig_user_99999",
			senderName: "Maria Garcia",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: hoursAgo(8),
			attachments: [],
		},
	],
	conv_fb_004: [
		{
			id: "msg_fb_004_1",
			conversationId: "conv_fb_004",
			accountId: "acc_003",
			platform: "facebook",
			message: "Hey team! Just reviewed the monthly analytics report 📈",
			senderId: "acc_003",
			senderName: "AcmeStudioOfficial",
			senderVerifiedType: null,
			direction: "outgoing",
			createdAt: daysAgo(1) + "T10:00:00Z",
			attachments: [],
			deliveryStatus: "read",
		},
		{
			id: "msg_fb_004_2",
			conversationId: "conv_fb_004",
			accountId: "acc_003",
			platform: "facebook",
			message: "Thanks for the update! The analytics look promising 📈",
			senderId: "fb_user_11111",
			senderName: "Alex Kim",
			senderVerifiedType: null,
			direction: "incoming",
			createdAt: daysAgo(1),
			attachments: [],
		},
	],
};

// ============================================================
// COMMENTS
// Zernio API: GET /v1/inbox/comments
// ============================================================

export interface MockComment {
	id: string;
	platform: string;
	accountId: string;
	accountUsername: string;
	content: string;
	picture: string | null;
	permalink: string | null;
	createdTime: string;
	commentCount: number;
	likeCount: number;
	subreddit?: string | null;
	cid?: string | null;
}

export const mockComments: MockComment[] = [
	{
		id: "post_ig_001",
		platform: "instagram",
		accountId: "acc_001",
		accountUsername: "acme.studio",
		content:
			"🚀 Just launched our new brand identity! What do you think? Swipe to see the full redesign. #branddesign #creative",
		picture: "https://i.pravatar.cc/400/300?u=post_ig_001",
		permalink: "https://instagram.com/p/ABC123/",
		createdTime: hoursAgo(6),
		commentCount: 47,
		likeCount: 892,
	},
	{
		id: "post_tw_001",
		platform: "twitter",
		accountId: "acc_002",
		accountUsername: "AcmeStudio",
		content:
			"Thread: 10 lessons we learned growing from 0 to 100k followers in 18 months 🧵",
		picture: null,
		permalink: "https://twitter.com/AcmeStudio/status/XYZ789/",
		createdTime: hoursAgo(12),
		commentCount: 89,
		likeCount: 2340,
	},
	{
		id: "post_ig_002",
		platform: "instagram",
		accountId: "acc_001",
		accountUsername: "acme.studio",
		content:
			"Behind the scenes of our latest photoshoot ✨ Professional lighting makes all the difference!",
		picture: "https://i.pravatar.cc/400/300?u=post_ig_002",
		permalink: "https://instagram.com/p/DEF456/",
		createdTime: daysAgo(1),
		commentCount: 23,
		likeCount: 456,
	},
	{
		id: "post_rd_001",
		platform: "reddit",
		accountId: "acc_005",
		accountUsername: "AcmeStudio_Reddit",
		content:
			"r/marketing - What are your favorite tools for social media analytics? Looking for recommendations",
		picture: null,
		permalink:
			"https://www.reddit.com/r/marketing/comments/1abc234/what_are_your_favorite_tools/",
		createdTime: daysAgo(2),
		commentCount: 156,
		likeCount: 234,
		subreddit: "marketing",
	},
	{
		id: "post_ig_003",
		platform: "instagram",
		accountId: "acc_001",
		accountUsername: "acme.studio",
		content:
			"Our team retreat was incredible! Building culture beyond the office walls 💪 #teambuilding #companyculture",
		picture: "https://i.pravatar.cc/400/300?u=post_ig_003",
		permalink: "https://instagram.com/p/GHI789/",
		createdTime: daysAgo(3),
		commentCount: 34,
		likeCount: 567,
	},
	{
		id: "post_bs_001",
		platform: "bluesky",
		accountId: "acc_006",
		accountUsername: "acme.studio.bsky",
		content:
			"Hot take: Social media analytics are overrated. Engagement quality > quantity. Change my mind.",
		picture: null,
		permalink: "https://bsky.app/profile/acme.studio.bsky.app/post/xyz123",
		createdTime: daysAgo(4),
		commentCount: 67,
		likeCount: 890,
		cid: "xyz123",
	},
];

// ============================================================
// REVIEWS
// Zernio API: GET /v1/inbox/reviews
// ============================================================

export interface MockReview {
	id: string;
	platform: string;
	accountId: string;
	accountUsername: string;
	reviewer: {
		id: string | null;
		name: string;
		profileImage: string | null;
	};
	rating: number;
	text: string;
	created: string;
	hasReply: boolean;
	reply?: {
		id: string;
		text: string;
		created: string;
	};
	reviewUrl: string | null;
}

export const mockReviews: MockReview[] = [
	{
		id: "rev_fb_001",
		platform: "facebook",
		accountId: "acc_003",
		accountUsername: "AcmeStudioOfficial",
		reviewer: {
			id: "fb_reviewer_001",
			name: "David Miller",
			profileImage: "https://i.pravatar.cc/150?u=david_miller",
		},
		rating: 5,
		text: "Absolutely fantastic service! The team went above and beyond to meet our deadline. Highly recommend for any brand looking to level up their social presence. 🌟",
		created: daysAgo(2),
		hasReply: true,
		reply: {
			id: "reply_fb_001",
			text: "Thank you so much David! We really appreciate your kind words. Looking forward to working together again soon!",
			created: daysAgo(1),
		},
		reviewUrl: "https://facebook.com/business/reviews/123",
	},
	{
		id: "rev_fb_002",
		platform: "facebook",
		accountId: "acc_003",
		accountUsername: "AcmeStudioOfficial",
		reviewer: {
			id: "fb_reviewer_002",
			name: "Emily Chen",
			profileImage: "https://i.pravatar.cc/150?u=emily_chen",
		},
		rating: 4,
		text: "Great work on our recent campaign! The only reason I'm not giving 5 stars is that delivery was slightly delayed. But the quality was outstanding.",
		created: daysAgo(5),
		hasReply: false,
		reviewUrl: "https://facebook.com/business/reviews/124",
	},
	{
		id: "rev_gg_001",
		platform: "googlebusiness",
		accountId: "acc_007",
		accountUsername: "Acme Studio",
		reviewer: {
			id: "gg_reviewer_001",
			name: "Michael Brown",
			profileImage: "https://i.pravatar.cc/150?u=michael_brown",
		},
		rating: 5,
		text: "Best social media agency we've ever worked with! Their data-driven approach really helped us understand our audience better.",
		created: daysAgo(7),
		hasReply: true,
		reply: {
			id: "reply_gg_001",
			text: "Thank you Michael! Data is at the core of everything we do. Glad it's making a difference for your brand!",
			created: daysAgo(6),
		},
		reviewUrl: "https://business.google.com/reviews/abc",
	},
	{
		id: "rev_fb_003",
		platform: "facebook",
		accountId: "acc_003",
		accountUsername: "AcmeStudioOfficial",
		reviewer: {
			id: "fb_reviewer_003",
			name: "Sarah Johnson",
			profileImage: "https://i.pravatar.cc/150?u=sarah_johnson",
		},
		rating: 5,
		text: "Incredible ROI on our campaigns! The team's creativity combined with their analytics expertise is a winning combination. Our engagement is up 300%!",
		created: daysAgo(10),
		hasReply: false,
		reviewUrl: "https://facebook.com/business/reviews/125",
	},
];

// ============================================================
// CONTACTS
// Zernio API: GET /v1/contacts
// ============================================================

export interface MockContact {
	id: string;
	name: string;
	email: string;
	company: string;
	avatarUrl: string;
	tags: string[];
	isSubscribed: boolean;
	isBlocked: boolean;
	lastMessageSentAt: string | null;
	lastMessageReceivedAt: string | null;
	messagesSentCount: number;
	messagesReceivedCount: number;
	customFields: Record<string, string>;
	notes: string;
	createdAt: string;
	platform: string;
	platformIdentifier: string;
	displayIdentifier: string;
}

export const mockContacts: MockContact[] = [
	{
		id: "contact_001",
		name: "Sarah Chen",
		email: "sarah.chen@email.com",
		company: "Design Studio Co",
		avatarUrl: "https://i.pravatar.cc/150?u=sarah_chen",
		tags: ["vip", "design", "collaboration"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: hoursAgo(2),
		lastMessageReceivedAt: hoursAgo(3),
		messagesSentCount: 45,
		messagesReceivedCount: 38,
		customFields: { "Lead Source": "Instagram", Budget: "$5k-10k" },
		notes: "Interested in Q3 collaboration. Follow up after campaign launch.",
		createdAt: daysAgo(30),
		platform: "instagram",
		platformIdentifier: "ig_user_12345",
		displayIdentifier: "@sarah_chen",
	},
	{
		id: "contact_002",
		name: "James Wilson",
		email: "james@techstartup.io",
		company: "TechStartup Inc",
		avatarUrl: "https://i.pravatar.cc/150?u=james_wilson",
		tags: ["lead", "tech", "investor"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: hoursAgo(8),
		lastMessageReceivedAt: hoursAgo(12),
		messagesSentCount: 23,
		messagesReceivedCount: 19,
		customFields: { "Lead Source": "Twitter", "Company Stage": "Series A" },
		notes: "Investor relations. Potential partnership opportunity.",
		createdAt: daysAgo(45),
		platform: "twitter",
		platformIdentifier: "tw_user_67890",
		displayIdentifier: "@jameswilson",
	},
	{
		id: "contact_003",
		name: "Maria Garcia",
		email: "maria.garcia@photography.com",
		company: "MG Photography",
		avatarUrl: "https://i.pravatar.cc/150?u=maria_garcia",
		tags: ["customer", "photographer"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: daysAgo(1),
		lastMessageReceivedAt: daysAgo(1),
		messagesSentCount: 67,
		messagesReceivedCount: 54,
		customFields: { "Lead Source": "Website", "Preferred Package": "Pro" },
		notes: "Regular client. Always books for product photography.",
		createdAt: daysAgo(90),
		platform: "instagram",
		platformIdentifier: "ig_user_99999",
		displayIdentifier: "@maria_garcia_photo",
	},
	{
		id: "contact_004",
		name: "Alex Kim",
		email: "alex.kim@enterprise.com",
		company: "Enterprise Solutions Ltd",
		avatarUrl: "https://i.pravatar.cc/150?u=alex_kim",
		tags: ["enterprise", "decision-maker"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: daysAgo(2),
		lastMessageReceivedAt: daysAgo(3),
		messagesSentCount: 12,
		messagesReceivedCount: 8,
		customFields: {
			"Lead Source": "Facebook",
			"Company Size": "500+ employees",
			"Annual Budget": "$50k+",
		},
		notes: "C-level contact. Long sales cycle expected.",
		createdAt: daysAgo(60),
		platform: "facebook",
		platformIdentifier: "fb_user_11111",
		displayIdentifier: "Alex Kim",
	},
	{
		id: "contact_005",
		name: "Tom Brown",
		email: "tom.brown@agency.com",
		company: "Digital Agency Pro",
		avatarUrl: "https://i.pravatar.cc/150?u=tom_brown",
		tags: ["partner", "agency"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: daysAgo(5),
		lastMessageReceivedAt: daysAgo(5),
		messagesSentCount: 89,
		messagesReceivedCount: 76,
		customFields: {
			"Lead Source": "Referral",
			"Partnership Type": "Cross-promotion",
		},
		notes: "Agency partner. Regular cross-promotion collaborations.",
		createdAt: daysAgo(120),
		platform: "telegram",
		platformIdentifier: "tg_user_77777",
		displayIdentifier: "+1 555-0123",
	},
	{
		id: "contact_006",
		name: "u/design_enthusiast",
		email: "",
		company: "",
		avatarUrl: "https://i.pravatar.cc/150?u=reddit_user",
		tags: ["reddit", "community"],
		isSubscribed: false,
		isBlocked: false,
		lastMessageSentAt: null,
		lastMessageReceivedAt: daysAgo(4),
		messagesSentCount: 0,
		messagesReceivedCount: 3,
		customFields: {},
		notes: "Active Reddit community member. Engages with content regularly.",
		createdAt: daysAgo(15),
		platform: "reddit",
		platformIdentifier: "rd_user_33333",
		displayIdentifier: "u/design_enthusiast",
	},
	{
		id: "contact_007",
		name: "Jordan Lee",
		email: "jordan.lee@startup.co",
		company: "Bluesky Startup",
		avatarUrl: "https://i.pravatar.cc/150?u=jordan_lee",
		tags: ["lead", "web3", "early-adopter"],
		isSubscribed: true,
		isBlocked: false,
		lastMessageSentAt: daysAgo(7),
		lastMessageReceivedAt: daysAgo(8),
		messagesSentCount: 15,
		messagesReceivedCount: 12,
		customFields: { "Lead Source": "Bluesky", "Platform Preference": "Web3" },
		notes: "Early adopter of Bluesky. Interested in Web3 marketing tools.",
		createdAt: daysAgo(20),
		platform: "bluesky",
		platformIdentifier: "bsky_user_88888",
		displayIdentifier: "@jordan.bsky.social",
	},
];

// ============================================================
// BROADCASTS
// Zernio API: GET /v1/broadcasts
// ============================================================

export interface MockBroadcast {
	id: string;
	name: string;
	description: string;
	platform: string;
	accountId: string;
	accountName: string;
	status:
		| "draft"
		| "scheduled"
		| "sending"
		| "completed"
		| "failed"
		| "cancelled";
	messagePreview: string;
	scheduledAt: string | null;
	startedAt: string | null;
	completedAt: string | null;
	recipientCount: number;
	sentCount: number;
	deliveredCount: number;
	readCount: number;
	failedCount: number;
	createdAt: string;
}

export const mockBroadcasts: MockBroadcast[] = [
	{
		id: "broadcast_001",
		name: "Summer Sale Announcement",
		description: "Announce our summer sale to all subscribers",
		platform: "instagram",
		accountId: "acc_001",
		accountName: "acme.studio",
		status: "completed",
		messagePreview:
			"🔥 SUMMER SALE IS HERE! Get up to 50% off on all products...",
		scheduledAt: daysAgo(3) + "T10:00:00Z",
		startedAt: daysAgo(3) + "T10:00:00Z",
		completedAt: daysAgo(3) + "T10:05:00Z",
		recipientCount: 12500,
		sentCount: 12480,
		deliveredCount: 12350,
		readCount: 8920,
		failedCount: 20,
		createdAt: daysAgo(7),
	},
	{
		id: "broadcast_002",
		name: "New Product Launch",
		description: "Launch announcement for new premium tier",
		platform: "telegram",
		accountId: "acc_004",
		accountName: "acme_bot",
		status: "scheduled",
		messagePreview:
			"✨ Introducing Premium: Unlimited access, priority support, and exclusive features...",
		scheduledAt: daysAgo(1) + "T09:00:00Z",
		startedAt: null,
		completedAt: null,
		recipientCount: 3420,
		sentCount: 0,
		deliveredCount: 0,
		readCount: 0,
		failedCount: 0,
		createdAt: hoursAgo(6),
	},
	{
		id: "broadcast_003",
		name: "Weekly Newsletter",
		description: "This week's top content and insights",
		platform: "twitter",
		accountId: "acc_002",
		accountName: "AcmeStudio",
		status: "draft",
		messagePreview:
			"📬 Your weekly dose of marketing insights is here! This week: Thread on engagement...",
		scheduledAt: null,
		startedAt: null,
		completedAt: null,
		recipientCount: 0,
		sentCount: 0,
		deliveredCount: 0,
		readCount: 0,
		failedCount: 0,
		createdAt: hoursAgo(2),
	},
	{
		id: "broadcast_004",
		name: "Flash Sale (2 hours only)",
		description: "Limited time flash sale announcement",
		platform: "whatsapp",
		accountId: "acc_008",
		accountName: "Acme Official",
		status: "sending",
		messagePreview:
			"⚡ FLASH SALE! 2 hours only! Use code FLASH20 for instant discount...",
		scheduledAt: hoursAgo(1) + "T14:00:00Z",
		startedAt: hoursAgo(1) + "T14:00:00Z",
		completedAt: null,
		recipientCount: 8900,
		sentCount: 6500,
		deliveredCount: 6480,
		readCount: 4200,
		failedCount: 20,
		createdAt: daysAgo(2),
	},
	{
		id: "broadcast_005",
		name: "Customer Appreciation Day",
		description: "Thank you message for loyal customers",
		platform: "facebook",
		accountId: "acc_003",
		accountName: "AcmeStudioOfficial",
		status: "completed",
		messagePreview:
			"💝 Thank you for being part of our journey! As a token of appreciation...",
		scheduledAt: daysAgo(5) + "T12:00:00Z",
		startedAt: daysAgo(5) + "T12:00:00Z",
		completedAt: daysAgo(5) + "T12:03:00Z",
		recipientCount: 7800,
		sentCount: 7795,
		deliveredCount: 7750,
		readCount: 6890,
		failedCount: 5,
		createdAt: daysAgo(10),
	},
];

// ============================================================
// SEQUENCES
// Zernio API: GET /v1/sequences
// ============================================================

export interface MockSequence {
	id: string;
	name: string;
	description: string;
	platform: string;
	accountId: string;
	accountName: string;
	messagePreview: string;
	status: "draft" | "active" | "paused";
	stepsCount: number;
	exitOnReply: boolean;
	exitOnUnsubscribe: boolean;
	totalEnrolled: number;
	totalCompleted: number;
	totalExited: number;
	createdAt: string;
}

export const mockSequences: MockSequence[] = [
	{
		id: "sequence_001",
		name: "New Follower Welcome",
		description: "Welcome sequence for new Instagram followers",
		platform: "instagram",
		accountId: "acc_001",
		accountName: "acme.studio",
		messagePreview: "Welcome to the community! 🎉 We're so glad you're here...",
		status: "active",
		stepsCount: 5,
		exitOnReply: true,
		exitOnUnsubscribe: true,
		totalEnrolled: 2340,
		totalCompleted: 1890,
		totalExited: 450,
		createdAt: daysAgo(60),
	},
	{
		id: "sequence_002",
		name: "Lead Nurturing Flow",
		description: "5-day email sequence for qualified leads",
		platform: "whatsapp",
		accountId: "acc_008",
		accountName: "Acme Official",
		messagePreview: "Hi {{name}}! Thanks for your interest in our services...",
		status: "active",
		stepsCount: 5,
		exitOnReply: true,
		exitOnUnsubscribe: true,
		totalEnrolled: 567,
		totalCompleted: 234,
		totalExited: 333,
		createdAt: daysAgo(30),
	},
	{
		id: "sequence_003",
		name: "Abandoned Cart Reminder",
		description: "Reminder for users who added items but didn't checkout",
		platform: "telegram",
		accountId: "acc_004",
		accountName: "acme_bot",
		messagePreview:
			"😮 Looks like you left something behind! Complete your purchase...",
		status: "paused",
		stepsCount: 3,
		exitOnReply: true,
		exitOnUnsubscribe: true,
		totalEnrolled: 1234,
		totalCompleted: 890,
		totalExited: 344,
		createdAt: daysAgo(45),
	},
	{
		id: "sequence_004",
		name: "Post-Purchase Follow-up",
		description: "Thank you and upsell sequence after purchase",
		platform: "instagram",
		accountId: "acc_001",
		accountName: "acme.studio",
		messagePreview:
			"Thank you for your purchase! 🎁 Here's what you might also like...",
		status: "draft",
		stepsCount: 4,
		exitOnReply: false,
		exitOnUnsubscribe: true,
		totalEnrolled: 0,
		totalCompleted: 0,
		totalExited: 0,
		createdAt: daysAgo(7),
	},
	{
		id: "sequence_005",
		name: "Re-engagement Campaign",
		description: "Win back inactive subscribers",
		platform: "twitter",
		accountId: "acc_002",
		accountName: "AcmeStudio",
		messagePreview: "We miss you! Here's what you've been missing...",
		status: "active",
		stepsCount: 3,
		exitOnReply: true,
		exitOnUnsubscribe: true,
		totalEnrolled: 456,
		totalCompleted: 123,
		totalExited: 333,
		createdAt: daysAgo(20),
	},
];

// ============================================================
// Helper functions
// ============================================================

export function getMockMessages(conversationId: string): ServerMessage[] {
	return mockMessages[conversationId] ?? [];
}

export function shouldUseMockData(error: unknown): boolean {
	if (!error) return false;
	const errorMessage =
		typeof error === "string"
			? error
			: error instanceof Error
				? error.message
				: JSON.stringify(error);
	return (
		errorMessage.includes("API key required") ||
		errorMessage.includes("Not authenticated") ||
		errorMessage.includes("Failed to fetch") ||
		errorMessage.includes("Network error") ||
		errorMessage.includes("401") ||
		errorMessage.includes("NetworkError")
	);
}

// ============================================================
// Type exports for use in components
// ============================================================

export type {
	ServerConversation,
	ServerMessage,
} from "@/app/inbox/InboxContent";
