"use client";

import { Button } from "@better-stack-2/ui/components/ui/button";
import { type Platform, PlatformIcon } from "@better-stack-2/ui/components/ui/PlatformIcon";
import { cn } from "@better-stack-2/ui/lib/utils";

interface IntegrationCardProps {
	id: string;
	name: string;
	platform: Platform;
	connected: boolean;
	handle: string | null;
	followers: string | null;
	posts: number | null;
	color: string;
	onToggle: (id: string) => void;
	onInvite?: (platform: Platform) => void;
	className?: string;
}

export function IntegrationCard({
	id,
	name,
	platform,
	connected,
	handle,
	followers,
	posts,
	color,
	onToggle,
	onInvite,
	className,
}: IntegrationCardProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
				className,
			)}
		>
			{/* Platform Icon */}
			<div className={cn("p-3 rounded-xl", color)}>
				<PlatformIcon platform={platform} className="h-6 w-6" />
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-gray-900">{name}</p>
				{connected && handle ? (
					<div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
						<span className="truncate">{handle}</span>
						{followers && (
							<>
								<span>•</span>
								<span>{followers} followers</span>
							</>
						)}
					</div>
				) : null}
			</div>

			{/* Action Button */}
			{connected ? (
				<Button
					variant="outline"
					size="sm"
					onClick={() => onToggle(id)}
					className="rounded-lg"
				>
					Disconnect
				</Button>
			) : (
				<div className="flex items-center gap-2">
					<Button
						variant="default"
						size="sm"
						onClick={() => onToggle(id)}
						className="rounded-lg"
					>
						Connect
					</Button>
					{onInvite && (
						<button
							type="button"
							onClick={() => onInvite(platform)}
							className="text-xs font-medium text-primary hover:underline"
						>
							Invite
						</button>
					)}
				</div>
			)}
		</div>
	);
}
