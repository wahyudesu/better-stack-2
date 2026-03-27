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
	// Published - Success state (green)
	published: {
		bg: "hsl(142 76% 36% / 0.15)",
		text: "hsl(142 76% 36%)",
	},
	// Scheduled - Primary/pending state (blue)
	scheduled: {
		bg: "hsl(var(--primary) / 0.15)",
		text: "hsl(var(--primary))",
	},
	// Draft - Neutral/inactive state (gray)
	draft: {
		bg: "hsl(var(--muted) / 0.5)",
		text: "hsl(var(--muted-foreground))",
	},
	// Review - Warning/attention state (yellow/orange)
	review: {
		bg: "hsl(38 92% 50% / 0.15)",
		text: "hsl(38 92% 50%)",
	},
	// Publishing - In-progress state (blue/indigo)
	publishing: {
		bg: "hsl(221 83% 53% / 0.15)",
		text: "hsl(221 83% 53%)",
	},
	// Failed - Error state (red)
	failed: {
		bg: "hsl(0 84% 60% / 0.15)",
		text: "hsl(0 84% 60%)",
	},
	// Cancelled - Neutral/stopped state (gray)
	cancelled: {
		bg: "hsl(var(--muted) / 0.3)",
		text: "hsl(var(--muted-foreground))",
	},
	// Legacy "pending" - maps to "review" for backward compatibility
	pending: {
		bg: "hsl(38 92% 50% / 0.15)",
		text: "hsl(38 92% 50%)",
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
	"text-muted-foreground hover:text-foreground h-full px-3 py-2 text-sm cursor-pointer transition-colors";
