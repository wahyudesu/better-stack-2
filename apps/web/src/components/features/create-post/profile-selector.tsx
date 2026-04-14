"use client";

import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SocialMediaSelector } from "@/components/ui/social-media-selector";
import { sampleProfiles } from "@/lib/data/social-data";

interface ProfileSelectorProps {
	selectedIds: string[];
	onChange: (ids: string[]) => void;
}

export function ProfileSelector({
	selectedIds,
	onChange,
}: ProfileSelectorProps) {
	const activeProfiles = sampleProfiles.filter((p) => p.status === "active");

	return (
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground">
				Select one or more profiles to post to their connected accounts
			</p>
			<SocialMediaSelector
				profiles={activeProfiles}
				selected={selectedIds}
				onChange={onChange}
				maxVisible={5}
				label="Profiles"
			/>
			<div className="flex flex-wrap gap-2">
				{activeProfiles
					.filter((p) => selectedIds.includes(p.id))
					.map((profile) => (
						<div
							key={profile.id}
							className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
						>
							<PlatformIcon platform={profile.platform} size={14} />
							<span>{profile.name}</span>
						</div>
					))}
			</div>
		</div>
	);
}
