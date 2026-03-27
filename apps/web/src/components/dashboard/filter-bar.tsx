"use client";

import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";

const typeOptions = [
	{ value: "overview", label: "Overview" },
	{ value: "engagement", label: "Engagement" },
	{ value: "reach", label: "Reach" },
	{ value: "impressions", label: "Impressions" },
] as const;

const timeOptions = [
	{ value: "7d", label: "Last 7 days" },
	{ value: "14d", label: "Last 14 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "90d", label: "Last 90 days" },
	{ value: "custom", label: "Custom range" },
] as const;

export interface FilterBarProps {
	selectedSocial: string;
	onSocialChange: (value: string) => void;
	selectedType: string;
	onTypeChange: (value: string) => void;
	selectedTime: string;
	onTimeChange: (value: string) => void;
}

export function FilterBar({
	selectedSocial,
	onSocialChange,
	selectedType,
	onTypeChange,
	selectedTime,
	onTimeChange,
}: FilterBarProps) {
	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
			<PlatformFilterDropdown
				value={selectedSocial}
				onChange={onSocialChange}
				variant="ghost"
			/>

			<div className="flex items-center gap-0.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
				<FilterDropdown
					value={selectedType}
					onChange={onTypeChange}
					options={typeOptions}
					placeholder="Type"
				/>

				<FilterDropdown
					value={selectedTime}
					onChange={onTimeChange}
					options={timeOptions}
					placeholder="Time range"
				/>
			</div>
		</div>
	);
}
