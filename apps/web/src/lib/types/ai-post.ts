/**
 * AI-generated post types.
 */

import type { ProfilePlatform } from "./core/platform";

export type Tone =
	| "professional"
	| "casual"
	| "inspirational"
	| "educational"
	| "friendly"
	| "storytelling";

export interface GeneratedPost {
	id: string;
	platform: ProfilePlatform;
	tone: Tone;
	content: string;
	hashtags: string[];
	createdAt: Date;
}
