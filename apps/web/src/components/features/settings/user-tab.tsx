/**
 * User Management Settings Tab Component.
 */

"use client";

import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserRole, UserStatus } from "@/lib/types/user";

interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	status: UserStatus;
	lastLogin: string;
	avatar?: string;
}

// Mock data - replace with API call when available
const mockUsers: TeamMember[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		role: "owner",
		status: "active",
		lastLogin: "2026-04-19",
	},
	{
		id: "2",
		name: "Sarah Wilson",
		email: "sarah.wilson@example.com",
		role: "admin",
		status: "active",
		lastLogin: "2026-04-18",
	},
	{
		id: "3",
		name: "Mike Chen",
		email: "mike.chen@example.com",
		role: "member",
		status: "active",
		lastLogin: "2026-04-17",
	},
	{
		id: "4",
		name: "Emma Davis",
		email: "emma.davis@example.com",
		role: "viewer",
		status: "pending",
		lastLogin: "-",
	},
];

const roleColors: Record<UserRole, string> = {
	owner:
		"bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
	admin: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
	member: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
	viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const statusColors: Record<UserStatus, string> = {
	active: "bg-green-500",
	invited: "bg-blue-500",
	pending: "bg-yellow-500",
	disabled: "bg-gray-400",
};

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export function UserTab() {
	const [users] = useState<TeamMember[]>(mockUsers);

	return (
		<div className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<p className="font-display font-semibold text-base">
						User Management
					</p>
					<p className="text-sm text-muted-foreground">
						Manage team members and their access
					</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<UserPlus className="size-4 mr-2" />
						Invite
					</Button>
					<Button size="sm">
						<UserPlus className="size-4 mr-2" />
						Add User
					</Button>
				</div>
			</div>

			{/* Users Table */}
			<Card>
				<CardContent className="">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border/50">
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Name
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Email
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Role
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Status
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Last Login
									</th>
									<th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr
										key={user.id}
										className="border-b border-border/30 hover:bg-muted/30 transition-colors"
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<Avatar className="size-8">
													{user.avatar && (
														<AvatarFallback>
															<img
																src={user.avatar}
																alt={user.name}
																className="size-full object-cover"
															/>
														</AvatarFallback>
													)}
													<AvatarFallback className="text-xs">
														{getInitials(user.name)}
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium">{user.name}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<span className="text-sm text-muted-foreground">
												{user.email}
											</span>
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
													roleColors[user.role] || roleColors.viewer
												}`}
											>
												{user.role}
											</span>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<span
													className={`size-2 rounded-full ${
														statusColors[user.status]
													}`}
												/>
												<span className="text-sm capitalize">
													{user.status}
												</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<span className="text-sm text-muted-foreground">
												{user.lastLogin}
											</span>
										</td>
										<td className="px-4 py-3 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger>
													<Button
														variant="ghost"
														size="icon"
														className="size-8"
													>
														<MoreHorizontal className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														<Pencil className="size-4 mr-2" />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem className="text-destructive">
														<Trash2 className="size-4 mr-2" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
