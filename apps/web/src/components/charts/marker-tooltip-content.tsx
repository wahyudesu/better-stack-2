"use client";

import { ExternalLink } from "lucide-react";
import { SocialIcon } from "react-social-icons/component";
import "react-social-icons/bsky.app";
import type { ChartMarkerItem } from "./markers";

// Network name mapping: our platform name -> react-social-icons network name
const networkMap: Record<string, string> = {
	instagram: "instagram",
	facebook: "facebook",
	twitter: "x",
	tiktok: "tiktok",
	youtube: "youtube",
	linkedin: "linkedin",
	pinterest: "pinterest",
	whatsapp: "whatsapp",
	reddit: "reddit",
	bluesky: "bsky.app",
	threads: "threads",
	telegram: "telegram",
	snapchat: "snapchat",
	google: "google",
};

export interface MarkerTooltipContentProps {
	markers: ChartMarkerItem[];
}

export function MarkerTooltipContent({ markers }: MarkerTooltipContentProps) {
	if (markers.length === 0) {
		return null;
	}

	// return (
	// 	<AnimatePresence mode="sync">
	// 		<motion.div
	// 			initial={{ opacity: 0, y: 10 }}
	// 			animate={{ opacity: 1, y: 0 }}
	// 			exit={{ opacity: 0, y: 10 }}
	// 			transition={{ duration: 0.2 }}
	// 			className="mt-3 pt-3 border-t border-border/50"
	// 		>
	// 			<p className="text-xs font-medium text-muted-foreground mb-2 px-1">
	// 				{markers.length > 1 ? `${markers.length} posts` : "Post"}
	// 			</p>
	// 			<div className="space-y-1.5">
	// 				{markers.map((marker, index) => (
	// 					<MarkerItem key={`${marker.title}-${index}`} marker={marker} />
	// 				))}
	// 			</div>
	// 		</motion.div>
	// 	</AnimatePresence>
	// );

	return (
		<div className="mt-3 pt-3 border-t border-border/50">
			<p className="text-xs font-medium text-muted-foreground mb-2 px-1">
				{markers.length > 1 ? `${markers.length} posts` : "Post"}
			</p>
			<div className="space-y-1.5">
				{markers.map((marker, index) => (
					<MarkerItem key={`${marker.title}-${index}`} marker={marker} />
				))}
			</div>
		</div>
	);
}

interface MarkerItemProps {
	marker: ChartMarkerItem;
}

function MarkerItem({ marker }: MarkerItemProps) {
	const socialNetwork = networkMap[marker.network] || marker.network;

	// If marker has href, render as clickable link
	// Note: SocialIcon renders an <a> internally, so we cannot wrap it in another <a>.
	// Use a div with role="link" and onClick to avoid nested anchors (invalid HTML).
	if (marker.href) {
		return (
			<div
				role="link"
				tabIndex={0}
				onClick={() => {
					if (marker.target === "_blank") {
						window.open(marker.href, "_blank", "noopener,noreferrer");
					} else if (marker.href) {
						window.location.href = marker.href;
					}
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						if (marker.target === "_blank") {
							window.open(marker.href, "_blank", "noopener,noreferrer");
						} else if (marker.href) {
							window.location.href = marker.href;
						}
					}
				}}
				className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer group border border-transparent"
				// className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer group border border-transparent hover:border-border/50"
			>
				<SocialIcon
					network={socialNetwork}
					bgColor={marker.color}
					style={{ width: 32, height: 32 }}
				/>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-1.5 text-sm font-medium">
						<span className="truncate">{marker.title}</span>
						<ExternalLink className="size-3.5 flex-shrink-0 opacity-50" />
					</div>
					{marker.description && (
						<p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
							{marker.description}
						</p>
					)}
				</div>
			</div>
		);
	}

	// If marker has onClick but no href, render as clickable button
	if (marker.onClick) {
		return (
			<button
				type="button"
				onClick={marker.onClick}
				className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer w-full border border-transparent"
				// className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer w-full border border-transparent hover:border-border/50"
			>
				<SocialIcon
					network={socialNetwork}
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
				network={socialNetwork}
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
