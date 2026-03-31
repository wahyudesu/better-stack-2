/**
 * Metrics Grid Component.
 * Displays overview stats in a responsive grid layout with mobile horizontal scroll.
 * Used in the analytics page for showing key metrics.
 */

"use client";

import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricItem {
	label: string;
	value: string;
	change: string;
}

export interface MetricsGridProps {
	metrics: MetricItem[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
	return (
		<div className="relative">
			{/* Mobile: Horizontal scroll, Desktop: Grid */}
			<div
				className={cn(
					"flex overflow-x-auto gap-3 sm:gap-4 scrollbar-hide",
					"sm:grid sm:grid-cols-3 lg:grid-cols-6",
					"-mx-4 px-4 sm:mx-0 sm:px-0",
					"scroll-smooth",
				)}
			>
				{metrics.map((stat) => (
					<div
						key={stat.label}
						className={cn(
							"border rounded-lg p-4",
							"flex-shrink-0 w-36 sm:flex-1 sm:w-auto",
							"space-y-1.5",
						)}
					>
						<p className="text-xs text-muted-foreground">{stat.label}</p>
						<p className="text-lg sm:text-xl font-bold text-foreground tabular-nums leading-tight">
							{stat.value}
						</p>
						<div className="flex items-center gap-0.5 text-xs text-success mt-1">
							<TrendingUp className="size-3 shrink-0" />
							<span className="truncate">{stat.change}</span>
						</div>
					</div>
				))}
			</div>
			{/* Fade indicator for mobile scroll */}
			<div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background via-background/80 to-transparent sm:hidden pointer-events-none" />
		</div>
	);
}
