/**
 * Central type exports.
 * Import all types from this file for a single source of truth.
 */

// Platform types (merged from dashboard.ts and ai-post.ts)
export type {
	SocialMediaPlatform,
	ReportType,
	TimeRange,
	DashboardConfig,
	PlatformMultiplier,
	StatItem,
	ChartDataPoint,
	GeoView,
	DemoView,
	Platform,
	ContentType,
	Tone,
	ScriptGoal,
} from "./platform";

export type {
	GeneratedPost,
	ToneOption,
	PlatformConfig,
} from "./platform";

// Content types
export type {
	ContentItem,
	ContentStatus,
} from "./content";

// UI types
export type {
	ThemeMode,
	AccentColor,
	DialogSize,
	StatusBadgeStyle,
} from "./ui";

// Feature types
export type {
	BrandingInput,
	NicheValue,
	ToneValue,
} from "./branding";

export type {
	ComposerTemplate,
	TemplateManager,
} from "./template";

export type {
	ContentScriptTemplate,
	ToolTemplateManager,
} from "./tool-template";
