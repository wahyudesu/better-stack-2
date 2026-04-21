import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { type CalendarEvent, calendarEvents } from "@/data/mock";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

const platformIcons: Record<string, string> = {
	instagram: "📸",
	tiktok: "🎵",
	twitter: "𝕏",
	youtube: "▶️",
	facebook: "👤",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
	return new Date(year, month, 1).getDay();
}

const statusStyles: Record<string, string> = {
	published: "bg-success/10 text-success",
	scheduled: "bg-primary/10 text-primary",
	draft: "bg-muted text-muted-foreground",
};

export default function ActivityPage() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null,
	);
	const [events, setEvents] = useState(calendarEvents);
	const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();
	const daysInMonth = getDaysInMonth(year, month);
	const firstDay = getFirstDayOfMonth(year, month);
	const monthName = currentDate.toLocaleString("default", {
		month: "long",
		year: "numeric",
	});

	const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
	const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
	const goToday = () => setCurrentDate(new Date());

	const eventsByDate = useMemo(() => {
		const map: Record<string, CalendarEvent[]> = {};
		events.forEach((e) => {
			if (!map[e.date]) map[e.date] = [];
			map[e.date].push(e);
		});
		return map;
	}, [events]);

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

	const today = new Date();
	const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

	const cells: { day: number | null; dateStr: string }[] = [];
	for (let i = 0; i < firstDay; i++) cells.push({ day: null, dateStr: "" });
	for (let d = 1; d <= daysInMonth; d++) {
		cells.push({
			day: d,
			dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
		});
	}
	while (cells.length % 7 !== 0) cells.push({ day: null, dateStr: "" });

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
					<p className="text-sm text-muted-foreground">
						Content schedule & planning
					</p>
				</div>
				<div className="flex items-center gap-1.5">
					<Button
						variant="outline"
						size="sm"
						onClick={goToday}
						className="text-xs"
					>
						Today
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={prevMonth}
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
						onClick={nextMonth}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<Card className="border-border/50 overflow-hidden">
				<div className="grid grid-cols-7 border-b border-border/50">
					{DAY_NAMES.map((d) => (
						<div
							key={d}
							className="px-2 py-2 text-center text-xs font-medium text-muted-foreground"
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

						return (
							<div
								key={i}
								className={cn(
									"min-h-[100px] border-b border-r border-border/30 p-1 transition-colors",
									cell.day ? "bg-card hover:bg-muted/30" : "bg-muted/20",
									draggedEvent && cell.day ? "hover:bg-primary/5" : "",
								)}
								onDragOver={cell.day ? handleDragOver : undefined}
								onDrop={
									cell.day ? (e) => handleDrop(e, cell.dateStr) : undefined
								}
							>
								{cell.day && (
									<>
										<span
											className={cn(
												"mb-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
												isToday
													? "bg-primary text-primary-foreground"
													: "text-foreground",
											)}
										>
											{cell.day}
										</span>
										<div className="space-y-0.5">
											{dayEvents.slice(0, 3).map((ev) => (
												<div
													key={ev.id}
													draggable
													onDragStart={(e) => handleDragStart(e, ev)}
													onDragEnd={handleDragEnd}
													onClick={() => setSelectedEvent(ev)}
													className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium transition-colors hover:opacity-80"
													style={{
														backgroundColor: `hsl(${ev.color} / 0.15)`,
														color: `hsl(${ev.color})`,
													}}
												>
													<span className="shrink-0">
														{platformIcons[ev.platform]}
													</span>
													<span className="truncate">{ev.title}</span>
												</div>
											))}
											{dayEvents.length > 3 && (
												<p className="px-1 text-[10px] text-muted-foreground">
													+{dayEvents.length - 3} more
												</p>
											)}
										</div>
									</>
								)}
							</div>
						);
					})}
				</div>
			</Card>

			<Dialog
				open={!!selectedEvent}
				onOpenChange={() => setSelectedEvent(null)}
			>
				<DialogContent className="sm:max-w-md">
					{selectedEvent && (
						<>
							<DialogHeader>
								<div className="flex items-center gap-2">
									<span className="text-lg">
										{platformIcons[selectedEvent.platform]}
									</span>
									<DialogTitle>{selectedEvent.title}</DialogTitle>
								</div>
								<DialogDescription className="sr-only">
									Event details
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div className="flex items-center gap-2 flex-wrap">
									<Badge
										variant="secondary"
										className={cn(
											"text-xs capitalize",
											statusStyles[selectedEvent.status],
										)}
									>
										{selectedEvent.status}
									</Badge>
									<Badge variant="outline" className="text-xs capitalize">
										{selectedEvent.type}
									</Badge>
								</div>
								{selectedEvent.description && (
									<p className="text-sm text-muted-foreground">
										{selectedEvent.description}
									</p>
								)}
								<div className="flex items-center gap-4 text-sm text-muted-foreground">
									<span>📅 {selectedEvent.date}</span>
									{selectedEvent.time && <span>🕐 {selectedEvent.time}</span>}
								</div>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
