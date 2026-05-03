"use client";

import { Flame } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStreakStore } from "@/stores";

export function StreakPopover() {
	const { currentStreak, longestStreak, totalPosts, getStreakMessage } =
		useStreakStore();
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<div
					className="relative inline-flex size-8 cursor-pointer items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
					onClick={() => setOpen((v) => !v)}
					role="button"
					aria-label="Streak info"
					tabIndex={0}
				>
					<Flame
						className={cn(
							"size-5 transition-colors",
							currentStreak > 0
								? "text-orange-500 fill-orange-500"
								: "text-muted-foreground",
						)}
					/>
					{currentStreak > 0 && (
						<span className="absolute -right-1 -top-1 flex size-3.5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
							{currentStreak > 99 ? "99+" : currentStreak}
						</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 p-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium">Current Streak</span>
						<span className="flex items-center gap-1 text-lg font-bold text-orange-500">
							<Flame className="size-5 fill-orange-500" />
							{currentStreak}
						</span>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg bg-muted p-3 text-center">
							<p className="text-xs text-muted-foreground">Longest</p>
							<p className="text-lg font-semibold">{longestStreak}</p>
						</div>
						<div className="rounded-lg bg-muted p-3 text-center">
							<p className="text-xs text-muted-foreground">Total Posts</p>
							<p className="text-lg font-semibold">{totalPosts}</p>
						</div>
					</div>

					<p className="text-center text-sm text-muted-foreground">
						{getStreakMessage()}
					</p>

					<Button
						variant="outline"
						size="sm"
						className="w-full"
						onClick={() => {
							useStreakStore.getState().incrementStreak();
						}}
					>
						Mark Today as Posted
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
