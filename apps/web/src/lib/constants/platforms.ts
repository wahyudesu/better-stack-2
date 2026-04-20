/**
 * Unified platform configuration.
 */

import type { GeneratedContentType as ContentType, GeneratedGoal as ScriptGoal, GeneratedTone as Tone } from "@/lib/types/ai";
import type { ProfilePlatform } from "@/lib/types/core/platform";

// ============================================================
// SOCIAL MEDIA PLATFORMS
// ============================================================

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
 * Platform icons and colors for dashboard display.
 * Uses react-social-icons network names.
 */
export const PLATFORMS = [
	{
		name: "Instagram",
		network: "instagram",
		color: "#E1306C",
		url: "https://instagram.com",
	},
	{
		name: "Facebook",
		network: "facebook",
		color: "#1877F2",
		url: "https://facebook.com",
	},
	{
		name: "Twitter/X",
		network: "twitter",
		color: "#000000",
		url: "https://x.com",
	},
	{
		name: "TikTok",
		network: "tiktok",
		color: "#000000",
		url: "https://tiktok.com",
	},
	{
		name: "LinkedIn",
		network: "linkedin",
		color: "#0077B5",
		url: "https://linkedin.com",
	},
	{
		name: "YouTube",
		network: "youtube",
		color: "#FF0000",
		url: "https://youtube.com",
	},
	{
		name: "Pinterest",
		network: "pinterest",
		color: "#E60023",
		url: "https://pinterest.com",
	},
] as const;

/**
 * Social media options for filter dropdowns.
 */
export const SOCIAL_MEDIA_OPTIONS = [
	{ value: "all", label: "All Platforms" },
	{ value: "instagram", label: "Instagram" },
	{ value: "twitter", label: "Twitter/X" },
	{ value: "tiktok", label: "TikTok" },
	{ value: "youtube", label: "YouTube" },
	{ value: "linkedin", label: "LinkedIn" },
	{ value: "facebook", label: "Facebook" },
] as const;

// ============================================================
// PLATFORM MULTIPLIERS
// ============================================================

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
	shares: number;
}

/**
 * Platform multipliers for metric calculations.
 */
export const PLATFORM_MULTIPLIERS: Record<string, PlatformMultiplier> = {
	all: {
		engagements: 1,
		followers: 1,
		impressions: 1,
		likes: 1,
		visits: 1,
		replies: 1,
		shares: 1,
	},
	facebook: {
		engagements: 0.8,
		followers: 1.2,
		impressions: 1.5,
		likes: 0.9,
		visits: 1.1,
		replies: 0.7,
		shares: 1.2,
	},
	instagram: {
		engagements: 1.5,
		followers: 1.3,
		impressions: 1.2,
		likes: 1.8,
		visits: 0.9,
		replies: 0.6,
		shares: 0.8,
	},
	twitter: {
		engagements: 1.2,
		followers: 0.9,
		impressions: 1.3,
		likes: 0.7,
		visits: 1.3,
		replies: 1.8,
		shares: 1.5,
	},
	tiktok: {
		engagements: 2.0,
		followers: 1.8,
		impressions: 2.5,
		likes: 2.2,
		visits: 0.7,
		replies: 0.4,
		shares: 1.8,
	},
	youtube: {
		engagements: 0.6,
		followers: 1.5,
		impressions: 1.8,
		likes: 0.8,
		visits: 1.2,
		replies: 0.5,
		shares: 0.4,
	},
	linkedin: {
		engagements: 0.5,
		followers: 0.8,
		impressions: 0.9,
		likes: 0.4,
		visits: 1.8,
		replies: 1.2,
		shares: 0.6,
	},
	pinterest: {
		engagements: 0.4,
		followers: 0.7,
		impressions: 1.1,
		likes: 0.6,
		visits: 2.0,
		replies: 0.3,
		shares: 1.5,
	},
} as const;

// ============================================================
// AI POST PLATFORMS
// ============================================================

export interface PlatformConfig {
	id: string;
	name: string;
	icon: string;
	color: string;
	description: string;
	maxChars: number;
	supports: ContentType[];
}

export const platforms: PlatformConfig[] = [
	{
		id: "threads",
		name: "Threads",
		icon: "🧵",
		color: "bg-black dark:bg-white",
		description: "Text & visual conversations",
		maxChars: 500,
		supports: ["single", "thread"],
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: "💼",
		color: "bg-blue-600",
		description: "Professional networking",
		maxChars: 3000,
		supports: ["single", "carousel", "video"],
	},
	{
		id: "twitter",
		name: "Twitter/X",
		icon: "𝕏",
		color: "bg-black",
		description: "Real-time conversations",
		maxChars: 280,
		supports: ["single", "thread"],
	},
	{
		id: "instagram",
		name: "Instagram",
		icon: "📸",
		color: "bg-gradient-to-br from-purple-500 to-pink-500",
		description: "Visual storytelling",
		maxChars: 2200,
		supports: ["single", "carousel", "video"],
	},
	{
		id: "tiktok",
		name: "TikTok",
		icon: "🎵",
		color: "bg-black",
		description: "Short-form video",
		maxChars: 150,
		supports: ["video"],
	},
];

export const contentTypes = [
	{
		value: "single" as ContentType,
		label: "Single Post",
		icon: "📝",
		description: "One standalone post",
	},
	{
		value: "thread" as ContentType,
		label: "Thread Series",
		icon: "🧵",
		description: "Multi-part thread",
	},
	{
		value: "carousel" as ContentType,
		label: "Carousel",
		icon: "🎠",
		description: "Multi-slide content",
	},
	{
		value: "video" as ContentType,
		label: "Video Script",
		icon: "🎬",
		description: "Script for short-form video",
	},
];

export const tones = [
	{
		value: "professional" as Tone,
		label: "Pro",
		color: "bg-blue-500",
		shortDesc: "Expert",
	},
	{
		value: "casual" as Tone,
		label: "Casual",
		color: "bg-green-500",
		shortDesc: "Relaxed",
	},
	{
		value: "inspirational" as Tone,
		label: "Inspire",
		color: "bg-purple-500",
		shortDesc: "Motivating",
	},
	{
		value: "educational" as Tone,
		label: "Edu",
		color: "bg-orange-500",
		shortDesc: "Teaching",
	},
	{
		value: "friendly" as Tone,
		label: "Friendly",
		color: "bg-pink-500",
		shortDesc: "Warm",
	},
	{
		value: "storytelling" as Tone,
		label: "Story",
		color: "bg-indigo-500",
		shortDesc: "Narrative",
	},
];

export const goals = [
	{
		value: "engagement" as ScriptGoal,
		label: "Engagement",
		icon: "💬",
		description: "Get likes, comments, shares",
	},
	{
		value: "sales" as ScriptGoal,
		label: "Sales",
		icon: "🛒",
		description: "Drive purchases",
	},
	{
		value: "branding" as ScriptGoal,
		label: "Branding",
		icon: "🎯",
		description: "Build brand",
	},
	{
		value: "education" as ScriptGoal,
		label: "Educate",
		icon: "📚",
		description: "Share knowledge",
	},
	{
		value: "entertainment" as ScriptGoal,
		label: "Fun",
		icon: "🎭",
		description: "Entertain",
	},
];

// ============================================================
// AI POST GENERATION
// ============================================================

export async function generatePost(
	topic: string,
	platform: string,
	contentType: ContentType,
	tone: Tone,
	goal: ScriptGoal,
): Promise<{ content: string; hashtags: string[]; cta: string }> {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const generateHashtags = (topic: string): string[] => {
		const words = topic
			.toLowerCase()
			.split(" ")
			.filter((w: string) => w.length > 2);
		const baseTags = words.map(
			(w: string) => `#${w.replace(/[^a-z0-9]/g, "")}`,
		);
		return [...baseTags.slice(0, 3), "#AIContent", "#SocialMedia"];
	};

	const generateCTA = (goal: ScriptGoal): string => {
		const ctas = {
			engagement: "💬 Drop your thoughts below!",
			sales: "🔗 Link in bio for more!",
			branding: "Follow for more insights",
			education: "💡 Save this for later!",
			entertainment: "👇 Double tap if you agree!",
		};
		return ctas[goal];
	};

	let content = "";

	if (platform === "threads" && contentType === "thread") {
		content = `🧵 ${topic}

1/${goal === "engagement" ? "Let's talk about something important..." : "Here's what most people get wrong:"}

${tone === "casual" ? "Okay, so here's the thing —" : "Let's break this down:"}

${topic.split(" ").slice(0, 5).join(" ")} isn't just about ${topic.split(" ")[0]}. It's about the bigger picture.

2/${goal === "education" ? "The truth is:" : "Here's where it gets interesting:"}

Most people miss this because they're focused on the wrong thing.

The real key? Consistency + Strategy.

3/Quick story:

I used to think ${topic.split(" ")[0] || "it"} was just about luck.

Until I realized:

→ It's about showing up daily
→ It's about providing value
→ It's about building genuine connections

4/So if you're struggling with ${topic.split(" ")[0] || "this"}, remember:

You're not behind. You're just on your own timeline.

Keep going. 💪

5/${generateCTA(goal)}`;
	} else if (platform === "linkedin") {
		content = `${topic === topic.toUpperCase() ? topic : topic.charAt(0).toUpperCase() + topic.slice(1)}

Here's my perspective:

${tone === "professional" ? "After analyzing this topic extensively," : "I've been thinking about this a lot,"}

${topic.split(" ")[0]?.charAt(0).toUpperCase() + topic.split(" ")[0]?.slice(1)} is not just about the surface level.

It's about:

→ Understanding the fundamentals
→ Applying them consistently
→ Measuring what works

${goal === "sales" ? "Want to dive deeper? Link in bio 👇" : "What's your experience?"}

I'd love to hear your thoughts below.

${generateCTA(goal)}

#${topic
			.split(" ")
			.join("")
			.replace(/[^a-zA-Z0-9]/g, "")} #Growth #Success`;
	} else if (platform === "twitter") {
		content = `${topic.split(" ").slice(0, 4).join(" ")} 👇

${tone === "casual" ? "okay but seriously" : "Here's the truth"} — ${goal === "education" ? "most people get this wrong" : "nobody talks about this enough"}

let me explain 🧵

${topic.split(" ")[0] || "It"} starts with understanding the basics.

Then you apply it consistently.

Results follow.

Simple? Yes.
Easy? No.

${generateCTA(goal)}`;
	} else if (platform === "instagram") {
		content = `${topic} ✨

${goal === "engagement" ? "POV:" : "Here's something I wish I knew earlier:"}

${topic.split(" ").slice(0, 6).join(" ")}...

Save this for later 📌
${generateCTA(goal)}`;
	} else if (platform === "tiktok") {
		content = `🎬 TikTok Script: ${topic}

【HOOK - First 1-2 seconds】
${tone === "casual" ? "Okay wait," : "Stop scrolling if"} ${topic.split(" ").slice(0, 3).join(" ")}...
${goal === "engagement" ? "This changed everything" : "Here's what nobody tells you"}

【BODY - 15-45 seconds】
${topic.split(" ").slice(0, 5).join(" ")} isn't what you think...

Let me show you 👇

${goal === "education" ? "Step 1:" : "First,"} Understand the basics
${goal === "education" ? "Step 2:" : "Then,"} Apply consistently
${goal === "education" ? "Step 3:" : "Finally,"} Watch what happens

【CTA】
${generateCTA(goal)}
Follow for more ${goal === "education" ? "tips" : "content"}! 🚀`;
	} else {
		content = `${topic}

${tone === "professional" ? "Key points:" : "Here's the thing:"}

• ${topic.split(" ")[0] || "It"} matters more than you think
• Consistency is key
• Results take time

${generateCTA(goal)}`;
	}

	return { content, hashtags: generateHashtags(topic), cta: generateCTA(goal) };
}
