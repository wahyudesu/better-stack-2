/**
 * Unified type exports.
 * Import all types from this file for a single source of truth.
 */

// AI types (re-export as shorter names for convenience)
export type {
	CarouselSlide,
	GeneratedCarousel,
	GeneratedContentType,
	GeneratedContentType as ContentType,
	GeneratedGoal,
	GeneratedGoal as ScriptGoal,
	GeneratedPost,
	GeneratedThread,
	GeneratedTone,
	GeneratedTone as Tone,
} from "./ai";
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
	STAT_DEFINITIONS,
	StatCard,
	StatKey,
	TimeRange,
	TimeSeriesDataPoint,
	TopPerformingPost,
} from "./analytics";
export {
	calculateEngagements,
	calculatePercentChange,
	formatMetric,
	formatPercentChange,
} from "./analytics";
// Content types
export * from "./content";
// Core types
export * from "./core";

// Backward-compatible platform type for AI generation
export type AIPlatform =
	| "threads"
	| "linkedin"
	| "twitter"
	| "instagram"
	| "tiktok";

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
export type { PostMedia } from "./content/media";
// Media helpers
export {
	isAudio,
	isImage,
	isVideo,
} from "./content/media";
export type { PostStatus } from "./content/post-status";
// Re-export status helpers
export {
	canCancelPost,
	canEditPost,
	isActivePost,
	POST_STATUS_INFO,
} from "./content/post-status";
// Template types
export type {
	ContentTemplate,
	TemplateConfig,
	TemplateFormat,
	TemplateFramework,
	TemplateManager,
	TemplatePersona,
	TemplatePurpose,
} from "./content/template";
export {
	createTemplateManager,
	getTemplateManager,
} from "./content/template";
// View models
export type {
	BulkActionResult,
	CalendarPostItem,
	DashboardPostItem,
	PublishResult,
	QueueItem,
} from "./content/view";
// Social types
export type {
	ContentPost,
	PostAnalytics,
	ProfilePlatform,
	ProfileStatus,
	SocialMediaProfile,
} from "./social";
// UI types
export type {
	AccentColor,
	DialogSize,
	StatusBadgeStyle,
	ThemeMode,
} from "./ui";
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
	CAROUSEL_PLATFORMS,
	PLATFORM_META,
	STORY_PLATFORMS,
	VIDEO_PLATFORMS,
} from "./core/platform";
