/**
 * UI-related constants.
 * Merges status styles from status.ts and theme options from settings.ts
 */

// ============================================================
// STATUS BADGES (from status.ts)
// ============================================================

/**
 * Status badge styles for different content states.
 * Used across ContentCard, generated-post-card, and ListView.
 *
 * Synced with PostStatus from @/lib/types/social.ts
 * - draft: Initial state, editable
 * - review: Pending approval
 * - scheduled: Scheduled to publish
 * - publishing: Currently being published
 * - published: Successfully published
 * - failed: Publish failed
 * - cancelled: Cancelled before publish
 */
export const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
	// All use muted/card style - subtle and neutral
	published: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	scheduled: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	draft: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	review: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	publishing: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	failed: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	cancelled: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
	pending: {
		bg: "bg-muted/50",
		text: "text-muted-foreground",
	},
};

// ============================================================
// THEME & APPEARANCE (from settings.ts)
// ============================================================

/**
 * Accent color options for theme customization.
 */
export const ACCENT_COLORS = [
	{ name: "Default", value: "default", color: "bg-foreground" },
	{ name: "Blue", value: "blue", color: "bg-blue-500" },
	{ name: "Green", value: "green", color: "bg-green-500" },
	{ name: "Purple", value: "purple", color: "bg-purple-500" },
	{ name: "Orange", value: "orange", color: "bg-orange-500" },
	{ name: "Pink", value: "pink", color: "bg-pink-500" },
	{ name: "Red", value: "red", color: "bg-red-500" },
	{ name: "Cyan", value: "cyan", color: "bg-cyan-500" },
] as const;

/**
 * Theme mode options.
 */
export const THEME_OPTIONS = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "system", label: "System" },
] as const;

// ============================================================
// TAB & DASHBOARD STYLES
// ============================================================

/**
 * Default tab trigger className for dashboard cards.
 * Used in AudienceCard, DemographicsCard, and similar components.
 */
export const TAB_TRIGGER_CLASSNAME =
	"text-muted-foreground hover:text-foreground h-8 px-3 text-sm cursor-pointer transition-colors";
