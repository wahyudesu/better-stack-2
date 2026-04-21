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
			{/* Left: View Mode Toggle */}
			<div className="flex items-center gap-2">
				<AnimatedTabs
					tabs={viewModeTabs}
					activeTab={viewMode}
					onChange={(val) => onViewModeChange(val as ViewMode)}
					variant="segment"
				/>
			</div>

			{/* Center: Calendar Navigation (calendar mode) or Status Tabs (cards mode) */}
			{viewMode === "calendar" ? (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1.5">
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
					</div>

					{/* Month/Week Dropdown for Calendar */}
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
				<div className="flex-1 flex justify-between items-center">
					{/* Status Tabs for Cards View */}
					<AnimatedTabs
						tabs={statusTabs}
						activeTab={postStatus}
						onChange={(val) => onPostStatusChange(val as PostStatus)}
						variant="segment"
					/>
				</div>
			)}

			{/* Right: Platform Filter + New Post */}
			<div className="flex items-center gap-3 ml-auto">
				{/* Platform Filter */}
				{onPlatformChange && (
					<PlatformFilterDropdown
						value={selectedPlatform}
						onChange={(value) => onPlatformChange(value)}
					/>
				)}
				<DepthButton
					size="sm"
					variant="blue"
					className="gap-1.5"
					onClick={() => {
						window.location.href = "/posts/create";
					}}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M12 5v14M5 12h14" />
					</svg>
					New Post
				</DepthButton>
			</div>
		</div>
	);
}
