/**
 * Metrics Grid Component.
 * Displays overview stats in a responsive grid layout.
 * Used in the analytics page for showing key metrics.
 */

"use client";

import { TrendingUp } from "lucide-react";

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
		<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
			{metrics.map((stat) => (
				<div key={stat.label} className="border rounded-lg p-4">
					<p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
					<p className="text-xl font-bold">{stat.value}</p>
					<div className="flex items-center gap-0.5 text-xs text-success mt-1">
						<TrendingUp className="size-3" />
						{stat.change}
					</div>
				</div>
			))}
		</div>
	);
}
