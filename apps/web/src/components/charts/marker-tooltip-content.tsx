"use client";

import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { ChartMarkerItem } from "./markers";

export interface MarkerTooltipContentProps {
  markers: ChartMarkerItem[];
}

export function MarkerTooltipContent({ markers }: MarkerTooltipContentProps) {
  if (markers.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="sync">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="mt-3 pt-3 border-t border/50"
      >
        <div className="space-y-2">
          {markers.map((marker, index) => (
            <MarkerItem key={`${marker.title}-${index}`} marker={marker} />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface MarkerItemProps {
  marker: ChartMarkerItem;
}

function MarkerItem({ marker }: MarkerItemProps) {
  // If marker has href, render as clickable link
  if (marker.href) {
    return (
      <a
        href={marker.href}
        target={marker.target || "_blank"}
        rel="noopener noreferrer"
        onClick={marker.onClick}
        className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group"
      >
        <span className="text-base flex-shrink-0 mt-0.5">{marker.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm font-medium group-hover:text-primary transition-colors">
            <span className="truncate">{marker.title}</span>
            <ExternalLink className="size-3 flex-shrink-0 opacity-50" />
          </div>
          {marker.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {marker.description}
            </p>
          )}
        </div>
      </a>
    );
  }

  // If marker has onClick but no href, render as clickable button
  if (marker.onClick) {
    return (
      <button
        onClick={marker.onClick}
        className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer w-full text-left"
      >
        <span className="text-base flex-shrink-0 mt-0.5">{marker.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{marker.title}</p>
          {marker.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {marker.description}
            </p>
          )}
        </div>
      </button>
    );
  }

  // Default: render as non-clickable item
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
      <span className="text-base flex-shrink-0 mt-0.5">{marker.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{marker.title}</p>
        {marker.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {marker.description}
          </p>
        )}
      </div>
    </div>
  );
}

MarkerTooltipContent.displayName = "MarkerTooltipContent";

export default MarkerTooltipContent;
