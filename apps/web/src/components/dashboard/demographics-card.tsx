"use client";

import { ID, JP, MY, PH, SG, TH, US, VN } from "country-flag-icons/react/3x2";
import { Info } from "lucide-react";
import React from "react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { useChart } from "@/components/charts/chart-context";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TAB_TRIGGER_CLASSNAME } from "@/lib/constants/ui";
import type { DemographicDataItem } from "@/lib/data/demographics";
import { cn } from "@/lib/utils";

const flagMap: Record<string, React.ComponentType<{ className?: string }>> = {
	ID,
	US,
	JP,
	SG,
	MY,
	TH,
	PH,
	VN,
};

export interface DemographicsCardProps {
	geoView: "country" | "region";
	onGeoViewChange: (view: "country" | "region") => void;
	data: DemographicDataItem[];
}

// Custom component to render labels inside bars
function BarInsideLabels({
	data,
	flagMap,
}: {
	data: DemographicDataItem[];
	flagMap: Record<string, React.ComponentType<{ className?: string }>>;
}) {
	const { barScale, bandWidth, barXAccessor, yScale, innerWidth } = useChart();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || !barScale || !bandWidth || !barXAccessor || !yScale) {
		return null;
	}

	return (
		<g>
			{data.map((item) => {
				const label = item.country ?? item.region;
				if (!label) return null;
				const bandY = barScale(label) ?? 0;
				const value = item.users;
				const Flag = item.countryCode ? flagMap[item.countryCode] : null;

				return (
					<g key={label} transform={`translate(0, ${bandY})`}>
						{/* Flag */}
						{Flag && (
							<foreignObject x={6} y={bandWidth / 2 - 7} width={14} height={14}>
								{React.createElement(Flag, {
									className: "size-3.5 rounded-full object-cover",
								})}
							</foreignObject>
						)}

						{/* Country Name - same color as value */}
						<text
							x={Flag ? 24 : 6}
							y={bandWidth / 2}
							dy="0.35em"
							fill="#6b7280"
							fontSize="12"
							fontWeight="600"
							style={{
								pointerEvents: "none",
							}}
						>
							{label}
						</text>

						{/* Value - dark text at far right */}
						<text
							x={innerWidth}
							y={bandWidth / 2}
							dy="0.35em"
							fill="#6b7280"
							fontSize="12"
							fontWeight="600"
							textAnchor="end"
							style={{
								pointerEvents: "none",
							}}
						>
							{value.toLocaleString()}
						</text>
					</g>
				);
			})}
		</g>
	);
}

export function DemographicsCard({
	geoView,
	onGeoViewChange,
	data,
}: DemographicsCardProps) {
	const handleValueChange = (v: string) => {
		if (v !== geoView) {
			onGeoViewChange(v as "country" | "region");
		}
	};

	const getTabClassName = (value: string) => {
		const isSelected = value === geoView;
		return cn(
			TAB_TRIGGER_CLASSNAME,
			"p-0",
			isSelected && "!font-semibold !text-foreground",
		);
	};

	return (
		<Tabs value={geoView} onValueChange={handleValueChange} className="gap-4">
			<div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-xl p-3 sm:p-4 min-h-72 sm:min-h-80 h-full flex flex-col">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-4">
					<div className="flex items-center gap-2">
						<p className="text-base font-semibold">Demographics</p>
						<SimpleTooltip content="Menampilkan distribusi pengguna berdasarkan negara atau daerah">
							<Info className="size-4 text-muted-foreground cursor-help" />
						</SimpleTooltip>
					</div>
					<TabsList
						variant="line"
						className="bg-transparent rounded-none gap-4"
					>
						<TabsTab value="country" className={getTabClassName("country")}>
							Negara
						</TabsTab>
						<TabsTab value="region" className={getTabClassName("region")}>
							Daerah
						</TabsTab>
					</TabsList>
				</div>

				{/* Country View - BarChart with inside labels */}
				{geoView === "country" && (
					<div className="flex-1 min-h-0 relative">
						<div className="absolute inset-0 overflow-y-auto no-scrollbar">
							<BarChart
								data={data as unknown as Record<string, unknown>[]}
								xDataKey="country"
								orientation="horizontal"
								margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
								aspectRatio="4 / 3"
							>
								<Bar dataKey="users" fill="#e5e7eb" lineCap={4} />
								<BarInsideLabels data={data} flagMap={flagMap} />
								<ChartTooltip showCrosshair={false} />
							</BarChart>
						</div>
						{/* White gradient fade at bottom */}
						<div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
					</div>
				)}

				{/* Region View - Same style as country view with inside labels */}
				{geoView === "region" && (
					<div className="flex-1 min-h-0 relative">
						<div className="absolute inset-0 overflow-y-auto no-scrollbar">
							<BarChart
								data={data as unknown as Record<string, unknown>[]}
								xDataKey="region"
								orientation="horizontal"
								margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
								aspectRatio="4 / 3"
							>
								<Bar dataKey="users" fill="#e5e7eb" lineCap={4} />
								<BarInsideLabels data={data} flagMap={flagMap} />
								<ChartTooltip showCrosshair={false} />
							</BarChart>
						</div>
						{/* White gradient fade at bottom */}
						<div className="absolute bottom-0 left-0 right-0 h-8 sm:h-12 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />
					</div>
				)}
			</div>
		</Tabs>
	);
}
