"use client";

import {
	type ChartMarker,
	ChartMarkers,
	ChartTooltip,
	Grid,
	Line,
	LineChart,
	MarkerTooltipContent,
	SegmentBackground,
	SegmentLineFrom,
	SegmentLineTo,
	useActiveMarkers,
	XAxis,
	YAxis,
} from "@/components/charts/line-chart";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

const metricOptions = [
	{ value: "followers", label: "Likes" },
	{ value: "engagement", label: "Engagement" },
	{ value: "views", label: "Profile Visits" },
	{ value: "comments", label: "Replies" },
	{ value: "impression", label: "Impressions" },
	{ value: "share", label: "Shares" },
];

export interface ChartDataPoint {
	date: Date;
	engagements: number;
	followers: number;
	views?: number;
	comments?: number;
	impression?: number;
	share?: number;
}

export interface StatItem {
	label: string;
	value: string;
	change: string;
	metricKey: string; // Maps to metricOptions value
}

export interface LineChartCardProps {
	chartData: ChartDataPoint[];
	markers: ChartMarker[];
	formatMetricValue: (value: number) => string;
	keyProp: string;
	primaryMetric?: string;
	secondaryMetric?: string | null;
	stats?: StatItem[];
	title?: string;
	onMetricChange?: (metric: string) => void;
}

// Helper to get direction for badge color
function getDirection(value: string): "up" | "down" | "neutral" {
	const trimmed = value.trim();
	const numValue = parseFloat(trimmed.replace(/[+%]/g, ""));
	if (isNaN(numValue) || numValue === 0) return "neutral";
	return numValue > 0 ? "up" : "down";
}

const badgeVariants = {
	up: "bg-green-500/15 text-green-600 dark:text-green-400 hover:bg-green-500/15 border-green-500/20",
	down: "bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-500/15 border-red-500/20",
	neutral: "bg-muted/50 text-muted-foreground hover:bg-muted/50 border-transparent",
};

// Marker content component for displaying active markers in tooltip
function MarkerContentDemo({ markers }: { markers: ChartMarker[] }) {
	const activeMarkers = useActiveMarkers(markers);
	if (activeMarkers.length === 0) {
		return null;
	}
	return <MarkerTooltipContent markers={activeMarkers} />;
}

export function LineChartCard({
	chartData,
	markers,
	formatMetricValue,
	keyProp,
	primaryMetric = "engagement",
	secondaryMetric = null,
	stats,
	title,
	onMetricChange,
}: LineChartCardProps) {
	// Use controlled or uncontrolled metric state
	const [internalMetric, setInternalMetric] = useState(primaryMetric);
	const activeMetric = onMetricChange ? primaryMetric : internalMetric;

	const handleStatClick = (metricKey: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (onMetricChange) {
			onMetricChange(metricKey);
		} else {
			setInternalMetric(metricKey);
		}
	};

	// Get the data key for the active metric
	const getDataKeyValue = (point: ChartDataPoint, metric: string): number => {
		switch (metric) {
			case "followers":
				return point.followers;
			case "engagement":
				return point.engagements;
			case "views":
				return point.views ?? 0;
			case "comments":
				return point.comments ?? 0;
			case "impression":
				return point.impression ?? 0;
			case "share":
				return point.share ?? 0;
			default:
				return point.engagements;
		}
	};

	// Get active metric label
	const activeMetricLabel = metricOptions.find((m) => m.value === activeMetric)?.label || "Engagement";

	// Transform chart data to use active metric
	const transformedChartData = chartData.map((point) => ({
		...point,
		primaryValue: getDataKeyValue(point, activeMetric),
		secondaryValue: secondaryMetric ? point.followers : undefined,
	}));

	return (
		<Card
			className="overflow-visible pb-4 sm:pb-6 pt-0 group"
			key={keyProp}
		>
			<CardContent className="p-3 sm:p-4">
				{/* Stats Section - clickable to change chart metric */}
				{stats && (
					<div className="flex flex-col sm:flex-row sm:divide-x sm:divide-y-0 divide-y divide-border/50 gap-4 sm:gap-0 w-full ">
						{stats.map((stat) => {
							const direction = getDirection(stat.change);
							const isActive = stat.metricKey === activeMetric;
							return (
								<button
									key={stat.metricKey}
									type="button"
									onClick={(e) => handleStatClick(stat.metricKey, e)}
									className={cn(
										"flex flex-col items-start text-left space-y-2 flex-1 px-2 sm:px-3 py-2 -mx-2 sm:mx-0 rounded-lg",
										"transition-all duration-200",
										"relative",
										"hover:bg-muted/50",
										isActive && "bg-muted/80",
										"cursor-pointer group/stat",
										// Focus ring for accessibility
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
									)}
								>
									<span className={cn(
										"text-xs font-medium transition-colors",
										isActive ? "text-foreground" : "text-muted-foreground"
									)}>
										{stat.label}
									</span>
									<span className="text-2xl font-bold text-foreground">
										{stat.value}
									</span>
									<Badge
										variant="outline"
										className={cn(
											"text-xs px-2 py-0.5",
											badgeVariants[direction],
										)}
									>
										{stat.change}
									</Badge>
								</button>
							);
						})}
					</div>
				)}

				{/* Optional title */}
				{title && (
					<h3 className={cn(
						"text-lg font-semibold",
						stats ? "mt-2" : "mb-4"
					)}>{title}</h3>
				)}

				<LineChart
					data={transformedChartData as unknown as Record<string, unknown>[]}
					aspectRatio="3 / 1"
					margin={{ top: 70, right: 50, bottom: 50, left: 10 }}
				>
					<Grid horizontal />
					<Line
						dataKey="primaryValue"
						stroke="var(--chart-line-primary)"
						strokeWidth={2.5}
					/>
					{secondaryMetric && (
						<Line
							dataKey="secondaryValue"
							stroke="var(--chart-line-secondary)"
							strokeWidth={2.5}
						/>
					)}
					<XAxis numTicks={6} />
					<YAxis numTicks={5} position="right" formatValue={formatMetricValue} />
					<ChartMarkers items={markers} />
					<ChartTooltip
						rows={(point) =>
							[
								{
									color: "var(--chart-line-primary)",
									label: activeMetricLabel,
									value: formatMetricValue(point.primaryValue as number),
								},
								secondaryMetric
									? {
											color: "var(--chart-line-secondary)",
											label:
												metricOptions.find((m) => m.value === secondaryMetric)
													?.label || "Followers",
											value: formatMetricValue(point.secondaryValue as number),
										}
									: null,
							].filter(Boolean) as {
								color: string;
								label: string;
								value: string;
							}[]
						}
					>
						<MarkerContentDemo markers={markers} />
					</ChartTooltip>
					{/* Segment Selection - click and drag to select date range */}
					<SegmentBackground />
					<SegmentLineFrom variant="dashed" />
					<SegmentLineTo variant="dashed" />
				</LineChart>

				{/* Screen reader summary for accessibility */}
				<p className="sr-only">
					Chart showing social media performance over {chartData.length} days.{" "}
					{activeMetricLabel} range from{" "}
					{formatMetricValue(Math.min(...transformedChartData.map((d) => d.primaryValue)))} to{" "}
					{formatMetricValue(Math.max(...transformedChartData.map((d) => d.primaryValue)))}
					{secondaryMetric &&
						`. Followers range from ${formatMetricValue(Math.min(...transformedChartData.map((d) => d.secondaryValue ?? 0)))} to ${formatMetricValue(Math.max(...transformedChartData.map((d) => d.secondaryValue ?? 0)))}.`}
				</p>
			</CardContent>
		</Card>
	);
}
