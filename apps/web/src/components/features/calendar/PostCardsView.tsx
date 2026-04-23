import { ContentCard } from "@/components/features/calendar/ContentCard";
import type { CalendarEvent } from "@/data/mock";

interface PostCardsViewProps {
	events: CalendarEvent[];
	onEventClick: (event: CalendarEvent) => void;
	onDelete?: (event: CalendarEvent) => void;
	onUnpublish?: (event: CalendarEvent) => void;
}

export function PostCardsView({
	events,
	onEventClick,
	onDelete,
	onUnpublish,
}: PostCardsViewProps) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{events.map((event) => (
				<ContentCard
					key={event.id}
					event={event}
					variant="vertical"
					onClick={() => onEventClick(event)}
					onDelete={onDelete}
					onUnpublish={onUnpublish}
				/>
			))}
		</div>
	);
}
