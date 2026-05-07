import {
	Ban,
	ExternalLink,
	Heart,
	MessageCircle,
	MousePointerClick,
	Play,
	RotateCw,
	Trash2,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Platform, PlatformIcon } from "@/components/ui/PlatformIcon";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { CalendarEvent } from "@/data/mock";
import { DAY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CalendarView = "month" | "week";

interface CalendarGridProps {
	cells: { day: number | null; dateStr: string }[];
	eventsByDate: Record<string, CalendarEvent[]>;
	todayStr: string;
	draggedEvent: CalendarEvent | null;
	onDateClick: (dateStr: string) => void;
	onEventClick: (event: CalendarEvent) => void;
	onDragStart: (e: React.DragEvent, event: CalendarEvent) => void;
	onDragEnd: (e: React.DragEvent) => void;
	onDragOver: (e: React.DragEvent) => void;
	onDrop: (e: React.DragEvent, dateStr: string) => void;
	onDelete?: (event: CalendarEvent) => void;
	onUnpublish?: (event: CalendarEvent) => void;
	onRetry?: (event: CalendarEvent) => void;
	onViewLogs?: (event: CalendarEvent) => void;
	calendarView?: CalendarView;
}

const BASE_HEADER_HEIGHT = 72; // px for date header
const EVENT_ITEM_HEIGHT = 72; // px per event row

export function CalendarGrid({
	cells,
	eventsByDate,
	todayStr,
	draggedEvent,
	onDateClick,
	onEventClick,
	onDragStart,
	onDragEnd,
	onDragOver,
	onDrop,
	onDelete,
	onUnpublish,
	onRetry,
	onViewLogs,
	calendarView = "month",
}: CalendarGridProps) {
	// Stable callbacks for week view
	const handleWeekDragStart = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.DragEvent) => onDragStart(e, ev);
		},
		[onDragStart],
	);

	const handleWeekEventClick = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.MouseEvent) => {
				e.stopPropagation();
				onEventClick(ev);
			};
		},
		[onEventClick],
	);

	// Stable callbacks for month view
	const handleMonthDateClick = useCallback(
		(dateStr: string) => {
			return () => onDateClick(dateStr);
		},
		[onDateClick],
	);

	const handleMonthEventClick = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.MouseEvent) => {
				e.stopPropagation();
				onEventClick(ev);
			};
		},
		[onEventClick],
	);

	const _handleMonthEventKeyDown = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.KeyboardEvent) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					e.stopPropagation();
					onEventClick(ev);
				}
			};
		},
		[onEventClick],
	);

	const handleMonthDragStart = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.DragEvent) => onDragStart(e, ev);
		},
		[onDragStart],
	);

	const handleMonthDrop = useCallback(
		(dateStr: string) => {
			return (e: React.DragEvent) => onDrop(e, dateStr);
		},
		[onDrop],
	);

	if (calendarView === "week") {
		// Week view - dynamic height based on content
		return (
			<Card className="overflow-hidden">
				{/* Header row with day names */}
				<div className="grid grid-cols-7">
					{DAY_NAMES.map((d) => (
						<div
							key={d}
							className="px-3 py-3 text-center text-sm font-medium text-muted-foreground"
						>
							{d}
						</div>
					))}
				</div>

				{/* Days columns - single row, height driven by content */}
				<div className="grid grid-cols-7">
					{cells.map((cell, cellIndex) => {
						const dayEvents = cell.dateStr
							? eventsByDate[cell.dateStr] || []
							: [];
						const isToday = cell.dateStr === todayStr;

						// Day names for empty cell keys
						const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
						const cellKey =
							cell.dateStr || `week-empty-${dayNames[cellIndex % 7]}`;

						return (
							<div
								key={cellKey}
								className={cn(
									"flex flex-col border border-border/30",
									cell.day ? "bg-card" : "bg-muted/20",
								)}
								style={{
									minHeight:
										BASE_HEADER_HEIGHT +
										Math.max(dayEvents.length, 1) * EVENT_ITEM_HEIGHT,
								}}
							>
								{/* Date header */}
								<div className="p-3 text-center sticky top-0 bg-card/95 backdrop-blur-sm z-10">
									{cell.day && (
										<span
											className={cn(
												"inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
												isToday ? "bg-primary text-primary-foreground" : "",
											)}
										>
											{cell.day}
										</span>
									)}
								</div>

								{/* Event cards - dynamic count, no slice limit */}
								<div className="p-2 space-y-1.5 flex-1">
									{dayEvents.map((ev) => (
										<ContentItemPopover
											key={ev.id}
											event={ev}
											onDelete={onDelete}
											onUnpublish={onUnpublish}
											onRetry={onRetry}
											onViewLogs={onViewLogs}
										>
											<div
												draggable
												onDragStart={handleWeekDragStart(ev)}
												onDragEnd={onDragEnd}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														e.stopPropagation();
														onEventClick(ev);
													}
												}}
												role="button"
												tabIndex={0}
												className="flex flex-col cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-all hover:bg-primary/5 border border-transparent min-h-[56px]"
												style={{
													borderColor: `hsl(${ev.color})`,
													color: `hsl(${ev.color})`,
												}}
											>
												<div className="flex items-start min-w-0 mb-auto">
													{ev.thumbnail ? (
														<div className="relative size-10 rounded overflow-hidden flex-shrink-0 bg-muted mr-2">
															<Image
																src={ev.thumbnail}
																alt=""
																fill
																className="object-cover"
															/>
														</div>
													) : (
														<span className="shrink-0 flex items-center mr-2">
															<PlatformIcon
																platform={ev.platform as Platform}
																size={14}
															/>
														</span>
													)}
													<span className="line-clamp-2 leading-tight flex-1 text-inherit">
														{ev.description}
													</span>
												</div>
												<div className="flex items-center justify-between mt-auto pt-1">
													<span className="shrink-0 flex items-center">
														<PlatformIcon
															platform={ev.platform as Platform}
															size={14}
														/>
													</span>
													{ev.time && (
														<span className="text-[10px] opacity-70">
															{ev.time}
														</span>
													)}
												</div>
											</div>
										</ContentItemPopover>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</Card>
		);
	}

	// Month view (original)
	return (
		<Card className="overflow-hidden">
			{/* Day headers */}
			<div className="grid grid-cols-7">
				{DAY_NAMES.map((d) => (
					<div
						key={d}
						className="px-3 py-3 text-center text-sm font-medium text-muted-foreground"
					>
						{d}
					</div>
				))}
			</div>

			{/* Days */}
			<div className="grid grid-cols-7">
				{cells.map((cell, i) => {
					const dayEvents = cell.dateStr
						? eventsByDate[cell.dateStr] || []
						: [];
					const isToday = cell.dateStr === todayStr;

					if (!cell.day) {
						const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
						return (
							<div
								key={`month-empty-${dayNames[i % 7]}`}
								className="min-h-[240px] p-2 bg-muted/20 border border-border/30"
							/>
						);
					}

					return (
						<div
							key={cell.dateStr}
							className={cn(
								"min-h-[240px] p-2 transition-colors bg-card hover:bg-muted/30 cursor-pointer border border-border/30",
								draggedEvent ? "hover:bg-primary/5" : "",
							)}
							onClick={handleMonthDateClick(cell.dateStr)}
							onDragOver={onDragOver}
							onDrop={handleMonthDrop(cell.dateStr)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onDateClick(cell.dateStr);
								}
							}}
							role="button"
							tabIndex={0}
						>
							<span
								className={cn(
									"mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
									isToday ? "bg-primary text-primary-foreground" : "",
								)}
							>
								{cell.day}
							</span>
							<div className="space-y-1.5">
								{dayEvents.slice(0, 4).map((ev) => (
									<ContentItemPopover key={ev.id} event={ev}>
										<div
											draggable
											onDragStart={handleMonthDragStart(ev)}
											onDragEnd={onDragEnd}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
													e.stopPropagation();
													onEventClick(ev);
												}
											}}
											role="button"
											tabIndex={0}
											className="flex flex-col cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-all hover:bg-primary/5 border border-transparent min-h-[56px]"
											style={{
												borderColor: `hsl(${ev.color})`,
											}}
										>
											<div className="flex items-start min-w-0 mb-auto">
												{ev.thumbnail ? (
													<div className="relative size-10 rounded overflow-hidden flex-shrink-0 bg-muted mr-2">
														<Image
															src={ev.thumbnail}
															alt=""
															fill
															className="object-cover"
														/>
													</div>
												) : (
													<span className="shrink-0 flex items-center mr-2">
														<PlatformIcon
															platform={ev.platform as Platform}
															size={14}
														/>
													</span>
												)}
												<span className="line-clamp-2 leading-tight flex-1 text-inherit">
													{ev.description}
												</span>
											</div>
											<div className="flex items-center justify-between mt-auto pt-1">
												<span className="shrink-0 flex items-center">
													<PlatformIcon
														platform={ev.platform as Platform}
														size={14}
													/>
												</span>
												{ev.time && (
													<span className="text-[10px] opacity-70">
														{ev.time}
													</span>
												)}
											</div>
										</div>
									</ContentItemPopover>
								))}
								{dayEvents.length > 4 && (
									<p className="px-2 text-xs text-muted-foreground">
										+{dayEvents.length - 4} more
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</Card>
	);
}

// Popover wrapper for content items in calendar grid
interface ContentItemPopoverProps {
	event: CalendarEvent;
	children: React.ReactNode;
	onDelete?: (event: CalendarEvent) => void;
	onUnpublish?: (event: CalendarEvent) => void;
	onRetry?: (event: CalendarEvent) => void;
	onViewLogs?: (event: CalendarEvent) => void;
}

function ContentItemPopover({
	event,
	children,
	onDelete,
	onUnpublish,
	onRetry,
	onViewLogs,
}: ContentItemPopoverProps) {
	const [expanded, setExpanded] = useState(false);
	const toggleExpand = useCallback(() => setExpanded((prev) => !prev), []);
	return (
		<Popover>
			<PopoverTrigger>
				<div onClick={(e) => e.stopPropagation()}>{children}</div>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				className="w-80 p-0 overflow-hidden"
				sideOffset={8}
			>
				{/* Header */}
				<div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50">
					<span className="text-xs text-muted-foreground">
						{event.date} • {event.platform}
					</span>
				</div>

				{/* Profile */}
				<div className="flex items-center gap-2.5 px-3 py-2.5">
					<div className="flex items-center justify-center size-8 rounded-full bg-muted">
						<span className="text-[10px] font-bold">TF</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-semibold">techfusion.id</span>
						<span className="text-[10px] text-muted-foreground">
							@{event.platform}
						</span>
					</div>
				</div>

				{/* Content */}
				<div className="flex gap-3 px-3 pb-3">
					<div className="flex-1 min-w-0">
						<p
							className={cn(
								"text-sm text-muted-foreground",
								expanded ? "" : "line-clamp-4",
							)}
						>
							{event.description || event.title}
						</p>
						<button
							type="button"
							className="text-xs text-primary mt-1 hover:underline"
							onClick={toggleExpand}
						>
							{expanded ? "see less" : "see more"}
						</button>
					</div>

					{event.thumbnail && (
						<div className="relative size-14 flex-shrink-0 overflow-hidden rounded-lg">
							<Image
								src={event.thumbnail}
								alt={event.description || event.title}
								fill
								className="object-cover"
							/>
							{event.mediaType === "video" && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/30">
									<Play className="size-3 text-white fill-white" />
								</div>
							)}
						</div>
					)}
				</div>

				{/* Interaction Bar */}
				<div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 bg-muted/30">
					<div className="flex items-center gap-4">
						<Heart className="size-3.5 text-muted-foreground" />
						<MessageCircle className="size-3.5 text-muted-foreground" />
						<TrendingUp className="size-3.5 text-muted-foreground" />
						<MousePointerClick className="size-3.5 text-muted-foreground" />
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center justify-between px-3 py-2.5 border-t border-border/50 gap-2">
					<div className="flex gap-1">
						{event.status === "failed" && onRetry && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8 text-orange-600 hover:text-orange-700"
								onClick={() => onRetry(event)}
							>
								<RotateCw className="size-3.5 mr-1" />
								Retry
							</Button>
						)}
						{event.status === "published" && onUnpublish && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8"
								onClick={() => onUnpublish(event)}
							>
								<Ban className="size-3.5 mr-1" />
								Unpublish
							</Button>
						)}
						{onViewLogs && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8"
								onClick={() => onViewLogs(event)}
							>
								View Logs
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="sm"
								className="text-xs h-8 text-destructive hover:text-destructive"
								onClick={() => onDelete(event)}
							>
								<Trash2 className="size-3.5 mr-1" />
								Delete
							</Button>
						)}
					</div>
					<Button
						variant="default"
						size="sm"
						className="text-xs h-8"
						onClick={() =>
							event.postUrl && window.open(event.postUrl, "_blank")
						}
					>
						<ExternalLink className="size-3.5 mr-1.5" />
						View Post
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
