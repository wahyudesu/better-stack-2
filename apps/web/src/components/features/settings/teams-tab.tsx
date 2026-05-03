/**
 * Teams Settings Tab Component.
 * Manage team members, roles, and profile access.
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

/**
 * User role types from Zernio API
 */
type UserRole = "owner" | "admin" | "member";

/**
 * Team member interface from Zernio /v1/users API
 */
export interface TeamMember {
	_id: string;
	name: string;
	email: string;
	role: UserRole;
	isRoot: boolean;
	profileAccess: string[];
	createdAt: string;
}

// Mock data matching Zernio API response format
const mockUsersResponse: {
	currentUserId: string;
	users: TeamMember[];
} = {
	currentUserId: "6507a1b2c3d4e5f6a7b8c9d0",
	users: [
		{
			_id: "6507a1b2c3d4e5f6a7b8c9d0",
			name: "John Doe",
			email: "john@example.com",
			role: "owner",
			isRoot: true,
			profileAccess: ["all"],
			createdAt: "2024-01-15T10:30:00Z",
		},
		{
			_id: "6507a1b2c3d4e5f6a7b8c9d1",
			name: "Sarah Wilson",
			email: "sarah.wilson@example.com",
			role: "admin",
			isRoot: false,
			profileAccess: ["64f0a1b2c3d4e5f6a7b8c9d0", "64f0a1b2c3d4e5f6a7b8c9d1"],
			createdAt: "2024-03-20T14:45:00Z",
		},
		{
			_id: "6507a1b2c3d4e5f6a7b8c9d2",
			name: "Mike Chen",
			email: "mike.chen@example.com",
			role: "member",
			isRoot: false,
			profileAccess: ["64f0a1b2c3d4e5f6a7b8c9d0"],
			createdAt: "2024-04-10T09:15:00Z",
		},
		{
			_id: "6507a1b2c3d4e5f6a7b8c9d3",
			name: "Emma Davis",
			email: "emma.davis@example.com",
			role: "member",
			isRoot: false,
			profileAccess: ["64f0a1b2c3d4e5f6a7b8c9d2"],
			createdAt: "2024-04-25T16:30:00Z",
		},
	],
};

/**
 * Role display configuration
 */
const roleConfig: Record<
	UserRole,
	{ label: string; color: string; description: string }
> = {
	owner: {
		label: "Owner",
		color:
			"bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
		description: "Full access to all features",
	},
	admin: {
		label: "Admin",
		color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
		description: "Can manage team members and content",
	},
	member: {
		label: "Member",
		color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
		description: "Can create and manage content",
	},
};

/**
 * Get user initials from name
 */
function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

/**
 * Format profile access for display
 */
function formatProfileAccess(profileAccess: string[]): string {
	if (profileAccess.includes("all")) {
		return "All Profiles";
	}
	return `${profileAccess.length} profile${profileAccess.length > 1 ? "s" : ""}`;
}

export function TeamsTab() {
	const [members] = useState<TeamMember[]>(mockUsersResponse.users);
	const currentUserId = mockUsersResponse.currentUserId;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<p className="font-display font-semibold text-base">Team Members</p>
					<p className="text-sm text-muted-foreground">
						Manage who has access to your workspace
					</p>
				</div>
				<Button size="sm">
					<UserPlus className="size-4 mr-2" />
					Invite Member
				</Button>
			</div>

			{/* Members Table */}
			<Card>
				<CardContent className="">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border/50">
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Member
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Role
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Profile Access
									</th>
									<th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">
										Joined
									</th>
									<th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{members.map((member) => (
									<tr
										key={member._id}
										className="border-b border-border/30 hover:bg-muted/30 transition-colors"
									>
										<td className="px-4 py-3">
											<div className="flex items-center gap-3">
												<Avatar className="size-9">
													<AvatarFallback className="text-xs">
														{getInitials(member.name)}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium">
															{member.name}
														</span>
														{member._id === currentUserId && (
															<span className="text-xs text-muted-foreground">
																(you)
															</span>
														)}
													</div>
													<span className="text-xs text-muted-foreground">
														{member.email}
													</span>
												</div>
											</div>
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
													roleConfig[member.role]?.color ||
													roleConfig.member.color
												}`}
											>
												{roleConfig[member.role]?.label || member.role}
											</span>
										</td>
										<td className="px-4 py-3">
											<span className="text-sm text-muted-foreground">
												{formatProfileAccess(member.profileAccess)}
											</span>
										</td>
										<td className="px-4 py-3">
											<span className="text-sm text-muted-foreground">
												{formatDate(member.createdAt)}
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
														Edit Role
													</DropdownMenuItem>
													{member._id !== currentUserId && (
														<DropdownMenuItem className="text-destructive">
															<Trash2 className="size-4 mr-2" />
															Remove
														</DropdownMenuItem>
													)}
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

			{/* Role Descriptions */}
			<Card>
				<CardContent className="p-4">
					<p className="text-sm font-medium mb-3">Role Permissions</p>
					<div className="grid gap-3 sm:grid-cols-3">
						{Object.entries(roleConfig).map(([key, config]) => (
							<div key={key} className="p-3 rounded-lg bg-muted/30">
								<p className="text-sm font-medium">{config.label}</p>
								<p className="text-xs text-muted-foreground mt-0.5">
									{config.description}
								</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
