"use client";

import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { SocialMediaSelector } from "@/components/ui/social-media-selector";
import type { SocialMediaProfile } from "@/lib/types/social";

interface ProfileSelectorProps {
	accounts: SocialMediaProfile[];
	selectedIds: string[];
	onChange: (ids: string[]) => void;
}

export function ProfileSelector({
	accounts,
	selectedIds,
	onChange,
}: ProfileSelectorProps) {
	const activeAccounts = accounts.filter((a) => a.status === "active");

	return (
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground">
				Select one or more accounts to post to their connected platforms
			</p>
			<SocialMediaSelector
				profiles={activeAccounts}
				selected={selectedIds}
				onChange={onChange}
				max={10}
				maxVisible={5}
				label="Accounts"
			/>
			<div className="flex flex-wrap gap-2">
				{activeAccounts
					.filter((a) => selectedIds.includes(a.id))
					.map((account) => (
						<div
							key={account.id}
							className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs"
						>
							<PlatformIcon platform={account.platform} size={14} />
							<span>{account.name}</span>
						</div>
					))}
			</div>
		</div>
	);
}
