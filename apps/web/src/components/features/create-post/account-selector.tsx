"use client";

import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { SocialMediaProfile } from "@/lib/types/social";
import { cn } from "@/lib/utils";

interface AccountSelectorProps {
	accounts: SocialMediaProfile[];
	selectedIds: string[];
	onChange: (ids: string[]) => void;
}

export function AccountSelector({
	accounts,
	selectedIds,
	onChange,
}: AccountSelectorProps) {
	const activeAccounts = accounts.filter(
		(account) => account.status === "active",
	);

	const toggleAccount = (accountId: string) => {
		if (selectedIds.includes(accountId)) {
			onChange(selectedIds.filter((id) => id !== accountId));
			return;
		}
		onChange([...selectedIds, accountId]);
	};

	if (activeAccounts.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
				No active social account found. Connect an account first.
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-2">
			{activeAccounts.map((account) => {
				const isSelected = selectedIds.includes(account.id);

				return (
					<button
						key={account.id}
						type="button"
						onClick={() => toggleAccount(account.id)}
						className={cn(
							"flex items-center gap-2 rounded-lg border px-3 py-2 transition-all",
							isSelected
								? "border-primary bg-primary/5"
								: "border-border hover:border-primary/40",
						)}
					>
						<div className="h-7 w-7 shrink-0 overflow-hidden rounded-full bg-muted">
							{account.avatarUrl ? (
								<img
									src={account.avatarUrl}
									alt={account.name}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
									{account.name
										.split(" ")
										.map((part) => part[0] ?? "")
										.join("")
										.slice(0, 2)
										.toUpperCase()}
								</div>
							)}
						</div>

						<span className="text-sm font-medium">@{account.username}</span>

						<PlatformIcon platform={account.platform} size={14} />
					</button>
				);
			})}
		</div>
	);
}
