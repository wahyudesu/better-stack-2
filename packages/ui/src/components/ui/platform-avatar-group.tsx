"use client";

import type { Platform } from "@better-stack-2/ui/components/ui/PlatformIcon";
import { PlatformIcon } from "@better-stack-2/ui/components/ui/PlatformIcon";
import { cn } from "@better-stack-2/ui/lib/utils";

export interface PlatformAvatarGroupProps {
	platforms: Platform[];
	maxVisible?: number;
	size?: number;
	className?: string;
}

export function PlatformAvatarGroup({
	platforms,
	maxVisible = 3,
	size = 20,
	className,
}: PlatformAvatarGroupProps) {
	const visiblePlatforms = platforms.slice(0, maxVisible);
	const remainingCount = platforms.length - maxVisible;
	const showRemaining = remainingCount > 0;

	return (
		<div className={cn("flex items-center", className)}>
			{visiblePlatforms.map((platform, index) => (
				<span
					key={platform}
					className="inline-flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 border-2 border-white dark:border-zinc-800 shadow-sm"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						marginLeft: index > 0 ? `-${size * 0.25}px` : 0,
						zIndex: maxVisible - index,
					}}
				>
					<PlatformIcon platform={platform} size={size * 0.6} />
				</span>
			))}
			{showRemaining && (
				<span
					className="inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground border-2 border-white dark:border-zinc-800 shadow-sm text-xs font-medium"
					style={{
						width: `${size}px`,
						height: `${size}px`,
						marginLeft: `-${size * 0.25}px`,
					}}
				>
					+{remainingCount}
				</span>
			)}
		</div>
	);
}
