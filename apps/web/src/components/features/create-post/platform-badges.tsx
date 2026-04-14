"use client";

import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { sampleProfiles } from "@/lib/data/social-data";
import type { ProfilePlatform } from "@/lib/types/social";

interface PlatformBadgesProps {
	selectedIds: string[];
}

export function PlatformBadges({ selectedIds }: PlatformBadgesProps) {
	const selectedProfiles = sampleProfiles.filter((p) =>
		selectedIds.includes(p.id),
	);

	// Get unique platforms
	const platforms = [
		...new Set(selectedProfiles.map((p) => p.platform)),
	] as ProfilePlatform[];

	if (platforms.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2 flex-wrap">
			<span className="text-xs text-muted-foreground">platforms:</span>
			{platforms.map((platform) => (
				<div
					key={platform}
					className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted"
				>
					<PlatformIcon platform={platform} size={14} />
					<span className="text-xs font-medium capitalize">{platform}</span>
				</div>
			))}
		</div>
	);
}
