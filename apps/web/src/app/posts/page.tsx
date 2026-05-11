"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PostCardsView, PostControls } from "@/components/features/calendar";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import type {
	CalendarView,
	PostStatus,
	ViewMode,
} from "@/components/features/calendar/PostControls";
import { DepthButton } from "@/components/ui/depth-buttons";
import type { Platform } from "@/components/ui/PlatformIcon";
import type { CalendarPlatform } from "@/data/mock";
import {
	useDeletePost,
	usePosts,
	useRetryPost,
	useSyncPosts,
	useUnpublishPost,
	useUpdatePost,
} from "@/hooks/use-posts";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/constants";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { DeleteDialog, LogsDialog, UnpublishDialog } from "./dialogs";
import type { CalendarEvent } from "./utils";
import { getWeekRange, postToCalendarEvent } from "./utils";

export default function PostsPage() {
	const [viewMode, setViewMode] = useState<ViewMode>("calendar");
	const [calendarView, setCalendarView] = useState<CalendarView>("month");
	const [postStatus, setPostStatus] = useState<PostStatus>("all");

	// Hydration-safe date initialization
	const [currentDate, setCurrentDate] = useState<Date>(
		() => new Date("2026-01-01T00:00:00"),
	);
	useEffect(() => setCurrentDate(new Date()), []);

	// Sync posts on mount
	const { mutateAsync: syncPosts, isPending: isSyncing } = useSyncPosts();
	useEffect(() => {
		syncPosts({}).catch(console.error);
	}, [syncPosts]);

	// Posts data
	const { data: postsData } = usePosts();
	const posts = postsData?.posts ?? [];

	const localEvents = useMemo(() => {
		if (!posts?.length) return [];
		return posts.map((post) => postToCalendarEvent(post));
	}, [posts]);

	// Drag state
	const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
	const [selectedPlatform, setSelectedPlatform] = useState<Platform | "all">(
		"all" as const,
	);

	// Calendar computation
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
		const d = new Date(currentDate);
		d.setDate(d.getDate() - 7);
		setCurrentDate(d);
	};
	const nextWeek = () => {
		const d = new Date(currentDate);
		d.setDate(d.getDate() + 7);
		setCurrentDate(d);
	};
	const handlePrev = calendarView === "week" ? prevWeek : prevMonth;
	const handleNext = calendarView === "week" ? nextWeek : nextMonth;
	const displayName = calendarView === "week" ? weekName : monthName;

	// Filter events
	const filteredEvents = useMemo(() => {
		let result =
			selectedPlatform === "all"
				? localEvents
				: localEvents.filter(
						(e) => e.platform === (selectedPlatform as CalendarPlatform),
					);

		if (postStatus !== "all") {
			result = result.filter((e) =>
				postStatus === "pending"
					? e.status === "scheduled"
					: e.status === postStatus,
			);
		}
		return result;
	}, [localEvents, selectedPlatform, postStatus]);

	const eventsByDate = useMemo(() => {
		const map: Record<string, CalendarEvent[]> = {};
		filteredEvents.forEach((e) => {
			if (!map[e.date]) map[e.date] = [];
			map[e.date].push(e);
		});
		return map;
	}, [filteredEvents]);

	// Drag handlers
	const handleDragStart = useCallback(
		(e: React.DragEvent, event: CalendarEvent) => {
			setDraggedEvent(event);
			e.dataTransfer.effectAllowed = "move";
			if (e.currentTarget instanceof HTMLElement)
				e.currentTarget.style.opacity = "0.5";
		},
		[],
	);

	const handleDragEnd = useCallback((e: React.DragEvent) => {
		if (e.currentTarget instanceof HTMLElement)
			e.currentTarget.style.opacity = "1";
		setDraggedEvent(null);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}, []);

	const { mutate: updatePost } = useUpdatePost();
	const handleDrop = useCallback(
		(e: React.DragEvent, targetDate: string) => {
			e.preventDefault();
			if (!draggedEvent) return;
			const newScheduledAt = new Date(
				`${targetDate}T${draggedEvent.time || "12:00"}`,
			).toISOString();
			updatePost(
				{ postId: draggedEvent.id, scheduledAt: newScheduledAt },
				{
					onSuccess: () => toast.success("Post rescheduled"),
					onError: (err) => toast.error(`Failed to reschedule: ${err.message}`),
				},
			);
			setDraggedEvent(null);
		},
		[draggedEvent, updatePost],
	);

	const handleDateClick = useCallback((dateStr: string) => {
		window.location.href = `/posts/create?date=${dateStr}`;
	}, []);

	// Event actions
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [logsOpen, setLogsOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [unpublishOpen, setUnpublishOpen] = useState(false);

	const { mutate: retryPost } = useRetryPost();

	const handleEventClick = useCallback(
		(event: CalendarEvent) => setSelectedEvent(event),
		[],
	);

	const handleDeleteClick = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setDeleteOpen(true);
	}, []);

	const handleUnpublishClick = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setUnpublishOpen(true);
	}, []);

	const handleRetryClick = useCallback(
		(event: CalendarEvent) => {
			retryPost(event.id, {
				onSuccess: () => toast.success("Post retry queued"),
				onError: (err) => toast.error(`Failed to retry: ${err.message}`),
			});
		},
		[retryPost],
	);

	const handleViewLogs = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setLogsOpen(true);
	}, []);

	const handleDeleted = useCallback(() => setSelectedEvent(null), []);

	const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

	// Calendar cells
	const cells = useMemo(() => {
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
			<div className="flex flex-row items-end justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Posts</h1>
					<p className="text-sm text-muted-foreground">
						{isSyncing ? "Syncing..." : "Manage & schedule your content"}
					</p>
				</div>
				<DepthButton
					size="sm"
					variant="blue"
					className="gap-1.5"
					onClick={() => (window.location.href = "/posts/create")}
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
					onDelete={handleDeleteClick}
					onUnpublish={handleUnpublishClick}
					onRetry={handleRetryClick}
					onViewLogs={handleViewLogs}
					calendarView={calendarView}
				/>
			)}

			{viewMode === "cards" && (
				<PostCardsView
					events={filteredEvents}
					onEventClick={handleEventClick}
					onDelete={handleDeleteClick}
					onUnpublish={handleUnpublishClick}
				/>
			)}

			{/* Dialogs */}
			<LogsDialog
				open={logsOpen}
				onOpenChange={setLogsOpen}
				event={selectedEvent}
			/>
			<DeleteDialog
				open={deleteOpen}
				onOpenChange={setDeleteOpen}
				event={selectedEvent}
				onDeleted={handleDeleted}
			/>
			<UnpublishDialog
				open={unpublishOpen}
				onOpenChange={setUnpublishOpen}
				event={selectedEvent}
				onUnpublished={handleDeleted}
			/>
		</div>
	);
}
