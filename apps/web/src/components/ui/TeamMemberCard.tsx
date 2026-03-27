"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamMemberCardProps {
	id: string;
	name: string;
	role: string;
	email: string;
	avatar: string;
	online?: boolean;
	tasksCompleted?: number;
	className?: string;
}

export function TeamMemberCard({
	name,
	role,
	email,
	avatar,
	online,
	tasksCompleted,
	className,
}: TeamMemberCardProps) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();

	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg border border/50 p-3",
				className,
			)}
		>
			<div className="relative">
				<Avatar className="size-10">
					<AvatarImage src={avatar} alt={name} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
				{online !== undefined && (
					<span
						className={cn(
							"absolute bottom-0 right-0 size-3 rounded-full border-2",
							online ? "bg-green-500" : "bg-gray-400",
						)}
					/>
				)}
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-medium truncate">{name}</p>
				<p className="text-xs text-muted-foreground truncate">{role}</p>
			</div>
			{tasksCompleted !== undefined && (
				<div className="text-right">
					<p className="text-xs font-medium">{tasksCompleted}</p>
					<p className="text-xs text-muted-foreground">tasks</p>
				</div>
			)}
		</div>
	);
}
