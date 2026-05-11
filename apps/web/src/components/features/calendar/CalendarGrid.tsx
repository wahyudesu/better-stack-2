import Image from "next/image";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { type Platform, PlatformIcon } from "@/components/ui/PlatformIcon";
import type { CalendarEvent } from "@/data/mock";
import { DAY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ContentItemPopover } from "./content-item-popover";

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

const BASE_HEADER_HEIGHT = 72;
const EVENT_ITEM_HEIGHT = 72;

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
	const handleWeekDragStart = useCallback(
		(ev: CalendarEvent) => {
			return (e: React.DragEvent) => onDragStart(e, ev);
		},
		[onDragStart],
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
		return (
			<Card className="overflow-hidden">
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

				<div className="grid grid-cols-7">
					{cells.map((cell, cellIndex) => {
						const dayEvents = cell.dateStr
							? eventsByDate[cell.dateStr] || []
							: [];
						const isToday = cell.dateStr === todayStr;

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
											<button
												type="button"
												draggable
												onClick={(e) => e.stopPropagation()}
												onDragStart={handleWeekDragStart(ev)}
												onDragEnd={onDragEnd}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
													}
												}}
												className="w-full text-left flex flex-col cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-all hover:bg-primary/5 border border-border"
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
													) : null}
													<span
														className="line-clamp-2 leading-tight flex-1 text-inherit"
														style={{ textAlignLast: "justify" }}
													>
														{ev.description}
													</span>
												</div>
												<div className="flex items-center justify-between mt-auto pt-1">
													<span className="shrink-0 flex items-center text-muted-foreground">
														<PlatformIcon
															platform={ev.platform as Platform}
															size={20}
														/>
													</span>
													{ev.time && (
														<span className="text-[10px] opacity-70">
															{ev.time}
														</span>
													)}
												</div>
											</button>
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

	return (
		<Card className="overflow-hidden">
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
								key={`month-empty-${i}`}
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
							onClick={() => onDateClick(cell.dateStr)}
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
										<button
											type="button"
											draggable
											onClick={(e) => e.stopPropagation()}
											onDragStart={handleMonthDragStart(ev)}
											onDragEnd={onDragEnd}
											onKeyDown={(e) => {
												if (e.key === "Enter" || e.key === " ") {
													e.preventDefault();
												}
											}}
											className="w-full text-left flex flex-col cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-all bg-input/30 hover:bg-input/50 border border-border"
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
												) : null}
												<span
													className="line-clamp-2 leading-tight flex-1 text-inherit"
													style={{ textAlignLast: "justify" }}
												>
													{ev.description}
												</span>
											</div>
											<div className="flex items-center justify-between mt-auto pt-1">
												<span className="shrink-0 flex items-center">
													<PlatformIcon
														platform={ev.platform as Platform}
														size={20}
													/>
												</span>
												{ev.time && (
													<span className="text-[10px] opacity-70">
														{ev.time}
													</span>
												)}
											</div>
										</button>
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
