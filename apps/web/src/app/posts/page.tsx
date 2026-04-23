"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PostCardsView, PostControls } from "@/components/features/calendar";
import type { ViewMode, CalendarView, PostStatus } from "@/components/features/calendar/PostControls";
import { CalendarGrid } from "@/components/features/calendar/CalendarGrid";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DepthButton } from "@/components/ui/depth-buttons";
import type { Platform } from "@/components/ui/PlatformIcon";
import type { CalendarPlatform } from "@/data/mock";
import { useDeletePost, usePosts, useUnpublishPost } from "@/hooks/use-posts";
import { useCurrentProfileId, useProfiles } from "@/hooks/use-profiles";
import type { Post } from "@/lib/client";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/constants";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

// CalendarEvent interface
interface CalendarEvent {
	id: string;
	title: string;
	date: string;
	platform: CalendarPlatform;
	platforms?: CalendarPlatform[];
	type: "post" | "story" | "reel" | "video" | "tweet" | "live";
	time?: string;
	description?: string;
	status:
		| "scheduled"
		| "published"
		| "draft"
		| "review"
		| "publishing"
		| "failed"
		| "cancelled";
	color: string;
	thumbnail?: string;
	mediaType?: "image" | "video";
	postUrl?: string;
}

// Platform colors
const PLATFORM_COLORS: Record<string, string> = {
	instagram: "328 70% 55%",
	tiktok: "349 70% 56%",
	twitter: "203 89% 53%",
	youtube: "0 72% 51%",
	linkedin: "217 91% 60%",
	facebook: "220 44% 41%",
	pinterest: "340 82% 52%",
};

/**
 * Convert server Post to CalendarEvent format
 */
function postToCalendarEvent(post: Post): CalendarEvent {
	const targetDate = post.scheduledAt
		? new Date(post.scheduledAt)
		: post.publishedAt
			? new Date(post.publishedAt)
			: new Date(post.createdAt);

	const date = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
	const time = `${String(targetDate.getHours()).padStart(2, "0")}:${String(targetDate.getMinutes()).padStart(2, "0")}`;

	// Determine primary platform from socialAccountIds
	const primaryPlatform = post.socialAccountIds[0] || "instagram";

	return {
		id: post._id,
		title: post.text.slice(0, 50) + (post.text.length > 50 ? "..." : ""),
		date,
		platform: primaryPlatform as CalendarPlatform,
		platforms: post.socialAccountIds as CalendarPlatform[],
		type: "post",
		time,
		description: post.text,
		status: post.status,
		color: PLATFORM_COLORS[primaryPlatform] || "328 70% 55%",
		thumbnail: post.media?.[0]?.url,
		mediaType: post.media?.[0]?.type === "video" ? "video" : "image",
	};
}

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

	// Ensure profiles are loaded first
	const { data: profilesData } = useProfiles();
	const profileId = useCurrentProfileId();

	// Fetch posts from server
	const { data: postsData, isLoading } = usePosts(profileId);
	const serverEvents = useMemo(() => {
		if (!postsData?.posts) return [];
		return postsData.posts.map(postToCalendarEvent);
	}, [postsData]);

	// Use server events, fallback to empty array
	const [events, setEvents] = useState<CalendarEvent[]>([]);

	// Update events when server data loads
	useEffect(() => {
		if (serverEvents.length > 0) {
			setEvents(serverEvents);
		}
	}, [serverEvents]);

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
		window.location.href = `/posts/create?date=${dateStr}`;
	}, []);

	const handleEventClick = useCallback((event: CalendarEvent) => {
		// TODO: open popover with post details + delete/unpublish actions
	}, []);

	// Delete/Unpublish modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);

	const { mutate: deletePost } = useDeletePost();
	const { mutate: unpublishPost } = useUnpublishPost();

	const _handleDeleteClick = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setDeleteModalOpen(true);
	}, []);

	const _handleUnpublishClick = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setUnpublishModalOpen(true);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!selectedEvent) return;
		deletePost(selectedEvent.id, {
			onSuccess: () => {
				toast.success("Post deleted");
				setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
				setDeleteModalOpen(false);
				setSelectedEvent(null);
			},
			onError: (err) => {
				toast.error(`Failed to delete: ${err.message}`);
			},
		});
	}, [selectedEvent, deletePost]);

	const confirmUnpublish = useCallback(() => {
		if (!selectedEvent) return;
		unpublishPost(selectedEvent.id, {
			onSuccess: () => {
				toast.success("Post unpublished");
				setEvents((prev) =>
					prev.map((e) =>
						e.id === selectedEvent.id
							? { ...e, status: "cancelled" as const }
							: e,
					),
				);
				setUnpublishModalOpen(false);
				setSelectedEvent(null);
			},
			onError: (err) => {
				toast.error(`Failed to unpublish: ${err.message}`);
			},
		});
	}, [selectedEvent, unpublishPost]);

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
			<div className="flex flex-row items-end justify-between">
				<div className="">
					<h1 className="text-2xl font-bold tracking-tight">Posts</h1>
					<p className="text-sm text-muted-foreground">
						{isLoading ? "Loading..." : "Manage & schedule your content"}
					</p>
				</div>
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
					onDelete={_handleDeleteClick}
					onUnpublish={_handleUnpublishClick}
				/>
			)}

			{/* Delete Confirmation Modal */}
			<AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Post</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this post? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Unpublish Confirmation Modal */}
			<AlertDialog
				open={unpublishModalOpen}
				onOpenChange={setUnpublishModalOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unpublish Post</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to unpublish this post? It will be removed
							from your social accounts.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmUnpublish}>
							Unpublish
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
