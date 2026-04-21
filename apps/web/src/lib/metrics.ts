/**
 * Metrics utilities for formatting and calculating values.
 * Shared across dashboard and analytics pages.
 */

/**
 * Format numbers with K/M suffix for display.
 * @example
 * formatMetricValue(1500) // "1.5K"
 * formatMetricValue(1500000) // "1.5M"
 * formatMetricValue(999) // "999"
 */
export function formatMetricValue(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}
	return value.toLocaleString();
}

/**
 * Calculate trend percentage between current and previous values.
 * @returns The percentage change (positive for growth, negative for decline)
 * @example
 * calculateTrend(150, 100) // 50 (50% growth)
 * calculateTrend(80, 100) // -20 (20% decline)
 * calculateTrend(100, 0) // 0 (no previous value)
 */
export function calculateTrend(current: number, previous: number): number {
	if (previous === 0) return 0;
	return ((current - previous) / previous) * 100;
}
