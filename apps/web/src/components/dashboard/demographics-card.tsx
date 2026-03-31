"use client";

import { Info } from "lucide-react";
import React from "react";
import { BarList } from "@/components/charts/bar-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { TAB_TRIGGER_CLASSNAME } from "@/lib/constants/ui";
import type { DemographicDataItem } from "@/lib/data/demographics";
import { cn } from "@/lib/utils";

// Flag emoji mapping for countries
const flagEmojis: Record<string, string> = {
	ID: "🇮🇩",
	US: "🇺🇸",
	JP: "🇯🇵",
	SG: "🇸🇬",
	MY: "🇲🇾",
	TH: "🇹🇭",
	PH: "🇵🇭",
	VN: "🇻🇳",
};

export interface DemographicsCardProps {
	geoView: "country" | "region";
	onGeoViewChange: (view: "country" | "region") => void;
	data: DemographicDataItem[];
}

export function DemographicsCard({
	geoView,
	onGeoViewChange,
	data,
}: DemographicsCardProps) {
	const [selectedItem, setSelectedItem] = React.useState<string>("");
	const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

	const handleValueChange = (v: string) => {
		if (v !== geoView) {
			onGeoViewChange(v as "country" | "region");
		}
	};

	const handleBarClick = (item: { name: string; value: number; key?: string }) => {
		setSelectedKey(item.key ?? item.name);
		setSelectedItem(
			JSON.stringify(
				{
					name: item.name,
					users: item.value.toLocaleString(),
					percentage: `${(
						(item.value / data.reduce((sum, d) => sum + d.users, 0)) * 100
					).toFixed(1)}%`,
				},
				null,
				2,
			),
		);
	};

	const getTabClassName = (value: string) => {
		const isSelected = value === geoView;
		return cn(
			TAB_TRIGGER_CLASSNAME,
			"p-0 font-normal",
			isSelected && "!font-medium !text-foreground",
		);
	};

	// Transform data for BarList with flags for countries
	const barListData = React.useMemo(() => {
		return data.map((item) => {
			const name = item.country ?? item.region ?? "";
			const flag = item.countryCode ? flagEmojis[item.countryCode] : null;

			// Add flag emoji before name for countries
			const displayName = flag ? `${flag} ${name}` : name;

			return {
				name: displayName,
				value: item.users,
				key: name,
			};
		});
	}, [data]);

	return (
		<Tabs value={geoView} onValueChange={handleValueChange} className="gap-4">
			<Card className="h-72 flex flex-col dark:bg-card/50 py-2 gap-0">
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 min-w-0">
							<CardTitle className="truncate">Demographics</CardTitle>
							<SimpleTooltip content="Menampilkan distribusi pengguna berdasarkan negara atau daerah">
								<Info className="size-4 text-muted-foreground cursor-help shrink-0" />
							</SimpleTooltip>
						</div>
						<TabsList
							variant="line"
							className="bg-transparent rounded-none gap-3"
						>
							<TabsTab value="country" className={getTabClassName("country")}>
								Negara
							</TabsTab>
							<TabsTab value="region" className={getTabClassName("region")}>
								Daerah
							</TabsTab>
						</TabsList>
					</div>
				</CardHeader>

				<CardContent className="flex-1 overflow-hidden relative">
					<div className="h-full overflow-y-auto scrollbar-hide pr-2">
						<BarList
							data={
								barListData as unknown as Array<{ name: string; value: number }>
							}
							valueFormatter={(value) => value.toLocaleString()}
							sortOrder="descending"
							className="gap-y-2"
							showAnimation={false}
							onValueChange={handleBarClick}
							selectedKey={selectedKey}
						/>
					</div>
					{/* Gradient fade at bottom */}
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 dark:to-transparent pointer-events-none" />
					{selectedItem && (
						<div className="absolute bottom-4 right-4 z-10">
							<pre className="w-fit rounded-md bg-muted p-2 font-mono text-xs text-foreground shadow-md">
								{selectedItem}
							</pre>
						</div>
					)}
				</CardContent>
			</Card>
		</Tabs>
	);
}
