// Ad types matching Zernio API responses

export type AdPlatform =
	| "facebook"
	| "instagram"
	| "tiktok"
	| "linkedin"
	| "pinterest"
	| "google"
	| "twitter";

export type AdStatus =
	| "active"
	| "paused"
	| "pending_review"
	| "rejected"
	| "completed"
	| "cancelled"
	| "error";

export type AdType = "boost" | "standalone";

export type AdGoal =
	| "engagement"
	| "traffic"
	| "awareness"
	| "video_views"
	| "lead_generation"
	| "conversions"
	| "app_promotion";

export interface AdMetrics {
	spend: number;
	impressions: number;
	clicks: number;
	ctr: number;
	cpc: number;
	conversions: number;
	cpa: number;
	roas: number;
}

export interface AdCreative {
	thumbnailUrl?: string;
	imageUrl?: string;
	videoUrl?: string;
	body?: string;
	linkUrl?: string;
	googleHeadline?: string;
	googleDescription?: string;
	pinterestTitle?: string;
	pinterestDescription?: string;
}

export interface Ad {
	_id: string;
	name: string;
	platform: AdPlatform;
	status: AdStatus;
	adType: AdType;
	goal: AdGoal;
	budget: { amount: number; type: "daily" | "lifetime" } | null;
	metrics: AdMetrics | null;
	campaignName: string;
	adSetName: string;
	platformCampaignId: string;
	platformAdId: string;
	platformAdAccountId: string;
	creative: AdCreative | null;
	targeting?: Record<string, unknown>;
	rejectionReason?: string;
	createdAt: string;
	updatedAt: string;
}

export interface AdCampaign {
	_id: string;
	name: string;
	platform: AdPlatform;
	status: AdStatus;
	objective: string;
	budget: { amount: number; type: "daily" | "lifetime" } | null;
	metrics: AdMetrics | null;
	adCount: number;
	campaignId: string;
	createdAt: string;
}

export interface AdAudience {
	_id: string;
	name: string;
	source: string;
	description: string;
	size: number;
	retentionDays: number;
	platform: AdPlatform;
	createdAt: string;
}

export interface AdAccount {
	_id: string;
	platform: AdPlatform;
	name: string;
	accountId: string;
	status: string;
	currency: string;
	dailyBudget: number | null;
	lifetimeBudget: number | null;
}
