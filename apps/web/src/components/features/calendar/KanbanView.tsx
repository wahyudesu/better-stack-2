"use client";

import { useState } from "react";
import { ContentCard } from "@/components/features/calendar/ContentCard";
import { Card, CardContent } from "@/components/ui/card";
import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanOverlay,
} from "@/components/ui/reui-kanban";
import type { CalendarEvent } from "@/data/mock";
import { cn } from "@/lib/utils";

interface KanbanViewProps {
	events: CalendarEvent[];
	onEventClick: (event: CalendarEvent) => void;
	onEventsChange?: (events: CalendarEvent[]) => void;
}

const COLUMN_CONFIG: Record<
	string,
	{
		title: string;
		colorClass: string;
		badgeClass: string;
		cardBorderClass: string;
	}
> = {
	draft: {
		title: "Draft",
		colorClass:
			"bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700",
		badgeClass:
			"bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
		cardBorderClass: "ring-slate-300 dark:ring-slate-600",
	},
	scheduled: {
		title: "Scheduled",
		colorClass:
			"bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
		badgeClass:
			"bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200",
		cardBorderClass: "ring-amber-300 dark:ring-amber-600",
	},
	published: {
		title: "Posted",
		colorClass:
			"bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
		badgeClass:
			"bg-emerald-200 text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-200",
		cardBorderClass: "ring-emerald-300 dark:ring-emerald-600",
	},
};

interface PostCardProps {
	event: CalendarEvent;
	isOverlay?: boolean;
	onClick?: () => void;
	cardBorderClass?: string;
}

function PostCard({
	event,
	isOverlay,
	onClick,
	cardBorderClass,
}: PostCardProps) {
	return (
		<ContentCard
			event={event}
			variant="vertical"
			onClick={onClick}
			className={cn(
				isOverlay && "shadow-2xl",
				cardBorderClass && `ring-1 ${cardBorderClass}`,
			)}
		/>
	);
}

interface PostColumnProps {
	value: string;
	events: CalendarEvent[];
	isOverlay?: boolean;
	onEventClick: (event: CalendarEvent) => void;
}

function PostColumn({
	value,
	events,
	isOverlay: _isOverlay,
	onEventClick,
}: PostColumnProps) {
	const config = COLUMN_CONFIG[value];

	return (
		<KanbanColumn value={value}>
			<Card className={cn("h-full flex flex-col", config.colorClass)}>
				<div className="flex items-center p-4 border-b border-white/10">
					<div className="flex items-center gap-2.5">
						<span className="text-sm font-semibold">{config.title}</span>
						<span
							className={cn(
								"px-2 py-0.5 rounded-full text-xs font-medium",
								config.badgeClass,
							)}
						>
							{events.length}
						</span>
					</div>
				</div>
				<CardContent className="p-3">
					<KanbanColumnContent
						value={value}
						className="flex flex-col gap-3 min-h-[200px]"
					>
						{events.map((event) => (
							<PostCard
								key={event.id}
								event={event}
								onClick={() => onEventClick(event)}
								cardBorderClass={config.cardBorderClass}
							/>
						))}
					</KanbanColumnContent>
				</CardContent>
			</Card>
		</KanbanColumn>
	);
}

export function KanbanView({
	events,
	onEventClick,
	onEventsChange,
}: KanbanViewProps) {
	// Group events by status
	const groupedEvents = {
		draft: events.filter((e) => e.status === "draft"),
		scheduled: events.filter((e) => e.status === "scheduled"),
		published: events.filter((e) => e.status === "published"),
	};

	const [columns, setColumns] = useState(groupedEvents);

	// Handle drag end - update event statuses based on their new column
	const handleValueChange = (newColumns: Record<string, CalendarEvent[]>) => {
		setColumns(newColumns as typeof groupedEvents);

		// Update event statuses when moved between columns
		if (onEventsChange) {
			const updatedEvents: CalendarEvent[] = [];

			// Update events based on their new column
			Object.entries(newColumns).forEach(([status, events]) => {
				events.forEach((event) => {
					updatedEvents.push({
						...event,
						status: status as CalendarEvent["status"],
					});
				});
			});

			onEventsChange(updatedEvents);
		}
	};

	return (
		<Kanban
			value={columns}
			onValueChange={handleValueChange}
			getItemValue={(item) => item.id}
		>
			<KanbanBoard className="grid auto-rows-fr grid-cols-3 gap-4">
				<PostColumn
					value="draft"
					events={columns.draft}
					onEventClick={onEventClick}
				/>
				<PostColumn
					value="scheduled"
					events={columns.scheduled}
					onEventClick={onEventClick}
				/>
				<PostColumn
					value="published"
					events={columns.published}
					onEventClick={onEventClick}
				/>
			</KanbanBoard>
			<KanbanOverlay>
				{({ value, variant }) => {
					if (variant === "column") {
						const events = columns[value as keyof typeof columns] ?? [];
						return (
							<PostColumn
								value={String(value)}
								events={events}
								isOverlay
								onEventClick={onEventClick}
							/>
						);
					}

					const event = Object.values(columns)
						.flat()
						.find((item) => item.id === value);

					if (!event) return null;

					return (
						<PostCard
							event={event}
							isOverlay
							onClick={() => onEventClick(event)}
						/>
					);
				}}
			</KanbanOverlay>
		</Kanban>
	);
}
