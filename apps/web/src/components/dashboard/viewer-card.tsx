"use client";

import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
	ChartContainer,
	type ChartConfig,
} from "@/components/ui/chart";
import { formatMetricValue } from "@/lib/metrics";
import type { TimeRange } from "@/lib/types/dashboard";

export interface ViewerCardProps {
	timeRange?: TimeRange;
}

const chartConfig = {
	viewers: {
		label: "Viewers",
		color: "#a855f7",
	},
} satisfies ChartConfig;

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
	const labelText = hoveredValue !== null ? "viewers" : `viewers in the last ${days} days`;

	return (
		<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-4">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<p className="text-base font-medium">
						{formatMetricValue(displayValue)} {labelText}
					</p>
				</div>
				<Button variant="secondary" size="xs">
					<Link href="/analytics" className="font-ba flex items-center gap-1.5">
						Audience <ChevronRight className="size-3.5 sm:size-4" />
					</Link>
				</Button>
			</div>

			<ChartContainer config={chartConfig} className="h-16 sm:h-20 w-full">
				<BarChart accessibilityLayer data={chartData}>
					<CartesianGrid vertical={false} />
					<XAxis hide />
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								setHoveredValue(payload[0].value as number);
							} else {
								setHoveredValue(null);
							}
							return null;
						}}
						cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
					/>
					<Bar dataKey="viewers" fill="var(--color-viewers)" radius={4} />
				</BarChart>
			</ChartContainer>
		</div>
	);
}

export default ViewerCard;
