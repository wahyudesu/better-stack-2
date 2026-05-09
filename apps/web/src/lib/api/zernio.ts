/**
 * Zernio API types - kept for reference
 * Sync logic moved to apps/server /v1/sync/posts and /v1/sync/accounts
 */

export interface ZernioPost {
	externalId: string;
	text: string;
	platforms: string[];
	status: "draft" | "scheduled" | "published" | "failed";
	scheduledAt?: number;
	publishedAt?: number;
	mediaUrls: string[];
	createdAt: number;
	updatedAt: number;
}

export interface ZernioAccount {
	externalId: string;
	platform: string;
	accountName: string;
	avatarUrl?: string;
	status: "active" | "error" | "disconnected";
	connectedAt: number;
}
