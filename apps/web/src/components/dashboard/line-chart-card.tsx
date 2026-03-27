"use client";

import { ChevronDown } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export interface LineChartCardProps {
	chartData: ChartDataPoint[];
	markers: ChartMarker[];
	formatMetricValue: (value: number) => string;
	keyProp: string;
}

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
}: LineChartCardProps) {
	const [primaryMetric, setPrimaryMetric] = useState("engagement");
	const [secondaryMetric, setSecondaryMetric] = useState<string | null>(null);

	return (
		<div
			className="bg-white border rounded-xl p-3 sm:p-4 overflow-visible pb-4 sm:pb-6 group"
			key={keyProp}
			onMouseEnter={() => {}}
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2 overflow-x-auto">
					{/* Primary Metric Selector */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="ghost"
								className="text-base sm:text-lg font-semibold whitespace-nowrap"
							>
								{metricOptions.find((m) => m.value === primaryMetric)?.label}{" "}
								Performance
								<ChevronDown className="ml-1.5" />
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
					{/* Secondary Metric Selector - appears on hover */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button
								variant="ghost"
								className={cn(
									"text-base sm:text-lg font-semibold whitespace-nowrap transition-opacity duration-200",
									"opacity-0 group-hover:opacity-100",
									secondaryMetric && "opacity-100",
								)}
							>
								{secondaryMetric
									? `vs ${metricOptions.find((m) => m.value === secondaryMetric)?.label}`
									: "Secondary Metrics"}
								<ChevronDown className="ml-1.5" />
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
												secondaryMetric === option.value ? null : option.value,
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
				</div>
			</div>
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
		</div>
	);
}
