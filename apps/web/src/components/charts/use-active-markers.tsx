"use client";

import { useMemo } from "react";
import { useChart } from "./chart-context";
import type { ChartMarkerItem } from "./markers";

/**
 * Hook to filter markers based on current hover position
 * Returns markers that are close to the hovered data point
 */
export function useActiveMarkers(markers: ChartMarkerItem[]) {
	const { tooltipData, xAccessor, data } = useChart();

	return useMemo(() => {
		// If not hovering, return empty array
		if (!tooltipData) {
			return [];
		}

		const hoveredDate = xAccessor(tooltipData.point);
		const hoveredTime = hoveredDate.getTime();

		// Find markers within 12 hours of the hovered date
		const threshold = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

		return markers.filter((marker) => {
			const markerTime = marker.date.getTime();
			return Math.abs(markerTime - hoveredTime) <= threshold;
		});
	}, [tooltipData, xAccessor, markers]);
}

export default useActiveMarkers;
