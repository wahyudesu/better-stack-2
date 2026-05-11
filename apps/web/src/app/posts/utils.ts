import type { CalendarPlatform } from "@/data/mock";
import type { Post } from "@/lib/client";

// CalendarEvent interface
export interface CalendarEvent {
	id: string;
	title: string;
	date: string;
	platform: CalendarPlatform;
	platforms?: CalendarPlatform[];
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

// Platform colors
export const PLATFORM_COLORS: Record<string, string> = {
	instagram: "328 70% 55%",
	tiktok: "349 70% 56%",
	twitter: "203 89% 53%",
	youtube: "0 72% 51%",
	linkedin: "217 91% 60%",
	facebook: "220 44% 41%",
	pinterest: "340 82% 52%",
};

/**
 * Convert server Post to CalendarEvent format
 * Handles both local Convex posts and Zernio API response format
 */
export function postToCalendarEvent(post: Post): CalendarEvent {
	// Zernio uses scheduledFor, local uses scheduledAt
	let targetDate: Date;
	if ((post as any).scheduledFor) {
		targetDate = new Date((post as any).scheduledFor);
	} else if (post.scheduledAt) {
		targetDate = new Date(post.scheduledAt);
	} else if (post.publishedAt) {
		targetDate = new Date(post.publishedAt);
	} else {
		targetDate = new Date(post.createdAt);
	}

	// Use UTC methods to avoid timezone shifts — server sends UTC ISO strings
	const date = `${targetDate.getUTCFullYear()}-${String(targetDate.getUTCMonth() + 1).padStart(2, "0")}-${String(targetDate.getUTCDate()).padStart(2, "0")}`;
	const time = `${String(targetDate.getUTCHours()).padStart(2, "0")}:${String(targetDate.getUTCMinutes()).padStart(2, "0")}`;

	// Zernio API uses "content" field, fallback to "text"
	const postText = post.content || post.text || "";

	// Zernio: platforms is array of { platform, accountId, status, ... }
	// Extract accountIds from platforms if available
	let accountIds: string[] = [];
	let primaryPlatform = "instagram";

	if ((post as any).platforms && Array.isArray((post as any).platforms)) {
		const platforms = (post as any).platforms as Array<{
			platform?: string;
			accountId?: { _id?: string } | string;
		}>;
		accountIds = platforms
			.map((p) => {
				if (typeof p.accountId === "object" && p.accountId !== null) {
					return (p.accountId as any)._id || "";
				}
				return String(p.accountId || "");
			})
			.filter(Boolean);
		primaryPlatform = platforms[0]?.platform || "instagram";
	} else if (post.socialAccountIds && post.socialAccountIds.length > 0) {
		accountIds = post.socialAccountIds;
		primaryPlatform = (post as any).platform || "instagram";
	}

	return {
		id: post._id,
		title: postText.slice(0, 50) + (postText.length > 50 ? "..." : ""),
		date,
		platform: primaryPlatform as CalendarPlatform,
		platforms: accountIds as CalendarPlatform[],
		type: "post",
		time,
		description: postText,
		status: post.status,
		color: PLATFORM_COLORS[primaryPlatform] || "328 70% 55%",
		thumbnail:
			post.media?.[0]?.url ||
			(post as any).mediaItems?.[0]?.url ||
			(post as any).mediaUrls?.[0],
		mediaType: post.media?.[0]?.type === "video" ? "video" : "image",
	};
}

// Calculate week range - defined outside component to avoid unnecessary re-renders
export function getWeekRange(date: Date) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
	const startOfWeek = new Date(d.setDate(diff));
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(endOfWeek.getDate() + 6);
	return { startOfWeek, endOfWeek };
}
