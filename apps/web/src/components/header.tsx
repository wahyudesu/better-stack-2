"use client";

import { Flame, User } from "lucide-react";
import { useState } from "react";
import { LogoZenpostCompact } from "@/components/logo-mwheh";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStreakStore } from "@/stores";

function StreakPopover() {
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
			<PopoverContent align="end" className="w-64 p-4">
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

export default function Header() {
	return (
		<header className="z-30 mx-auto flex w-full max-w-[1024px] items-center justify-between px-5 py-6">
			{/* Logo only - no dropdown */}
			<div className="flex items-center gap-2">
				<LogoZenpostCompact className="size-8" />
				<span className="text-lg font-bold">Zenpost</span>
			</div>

			{/* User menu + Streak */}
			<div className="flex items-center gap-2">
				<StreakPopover />

				<DropdownMenu>
					<DropdownMenuTrigger className="">
						<Avatar className="size-8">
							<AvatarImage src="https://i.pravatar.cc/150?u=admin" />
							<AvatarFallback>
								<User className="size-5" />
							</AvatarFallback>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Preferences</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-destructive">
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
