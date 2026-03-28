"use client";

import { ChevronRight, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Cell, ReferenceLine, XAxis } from "recharts";
import { useMotionValueEvent, useSpring } from "framer-motion";
import { AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { formatMetricValue } from "@/lib/metrics";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/lib/types/dashboard";

export interface ViewerCardProps {
	timeRange?: TimeRange;
}

const CHART_MARGIN = 35;

const chartConfig = {
	viewers: {
		label: "Viewers",
		color: "#a855f7",
	},
} satisfies ChartConfig;

export function ViewerCard({ timeRange = "30d" }: ViewerCardProps) {
	const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

	const daysMap: Record<TimeRange, number> = {
		"7d": 7,
		"14d": 14,
		"30d": 30,
		"90d": 90,
		custom: 30,
	};

	const days = daysMap[timeRange] ?? 30;

	const viewerData = useMemo(() => {
		const data: Array<{ day: string; viewers: number }> = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			const baseValue = 15000;
			const trend = Math.sin(i / 5) * 4000;
			const viewers = Math.floor(baseValue + trend + Math.random() * 3000);

			const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
			data.push({ day: dayLabel, viewers });
		}

		return data;
	}, [days]);

	const totalViewers = useMemo(
		() => viewerData.reduce((sum, d) => sum + d.viewers, 0),
		[viewerData]
	);

	const maxValueIndex = useMemo(() => {
		// if user is moving mouse over bar then set value to the bar value
		if (activeIndex !== undefined) {
			return { index: activeIndex, value: viewerData[activeIndex]?.viewers ?? 0 };
		}
		// if no active index then set value to max value
		return viewerData.reduce(
			(max, data, index) => {
				return data.viewers > max.value ? { index, value: data.viewers } : max;
			},
			{ index: 0, value: 0 }
		);
	}, [viewerData, activeIndex]);

	const maxValueIndexSpring = useSpring(maxValueIndex.value, {
		stiffness: 100,
		damping: 20,
	});

	const [springyValue, setSpringyValue] = useState(maxValueIndex.value);

	useMotionValueEvent(maxValueIndexSpring, "change", (latest) => {
		setSpringyValue(Number(latest.toFixed(0)));
	});

	// Update spring when maxValue changes
	useEffect(() => {
		maxValueIndexSpring.set(maxValueIndex.value);
	}, [maxValueIndex.value, maxValueIndexSpring]);

	return (
		<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<Users className="size-4 text-purple-500" />
					<div className="flex items-center gap-2">
						<p className="text-sm font-medium">
							{formatMetricValue(totalViewers)} viewers in the last {days}{" "}
							days
						</p>
						<Badge variant="secondary" className="h-6">
							<TrendingUp className="h-3 w-3" />
							<span className="text-xs">5.2%</span>
						</Badge>
					</div>
				</div>
				<Button
					asChild
					variant="secondary"
					size="sm"
					className="h-7 px-2 text-xs"
				>
					<Link href="/analytics" className="flex items-center gap-1">
						Read more <ChevronRight className="size-3.5" />
					</Link>
				</Button>
			</div>

			{/* Bar Chart */}
			<div className="h-36">
				<AnimatePresence mode="wait">
					<ChartContainer config={chartConfig}>
						<BarChart
							accessibilityLayer
							data={viewerData}
							onMouseLeave={() => setActiveIndex(undefined)}
							margin={{
								left: CHART_MARGIN,
								right: 8,
							}}
						>
							<XAxis hide />
							<Bar dataKey="viewers" fill="var(--color-viewers)" radius={4}>
								{viewerData.map((_, index) => (
									<Cell
										className="duration-200"
										opacity={index === maxValueIndex.index ? 1 : 0.2}
										key={index}
										onMouseEnter={() => setActiveIndex(index)}
									/>
								))}
							</Bar>
							<ReferenceLine
								opacity={0.4}
								y={springyValue}
								stroke="var(--color-viewers)"
								strokeWidth={1}
								strokeDasharray="3 3"
								label={<CustomReferenceLabel value={maxValueIndex.value} />}
							/>
							<ChartTooltip
								content={<ChartTooltipContent />}
								cursor={false}
							/>
						</BarChart>
					</ChartContainer>
				</AnimatePresence>
			</div>
		</div>
	);
}

export default ViewerCard;

interface CustomReferenceLabelProps {
	viewBox?: {
		x?: number;
		y?: number;
	};
	value: number;
}

const CustomReferenceLabel = ({ viewBox, value }: CustomReferenceLabelProps) => {
	const x = viewBox?.x ?? 0;
	const y = viewBox?.y ?? 0;

	// we need to change width based on value length
	const width = useMemo(() => {
		const characterWidth = 8; // Average width of a character in pixels
		const padding = 10;
		return value.toString().length * characterWidth + padding;
	}, [value]);

	return (
		<>
			<rect
				x={x - CHART_MARGIN}
				y={y - 9}
				width={width}
				height={18}
				fill="var(--color-viewers)"
				rx={4}
			/>
			<text
				fontWeight={600}
				x={x - CHART_MARGIN + 6}
				y={y + 4}
				fill="white"
			>
				{formatMetricValue(value)}
			</text>
		</>
	);
};
