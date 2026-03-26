/**
 * Time-related constants.
 * Merges timezone options from settings.ts and time options from dashboard.ts
 */

// ============================================================
// TIMEZONES (from settings.ts)
// ============================================================

/**
 * Timezone options for user settings.
 */
export const TIMEZONES = [
	{ value: "UTC", label: "UTC (Coordinated Universal Time)" },
	{ value: "America/New_York", label: "Eastern Time (ET) - New York" },
	{ value: "America/Chicago", label: "Central Time (CT) - Chicago" },
	{ value: "America/Denver", label: "Mountain Time (MT) - Denver" },
	{ value: "America/Los_Angeles", label: "Pacific Time (PT) - Los Angeles" },
	{ value: "Europe/London", label: "GMT - London" },
	{ value: "Europe/Paris", label: "CET - Paris" },
	{ value: "Europe/Berlin", label: "CET - Berlin" },
	{ value: "Asia/Jakarta", label: "WIB - Jakarta" },
	{ value: "Asia/Makassar", label: "WITA - Makassar" },
	{ value: "Asia/Jayapura", label: "WIT - Jayapura" },
	{ value: "Asia/Singapore", label: "SGT - Singapore" },
	{ value: "Asia/Tokyo", label: "JST - Tokyo" },
	{ value: "Asia/Shanghai", label: "CST - Shanghai" },
	{ value: "Asia/Dubai", label: "GST - Dubai" },
	{ value: "Australia/Sydney", label: "AEDT - Sydney" },
] as const;

// ============================================================
// TIME RANGES (from dashboard.ts)
// ============================================================

/**
 * Time range options for dashboard filters.
 */
export const TIME_OPTIONS = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "14d", label: "Last 14 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
] as const;

/**
 * Time range to days mapping.
 * Used for calculations in dashboard analytics.
 */
export const DAYS_MAP: Record<string, number> = {
	"7d": 7,
	"14d": 14,
	"30d": 30,
	"90d": 90,
	custom: 30,
} as const;
