"use client";

import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";

export interface SimpleBarChartProps {
	data: Array<{ name: string; value: number }>;
	fill?: string;
	height?: number;
	barRadius?: number;
	animationDuration?: number;
}

export function SimpleBarChart({
	data,
	fill = "#a855f7",
	height = 128,
	barRadius = 4,
	animationDuration = 600,
}: SimpleBarChartProps) {
	const [isAnimated, setIsAnimated] = useState(false);

	useMemo(() => {
		const timer = setTimeout(() => setIsAnimated(true), animationDuration);
		return () => clearTimeout(timer);
	}, [animationDuration]);

	const margin = { top: 8, right: 8, bottom: 8, left: 8 };
	const innerWidth = 800 - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const maxValue = useMemo(() => {
		return Math.max(...data.map((d) => d.value), 0);
	}, [data]);

	const xScale = useMemo(
		() =>
			scaleBand<string>({
				range: [0, innerWidth],
				domain: data.map((d) => d.name),
				padding: 0.2,
			}),
		[data, innerWidth],
	);

	const yScale = useMemo(
		() =>
			scaleLinear({
				range: [innerHeight, 0],
				domain: [0, maxValue * 1.1],
			}),
		[maxValue, innerHeight],
	);

	const barWidth = xScale.bandwidth();

	return (
		<ParentSize>
			{({ width: containerWidth }) => {
				const scaleX = containerWidth / innerWidth;

				return (
					<svg width={containerWidth} height={height}>
						{data.map((d, i) => {
							const barX = (xScale(d.name) ?? 0) * scaleX;
							const barWidthScaled = barWidth * scaleX;
							const barY = yScale(d.value) ?? 0;
							const barHeight = innerHeight - barY;

							return (
								<motion.rect
									key={d.name}
									x={barX + margin.left}
									y={isAnimated ? barY + margin.top : innerHeight + margin.top}
									width={barWidthScaled}
									height={isAnimated ? barHeight : 0}
									fill={fill}
									rx={barRadius}
									initial={{ opacity: 1 }}
									animate={{ opacity: 1 }}
									transition={{
										height: {
											duration: animationDuration / 1000,
											ease: [0.85, 0, 0.15, 1],
										},
										y: {
											duration: animationDuration / 1000,
											ease: [0.85, 0, 0.15, 1],
										},
									}}
								/>
							);
						})}
					</svg>
				);
			}}
		</ParentSize>
	);
}

export default SimpleBarChart;
