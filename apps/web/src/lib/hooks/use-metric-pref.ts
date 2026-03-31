import { useEffect, useState } from "react";

const STORAGE_KEY = "dashboard-metric-preference";
const DEFAULT_METRIC = "impression";

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
			if (stored) {
				setMetricState(stored);
			}
		} catch {
			// Silently fail if localStorage is unavailable
		}
		setIsInitialized(true);
	}, []);

	const setMetric = (value: string) => {
		setMetricState(value);
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// Silently fail if localStorage is unavailable
		}
	};

	return { metric, setMetric, isInitialized };
}
