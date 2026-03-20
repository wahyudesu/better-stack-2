import { Calendar as CalendarIcon } from "lucide-react";
import type { CalendarEvent } from "@/data/mock";
import { PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EventDetailDialogProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailDialog({ event, onClose }: EventDetailDialogProps) {
  if (!event) return null;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-background">
              <PlatformIcon platform={event.platform as Platform} size={20} />
            </span>
            <div className="flex-1">
              <DialogTitle className="text-base">{event.title}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.platform} • {event.type}
              </p>
            </div>
          </div>
          <DialogDescription className="sr-only">Event details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs capitalize",
                event.status === "published" && "bg-success/10 text-success",
                event.status === "scheduled" && "bg-primary/10 text-primary",
                event.status === "draft" && "bg-muted text-muted-foreground"
              )}
            >
              {event.status}
            </Badge>
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              {event.date}
            </span>
            {event.time && (
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-border" />
                {event.time}
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
