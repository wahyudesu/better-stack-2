"use client";

import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	KanbanSquare,
	LayoutGrid,
	List,
	Newspaper,
} from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { Button } from "@/components/ui/button";
import { DepthButtonMenu } from "@/components/ui/depth-button-menu";
import type { Platform } from "@/components/ui/PlatformIcon";
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";

type ViewMode = "calendar" | "cards";
type CalendarView = "month" | "week";
type CardsView = "grid" | "kanban" | "list";

interface PostControlsProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	monthName: string;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	calendarView?: CalendarView;
	onCalendarViewChange?: (view: CalendarView) => void;
	cardsView?: CardsView;
	onCardsViewChange?: (view: CardsView) => void;
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
	cardsView = "grid",
	onCardsViewChange,
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
			label: "List",
			icon: <Newspaper className="h-3.5 w-3.5" />,
		},
	];

	const cardsViewTabs = [
		{ id: "grid", label: "Grid", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
		{
			id: "kanban",
			label: "Kanban",
			icon: <KanbanSquare className="h-3.5 w-3.5" />,
		},
		{ id: "list", label: "List", icon: <List className="h-3.5 w-3.5" /> },
	];

	return (
		<div className="flex items-center gap-4 flex-wrap">
			{/* Left: Calendar Navigation */}
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
				<div />
			)}

			{/* Right: View Toggle & Filters - always pushed to right */}
			<div className="flex items-center gap-3 ml-auto">
				{/* View Mode Toggle */}
				{/* Grid/Kanban/List Toggle for Cards View */}
				{viewMode === "cards" && onCardsViewChange && (
					<AnimatedTabs
						tabs={cardsViewTabs}
						activeTab={cardsView}
						onChange={(val) => onCardsViewChange(val as CardsView)}
						variant="segment"
						iconOnly
					/>
				)}
				<div className="flex items-center gap-2">
					<AnimatedTabs
						tabs={viewModeTabs}
						activeTab={viewMode}
						onChange={(val) => onViewModeChange(val as ViewMode)}
						variant="segment"
					/>
				</div>
				{/* Platform Filter */}
				{onPlatformChange && (
					<PlatformFilterDropdown
						value={selectedPlatform}
						onChange={(value) => onPlatformChange(value)}
					/>
				)}
			</div>
		</div>
	);
}
