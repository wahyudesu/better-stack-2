/**
 * UI-related types.
 */

export type ThemeMode = "light" | "dark" | "system";

export type AccentColor =
	| "default"
	| "blue"
	| "green"
	| "purple"
	| "orange"
	| "pink"
	| "red"
	| "cyan";

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface StatusBadgeStyle {
	bg: string;
	text: string;
}
