import type { PlatformFilterValue } from "@/components/ui/platform-filter";
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";
import { DepthButton, DepthButtonGroup } from "@/components/ui/depth-buttons";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import { Download } from "lucide-react";

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
	selectedSocial: PlatformFilterValue;
	onSocialChange: (value: PlatformFilterValue) => void;
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
		<div className="flex items-start gap-3 sm:gap-4">
			{/* Left: Platform Filter */}
			<PlatformFilterDropdown
				value={selectedSocial}
				onChange={onSocialChange}
				variant="ghost"
			/>

			{/* Spacer to push buttons to the right */}
			<div className="flex-1 min-w-0" />

			{/* Right: Filters + Export - Grouped */}
			<DepthButtonGroup className="gap-2">
				<DepthButtonMenu
					value={selectedType}
					onChange={onTypeChange}
					options={typeOptions}
					placeholder="Type"
					size="default"
					// position="first"
				/>

				<DepthButtonMenu
					value={selectedTime}
					onChange={onTimeChange}
					options={timeOptions}
					placeholder="Time range"
					size="default"
					// position="middle"
				/>

				<DepthButton variant="outline" size="default">
					<Download className="size-4" />
				</DepthButton>
			</DepthButtonGroup>
		</div>
	);
}
