import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Clock, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Platform } from "@/components/ui/PlatformIcon";
import { PlatformIcon, getPlatformBgColor, getPlatformColor } from "@/components/ui/PlatformIcon";
import type { CalendarEvent } from "@/data/mock";

const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  published: {
    bg: "hsl(142 76% 36% / 0.15)",
    text: "hsl(142 76% 36%)",
  },
  scheduled: {
    bg: "hsl(var(--primary) / 0.15)",
    text: "hsl(var(--primary))",
  },
  draft: {
    bg: "hsl(var(--muted) / 0.5)",
    text: "hsl(var(--muted-foreground))",
  },
  pending: {
    bg: "hsl(38 92% 50% / 0.15)",
    text: "hsl(38 92% 50%)",
  },
};

interface ContentCardProps {
  event: CalendarEvent;
  onClick?: () => void;
  variant?: "calendar" | "vertical" | "compact";
  size?: "default" | "sm";
  className?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  showDateTime?: boolean;
  cardBorderClass?: string;
}

export function ContentCard({
  event,
  onClick,
  variant = "calendar",
  size = "default",
  className,
  draggable,
  onDragStart,
  onDragEnd,
  showDateTime = true,
  cardBorderClass,
}: ContentCardProps) {
  const badgeStyle = statusBadgeStyles[event.status] || statusBadgeStyles.draft;
  const isSm = size === "sm";
  const isCompact = variant === "compact";
  const isVertical = variant === "vertical";
  const platforms = event.platforms || [event.platform];
  const platformBgColor = getPlatformBgColor(event.platform);
  const platformColor = getPlatformColor(event.platform);

  // Calendar variant - styled pill for calendar grid
  if (variant === "calendar") {
    return (
      <Card
        className={cn(
          "group/card overflow-hidden transition-all hover:shadow-md hover:opacity-80",
          "flex flex-col rounded-lg px-2.5 py-2 cursor-pointer min-h-[56px] border-0",
          isSm && "text-xs",
          className,
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        style={{
          backgroundColor: platformBgColor,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Description */}
          <div className="flex items-start min-w-0 mb-auto">
            <span className="line-clamp-2 leading-tight flex-1 text-xs">
              {event.description || event.title}
            </span>
          </div>

          {/* Footer: Status badge, platform icon, time */}
          <div className="flex items-center justify-between mt-auto pt-1 gap-1.5">
            {/* Status badge */}
            <Badge
              variant="secondary"
              className={cn(
                "capitalize pointer-events-none h-5 rounded-sm px-1.5 text-[10px] font-medium",
              )}
              style={{
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
              }}
            >
              {event.status}
            </Badge>

            {/* Platform icon */}
            <span className="shrink-0 flex items-center rounded-full bg-background/50 p-0.5">
              <PlatformIcon platform={event.platform as Platform} size={12} />
            </span>

            {/* Time */}
            {event.time && (
              <span className="text-[10px] opacity-70">{event.time}</span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Compact variant - horizontal layout for list view
  if (isCompact) {
    return (
      <Card
        className={cn(
          "group/card overflow-hidden transition-all hover:shadow-md cursor-pointer",
          "p-3",
          isSm && "text-xs",
          cardBorderClass && `ring-1 ${cardBorderClass}`,
          className,
        )}
        onClick={onClick}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-3">
          {/* Thumbnail */}
          {event.thumbnail ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={event.thumbnail}
                alt={event.description || event.title}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
              {event.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              {event.mediaType === "video" ? (
                <Video className="h-6 w-6 text-muted-foreground" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-start justify-between mb-1.5">
              <Badge
                variant="secondary"
                className="capitalize"
                style={{
                  backgroundColor: badgeStyle.bg,
                  color: badgeStyle.text,
                }}
              >
                {event.status}
              </Badge>
              <div className="flex items-center gap-0.5 -space-x-1">
                {platforms.map((platform) => (
                  <div
                    key={platform}
                    className="relative rounded-full bg-muted/50 p-0.5"
                  >
                    <PlatformIcon platform={platform as Platform} size={16} />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
              {event.description || event.title}
            </p>
            {showDateTime && (
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-auto">
                <span className="capitalize">{event.type}</span>
                <span>{event.date}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Vertical variant - card with image on left, content on right
  return (
    <Card
      className={cn(
        "group/card overflow-hidden transition-all hover:shadow-md cursor-pointer",
        "p-3",
        isSm && "text-xs",
        cardBorderClass && `ring-1 ${cardBorderClass}`,
        className,
      )}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="p-0">
        {/* Row 1: Image left, content right */}
        <div className="flex gap-3 mb-2">
          {event.thumbnail ? (
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
              <Image
                src={event.thumbnail}
                alt={event.description || event.title}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
              {event.mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 text-white fill-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="h-20 w-20 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
              {event.mediaType === "video" ? (
                <Video className="h-8 w-8 text-muted-foreground/50" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col">
            <Badge
              variant="secondary"
              className={cn(
                "capitalize pointer-events-none w-fit mb-1.5",
                isSm && "h-5 rounded-sm px-1.5",
              )}
              style={{
                backgroundColor: badgeStyle.bg,
                color: badgeStyle.text,
              }}
            >
              {event.status}
            </Badge>
            <p
              className={cn(
                "text-muted-foreground line-clamp-2",
                isSm ? "text-xs" : "text-sm",
              )}
            >
              {event.description || event.title}
            </p>
          </div>
        </div>

        {/* Row 2: Platform icons + date/time */}
        {showDateTime && (
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              {platforms.map((platform) => (
                <div key={platform} className="rounded-full bg-muted/50 p-1">
                  <PlatformIcon platform={platform as Platform} size={16} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span>{event.date}</span>
              {event.time && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{event.time}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
