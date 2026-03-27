"use client";

import { ID, JP, MY, PH, SG, TH, US, VN } from "country-flag-icons/react/3x2";
import { Info } from "lucide-react";
import React from "react";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { useChart } from "@/components/charts/chart-context";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
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
				const bandY = barScale(label) ?? 0;
				const value = item.users;
				const Flag = item.countryCode ? flagMap[item.countryCode] : null;

				return (
					<g key={label} transform={`translate(0, ${bandY})`}>
						{/* Flag */}
						{Flag && (
							<foreignObject x={8} y={bandWidth / 2 - 8} width={16} height={16}>
								{React.createElement(Flag, {
									className: "size-4 rounded-full object-cover",
								})}
							</foreignObject>
						)}

						{/* Country Name - same color as value */}
						<text
							x={28}
							y={bandWidth / 2}
							dy="0.35em"
							fill="#6b7280"
							fontSize="14"
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
							fontSize="14"
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
			isSelected && "!font-semibold !text-foreground",
		);
	};

	return (
		<Tabs value={geoView} onValueChange={handleValueChange} className="gap-4">
			<div className="bg-white border rounded-xl p-3 sm:p-4 min-h-80 h-full">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
					<div className="flex items-center gap-2">
						<p className="text-base font-semibold">Demographics</p>
						<SimpleTooltip content="Menampilkan distribusi pengguna berdasarkan negara atau daerah">
							<Info className="size-4 text-muted-foreground cursor-help" />
						</SimpleTooltip>
					</div>
					<TabsList variant="line" className="bg-transparent rounded-none p-0">
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
					<BarChart
						data={data as unknown as Record<string, unknown>[]}
						xDataKey="country"
						orientation="horizontal"
						margin={{ left: 10, right: 10, top: 0, bottom: 0 }}
						aspectRatio="4 / 3"
					>
						<Bar dataKey="users" fill="#e5e7eb" lineCap={4} />
						<BarInsideLabels data={data} flagMap={flagMap} />
						<ChartTooltip showCrosshair={false} />
					</BarChart>
				)}

				{/* Region View - Keep the original bar chart */}
				{geoView === "region" && (
					<BarChart
						data={data as unknown as Record<string, unknown>[]}
						xDataKey="region"
						orientation="horizontal"
						margin={{ left: 85, right: 20, top: 0, bottom: 0 }}
						aspectRatio="4 / 3"
					>
						<Bar dataKey="users" fill="#e5e7eb" lineCap={4} />
						<BarYAxis />
						<ChartTooltip showCrosshair={false} />
					</BarChart>
				)}
			</div>
		</Tabs>
	);
}
