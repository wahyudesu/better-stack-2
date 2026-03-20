"use client";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  LayoutGrid,
  KanbanSquare,
  List,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { PlatformFilterDropdown } from "@/components/ui/platform-filter";
import type { Platform } from "@/components/ui/PlatformIcon";

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
      label: "Posts",
      icon: <Newspaper className="h-3.5 w-3.5" />,
    },
  ];

  const calendarViewTabs = [
    {
      id: "month",
      label: "Month",
      icon: <CalendarDays className="h-3.5 w-3.5" />,
    },
    {
      id: "week",
      label: "Week",
      icon: <CalendarRange className="h-3.5 w-3.5" />,
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
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <AnimatedTabs
          tabs={viewModeTabs}
          activeTab={viewMode}
          onChange={(val) => onViewModeChange(val as ViewMode)}
          variant="segment"
          iconOnly
        />

        {/* Month/Week Toggle for Calendar */}
        {viewMode === "calendar" && onCalendarViewChange && (
          <AnimatedTabs
            tabs={calendarViewTabs}
            activeTab={calendarView}
            onChange={(val) => onCalendarViewChange(val as CalendarView)}
            variant="segment"
            iconOnly
          />
        )}

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

        {/* Platform Filter */}
        {onPlatformChange && (
          <PlatformFilterDropdown
            value={selectedPlatform}
            onChange={(value) => onPlatformChange(value)}
            size="sm"
          />
        )}
      </div>

      {viewMode === "calendar" && (
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
      )}
    </div>
  );
}
