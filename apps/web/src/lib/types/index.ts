/**
 * Central type exports.
 * Import all types from this file for a single source of truth.
 */

// Re-export for convenience (status badges use PostStatus)
export { statusBadgeStyles } from "@/lib/constants/ui";
// Feature types
export type {
	BrandingInput,
	NicheValue,
	ToneValue,
} from "./branding";

// Content types
export type {
	ContentItem,
	ContentStatus,
} from "./content";
// Platform types (merged from dashboard.ts and ai-post.ts)
export type {
	ChartDataPoint,
	ContentType,
	DashboardConfig,
	DemoView,
	GeneratedPost,
	GeoView,
	Platform,
	PlatformConfig,
	PlatformMultiplier,
	ReportType,
	ScriptGoal,
	SocialMediaPlatform,
	StatItem,
	TimeRange,
	Tone,
	ToneOption,
} from "./platform";
// Social media types (profiles, posts, analytics)
export type {
	CalendarPostItem,
	ContentPost,
	DashboardPostItem,
	MediaType,
	PostAnalytics,
	PostMedia,
	PostStatus,
	ProfilePlatform,
	ProfileStatus,
	SocialMediaProfile,
} from "./social";
export type {
	ComposerTemplate,
	TemplateManager,
} from "./template";
export type {
	ContentScriptTemplate,
	ToolTemplateManager,
} from "./tool-template";
// UI types
export type {
	AccentColor,
	DialogSize,
	StatusBadgeStyle,
	ThemeMode,
} from "./ui";
