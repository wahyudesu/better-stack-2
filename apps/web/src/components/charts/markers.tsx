"use client";

import { useState } from "react";
import { useChart } from "./chart-context";

export interface ChartMarkerItem {
	/** Date for the marker position */
	date: Date;
	/** Icon/emoji to display */
	icon: string;
	/** Title for tooltip */
	title: string;
	/** Optional description for tooltip */
	description?: string;
	/** Optional URL to navigate to when clicked */
	href?: string;
	/** Link target (_blank or _self). Default: "_blank" */
	target?: "_blank" | "_self";
	/** Optional click handler */
	onClick?: () => void;
	/** Optional background color override */
	color?: string;
}

export interface ChartMarkersProps {
	/** Array of marker items to display */
	items: ChartMarkerItem[];
	/** Size of marker icon. Default: 20 */
	size?: number;
	/** Whether to show vertical guide lines. Default: true */
	showLines?: boolean;
}

export function ChartMarkers({
	items,
	size = 20,
	showLines = true,
}: ChartMarkersProps) {
	const { xScale, innerHeight, margin, xAccessor, data } = useChart();
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	// Find the closest data point index for each marker date
	const markers = items.map((item, index) => {
		const markerTime = item.date.getTime();

		// Find the data point with the closest date
		let closestIndex = 0;
		let minDiff = Infinity;

		data.forEach((d, i) => {
			const dataTime = xAccessor(d).getTime();
			const diff = Math.abs(dataTime - markerTime);
			if (diff < minDiff) {
				minDiff = diff;
				closestIndex = i;
			}
		});

		return { ...item, closestIndex, originalIndex: index };
	});

	const handleMarkerClick = (
		marker: ChartMarkerItem & { originalIndex: number },
		e: React.MouseEvent,
	) => {
		e.stopPropagation();

		// If marker has onClick, call it
		if (marker.onClick) {
			marker.onClick();
			return;
		}

		// If marker has href, navigate to it
		if (marker.href) {
			if (marker.target === "_self") {
				window.location.href = marker.href;
			} else {
				window.open(marker.href, "_blank");
			}
		}
	};

	return (
		<g className="chart-markers">
			{markers.map((marker) => {
				const x = xScale(xAccessor(data[marker.closestIndex]));
				if (x === undefined) return null;

				const isHovered = hoveredIndex === marker.originalIndex;
				const hasInteraction = marker.href || marker.onClick;

				return (
					<g
						key={marker.originalIndex}
						transform={`translate(${x}, ${innerHeight})`}
						onMouseEnter={() =>
							hasInteraction && setHoveredIndex(marker.originalIndex)
						}
						onMouseLeave={() => setHoveredIndex(null)}
						onClick={(e) => handleMarkerClick(marker, e)}
						style={{ cursor: hasInteraction ? "pointer" : "default" }}
					>
						{/* Marker line */}
						{showLines && (
							<line
								x1={0}
								y1={0}
								x2={0}
								y2={-innerHeight}
								stroke="var(--chart-grid)"
								strokeDasharray="2,2"
								strokeOpacity={isHovered ? 0.8 : 0.5}
								strokeWidth={isHovered ? 1.5 : 1}
							/>
						)}

						{/* Marker circle at bottom */}
						<circle
							cx={0}
							cy={0}
							r={isHovered ? 8 : 6}
							fill={marker.color || "var(--chart-1)"}
							stroke="var(--background)"
							strokeWidth={2}
							className={hasInteraction ? "transition-all duration-200" : ""}
						/>

						{/* Hover glow effect */}
						{isHovered && hasInteraction && (
							<circle
								cx={0}
								cy={0}
								r={12}
								fill={marker.color || "var(--chart-1)"}
								fillOpacity={0.2}
								className="animate-pulse"
							/>
						)}

						{/* Marker icon above */}
						<text
							x={0}
							y={-innerHeight - (isHovered ? 14 : 10)}
							textAnchor="middle"
							dominantBaseline="auto"
							fontSize={isHovered ? size * 1.2 : size}
							style={{
								fontFamily: "system-ui, sans-serif",
								filter: isHovered
									? "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
									: "none",
							}}
							className={hasInteraction ? "transition-all duration-200" : ""}
						>
							{marker.icon}
						</text>
					</g>
				);
			})}
		</g>
	);
}

ChartMarkers.displayName = "ChartMarkers";
// Mark this component for special handling in LineChart
(ChartMarkers as any).__isChartMarkers = true;

export default ChartMarkers;
