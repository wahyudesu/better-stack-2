/**
 * UI-related types.
 */

/**
 * Theme mode options.
 */
export type ThemeMode = "light" | "dark" | "system";

/**
 * Accent color options.
 */
export type AccentColor =
	| "default"
	| "blue"
	| "green"
	| "purple"
	| "orange"
	| "pink"
	| "red"
	| "cyan";

/**
 * Dialog size options.
 */
export type DialogSize = "sm" | "md" | "lg" | "xl";

/**
 * Status badge styles.
 */
export interface StatusBadgeStyle {
	bg: string;
	text: string;
}
