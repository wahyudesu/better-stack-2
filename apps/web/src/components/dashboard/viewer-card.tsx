"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Tooltip, XAxis } from "recharts";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { formatMetricValue } from "@/lib/metrics";
import type { TimeRange } from "@/lib/types/dashboard";

export interface ViewerCardProps {
	timeRange?: TimeRange;
}

const chartConfig = {
	viewers: {
		label: "Viewers",
		color: "var(--primary)",
	},
} satisfies ChartConfig;

// Single indigo color for all bars
const barColor = "var(--primary)";

function calculateOpacity(value: number, maxValue: number): number {
	const minOpacity = 0.1;
	const maxOpacity = 1.0;
	const normalized = value / maxValue;
	return minOpacity + normalized * (maxOpacity - minOpacity);
}

export function ViewerCard({ timeRange = "30d" }: ViewerCardProps) {
	const [hoveredValue, setHoveredValue] = useState<number | null>(null);

	const daysMap: Record<TimeRange, number> = {
		"7d": 7,
		"14d": 14,
		"30d": 30,
		"90d": 90,
		custom: 30,
	};

	const days = daysMap[timeRange] ?? 30;

	// Calculate date range for display
	const dateRange = useMemo(() => {
		const now = new Date();
		const startDate = new Date(now);
		startDate.setDate(startDate.getDate() - days + 1);

		const formatDate = (date: Date) => {
			return date.toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
			});
		};

		return `${formatDate(startDate)} - ${formatDate(now)}`;
	}, [days]);

	const chartData = useMemo(() => {
		const data: Array<{ month: string; viewers: number }> = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			const baseValue = 15000;
			const trend = Math.sin(i / 5) * 4000;
			const viewers = Math.floor(baseValue + trend + Math.random() * 3000);

			const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
			data.push({ month: dayLabel, viewers });
		}

		return data;
	}, [days]);

	const totalViewers = useMemo(
		() => chartData.reduce((sum, d) => sum + d.viewers, 0),
		[chartData],
	);

	const displayValue = hoveredValue ?? totalViewers;
	const labelText = hoveredValue !== null ? "viewers" : `viewers (${dateRange})`;

	const maxViewers = Math.max(...chartData.map((d) => d.viewers));

	return (
		<Card className="h-full flex flex-col pb-0">
			<CardHeader>
				<CardTitle>
					{formatMetricValue(displayValue)} {labelText}
				</CardTitle>
				<CardAction>
					<Link
						href="/analytics"
						className={buttonVariants({ variant: "secondary", size: "xs" })}
					>
						Audience <ChevronRight className="size-3.5 sm:size-4" />
					</Link>
				</CardAction>
			</CardHeader>

			<CardContent className="pb-0 flex-1 flex items-center">
				<ChartContainer config={chartConfig} className="h-16 sm:h-20 w-full">
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
						barCategoryGap={2}
					>
						<XAxis hide axisLine={false} tickLine={false} />
						<Tooltip
							content={() => null}
							cursor={false}
							allowEscapeViewBox={{ x: false, y: false }}
						/>
						<Bar
							dataKey="viewers"
							radius={[20, 20, 0, 0]}
							fill="none"
							onMouseEnter={(data) => {
								if (data?.payload?.viewers !== undefined) {
									setHoveredValue(data.payload.viewers);
								}
							}}
							onMouseLeave={() => setHoveredValue(null)}
						>
							{chartData.map((entry, index) => {
								const opacity = calculateOpacity(entry.viewers, maxViewers);
								return (
									<Cell
										key={`cell-${index}`}
										fill={barColor}
										fillOpacity={opacity}
										style={{ cursor: "pointer" }}
									/>
								);
							})}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

export default ViewerCard;
