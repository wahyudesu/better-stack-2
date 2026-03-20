import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContentCard } from "@/components/features/calendar/ContentCard";
import { type CalendarEvent } from "@/data/mock";

interface PostCardsViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCreateClick: () => void;
}

export function PostCardsView({ events, onEventClick, onCreateClick }: PostCardsViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {events.map((event) => (
        <ContentCard
          key={event.id}
          event={event}
          variant="vertical"
          onClick={() => onEventClick(event)}
        />
      ))}
      <Card
        className="border-border/50 border-dashed cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/30 min-h-[280px] flex items-center justify-center"
        onClick={onCreateClick}
      >
        <div className="text-center text-muted-foreground">
          <LayoutGrid className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <span className="text-sm font-medium">Create New Content</span>
        </div>
      </Card>
    </div>
  );
}
