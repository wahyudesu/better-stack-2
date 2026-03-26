/**
 * Settings page constants.
 *
 * This file now re-exports constants from their new locations:
 * - UI constants: @/lib/constants/ui
 * - Time constants: @/lib/constants/time
 */

// ============================================================
// RE-EXPORTS FROM NEW LOCATIONS
// ============================================================

// UI-related (theme, accent colors)
export { ACCENT_COLORS, THEME_OPTIONS } from "./ui";

// Time-related (timezones)
export { TIMEZONES } from "./time";

// ============================================================
// SETTINGS-SPECIFIC CONSTANTS (kept here)
// ============================================================

// Billing history mock data
export const BILLING_HISTORY = [
	{
		id: 1,
		date: "Mar 1, 2024",
		amount: "$29.00",
		status: "Paid",
		invoice: "INV-2024-0301",
	},
	{
		id: 2,
		date: "Feb 1, 2024",
		amount: "$29.00",
		status: "Paid",
		invoice: "INV-2024-0201",
	},
	{
		id: 3,
		date: "Jan 1, 2024",
		amount: "$29.00",
		status: "Paid",
		invoice: "INV-2024-0101",
	},
	{
		id: 4,
		date: "Dec 1, 2023",
		amount: "$29.00",
		status: "Paid",
		invoice: "INV-2023-1201",
	},
] as const;
