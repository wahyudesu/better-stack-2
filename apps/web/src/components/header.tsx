"use client";

import { User } from "lucide-react";
import { LogoMwhehCompact } from "@/components/logo-mwheh";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
	return (
		<header className="z-30 mx-auto flex w-full max-w-[1024px] items-center justify-between px-5 py-3">
			{/* Logo only - no dropdown */}
			<div className="flex items-center gap-2">
				<LogoMwhehCompact className="size-8" />
				<span className="text-lg font-bold">Mwheh</span>
			</div>

			{/* User menu */}
			<DropdownMenu>
				<DropdownMenuTrigger className="rounded-full bg-card/90 p-2 shadow-sm backdrop-blur-xl hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
					<Avatar className="size-8">
						<AvatarImage src="https://i.pravatar.cc/150?u=admin" />
						<AvatarFallback>
							<User className="size-4" />
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
		</header>
	);
}
