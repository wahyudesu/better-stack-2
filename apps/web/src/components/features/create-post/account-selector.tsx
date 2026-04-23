"use client";

import { Check } from "lucide-react";
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
		<div className="space-y-3">
			<p className="text-xs text-muted-foreground">
				Pilih satu atau beberapa akun social media untuk posting.
			</p>

			<div className="grid gap-2 sm:grid-cols-2">
				{activeAccounts.map((account) => {
					const isSelected = selectedIds.includes(account.id);

					return (
						<button
							key={account.id}
							type="button"
							onClick={() => toggleAccount(account.id)}
							className={cn(
								"flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
								isSelected
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/40",
							)}
						>
							<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
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

							<div className="min-w-0 flex-1">
								<div className="truncate text-sm font-medium">
									{account.name}
								</div>
								<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
									<PlatformIcon platform={account.platform} size={12} />
									<span className="truncate">@{account.username}</span>
								</div>
							</div>

							<div
								className={cn(
									"flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
									isSelected
										? "border-primary bg-primary text-primary-foreground"
										: "border-muted-foreground/40",
								)}
							>
								{isSelected && <Check className="h-3 w-3" />}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
