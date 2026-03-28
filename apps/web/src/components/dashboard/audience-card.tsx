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
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TAB_TRIGGER_CLASSNAME } from "@/lib/constants/ui";
import { cn } from "@/lib/utils";

const followerData = [
	{ label: "Verified", value: 35 },
	{ label: "Regular", value: 45 },
	{ label: "New", value: 20 },
];

const viewerData = [
	{ label: "Organic", value: 52 },
	{ label: "Suggested", value: 28 },
	{ label: "Hashtag", value: 15 },
	{ label: "External", value: 5 },
];

const pieColors = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
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

	// Add colors to legend items
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
					<PieSlice index={index} key={item.label} />
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
					<LegendLabel showValue valueSuffix="%" className="text-xs sm:text-sm" />
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
			"p-0",
			isSelected && "!font-semibold !text-foreground",
		);
	};

	if (onDemoViewChange) {
		return (
			<Tabs
				value={demoView}
				onValueChange={handleValueChange}
				className="gap-4"
			>
				<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 sm:p-4 min-h-72 sm:min-h-80 h-full">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
						<div className="flex items-center gap-2">
							<p className="text-base font-semibold">Audience</p>
							<SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
								<Info className="size-4 text-muted-foreground cursor-help" />
							</SimpleTooltip>
						</div>
						<TabsList
							variant="line"
							className="bg-transparent rounded-none gap-4"
						>
							<TabsTab value="follower" className={getTabClassName("follower")}>
								Follower
							</TabsTab>
							<TabsTab value="viewer" className={getTabClassName("viewer")}>
								Viewer
							</TabsTab>
						</TabsList>
					</div>
					<TabsPanel value="follower">
						<div className="flex flex-col items-center justify-center">
							<PieChartWithLegend data={currentFollowerData} size={150} />
						</div>
					</TabsPanel>
					<TabsPanel value="viewer">
						<div className="flex flex-col items-center justify-center">
							<PieChartWithLegend data={currentViewerData} size={150} />
						</div>
					</TabsPanel>
				</div>
			</Tabs>
		);
	}

	return (
		<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 sm:p-4 min-h-72 sm:min-h-80">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
				<div className="flex items-center gap-2">
					<p className="text-base font-semibold">Audience</p>
					<SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
						<Info className="size-4 text-muted-foreground cursor-help" />
					</SimpleTooltip>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<PieChartWithLegend data={currentFollowerData} size={150} />
			</div>
		</div>
	);
}
