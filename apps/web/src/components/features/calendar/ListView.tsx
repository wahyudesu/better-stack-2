"use client";

import type { CalendarEvent } from "@/data/mock";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  Video,
  Image as ImageIcon,
  Play
} from "lucide-react";
import { useState, useMemo } from "react";
import Image from "next/image";

type SortField = "title" | "date" | "platform" | "status";
type SortDirection = "asc" | "desc";

const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  published: { bg: "hsl(142 76% 36% / 0.15)", text: "hsl(142 76% 36%)" },
  scheduled: { bg: "hsl(38 92% 50% / 0.15)", text: "hsl(32 95% 44%)" },
  draft: { bg: "hsl(220 10% 46% / 0.15)", text: "hsl(220 10% 36%)" },
};

interface SortButtonProps {
  field: SortField;
  label: string;
  sortField: SortField;
  onSort: (field: SortField) => void;
}

function SortButton({ field, label, sortField, onSort }: SortButtonProps) {
  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors"
      onClick={() => onSort(field)}
    >
      {label}
      <ArrowUpDown className={cn(
        "h-3 w-3",
        sortField === field ? "text-primary" : "text-muted-foreground/50"
      )} />
    </button>
  );
}

interface ListViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const toggleSelectAll = () => {
    if (selectedIds.size === events.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(events.map(e => e.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "title":
          comparison = (a.description || a.title).localeCompare(b.description || b.title);
          break;
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "platform":
          comparison = a.platform.localeCompare(b.platform);
          break;
        case "status":
          const statusOrder = { draft: 0, scheduled: 1, published: 2 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [events, sortField, sortDirection]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={selectedIds.size === events.length && events.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-12"></TableHead>
              <TableHead>
                <SortButton field="title" label="Content" sortField={sortField} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton field="platform" label="Platform" sortField={sortField} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton field="status" label="Status" sortField={sortField} onSort={handleSort} />
              </TableHead>
              <TableHead>
                <SortButton field="date" label="Date" sortField={sortField} onSort={handleSort} />
              </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => {
            const badgeStyle = statusBadgeStyles[event.status] || statusBadgeStyles.draft;

            return (
              <TableRow
                key={event.id}
                className={cn(
                  "cursor-pointer group",
                  selectedIds.has(event.id) && "bg-muted/50"
                )}
                onClick={() => onEventClick?.(event)}
              >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(event.id)}
                      onCheckedChange={() => toggleSelect(event.id)}
                      className={cn(
                        "transition-opacity",
                        selectedIds.has(event.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    />
                  </TableCell>
                <TableCell>
                    {event.thumbnail ? (
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={event.thumbnail}
                          alt={event.description || event.title}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                        {event.mediaType === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-3 w-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        {event.mediaType === "video" ? (
                          <Video className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {event.description || event.title}
                      </span>
                    </div>
                  </TableCell>
                    <TableCell>
                      <PlatformIcon platform={event.platform} size={26} />
                    </TableCell>
                    <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-[10px] capitalize font-medium"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.text,
                    }}
                  >
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{formatDate(event.date)}</span>
                    {event.time && (
                      <span className="text-xs text-muted-foreground">
                        {event.time}
                      </span>
                    )}
                  </div>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <p className="text-sm">No posts found</p>
        </div>
      )}
    </div>
  );
}
