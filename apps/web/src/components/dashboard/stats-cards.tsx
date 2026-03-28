"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
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

function getChangeColor(change: string): string {
	const trimmed = change.trim();
	// Check for negative values (starts with - or contains -)
	if (trimmed.startsWith("-")) {
		return "text-destructive";
	}
	// Check for positive values (starts with + or just number)
	if (trimmed.startsWith("+") || /^[0-9]/.test(trimmed)) {
		return "text-success";
	}
	// Default for neutral values
	return "text-muted-foreground";
}

function getChangeIcon(change: string) {
	const trimmed = change.trim();
	if (trimmed.startsWith("-")) {
		return <TrendingDown className="size-3" />;
	}
	return <TrendingUp className="size-3" />;
}

export function StatsCards({ stats, keyProp }: StatsCardsProps) {
	return (
		<div
			className={cn(
				"flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-0 sm:border sm:rounded-xl sm:overflow-hidden",
			)}
			key={keyProp}
		>
			{stats.map((stat, index) => {
				const changeColor = getChangeColor(stat.change);
				const changeIcon = getChangeIcon(stat.change);

				return (
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
						<div
							className={cn(
								"flex items-center gap-0.5 text-xs mt-1",
								changeColor,
							)}
						>
							{changeIcon}
							{stat.change}
						</div>
					</div>
				);
			})}
		</div>
	);
}
