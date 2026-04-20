/**
 * Unified type exports.
 * Import all types from this file for a single source of truth.
 */

// Core types
export * from "./core";

// Content types
export * from "./content";

// Analytics
export type {
	AnalyticsQuery,
	AnalyticsResponse,
	ContentTypeAnalytics,
	DemographicDataItem,
	EngagementTimeSeries,
	FollowerTimeSeries,
	PlatformAnalytics,
	ReportType,
	StatCard,
	StatKey,
	TimeRange,
	TimeSeriesDataPoint,
	TopPerformingPost,
	calculateEngagementRate,
	formatMetric,
	STAT_DEFINITIONS,
} from "./analytics";

// AI types (re-export as shorter names for convenience)
export type {
	GeneratedCarousel,
	GeneratedContentType,
	GeneratedGoal,
	GeneratedPost,
	GeneratedThread,
	GeneratedTone,
	CarouselSlide,
	GeneratedContentType as ContentType,
	GeneratedGoal as ScriptGoal,
	GeneratedTone as Tone,
} from "./ai";

// Backward-compatible platform type for AI generation
export type AIPlatform = "threads" | "linkedin" | "twitter" | "instagram" | "tiktok";
export { calculateEngagementRate, formatMetric } from "./analytics";

// Social types
export type {
	ContentPost,
	PostAnalytics,
	ProfileStatus,
	SocialMediaProfile,
	ProfilePlatform,
} from "./social";
export type { PostMedia } from "./content/media";
export type { PostStatus } from "./content/post-status";
export { PostMedia } from "./content/media";
export { PostStatus } from "./content/post-status";

// User/Workspace types
export type {
	AuditLogEntry,
	Notification,
	NotificationStatus,
	NotificationType,
	RecurrenceFrequency,
	RecurringSchedule,
	Subscription,
	SubscriptionLimits,
	SubscriptionPlan,
	SubscriptionStatus,
	User,
	UserRole,
	UserStatus,
	Workspace,
	WorkspaceMember,
	WorkspacePreferences,
} from "./user";

// Automation types
export type {
	AutomationRule,
	AutomationSettings,
	AutomationType,
	TriggerType,
} from "./automation";

// Branding types
export type {
	BrandingInput,
	NicheValue,
	ToneValue,
} from "./branding";
export { nicheOptions, toneOptions } from "./branding";

// UI types
export type {
	AccentColor,
	DialogSize,
	StatusBadgeStyle,
	ThemeMode,
} from "./ui";

// View models
export type {
	BulkActionResult,
	CalendarPostItem,
	DashboardPostItem,
	PublishResult,
	QueueItem,
} from "./content/view";

// Re-export status helpers
export {
	canCancelPost,
	canEditPost,
	isActivePost,
	POST_STATUS_INFO,
} from "./content/post-status";

// Media helpers
export {
	isAudio,
	isImage,
	isVideo,
} from "./content/media";

// Template types
export type {
	ContentTemplate,
	TemplateManager,
	TemplateConfig,
	TemplateFormat,
	TemplateFramework,
	TemplatePersona,
	TemplatePurpose,
} from "./content/template";
export {
	createTemplateManager,
	getTemplateManager,
} from "./content/template";

// Backward compatibility: ComposerTemplate alias
export type ComposerTemplate = {
	id: string;
	name: string;
	platform?: string;
	contentType?: string;
	goal?: string;
	tone?: string;
	message?: string;
	createdAt: number;
};

// Backward compatibility: Platform alias for AI
export type Platform = AIPlatform;

// Platform helpers
export {
	PLATFORM_META,
	CAROUSEL_PLATFORMS,
	STORY_PLATFORMS,
	VIDEO_PLATFORMS,
} from "./core/platform";
