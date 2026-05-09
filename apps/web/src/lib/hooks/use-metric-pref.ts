import { useEffect, useState } from "react";

const STORAGE_KEY = "dashboard-metric-preference";
const DEFAULT_METRIC = "impression";
const MAX_LENGTH = 50;

/**
 * Persist metric preference to localStorage.
 * Defaults to "impression" for new users.
 */
export function useMetricPreference() {
	const [metric, setMetricState] = useState<string>(DEFAULT_METRIC);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored && stored.length <= MAX_LENGTH) {
				setMetricState(stored);
			}
		} catch {
			// Silently fail if localStorage is unavailable
		}
		setIsInitialized(true);
	}, []);

	const setMetric = (value: string) => {
		// Sanitize: truncate to max length to prevent localStorage overflow
		const sanitized = String(value).slice(0, MAX_LENGTH);
		setMetricState(sanitized);
		try {
			localStorage.setItem(STORAGE_KEY, sanitized);
		} catch {
			// Silently fail if localStorage is unavailable
		}
	};

	return { metric, setMetric, isInitialized };
}
