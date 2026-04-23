"use client";

import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Newspaper,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import { DepthButton } from "@/components/ui/depth-buttons";
import type { Platform } from "@/components/ui/PlatformIcon";
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";

type ViewMode = "calendar" | "cards";
type CalendarView = "month" | "week";
type PostStatus = "draft" | "pending" | "published" | "failed";

interface PostControlsProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	monthName: string;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	calendarView?: CalendarView;
	onCalendarViewChange?: (view: CalendarView) => void;
	postStatus: PostStatus;
	onPostStatusChange: (status: PostStatus) => void;
	selectedPlatform?: Platform | "all";
	onPlatformChange?: (platform: Platform | "all") => void;
}

export function PostControls({
	viewMode,
	onViewModeChange,
	monthName,
	onPrevMonth,
	onNextMonth,
	calendarView = "month",
	onCalendarViewChange,
	postStatus,
	onPostStatusChange,
	selectedPlatform = "all",
	onPlatformChange,
}: PostControlsProps) {
	const viewModeTabs = [
		{
			id: "calendar",
			label: "Calendar",
			icon: <CalendarIcon className="h-3.5 w-3.5" />,
		},
		{
			id: "cards",
			label: "Posts",
			icon: <Newspaper className="h-3.5 w-3.5" />,
		},
	];

	const statusTabs = [
		{ id: "draft", label: "Draft" },
		{ id: "pending", label: "Pending" },
		{ id: "published", label: "Published" },
		{ id: "failed", label: "Failed" },
	];

	return (
		<div className="flex items-center gap-4 flex-wrap">
			<div className="flex items-center gap-2 flex-1">
				{viewMode === "calendar" ? (
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={onPrevMonth}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="min-w-[140px] text-center text-sm font-semibold">
							{monthName}
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={onNextMonth}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						{onCalendarViewChange && (
							<DepthButtonMenu
								value={calendarView}
								onChange={(val) => onCalendarViewChange(val as CalendarView)}
								options={[
									{ value: "month", label: "Month" },
									{ value: "week", label: "Week" },
								]}
								placeholder="Select..."
							/>
						)}
					</div>
				) : (
					<AnimatedTabs
						tabs={statusTabs}
						activeTab={postStatus}
						onChange={(val) => onPostStatusChange(val as PostStatus)}
						variant="segment"
					/>
				)}
			</div>
			<div className="flex items-center gap-3">
				{onPlatformChange && (
					<PlatformFilterDropdown
						value={selectedPlatform}
						onChange={(value) => onPlatformChange(value)}
					/>
				)}
				<AnimatedTabs
					tabs={viewModeTabs}
					activeTab={viewMode}
					onChange={(val) => onViewModeChange(val as ViewMode)}
					variant="segment"
				/>
			</div>
		</div>
	);
}
