"use client";

import { cn } from "@better-stack-2/ui/lib/utils";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { formatMetricValue } from "@/lib/metrics";
import { useChart } from "./chart-context";

export interface YAxisProps {
	/** Number of ticks to show. Default: 5 */
	numTicks?: number;
	/** Whether to show the axis on the right side. Default: true */
	position?: "left" | "right";
	/** Custom formatter for values */
	formatValue?: (value: number) => string;
}

interface YAxisLabelProps {
	label: string;
	y: number;
	crosshairY: number | null;
	isHovering: boolean;
	isRight: boolean;
}

function YAxisLabel({
	label,
	y,
	crosshairY,
	isHovering,
	isRight,
}: YAxisLabelProps) {
	const fadeRadius = 30;

	let opacity = 1;
	if (isHovering && crosshairY !== null) {
		const distance = Math.abs(y - crosshairY);
		if (distance < 15) {
			opacity = 0.3;
		} else if (distance < fadeRadius) {
			opacity = 0.3 + ((distance - 15) / (fadeRadius - 15)) * 0.7;
		}
	}

	return (
		<div
			className="absolute flex items-center"
			style={{
				top: y,
				[isRight ? "right" : "left"]: 8,
				transform: "translateY(-50%)",
			}}
		>
			<motion.span
				animate={{ opacity: opacity }}
				className={cn(
					"whitespace-nowrap text-chart-label text-xs",
					isRight ? "text-right" : "text-left",
				)}
				initial={{ opacity: 1 }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				{label}
			</motion.span>
		</div>
	);
}

export function YAxis({
	numTicks = 5,
	position = "right",
	formatValue: customFormatValue,
}: YAxisProps) {
	const { yScale, margin, tooltipData, containerRef, innerHeight } = useChart();
	const [mounted, setMounted] = useState(false);

	// Only render on client side after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Generate evenly spaced tick values
	const labelsToShow = useMemo(() => {
		const domain = yScale.domain();
		const minValue = domain[0];
		const maxValue = domain[1];

		if (minValue === undefined || maxValue === undefined) {
			return [];
		}

		const range = maxValue - minValue;
		const step = range / (numTicks - 1);

		const formatter = customFormatValue || formatMetricValue;

		return Array.from({ length: numTicks }, (_, i) => {
			const value = minValue + step * i;
			const y = yScale(value) ?? 0;
			return {
				label: formatter(Math.round(value)),
				y: y + margin.top,
				value,
			};
		});
	}, [yScale, margin.top, numTicks, customFormatValue]);

	const isHovering = tooltipData !== null;
	const crosshairY = tooltipData
		? Object.values(tooltipData.yPositions)[0] + margin.top
		: null;

	// Use portal to render into the chart container
	const container = containerRef.current;
	if (!(mounted && container)) {
		return null;
	}

	const { createPortal } = require("react-dom") as typeof import("react-dom");

	return createPortal(
		<div className="pointer-events-none absolute inset-0">
			{labelsToShow.map((item) => (
				<YAxisLabel
					key={`${item.label}-${item.y}`}
					label={item.label}
					y={item.y}
					crosshairY={crosshairY}
					isHovering={isHovering}
					isRight={position === "right"}
				/>
			))}
		</div>,
		container,
	);
}

YAxis.displayName = "YAxis";

export default YAxis;
