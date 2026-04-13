"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { PieChart } from "@/components/charts/pie-chart";
import {
	Legend,
	LegendItemComponent,
	LegendLabel,
	LegendMarker,
} from "@/components/charts/pie-legend";
import { PieSlice } from "@/components/charts/pie-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TAB_TRIGGER_CLASSNAME } from "@/lib/constants/ui";
import { cn } from "@/lib/utils";

const followerData = [
	{ label: "Verified", value: 65 },
	{ label: "Regular", value: 22 },
	{ label: "New", value: 8 },
	{ label: "Inactive", value: 5 },
];

const viewerData = [
	{ label: "FYP", value: 58 },
	{ label: "Following", value: 18 },
	{ label: "Hashtag", value: 14 },
	{ label: "Sound", value: 7 },
	{ label: "External", value: 3 },
];

const pieColors = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

export interface AudienceCardProps {
	demoView?: "follower" | "viewer";
	onDemoViewChange?: (view: "follower" | "viewer") => void;
	followerData?: { label: string; value: number }[];
	viewerData?: { label: string; value: number }[];
}

// Pie Chart with Legend wrapper
function PieChartWithLegend({
	data,
	size,
}: {
	data: { label: string; value: number }[];
	size: number;
}) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	// Find max value for opacity normalization
	const maxValue = Math.max(...data.map((d) => d.value));

	// Calculate opacity for each slice based on value
	const sliceOpacities = data.map((item) => {
		// Normalize value to opacity range (0.1 to 1.0)
		const normalizedValue = item.value / maxValue;
		return 0.1 + normalizedValue * 0.9;
	});

	// Add colors to legend items (use base colors for legend)
	const legendItems = data.map((item, index) => ({
		...item,
		color: pieColors[index % pieColors.length],
	}));

	return (
		<>
			<PieChart
				data={data}
				size={size}
				innerRadius={0}
				hoveredIndex={hoveredIndex}
				onHoverChange={setHoveredIndex}
			>
				{data.map((item, index) => (
					<PieSlice
						index={index}
						key={item.label}
						baseOpacity={sliceOpacities[index]}
					/>
				))}
			</PieChart>
			<Legend
				items={legendItems}
				hoveredIndex={hoveredIndex}
				onHoverChange={setHoveredIndex}
				className="flex flex-wrap justify-center gap-x-2 sm:gap-x-4 gap-y-1.5 mt-2 sm:mt-3"
			>
				<LegendItemComponent>
					<LegendMarker className="size-2 sm:size-3 rounded-full" />
					<LegendLabel
						showValue
						valueSuffix="%"
						className="text-xs sm:text-sm"
					/>
				</LegendItemComponent>
			</Legend>
		</>
	);
}

export function AudienceCard({
	demoView = "follower",
	onDemoViewChange,
	followerData: customFollowerData,
	viewerData: customViewerData,
}: AudienceCardProps) {
	const currentFollowerData = customFollowerData || followerData;
	const currentViewerData = customViewerData || viewerData;

	const handleValueChange = (v: string) => {
		if (v !== demoView) {
			onDemoViewChange?.(v as "follower" | "viewer");
		}
	};

	const getTabClassName = (value: string) => {
		const isSelected = value === demoView;
		return cn(
			TAB_TRIGGER_CLASSNAME,
			"p-0 font-normal",
			isSelected && "!font-medium !text-foreground",
		);
	};

	if (onDemoViewChange) {
		return (
			<Tabs
				value={demoView}
				onValueChange={handleValueChange}
				className="gap-4"
			>
				<Card className="h-72 flex flex-col dark:bg-card/50 py-2 gap-0">
					<CardHeader className="flex items-center justify-between gap-2 py-2 h-fit">
						<CardTitle className="w-full h-full leading-none font-medium flex items-center gap-1">
							Audience
							<SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
								<Info className="size-4 text-muted-foreground cursor-help shrink-0" />
							</SimpleTooltip>
						</CardTitle>
						<TabsList className="bg-transparent rounded-none gap-3">
							<TabsTab value="follower" className={getTabClassName("follower")}>
								Follower
							</TabsTab>
							<TabsTab value="viewer" className={getTabClassName("viewer")}>
								Viewer
							</TabsTab>
						</TabsList>
					</CardHeader>
					<CardContent>
						<TabsPanel value="follower">
							<div className="flex flex-col items-center justify-center">
								<PieChartWithLegend data={currentFollowerData} size={180} />
							</div>
						</TabsPanel>
						<TabsPanel value="viewer">
							<div className="flex flex-col items-center justify-center">
								<PieChartWithLegend data={currentViewerData} size={180} />
							</div>
						</TabsPanel>
					</CardContent>
				</Card>
			</Tabs>
		);
	}

	return (
		<Card className="h-72 flex flex-col gap-0 rounded-none">
			<CardHeader className="py-2 h-fit">
				<CardTitle className="w-full h-full leading-none font-medium flex items-center gap-1">
					Audience
					<SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
						<Info className="size-4 text-muted-foreground cursor-help shrink-0" />
					</SimpleTooltip>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center justify-center">
					<PieChartWithLegend data={currentFollowerData} size={150} />
				</div>
			</CardContent>
		</Card>
	);
}
