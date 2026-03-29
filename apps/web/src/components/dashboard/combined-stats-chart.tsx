"use client";

import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	FilterSelect,
	PlatformFilter,
	type PlatformFilterValue,
} from "@/components/ui/filter-select";
import { cn } from "@/lib/utils";

const metricOptions = [
	{ value: "engagement", label: "Engagement" },
	{ value: "views", label: "Views" },
	{ value: "comments", label: "Comments" },
	{ value: "impression", label: "Impression" },
	{ value: "share", label: "Share" },
];

export interface ChartDataPoint {
	date: Date;
	engagements: number;
	followers: number;
}

export interface StatItem {
	label: string;
	value: string;
	change: string;
}

export interface CombinedStatsChartProps {
	chartData: ChartDataPoint[];
	markers: ChartMarker[];
	stats: StatItem[];
	formatMetricValue: (value: number) => string;
	keyProp: string;
}

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

export function CombinedStatsChart({
	chartData,
	markers,
	stats,
	formatMetricValue,
	keyProp,
}: CombinedStatsChartProps) {
	const [primaryMetric, setPrimaryMetric] = useState("engagement");
	const [secondaryMetric, setSecondaryMetric] = useState<string | null>(null);
	const [platform, setPlatform] = useState<PlatformFilterValue>("all");

	return (
		<Card
			className="overflow-visible pb-4 sm:pb-6 group"
			key={keyProp}
			onMouseEnter={() => {}}
		>
			<CardHeader className="p-3 sm:p-4 pb-0 mb-3 sm:mb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2 sm:gap-3">
						{/* Primary Metric Selector */}
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button
									variant="ghost"
									className="text-sm sm:text-base lg:text-lg font-semibold whitespace-nowrap text-left justify-start"
								>
									<span className="truncate max-w-[200px] sm:max-w-none">
										{metricOptions.find((m) => m.value === primaryMetric)?.label}{" "}
										Performance
									</span>
									<ChevronDown className="ml-1.5 shrink-0" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="min-w-[160px]">
								{metricOptions.map((option) => (
									<DropdownMenuItem
										key={option.value}
										onClick={() => {
											setPrimaryMetric(option.value);
											if (secondaryMetric === option.value) {
												setSecondaryMetric(null);
											}
										}}
									>
										<span className="flex-1">{option.label}</span>
										{primaryMetric === option.value && (
											<svg
												className="size-4 text-primary"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						{/* Secondary Metric Selector - visible on mobile, hover on desktop */}
						<div className="flex items-center gap-1">
							<DropdownMenu>
								<DropdownMenuTrigger>
									<Button
										variant="ghost"
										className={cn(
											"text-sm sm:text-base lg:text-lg font-semibold whitespace-nowrap text-left justify-start",
											// Always visible on mobile, hover on desktop
											"opacity-100",
											"sm:opacity-0",
											"group-hover:opacity-100",
											secondaryMetric && "opacity-100",
										)}
									>
										<span className="truncate max-w-[120px] sm:max-w-none">
											{secondaryMetric
												? `vs ${metricOptions.find((m) => m.value === secondaryMetric)?.label}`
												: "Compare"}
										</span>
										<ChevronDown className="ml-1.5 shrink-0" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="min-w-[160px]">
									{metricOptions
										.filter((m) => m.value !== primaryMetric)
										.map((option) => (
											<DropdownMenuItem
												key={option.value}
												onClick={() =>
													setSecondaryMetric(
														secondaryMetric === option.value
															? null
															: option.value,
													)
												}
											>
												<span className="flex-1">{option.label}</span>
												{secondaryMetric === option.value && (
													<svg
														className="size-4 text-primary"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															fillRule="evenodd"
															d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
															clipRule="evenodd"
														/>
													</svg>
												)}
											</DropdownMenuItem>
										))}
								</DropdownMenuContent>
							</DropdownMenu>
							{/* Clear button - only show when secondary metric is active */}
							{secondaryMetric && (
								<Button
									variant="ghost"
									size="icon"
									className="size-7 hover:bg-muted"
									onClick={() => setSecondaryMetric(null)}
								>
									<X className="size-4" />
								</Button>
							)}
						</div>
					</div>
					{/* Platform Filter */}
					<PlatformFilter
						value={platform}
						onChange={setPlatform}
						className="w-fit"
					/>
				</div>
			</CardHeader>

			<CardContent className="p-3 sm:p-4 pt-0 space-y-4">
				{/* Stats Section */}
				<div
					className={cn(
						"flex flex-col sm:flex-row sm:divide-x sm:divide-y-0 divide-y divide-border/50",
						"gap-4 sm:gap-0 w-full",
					)}
				>
					{stats.map((stat) => {
						const direction = getDirection(stat.change);

						return (
							<div
								key={stat.label}
								className="flex flex-col items-start text-left space-y-2 flex-1 sm:px-6 sm:py-2"
							>
								{/* Title */}
								<span className="text-xs font-medium text-muted-foreground">
									{stat.label}
								</span>

								{/* Large value */}
								<span className="text-2xl font-bold text-foreground">
									{stat.value}
								</span>

								{/* Percentage badge */}
								<Badge
									variant="outline"
									className={cn(
										"text-xs px-2 py-0.5",
										badgeVariants[direction],
									)}
								>
									{stat.change}
								</Badge>
							</div>
						);
					})}
				</div>

				{/* Chart Section */}
				<LineChart
					data={chartData as unknown as Record<string, unknown>[]}
					aspectRatio="3 / 1"
					margin={{ top: 70, right: 50, bottom: 50, left: 10 }}
				>
					<Grid horizontal />
					<Line
						dataKey="engagements"
						stroke="var(--chart-line-primary)"
						strokeWidth={2.5}
					/>
					{secondaryMetric && (
						<Line
							dataKey="followers"
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
									label:
										metricOptions.find((m) => m.value === primaryMetric)?.label ||
										"Engagements",
									value: formatMetricValue(point.engagements as number),
								},
								secondaryMetric
									? {
											color: "var(--chart-line-secondary)",
											label:
												metricOptions.find((m) => m.value === secondaryMetric)
													?.label || "Followers",
											value: formatMetricValue(point.followers as number),
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
					Engagements range from{" "}
					{formatMetricValue(Math.min(...chartData.map((d) => d.engagements)))} to{" "}
					{formatMetricValue(Math.max(...chartData.map((d) => d.engagements)))}
					{secondaryMetric &&
						`. Followers range from ${formatMetricValue(Math.min(...chartData.map((d) => d.followers)))} to ${formatMetricValue(Math.max(...chartData.map((d) => d.followers)))}.`}
				</p>
			</CardContent>
		</Card>
	);
}
