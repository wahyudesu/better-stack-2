"use client";

import { ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SocialIcon } from "react-social-icons";
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
				className="mt-3 pt-3 border-t border-border/50"
			>
				<p className="text-xs font-medium text-muted-foreground mb-2 px-1">
					{markers.length > 1 ? `${markers.length} posts` : "Post"}
				</p>
				<div className="space-y-1.5">
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
				className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer group border border-transparent hover:border-border/50"
			>
				<SocialIcon
					network={marker.network}
					bgColor={marker.color}
					style={{ width: 32, height: 32 }}
				/>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-1.5 text-sm font-medium group-hover:text-primary transition-colors">
						<span className="truncate">{marker.title}</span>
						<ExternalLink className="size-3.5 flex-shrink-0 opacity-50" />
					</div>
					{marker.description && (
						<p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
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
				type="button"
				onClick={marker.onClick}
				className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer w-full border border-transparent hover:border-border/50"
			>
				<SocialIcon
					network={marker.network}
					bgColor={marker.color}
					style={{ width: 32, height: 32 }}
				/>

				<div className="flex-1 min-w-0 text-left">
					<p className="text-sm font-medium truncate">{marker.title}</p>
					{marker.description && (
						<p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
							{marker.description}
						</p>
					)}
				</div>
			</button>
		);
	}

	// Default: render as non-clickable item
	return (
		<div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/30">
			<SocialIcon
				network={marker.network}
				bgColor={marker.color}
				style={{ width: 32, height: 32 }}
			/>

			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">{marker.title}</p>
				{marker.description && (
					<p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
						{marker.description}
					</p>
				)}
			</div>
		</div>
	);
}

MarkerTooltipContent.displayName = "MarkerTooltipContent";

export default MarkerTooltipContent;
