import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Format a date string to a relative time string (e.g., "5m ago")
 */
export function formatRelativeTime(dateStr: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	const diffHours = Math.floor(diffMs / 3600000);
	const diffDays = Math.floor(diffMs / 86400000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString();
}

/**
 * Helper for Select onChange handlers.
 * Select components pass `string | null`, so we use null coalescing
 * to ensure we always return a string value.
 */
export function selectHandler<T extends string>(
	value: T | null,
	defaultValue: T,
	callback: (value: T) => void,
) {
	callback(value ?? defaultValue);
}

export const focusInput = [
	// base
	"focus:ring-2",
	// ring color
	"focus:ring-blue-200 dark:focus:ring-blue-700/30",
	// border color
	"focus:border-blue-500 dark:focus:border-blue-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
	// base
	"outline outline-offset-2 outline-0 focus-visible:outline-2",
	// outline color
	"outline-blue-500 dark:outline-blue-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
	// base
	"ring-2",
	// border color
	"border-red-500 dark:border-red-700",
	// ring color
	"ring-red-200 dark:ring-red-700/30",
];
