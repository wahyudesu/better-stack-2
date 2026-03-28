import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { type Platform, PlatformIcon } from "@/components/ui/PlatformIcon";
import type { CalendarEvent } from "@/data/mock";
import { DAY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ContentCard } from "./ContentCard";

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
	calendarView?: CalendarView;
}

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
	calendarView = "month",
}: CalendarGridProps) {
	// Stable callbacks for week view
	const handleWeekDragStart = useCallback(
		(e: React.DragEvent, ev: CalendarEvent) => {
			onDragStart(e, ev);
		},
		[onDragStart],
	);

	const handleWeekDateClick = useCallback(
		(dateStr: string) => {
			return () => onDateClick(dateStr);
		},
		[onDateClick],
	);

	const handleWeekEventClick = useCallback(
		(ev: CalendarEvent) => {
			return () => onEventClick(ev);
		},
		[onEventClick],
	);

	const handleWeekDrop = useCallback(
		(dateStr: string) => {
			return (e: React.DragEvent) => onDrop(e, dateStr);
		},
		[onDrop],
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

	const handleMonthEventKeyDown = useCallback(
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
		// Week view with card-based design (same as kanban)
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

				{/* Days columns */}
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
									"flex flex-col min-h-[600px]",
									cell.day ? "bg-card" : "bg-muted/20",
								)}
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

								{/* Event cards */}
								<div className="flex-1 p-2 space-y-2">
									{dayEvents.map((ev) => (
										<ContentCard
											key={ev.id}
											event={ev}
											variant="calendar"
											size="sm"
											draggable
											onDragStart={(e) => handleWeekDragStart(e, ev)}
											onDragEnd={onDragEnd}
											onClick={handleWeekEventClick(ev)}
										/>
									))}

									{/* Empty slot indicator for creating new events */}
									{cell.day && (
										<button
											onClick={handleWeekDateClick(cell.dateStr)}
											onDragOver={onDragOver}
											onDrop={handleWeekDrop(cell.dateStr)}
											className="w-full p-3 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground hover:border-primary/50 hover:bg-muted/30 transition-all"
										>
											<span className="text-xs">+</span>
										</button>
									)}
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
								className="min-h-[240px] p-2 bg-muted/20"
							/>
						);
					}

					return (
						<div
							key={cell.dateStr}
							className={cn(
								"min-h-[240px] p-2 transition-colors bg-card hover:bg-muted/30 cursor-pointer",
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
									<div
										key={ev.id}
										draggable
										onDragStart={handleMonthDragStart(ev)}
										onDragEnd={onDragEnd}
										onClick={handleMonthEventClick(ev)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												e.stopPropagation();
												onEventClick(ev);
											}
										}}
										role="button"
										tabIndex={0}
										className="flex flex-col cursor-pointer rounded-lg px-2.5 py-2 text-xs font-medium transition-colors hover:opacity-80 min-h-[56px]"
										style={{
											backgroundColor: `hsl(${ev.color} / 0.15)`,
											color: `hsl(${ev.color})`,
										}}
									>
										<div className="flex items-start min-w-0 mb-auto">
											<span className="line-clamp-2 leading-tight flex-1">
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
