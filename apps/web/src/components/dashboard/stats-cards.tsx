"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatItem {
	label: string;
	value: string;
	change: string;
}

export interface StatsCardsProps {
	stats: StatItem[];
	keyProp: string; // Used for key prop to trigger re-render
}

export function StatsCards({ stats, keyProp }: StatsCardsProps) {
	return (
		<div
			className={cn(
				"flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-0 sm:border sm:rounded-xl sm:overflow-hidden",
			)}
			key={keyProp}
		>
			{stats.map((stat, index) => (
				<div
					key={stat.label}
					className={cn(
						"flex-shrink-0 w-[140px] sm:w-auto rounded-lg border p-3 sm:p-4",
						"sm:rounded-none sm:border-0",
						"lg:border-r lg:border/50",
						index >= stats.length - 2 && "lg:border-r-0",
					)}
				>
					<p className="text-xs text-muted-foreground mb-1 truncate">
						{stat.label}
					</p>
					<p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
					<div className="flex items-center gap-0.5 text-xs text-success mt-1">
						<TrendingUp className="size-3" />
						{stat.change}
					</div>
				</div>
			))}
		</div>
	);
}
