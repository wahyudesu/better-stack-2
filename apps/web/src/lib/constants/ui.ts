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
 */
export const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  published: {
    bg: "hsl(142 76% 36% / 0.15)",
    text: "hsl(142 76% 36%)",
  },
  scheduled: {
    bg: "hsl(var(--primary) / 0.15)",
    text: "hsl(var(--primary))",
  },
  draft: {
    bg: "hsl(var(--muted) / 0.5)",
    text: "hsl(var(--muted-foreground))",
  },
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
