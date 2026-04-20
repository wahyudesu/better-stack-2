/**
 * AI-generated content types.
 */

import type { ProfilePlatform } from "./core/platform";

export type GeneratedContentType = "single" | "thread" | "carousel" | "video";
export type GeneratedTone =
	| "professional"
	| "casual"
	| "inspirational"
	| "educational"
	| "friendly"
	| "storytelling";
export type GeneratedGoal =
	| "engagement"
	| "sales"
	| "branding"
	| "education"
	| "entertainment";

export interface GeneratedPost {
	id: string;
	platform: ProfilePlatform;
	contentType: GeneratedContentType;
	tone: GeneratedTone;
	goal: GeneratedGoal;
	content: string;
	hashtags: string[];
	cta: string;
	createdAt: Date;
	/** Optional: reference to the source request */
	requestId?: string;
}

export interface GeneratedThread {
	id: string;
	posts: GeneratedPost[];
	totalLength: number;
}

export interface GeneratedCarousel {
	id: string;
	slides: CarouselSlide[];
	platform: ProfilePlatform;
	createdAt: Date;
}

export interface CarouselSlide {
	order: number;
	imagePrompt: string;
	caption: string;
	hashtags: string[];
}
