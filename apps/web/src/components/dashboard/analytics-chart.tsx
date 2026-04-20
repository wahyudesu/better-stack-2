/**
 * Analytics Chart Component.
 * Displays a line chart with metric selection dropdown.
 * Used in the analytics page for showing performance over time.
 */

"use client";

import { ChevronDown } from "lucide-react";
import {
	ChartTooltip,
	Line,
	LineChart,
	SegmentBackground,
	SegmentLineFrom,
	SegmentLineTo,
	XAxis,
} from "@/components/charts/line-chart";
import { ChartMarkers } from "@/components/charts/markers";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface ChartDataPoint {
	date: Date;
	[key: string]: number | Date;
}

export interface ChartMarker {
	date: Date;
	network: string;
	title: string;
	description?: string;
	color?: string;
	href?: string;
	target?: "_blank" | "_self";
	onClick?: () => void;
}

export interface MetricOption {
	value: string;
	label: string;
	color: string;
}

export interface AnalyticsChartProps {
	data: ChartDataPoint[];
	markers: ChartMarker[];
	activeMetric: string;
	onMetricChange: (metric: string) => void;
	metricOptions: MetricOption[];
	compareMetric?: string | null;
	className?: string;
}

export function AnalyticsChart({
	data,
	markers,
	activeMetric,
	onMetricChange,
	metricOptions,
	compareMetric,
	className,
}: AnalyticsChartProps) {
	return (
		<div className={cn("border rounded-lg p-4", className)}>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
				<DropdownMenu>
					<DropdownMenuTrigger className="text-lg font-semibold hover:bg-muted px-3 py-2 rounded-md transition-colors flex items-center cursor-pointer">
						{metricOptions.find((m) => m.value === activeMetric)?.label}{" "}
						Performance
						<ChevronDown className="ml-1.5" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-[160px]">
						{metricOptions.map((option) => (
							<DropdownMenuItem
								key={option.value}
								onClick={() => onMetricChange(option.value)}
							>
								<span className="flex-1">{option.label}</span>
								{activeMetric === option.value && (
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

			<LineChart
				data={data}
				aspectRatio="3 / 1"
				margin={{ top: 70, right: 10, bottom: 50, left: 10 }}
			>
				<Line
					dataKey={activeMetric}
					stroke="var(--chart-line-primary)"
					strokeWidth={2.5}
				/>
				{compareMetric && (
					<Line
						dataKey={compareMetric}
						stroke="var(--chart-line-secondary)"
						strokeWidth={2.5}
					/>
				)}
				<XAxis numTicks={8} />
				<ChartMarkers items={markers} />
				<ChartTooltip
					rows={(point) =>
						[
							{
								color: "var(--chart-line-primary)",
								label:
									metricOptions.find((m) => m.value === activeMetric)?.label ||
									"Value",
								value: point[activeMetric] as number,
							},
							compareMetric
								? {
										color: "var(--chart-line-secondary)",
										label:
											metricOptions.find((m) => m.value === compareMetric)
												?.label || "Compare",
										value: point[compareMetric] as number,
									}
								: null,
						].filter(Boolean) as {
							color: string;
							label: string;
							value: number;
						}[]
					}
				/>
				<SegmentBackground />
				<SegmentLineFrom variant="dashed" />
				<SegmentLineTo variant="dashed" />
			</LineChart>
		</div>
	);
}
