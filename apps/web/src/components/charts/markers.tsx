"use client";

import { useState } from "react";
import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/bsky.app";
import { useChart } from "./chart-context";

// Network name mapping: our platform name -> react-social-icons network name
const networkMap: Record<string, string> = {
	instagram: "instagram",
	facebook: "facebook",
	twitter: "x",
	tiktok: "tiktok",
	youtube: "youtube",
	linkedin: "linkedin",
	pinterest: "pinterest",
	whatsapp: "whatsapp",
	reddit: "reddit",
	bluesky: "bsky.app",
	threads: "threads",
	telegram: "telegram",
	snapchat: "snapchat",
	google: "google",
};

export interface ChartMarkerItem {
	date: Date;
	network: string;
	title: string;
	description?: string;
	color?: string;
	href?: string;
	target?: "_blank" | "_self";
	onClick?: () => void;
}

export interface ChartMarkersProps {
	items: ChartMarkerItem[];
	size?: number;
	showLines?: boolean;
}

export function ChartMarkers({
	items,
	size = 28,
	showLines = true,
}: ChartMarkersProps) {
	const { xScale, innerHeight, xAccessor, data, setTooltipData } = useChart();
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const markers = items.map((item, index) => {
		const markerTime = item.date.getTime();
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

	const handleClick = (marker: ChartMarkerItem, e: React.MouseEvent) => {
		e.stopPropagation();

		if (marker.onClick) {
			marker.onClick();
		} else if (marker.href) {
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
				const hasAction = marker.href || marker.onClick;
				const yOffset = -innerHeight - size - 8;
				const socialNetwork = networkMap[marker.network] || marker.network;

				return (
					<g
						key={marker.originalIndex}
						transform={`translate(${x}, ${innerHeight})`}
						onMouseEnter={() => {
							if (hasAction) {
								setHoveredIndex(marker.originalIndex);
								setTooltipData?.({
									index: marker.closestIndex,
									point: data[marker.closestIndex],
									x,
									yPositions: {},
								});
							}
						}}
						onMouseLeave={() => {
							setHoveredIndex(null);
						}}
						onClick={(e) => handleClick(marker, e)}
						style={{ cursor: hasAction ? "pointer" : "default" }}
					>
						{/* Vertical guide line */}
						{showLines && (
							<line
								x1={0}
								y1={0}
								x2={0}
								y2={-innerHeight}
								stroke={marker.color || "var(--chart-1)"}
								strokeDasharray="4,4"
								strokeOpacity={isHovered ? 0.8 : 0.4}
								strokeWidth={isHovered ? 1.5 : 1}
								className="transition-all duration-200"
							/>
						)}

						{/* Bottom dot */}
						<circle
							cx={0}
							cy={0}
							r={isHovered ? 8 : 5}
							fill={marker.color || "var(--chart-1)"}
							stroke="var(--background)"
							strokeWidth={2}
							className="transition-all duration-200"
						/>

						{/* Social icon via foreignObject */}
						<foreignObject x={-size / 2} y={yOffset} width={size} height={size}>
							<div className="flex items-center justify-center w-full h-full">
								<SocialIcon
									network={socialNetwork}
									bgColor={marker.color}
									style={{ width: size, height: size }}
								/>
							</div>
						</foreignObject>
					</g>
				);
			})}
		</g>
	);
}

ChartMarkers.displayName = "ChartMarkers";
(ChartMarkers as any).__isChartMarkers = true;

export default ChartMarkers;
