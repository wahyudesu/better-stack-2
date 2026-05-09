"use client";

import { ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatMetricValue } from "@/lib/metrics";
import type { TimeRange } from "@/lib/types/dashboard";

const ViewerChart = dynamic(
	() => import("./viewer-chart-lazy").then((mod) => mod.ViewerChart),
	{ ssr: false, loading: () => <div className="h-20 sm:h-24 w-full" /> },
);

export interface ViewerCardProps {
	timeRange?: TimeRange;
}

// Single indigo color for all bars
const barColor = "var(--primary)";

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

	// Seeded random for consistent SSR/CSR values
	const seededRandom = useMemo(() => {
		let seed = days;
		return () => {
			const x = Math.sin(seed++) * 10000;
			return x - Math.floor(x);
		};
	}, [days]);

	const chartData = useMemo(() => {
		const data: Array<{ month: string; viewers: number }> = [];
		const now = new Date();

		for (let i = days - 1; i >= 0; i--) {
			const date = new Date(now);
			date.setDate(date.getDate() - i);

			const baseValue = 15000;
			const trend = Math.sin(i / 5) * 4000;
			const viewers = Math.floor(baseValue + trend + seededRandom() * 3000);

			const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" });
			data.push({ month: dayLabel, viewers });
		}

		return data;
	}, [days, seededRandom]);

	const totalViewers = useMemo(
		() => chartData.reduce((sum, d) => sum + d.viewers, 0),
		[chartData],
	);

	const displayValue = hoveredValue ?? totalViewers;
	const labelText = hoveredValue !== null ? "viewers" : "viewers this month";

	const maxViewers = Math.max(...chartData.map((d) => d.viewers));

	return (
		<Card className="h-36 flex flex-col pb-0">
			<CardHeader className="flex items-center justify-between gap-2 py-2 h-fit">
				<CardTitle className="w-full h-full leading-none font-medium">
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
			<CardContent className="pb-0 flex-1 flex items-center px-4 sm:px-6">
				<ViewerChart
					data={chartData}
					barColor={barColor}
					maxViewers={maxViewers}
					onMouseEnter={(viewers) => setHoveredValue(viewers)}
					onMouseLeave={() => setHoveredValue(null)}
				/>
			</CardContent>
		</Card>
	);
}

export default ViewerCard;
