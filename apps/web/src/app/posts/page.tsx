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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Platform } from "@/components/ui/PlatformIcon";
import type { CalendarPlatform } from "@/data/mock";
import {
	useDeletePost,
	useEditPost,
	useRetryPost,
	useSyncPosts,
	useUnpublishPost,
	useUpdatePost,
} from "@/hooks/use-posts";
import { useCurrentProfileId, useProfiles } from "@/hooks/use-profiles";
import type { Post } from "@/lib/client";
import { api } from "@/lib/client";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/constants";
import { api as convexApi, useQuery } from "@/lib/convex-client";
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

	// Zernio API uses "content" field, fallback to "text"
	const postText = post.content || post.text || "";

	// Determine primary platform from socialAccountIds
	const primaryPlatform = post.socialAccountIds[0] || "instagram";

	return {
		id: post._id,
		title: postText.slice(0, 50) + (postText.length > 50 ? "..." : ""),
		date,
		platform: primaryPlatform as CalendarPlatform,
		platforms: post.socialAccountIds as CalendarPlatform[],
		type: "post",
		time,
		description: postText,
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

	// Sync posts from Zernio on mount
	const { mutateAsync: syncPosts, isPending: isSyncing } = useSyncPosts();

	// Sync on mount to get latest from Zernio
	useEffect(() => {
		syncPosts({}).catch(console.error);
	}, []);

	// Fetch local Convex posts (already synced from Zernio)
	const convexPosts = useQuery(convexApi.data.listPosts, {});

	// Convert Convex posts to CalendarEvent format
	const localEvents = useMemo(() => {
		if (!convexPosts) return [];
		return convexPosts.map((post: any) => {
			const targetDate = post.scheduledAt
				? new Date(post.scheduledAt)
				: post.publishedAt
					? new Date(post.publishedAt)
					: new Date(post.createdAt);

			const date = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
			const time = `${String(targetDate.getHours()).padStart(2, "0")}:${String(targetDate.getMinutes()).padStart(2, "0")}`;

			return {
				id: post._id,
				title: post.text.slice(0, 50) + (post.text.length > 50 ? "..." : ""),
				date,
				platform: "instagram" as CalendarPlatform, // TODO: derive from accountIds
				platforms: [] as CalendarPlatform[],
				type: "post" as const,
				time,
				description: post.text,
				status:
					post.status === "published"
						? ("published" as const)
						: post.status === "scheduled"
							? ("scheduled" as const)
							: post.status === "failed"
								? ("failed" as const)
								: ("draft" as const),
				color: "328 70% 55%",
				thumbnail: post.mediaUrls?.[0],
				mediaType: undefined,
			};
		});
	}, [convexPosts]);

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
				? localEvents
				: localEvents.filter(
						(e) => e.platform === (selectedPlatform as CalendarPlatform),
					);

		if (postStatus === "pending") {
			result = result.filter((e) => e.status === "scheduled");
		} else {
			result = result.filter((e) => e.status === postStatus);
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
					onSuccess: () => {
						toast.success("Post rescheduled");
					},
					onError: (err) => {
						toast.error(`Failed to reschedule: ${err.message}`);
					},
				},
			);
			setDraggedEvent(null);
		},
		[draggedEvent, updatePost],
	);

	const handleDateClick = useCallback((dateStr: string) => {
		window.location.href = `/posts/create?date=${dateStr}`;
	}, []);

	// Post actions popover state
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [logsOpen, setLogsOpen] = useState(false);
	const [postLogs, setPostLogs] = useState<any[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);

	const { mutate: deletePost } = useDeletePost();
	const { mutate: unpublishPost } = useUnpublishPost();
	const { mutate: retryPost } = useRetryPost();
	const { mutate: editPost } = useEditPost();

	const handleEventClick = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setPopoverOpen(true);
	}, []);

	const _handleDeleteClick = useCallback(
		(event: CalendarEvent) => {
			setSelectedEvent(event);
			setPopoverOpen(false);
			deletePost(event.id, {
				onSuccess: () => {
					toast.success("Post deleted");
				},
				onError: (err) => {
					toast.error(`Failed to delete: ${err.message}`);
				},
			});
		},
		[deletePost],
	);

	const _handleUnpublishClick = useCallback(
		(event: CalendarEvent) => {
			setSelectedEvent(event);
			setPopoverOpen(false);
			unpublishPost(event.id, {
				onSuccess: () => {
					toast.success("Post unpublished");
				},
				onError: (err) => {
					toast.error(`Failed to unpublish: ${err.message}`);
				},
			});
		},
		[unpublishPost],
	);

	const _handleRetryClick = useCallback(
		(event: CalendarEvent) => {
			setPopoverOpen(false);
			retryPost(event.id, {
				onSuccess: () => {
					toast.success("Post retry queued");
				},
				onError: (err) => {
					toast.error(`Failed to retry: ${err.message}`);
				},
			});
		},
		[retryPost],
	);

	const _handleViewLogs = useCallback((event: CalendarEvent) => {
		setPopoverOpen(false);
		setLogsOpen(true);
		setLogsLoading(true);
		api
			.getPostLogs(event.id)
			.then(({ data, error }) => {
				if (error) {
					toast.error(`Failed to load logs: ${error}`);
				} else {
					setPostLogs(data?.logs || []);
				}
			})
			.finally(() => setLogsLoading(false));
	}, []);

	// Delete/Unpublish modal state
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);

	const _handleDeleteConfirm = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setDeleteModalOpen(true);
	}, []);

	const _handleUnpublishConfirm = useCallback((event: CalendarEvent) => {
		setSelectedEvent(event);
		setUnpublishModalOpen(true);
	}, []);

	const confirmDelete = useCallback(() => {
		if (!selectedEvent) return;
		deletePost(selectedEvent.id, {
			onSuccess: () => {
				toast.success("Post deleted");
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
						{isSyncing ? "Syncing..." : "Manage & schedule your content"}
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

			{/* Post Actions Dialog */}
			<Dialog open={popoverOpen} onOpenChange={setPopoverOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Post Actions</DialogTitle>
					</DialogHeader>
					{selectedEvent && (
						<div className="space-y-3">
							<div className="p-3 rounded-lg bg-muted/50 border">
								<p className="text-sm font-medium truncate">
									{selectedEvent.description?.slice(0, 80)}
									{selectedEvent.description &&
									selectedEvent.description.length > 80
										? "..."
										: ""}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{selectedEvent.date}
									{selectedEvent.time ? ` at ${selectedEvent.time}` : ""}
								</p>
							</div>
							<div className="flex flex-col gap-1">
								{selectedEvent.status === "failed" && (
									<button
										className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer text-orange-600 font-medium"
										onClick={() =>
											selectedEvent && _handleRetryClick(selectedEvent)
										}
									>
										Retry Post
									</button>
								)}
								{selectedEvent.status === "published" && (
									<button
										className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer text-orange-600 font-medium"
										onClick={() =>
											selectedEvent && _handleUnpublishConfirm(selectedEvent)
										}
									>
										Unpublish
									</button>
								)}
								<button
									className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer"
									onClick={() =>
										selectedEvent && _handleViewLogs(selectedEvent)
									}
								>
									View Logs
								</button>
								<button
									className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer text-destructive font-medium"
									onClick={() =>
										selectedEvent && _handleDeleteConfirm(selectedEvent)
									}
								>
									Delete
								</button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Logs Dialog */}
			<Dialog open={logsOpen} onOpenChange={setLogsOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Post Logs</DialogTitle>
					</DialogHeader>
					{logsLoading ? (
						<div className="py-8 text-center text-muted-foreground text-sm">
							Loading logs...
						</div>
					) : postLogs.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground text-sm">
							No logs available
						</div>
					) : (
						<div className="max-h-80 overflow-y-auto space-y-2">
							{postLogs.map((log: any, i: number) => (
								<div
									key={i}
									className="text-sm p-2 rounded-md bg-muted/50 border"
								>
									<div className="flex items-center justify-between">
										<span className="font-medium text-xs uppercase">
											{log.status || log.level || "info"}
										</span>
										<span className="text-xs text-muted-foreground">
											{log.createdAt
												? new Date(log.createdAt).toLocaleString()
												: ""}
										</span>
									</div>
									<p className="text-sm mt-1">{log.message || log.text}</p>
								</div>
							))}
						</div>
					)}
				</DialogContent>
			</Dialog>

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
