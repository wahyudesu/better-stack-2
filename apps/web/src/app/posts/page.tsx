"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	PostCardsView,
	PostControls,
} from "@/components/features/calendar";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import type { Platform } from "@/components/ui/PlatformIcon";
import {
	type CalendarEvent,
	type Platform as CalendarPlatform,
	calendarEvents,
} from "@/data/mock";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/constants";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

type ViewMode = "calendar" | "cards";
type CalendarView = "month" | "week";
type PostStatus = "draft" | "pending" | "published" | "failed";

// Calculate week range - defined outside component to avoid unnecessary re-renders
function getWeekRange(date: Date) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
	const startOfWeek = new Date(d.setDate(diff));
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(endOfWeek.getDate() + 6);
	return { startOfWeek, endOfWeek };
}

export default function PostsPage() {
	// View mode states
	const [viewMode, setViewMode] = useState<ViewMode>("calendar");
	const [calendarView, setCalendarView] = useState<CalendarView>("month");
	const [postStatus, setPostStatus] = useState<PostStatus>("draft");

	// Use a fixed date for initial render to prevent hydration mismatch
	const [currentDate, setCurrentDate] = useState<Date>(
		() => new Date("2026-01-01T00:00:00"),
	);

	// Update to actual date on client mount only (after hydration)
	useEffect(() => {
		setCurrentDate(new Date());
	}, []);

	const [events, setEvents] = useState(calendarEvents);
	const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
	const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(
		"all" as const,
	);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfMonth(year, month);
	const monthName = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});

	const weekRange = useMemo(() => getWeekRange(currentDate), [currentDate]);
	const weekName = `${weekRange.startOfWeek.toLocaleDateString("default", { month: "short", day: "numeric" })} - ${weekRange.endOfWeek.toLocaleDateString("default", { month: "short", day: "numeric", year: "numeric" })}`;

	const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

	const prevWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() - 7);
		setCurrentDate(newDate);
	};

	const nextWeek = () => {
		const newDate = new Date(currentDate);
		newDate.setDate(newDate.getDate() + 7);
		setCurrentDate(newDate);
	};

	const handlePrev = calendarView === "week" ? prevWeek : prevMonth;
	const handleNext = calendarView === "week" ? nextWeek : nextMonth;
	const displayName = calendarView === "week" ? weekName : monthName;

	// Filter events by platform and status
	const filteredEvents = useMemo(() => {
		let result =
			selectedPlatform === "all"
				? events
				: events.filter(
						(e) => e.platform === (selectedPlatform as CalendarPlatform),
					);

		if (postStatus === "pending") {
			result = result.filter((e) => e.status === "scheduled");
		} else {
			result = result.filter((e) => e.status === postStatus);
		}

		return result;
	}, [events, selectedPlatform, postStatus]);

	const eventsByDate = useMemo(() => {
		const map: Record<string, CalendarEvent[]> = {};
		filteredEvents.forEach((e) => {
			if (!map[e.date]) map[e.date] = [];
			map[e.date].push(e);
		});
		return map;
	}, [filteredEvents]);

	const handleDragStart = useCallback(
		(e: React.DragEvent, event: CalendarEvent) => {
			setDraggedEvent(event);
			e.dataTransfer.effectAllowed = "move";
			if (e.currentTarget instanceof HTMLElement) {
				e.currentTarget.style.opacity = "0.5";
			}
		},
		[],
	);

	const handleDragEnd = useCallback((e: React.DragEvent) => {
		if (e.currentTarget instanceof HTMLElement) {
			e.currentTarget.style.opacity = "1";
		}
		setDraggedEvent(null);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent, targetDate: string) => {
			e.preventDefault();
			if (!draggedEvent) return;
			setEvents((prev) =>
				prev.map((ev) =>
					ev.id === draggedEvent.id ? { ...ev, date: targetDate } : ev,
				),
			);
			setDraggedEvent(null);
		},
		[draggedEvent],
	);

	const handleDateClick = useCallback((dateStr: string) => {
		// Navigate to create page with date
		window.location.href = `/posts/create?date=${dateStr}`;
	}, []);

	const handleEventClick = useCallback((_event: CalendarEvent) => {
		// TODO: open popover instead of dialog
	}, []);

	const today = currentDate;
	const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

	// Calculate cells based on calendar view
	const cells: { day: number | null; dateStr: string }[] = useMemo(() => {
		if (calendarView === "month") {
			const monthCells: { day: number | null; dateStr: string }[] = [];
			for (let i = 0; i < firstDay; i++)
				monthCells.push({ day: null, dateStr: "" });
			for (let d = 1; d <= daysInMonth; d++) {
				monthCells.push({
					day: d,
					dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
				});
			}
			while (monthCells.length % 7 !== 0)
				monthCells.push({ day: null, dateStr: "" });
			return monthCells;
		} else {
			// Week view - show 7 days of the current week
			const weekCells: { day: number | null; dateStr: string }[] = [];
			const startOfWeek = weekRange.startOfWeek;
			for (let i = 0; i < 7; i++) {
				const d = new Date(startOfWeek);
				d.setDate(startOfWeek.getDate() + i);
				weekCells.push({
					day: d.getDate(),
					dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
				});
			}
			return weekCells;
		}
	}, [calendarView, firstDay, daysInMonth, year, month, weekRange]);

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Posts</h1>
				<p className="text-sm text-muted-foreground">
					Manage & schedule your content
				</p>
			</div>

			{/* Controls */}
			<PostControls
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				monthName={displayName}
				onPrevMonth={handlePrev}
				onNextMonth={handleNext}
				calendarView={calendarView}
				onCalendarViewChange={setCalendarView}
				postStatus={postStatus}
				onPostStatusChange={setPostStatus}
				selectedPlatform={selectedPlatform}
				onPlatformChange={(value) => setSelectedPlatform(value)}
			/>

			{/* Content */}
			{viewMode === "calendar" && (
				<CalendarGrid
					cells={cells}
					eventsByDate={eventsByDate}
					todayStr={todayStr}
					draggedEvent={draggedEvent}
					onDateClick={handleDateClick}
					onEventClick={handleEventClick}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					calendarView={calendarView}
				/>
			)}

			{viewMode === "cards" && (
				<PostCardsView
					events={filteredEvents}
					onEventClick={handleEventClick}
				/>
			)}
		</div>
	);
}
