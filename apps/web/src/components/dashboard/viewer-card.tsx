"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis } from "recharts";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
		<Card>
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

			<CardContent className="pb-4">
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
			</CardContent>
		</Card>
	);
}

export default ViewerCard;
